import { db } from '@db';
import { committees } from '@db/schema/committee';
import { users } from '@db/schema/user';
import { department } from '@db/schema/department';
import { examSessionCommittees } from '@db/schema/exam-session-committee';
import { asc, eq, notInArray } from 'drizzle-orm';

export class GetAvailableCommitteesService {
  static async getAvailableCommittees(examSessionId?: number) {
    // Get committee IDs already assigned to exam sessions
    let assignedCommitteeIds;
    
    if (examSessionId) {
      assignedCommitteeIds = await db
        .select({ committeeId: examSessionCommittees.committeeId })
        .from(examSessionCommittees)
        .where(eq(examSessionCommittees.examSessionId, examSessionId));
    } else {
      assignedCommitteeIds = await db
        .select({ committeeId: examSessionCommittees.committeeId })
        .from(examSessionCommittees);
    }

    const assignedIds = assignedCommitteeIds.map((c) => c.committeeId);

    // Build the main query
    const baseQuery = db
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
      .leftJoin(department, eq(committees.departmentId, department.id));

    // Filter out already assigned committees
    let result;
    
    if (assignedIds.length > 0) {
      result = await baseQuery
        .where(notInArray(committees.id, assignedIds))
        .orderBy(asc(committees.name));
    } else {
      result = await baseQuery.orderBy(asc(committees.name));
    }

    return result;
  }
}
