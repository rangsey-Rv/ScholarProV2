import { db } from "@db";
import { users } from "@db/schema/user";
import { admins } from "@db/schema/admin";
import { committees } from "@db/schema/committee";
import { eq } from "drizzle-orm";
import { NotFoundError } from '@utils/errors';
import { userLogger, auditLogger } from "@utils/logger";

export class UpdateUserService {
  static async updateUser(
    userId: string,
    data: {
      email?: string;
      role?: 'admin' | 'committee';
      phoneNumber?: string;
      isActive?: boolean;
      adminName?: string;
      committee?: {
        name?: string;
        departmentId?: number;
      };
    },
    performedBy?: { id: string; role: string } // optional performer info
  ) {
    return await db.transaction(async (tx) => {
      const { adminName, committee, ...userData } = data;

      // Fetch existing user to detect role changes
      const [existing] = await tx
        .select({ role: users.role })
        .from(users)
        .where(eq(users.id, userId));

      if (!existing) {
        const logData = {
          action: 'update_user_failed',
          reason: 'user_not_found',
          userId,
          attemptedUpdate: data,
          performedBy,
          timestamp: new Date().toISOString(),
        };
        userLogger.warn(logData);
        auditLogger.warn(logData);

        throw new NotFoundError('User not found');
      }

      const previousRole = existing.role as 'admin' | 'committee';

      // Step 1: Update users table
      let updatedUser;
      if (Object.keys(userData).length > 0) {
        [updatedUser] = await tx
          .update(users)
          .set({ ...userData, updatedAt: new Date() })
          .where(eq(users.id, userId))
          .returning({ id: users.id });
      }

      // Step 2: Determine target role
      const targetRole = (userData.role ?? previousRole) as 'admin' | 'committee';

      // Step 3: Admin update
      if (adminName !== undefined && targetRole === 'admin') {
        await tx
          .update(admins)
          .set({ name: adminName, updatedAt: new Date() })
          .where(eq(admins.userId, userId));
      }

      // Step 4: Committee lifecycle
      if (previousRole !== 'committee' && targetRole === 'committee') {
        await tx.insert(committees).values({
          userId,
          name: committee?.name ?? '',
          departmentId: committee?.departmentId ?? null as unknown as number,
          updatedAt: new Date(),
        });
      } else if (previousRole === 'committee' && targetRole !== 'committee') {
        await tx.delete(committees).where(eq(committees.userId, userId));
      } else if (previousRole === 'committee' && targetRole === 'committee') {
        const updateCommitteePayload: Record<string, unknown> = {};
        if (committee?.name !== undefined) updateCommitteePayload.name = committee.name;
        if (committee?.departmentId !== undefined) updateCommitteePayload.departmentId = committee.departmentId;
        if (Object.keys(updateCommitteePayload).length > 0) {
          await tx
            .update(committees)
            .set({ ...updateCommitteePayload, updatedAt: new Date() })
            .where(eq(committees.userId, userId));
        }
      }

      // Step 5: Retrieve updated user
      const [userWithAdmin] = await tx
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
        .where(eq(users.id, userId));

      // Step 6: Logging
      const logData = {
        action: 'update_user_success',
        userId,
        previousRole,
        updatedData: data,
        result: userWithAdmin,
        performedBy,
        timestamp: new Date().toISOString(),
      };
      userLogger.info(logData);
      auditLogger.info(logData);

      return userWithAdmin;
    });
  }
}
