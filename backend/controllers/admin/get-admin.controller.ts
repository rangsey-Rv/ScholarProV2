import { Request, Response } from "express";
import { db } from "@db";
import { admins } from "@db/schema/admin";
import { users } from "@db/schema/user";
import { eq, asc } from "drizzle-orm";
import { asyncHandler } from "@utils/async-handler";

export const getAdmins = asyncHandler(async (req: Request, res: Response) => {
  const result = await db
    .select({
      id: admins.id,
      name: admins.name,
      email: users.email,
      role: users.role,
      createdAt: admins.createdAt,
    })
    .from(admins)
    .leftJoin(users, eq(admins.userId, users.id))
    .orderBy(asc(admins.id));

  res.json({ success: true, data: result });
});
