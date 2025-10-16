import express from "express";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { storage } from "./storage";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

async function main() {
  await setupAuth(app);

  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.get('/api/auth/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json({ authenticated: true, user });
    } catch (error) {
      console.error("Error checking auth:", error);
      res.status(500).json({ message: "Failed to check auth" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
  });
}

main().catch(console.error);
