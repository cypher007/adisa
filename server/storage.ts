import {
  users,
  invitations,
  organizations,
  type User,
  type UpsertUser,
  type Invitation,
  type UpsertInvitation,
  type Organization,
  type UpsertOrganization,
} from "../shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createInvitation(invitation: UpsertInvitation): Promise<Invitation>;
  getInvitationByToken(token: string): Promise<Invitation | undefined>;
  markInvitationAsUsed(token: string): Promise<void>;
  getOrganizationByUserId(userId: string): Promise<Organization | undefined>;
  upsertOrganization(org: UpsertOrganization): Promise<Organization>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createInvitation(invitationData: UpsertInvitation): Promise<Invitation> {
    const [invitation] = await db
      .insert(invitations)
      .values(invitationData)
      .returning();
    return invitation;
  }

  async getInvitationByToken(token: string): Promise<Invitation | undefined> {
    const [invitation] = await db
      .select()
      .from(invitations)
      .where(and(eq(invitations.token, token), eq(invitations.used, false)));
    return invitation;
  }

  async markInvitationAsUsed(token: string): Promise<void> {
    await db
      .update(invitations)
      .set({ used: true })
      .where(eq(invitations.token, token));
  }

  async getOrganizationByUserId(userId: string): Promise<Organization | undefined> {
    const [org] = await db
      .select()
      .from(organizations)
      .where(eq(organizations.userId, userId));
    return org;
  }

  async upsertOrganization(orgData: UpsertOrganization): Promise<Organization> {
    const existing = await this.getOrganizationByUserId(orgData.userId);
    
    if (existing) {
      const [updated] = await db
        .update(organizations)
        .set({ ...orgData, updatedAt: new Date() })
        .where(eq(organizations.userId, orgData.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(organizations)
        .values(orgData)
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
