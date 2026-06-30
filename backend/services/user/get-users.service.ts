import { db } from "@db";
import { users } from "@db/schema/user";
import { admins } from "@db/schema/admin";
import { asc, eq, sql, and } from "drizzle-orm";
import { NotFoundError } from "@utils/errors";
import { PaginationConfigService } from "@services/setting/pagination-config.service";
import { userLogger, auditLogger } from "@utils/logger";

export class GetUsersService {
  static async getAllUsers(isActive?: boolean, page: number = 1, limit?: number, performedBy?: { id: string; role: string }) {
    const whereClause = [];
    if (isActive !== undefined) whereClause.push(eq(users.isActive, isActive));

    if (!limit) limit = await PaginationConfigService.getDefaultLimit();
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        admin: { id: admins.id, name: admins.name },
      })
      .from(users)
      .leftJoin(admins, eq(users.id, admins.userId))
      .where(whereClause.length > 0 ? and(...whereClause) : undefined)
      .orderBy(asc(users.id))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(users)
      .where(whereClause.length > 0 ? and(...whereClause) : undefined);
    const total = totalResult[0]?.count || 0;

    // Logging
    const logData = {
      action: "get_all_users",
      filters: { isActive, page, limit },
      resultCount: result.length,
      total,
      performedBy,
      timestamp: new Date().toISOString(),
    };
    userLogger.info(logData);
    auditLogger.info(logData);

    return {
      data: result,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getUsersByRole(role: "admin" | "committee", isActive?: boolean, page: number = 1, limit?: number, performedBy?: { id: string; role: string }) {
    const whereClause = [eq(users.role, role)];
    if (isActive !== undefined) whereClause.push(eq(users.isActive, isActive));

    if (!limit) limit = await PaginationConfigService.getDefaultLimit();
    const offset = (page - 1) * limit;

    const result = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        admin: { id: admins.id, name: admins.name },
      })
      .from(users)
      .leftJoin(admins, eq(users.id, admins.userId))
      .where(and(...whereClause))
      .orderBy(asc(users.id))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(users)
      .where(and(...whereClause));
    const total = totalResult[0]?.count || 0;

    // Logging
    const logData = {
      action: "get_users_by_role",
      role,
      filters: { isActive, page, limit },
      resultCount: result.length,
      total,
      performedBy,
      timestamp: new Date().toISOString(),
    };
    userLogger.info(logData);
    auditLogger.info(logData);

    return {
      data: result,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getUserById(userId: string, performedBy?: { id: string; role: string }) {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        isActive: users.isActive,
        lastLogin: users.lastLogin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        admin: { id: admins.id, name: admins.name },
      })
      .from(users)
      .leftJoin(admins, eq(users.id, admins.userId))
      .where(eq(users.id, userId));

    if (!user) {
      const logData = {
        action: "get_user_by_id_failed",
        reason: "user_not_found",
        userId,
        performedBy,
        timestamp: new Date().toISOString(),
      };
      userLogger.warn(logData);
      auditLogger.warn(logData);

      throw new NotFoundError("User not found");
    }

    // Logging
    const logData = {
      action: "get_user_by_id",
      userId,
      result: user,
      performedBy,
      timestamp: new Date().toISOString(),
    };
    userLogger.info(logData);
    auditLogger.info(logData);

    return user;
  }
}
