import { db } from '@db';
import { committees } from '@db/schema/committee';
import { users } from '@db/schema/user';
import { department } from '@db/schema/department';
import { asc, eq, and, sql } from 'drizzle-orm';
import { PaginationConfigService } from "@services/setting/pagination-config.service";

export class getAllCommitteeService {
  static async getAllCommittees(
    page = 1,
    limit?: number,
    status?: string
  ) {
    if (!limit) {
      limit = await PaginationConfigService.getDefaultLimit();
    }
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status) {
      const normalizedStatus = status.toLowerCase();
      if (normalizedStatus === 'active') conditions.push(eq(users.isActive, true));
      if (normalizedStatus === 'inactive') conditions.push(eq(users.isActive, false));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const result = await db
      .select({
        id: committees.id,
        name: committees.name,
        userId: committees.userId,
        departmentId: committees.departmentId,
        createdAt: committees.createdAt,
        updatedAt: committees.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          role: users.role,
          phoneNumber: users.phoneNumber,
          isActive: users.isActive,
        },
        department: {
          id: department.id,
          departmentName: department.departmentName,
        },
      })
      .from(committees)
      .leftJoin(users, eq(committees.userId, users.id))
      .leftJoin(department, eq(committees.departmentId, department.id))
      .where(whereClause)
      .orderBy(asc(committees.name))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({
        total: sql<number>`count(${committees.id})`.mapWith(Number),
      })
      .from(committees)
      .leftJoin(users, eq(committees.userId, users.id))
      .where(whereClause);

    return {
      data: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
