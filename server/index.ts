import express from "express";
import { setupAuth, isAuthenticated, isAdmin } from "./auth";
import { setupInvitationRoutes } from "./invitations";
import { setupTwoFactorRoutes } from "./twoFactor";
import { storage } from "./storage";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

async function main() {
  // Setup authentication
  await setupAuth(app);

  // Setup invitation routes
  setupInvitationRoutes(app);

  // Setup 2FA routes
  setupTwoFactorRoutes(app);

  // Admin routes
  app.get("/api/admin/users", isAdmin, async (req, res) => {
    try {
      const { users } = await import("../shared/schema");
      const { db } = await import("./db");
      
      const allUsers = await db.select().from(users);
      
      res.json({
        users: allUsers.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Organization routes
  app.get("/api/organization", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const org = await storage.getOrganizationByUserId(user.id);
      
      res.json({ organization: org || null });
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ error: "Failed to fetch organization" });
    }
  });

  app.post("/api/organization", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as Express.User;
      const { name, description, sector, size, country } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Organization name is required" });
      }

      const org = await storage.upsertOrganization({
        userId: user.id,
        name,
        description,
        sector,
        size,
        country,
      });

      res.json({ organization: org });
    } catch (error) {
      console.error("Error saving organization:", error);
      res.status(500).json({ error: "Failed to save organization" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
