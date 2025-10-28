import { Express, RequestHandler } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { getSession } from "./db";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      role: "admin" | "user";
      twoFactorEnabled: boolean;
      twoFactorVerified?: boolean;
    }
  }
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Local strategy for username/password authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);

        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (!user.password) {
          return done(null, false, { message: "Invalid credentials" });
        }

        if (!user.isActive) {
          return done(null, false, { message: "Account is inactive" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, {
          id: user.id,
          username: user.username!,
          email: user.email!,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
          twoFactorVerified: false,
        });
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Login route
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: Express.User, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Authentication error" });
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || "Invalid credentials" });
      }

      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Login failed" });
        }

        // If 2FA is enabled, require 2FA verification
        if (user.twoFactorEnabled) {
          return res.json({
            success: true,
            requires2FA: true,
            userId: user.id,
          });
        }

        return res.json({
          success: true,
          requires2FA: false,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        });
      });
    })(req, res, next);
  });

  // Logout route
  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/login");
    });
  });

  // Check authentication status
  app.get("/api/auth/check", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as Express.User;

      // If 2FA is enabled but not verified, require verification
      if (user.twoFactorEnabled && !user.twoFactorVerified) {
        return res.status(401).json({ error: "2FA verification required" });
      }

      return res.json({ authenticated: true });
    }

    res.status(401).json({ authenticated: false });
  });

  // Get current user
  app.get("/api/auth/user", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const sessionUser = req.user as Express.User;

    // If 2FA is enabled but not verified, deny access
    if (sessionUser.twoFactorEnabled && !sessionUser.twoFactorVerified) {
      return res.status(401).json({ error: "2FA verification required" });
    }

    const user = await storage.getUser(sessionUser.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageUrl: user.profileImageUrl,
      role: user.role,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  });
}

// Middleware to check if user is authenticated
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = req.user as Express.User;

  // Check if 2FA verification is required
  if (user.twoFactorEnabled && !user.twoFactorVerified) {
    return res.status(401).json({ error: "2FA verification required" });
  }

  next();
};

// Middleware to check if user is admin
export const isAdmin: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = req.user as Express.User;

  if (user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }

  next();
};
