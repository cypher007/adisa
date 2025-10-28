import { Express, RequestHandler } from "express";
import { TOTP } from "otpauth";
import base32 from "hi-base32";
import QRCode from "qrcode";
import crypto from "crypto";
import { storage } from "./storage";

export function setupTwoFactorRoutes(app: Express) {
  // Generate 2FA secret (for new users during registration)
  app.post("/api/2fa/generate", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID required" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: "2FA already enabled" });
      }

      // Generate secret
      const buffer = crypto.randomBytes(20);
      const secret = base32.encode(buffer).replace(/=/g, "");

      // Create TOTP instance
      const totp = new TOTP({
        issuer: "ADISA",
        label: user.username || user.email,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret,
      });

      // Generate QR code
      const otpauthUrl = totp.toString();
      const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

      // Store secret temporarily (will be confirmed after verification)
      await storage.upsertUser({
        id: user.id,
        twoFactorSecret: secret,
      });

      res.json({
        secret,
        qrCode: qrCodeDataUrl,
        otpauthUrl,
      });
    } catch (error) {
      console.error("2FA generation error:", error);
      res.status(500).json({ error: "Failed to generate 2FA" });
    }
  });

  // Verify and enable 2FA
  app.post("/api/2fa/verify", async (req, res) => {
    try {
      const { userId, token } = req.body;

      if (!userId || !token) {
        return res.status(400).json({ error: "User ID and token required" });
      }

      const user = await storage.getUser(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.twoFactorSecret) {
        return res.status(400).json({ error: "2FA not initialized. Generate secret first." });
      }

      // Create TOTP instance
      const totp = new TOTP({
        secret: user.twoFactorSecret,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      // Verify token (with 1-step tolerance)
      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        return res.status(401).json({
          success: false,
          error: "Invalid verification code",
        });
      }

      // Enable 2FA
      await storage.upsertUser({
        id: user.id,
        twoFactorEnabled: true,
      });

      res.json({
        success: true,
        message: "2FA enabled successfully. You can now login.",
      });
    } catch (error) {
      console.error("2FA verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // Authenticate with 2FA code (during login)
  app.post("/api/2fa/authenticate", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { token } = req.body;
      const sessionUser = req.user as Express.User;

      if (!token) {
        return res.status(400).json({ error: "Token required" });
      }

      const user = await storage.getUser(sessionUser.id);

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({ error: "2FA not enabled for this user" });
      }

      // Create TOTP instance
      const totp = new TOTP({
        secret: user.twoFactorSecret,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
      });

      // Verify token
      const delta = totp.validate({ token, window: 1 });

      if (delta === null) {
        return res.status(401).json({
          authenticated: false,
          error: "Invalid 2FA code",
        });
      }

      // Mark 2FA as verified in session
      sessionUser.twoFactorVerified = true;

      res.json({
        authenticated: true,
        message: "2FA verification successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("2FA authentication error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  });
}
