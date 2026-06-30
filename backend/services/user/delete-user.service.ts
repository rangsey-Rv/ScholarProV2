import { db } from '@db';
import { users } from '@db/schema/user';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '@utils/errors';
import { userLogger, auditLogger } from '@utils/logger';

export class DeleteUserService {
  static async deleteUser(userId: string, performedBy?: { id: string; role: string }) {
    // Soft delete - set isActive to false
    const [deletedUser] = await db
      .update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        phoneNumber: users.phoneNumber,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }

    // =========================
    // LOGGING
    // =========================
    const logData = {
      deletedUser: {
        id: deletedUser.id,
        email: deletedUser.email,
        role: deletedUser.role,
        phoneNumber: deletedUser.phoneNumber,
      },
      performedBy,
      action: 'delete_user',
      timestamp: new Date().toISOString(),
    };

    userLogger.info(logData);
    auditLogger.info(logData);

    return deletedUser;
  }
}
