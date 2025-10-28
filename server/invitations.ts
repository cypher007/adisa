import { Express } from "express";
import crypto from "crypto";
import { storage } from "./storage";
import { isAdmin } from "./auth";
import { sendEmail } from "../src/utils/replitmail";

// Generate secure random token
function generateInvitationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function setupInvitationRoutes(app: Express) {
  // Admin sends invitation
  app.post("/api/admin/invite", isAdmin, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return res.status(400).json({ error: "Valid email address required" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: "User already exists with this email" });
      }

      // Check if there's already a pending invitation
      const token = generateInvitationToken();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration

      const adminUser = req.user as Express.User;

      // Create invitation
      const invitation = await storage.createInvitation({
        email,
        token,
        invitedBy: adminUser.id,
        expiresAt,
      });

      // Send invitation email
      const inviteUrl = `${req.protocol}://${req.get("host")}/register?token=${token}`;

      await sendEmail({
        to: email,
        subject: "Invitation à rejoindre ADISA",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1890ff;">Vous êtes invité à rejoindre ADISA</h2>
            <p>Bonjour,</p>
            <p>Vous avez été invité par un administrateur à rejoindre la plateforme ADISA - AfricTivistes Digital Safety Audit.</p>
            <p>Cliquez sur le bouton ci-dessous pour créer votre compte :</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="background-color: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Créer mon compte
              </a>
            </div>
            <p><small>Ce lien expire dans 7 jours.</small></p>
            <p><small>Si vous n'avez pas demandé cette invitation, vous pouvez ignorer cet email.</small></p>
          </div>
        `,
        text: `Vous avez été invité à rejoindre ADISA.\n\nCréez votre compte en visitant : ${inviteUrl}\n\nCe lien expire dans 7 jours.`,
      });

      res.json({
        success: true,
        message: "Invitation sent successfully",
        email,
      });
    } catch (error) {
      console.error("Invitation error:", error);
      res.status(500).json({ error: "Failed to send invitation" });
    }
  });

  // Validate invitation token
  app.get("/api/invitation/validate/:token", async (req, res) => {
    try {
      const { token } = req.params;

      const invitation = await storage.getInvitationByToken(token);

      if (!invitation) {
        return res.status(404).json({
          valid: false,
          error: "Invalid or expired invitation",
        });
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        return res.status(404).json({
          valid: false,
          error: "Invitation has expired",
        });
      }

      res.json({
        valid: true,
        email: invitation.email,
      });
    } catch (error) {
      console.error("Validation error:", error);
      res.status(500).json({ error: "Validation failed" });
    }
  });

  // Register with invitation
  app.post("/api/register", async (req, res) => {
    try {
      const { token, username, password, firstName, lastName } = req.body;

      if (!token || !username || !password || !firstName || !lastName) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Validate invitation
      const invitation = await storage.getInvitationByToken(token);

      if (!invitation) {
        return res.status(403).json({ error: "Invalid or expired invitation" });
      }

      if (new Date() > new Date(invitation.expiresAt)) {
        return res.status(403).json({ error: "Invitation has expired" });
      }

      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: "Username already taken" });
      }

      // Hash password
      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = await storage.upsertUser({
        username,
        email: invitation.email,
        password: hashedPassword,
        firstName,
        lastName,
        role: "user",
        isActive: true,
        twoFactorEnabled: false, // Will be set to true after 2FA setup
        invitedBy: invitation.invitedBy,
      });

      // Mark invitation as used
      await storage.markInvitationAsUsed(token);

      res.json({
        success: true,
        message: "Registration successful. Please set up 2FA to complete your account.",
        userId: user.id,
        requires2FASetup: true,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
}
