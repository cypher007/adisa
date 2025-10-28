import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";

async function createAdminUser() {
  const username = "cheikhfall7";
  const password = "Nazim@2207";
  const email = "admin@adisa.local";

  try {
    // Check if admin already exists
    const [existingAdmin] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const [admin] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
        email,
        role: "admin",
        firstName: "Admin",
        lastName: "ADISA",
        isActive: true,
        twoFactorEnabled: false,
      })
      .returning();

    console.log("✓ Admin user created successfully");
    console.log(`  Username: ${username}`);
    console.log(`  Email: ${email}`);
    console.log(`  Role: ${admin.role}`);
  } catch (error) {
    console.error("✗ Error creating admin user:", error);
    throw error;
  }
}

createAdminUser()
  .then(() => {
    console.log("\nAdmin setup complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nAdmin setup failed:", error);
    process.exit(1);
  });
