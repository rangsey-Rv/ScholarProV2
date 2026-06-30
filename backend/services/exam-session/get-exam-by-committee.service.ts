import { db } from '@db';
import { examSessions } from '@db/schema/exam-session';
import { examSessionCommittees } from '@db/schema/exam-session-committee';
import { batches } from '@db/schema/batch';
import { subjects } from '@db/schema/subject';
import { eq } from 'drizzle-orm';
import { committees } from '@db/schema/committee';

export async function getExamsByCommittee(userId: string) {
    const [committee] = await db
      .select({ committeeId: committees.id })
      .from(committees)
      .where(eq(committees.userId, userId));


    if (!committee) {
        return {
            success: false,
            msg: "User not found"
        };
    }

    const result = await db
        .select({
            sessionId: examSessions.id,
            sessionName: examSessions.sessionName,
            location: examSessions.location,
            capacity: examSessions.capacity,
            examDate: examSessions.examDate,
            startTime: examSessions.startTime,
            endTime: examSessions.endTime,
            breakStart: examSessions.breakStart,
            breakEnd: examSessions.breakEnd,
            status: examSessions.status,
            batch: {
                id: batches.id,
                batchName: batches.batchName
            },
            subject: {
                id: subjects.id,
                subjectName: subjects.subjectName
            },
        })
        .from(examSessions)
        .innerJoin(batches, eq(examSessions.batchId, batches.id))
        .innerJoin(subjects, eq(examSessions.subjectId, subjects.id))
        .innerJoin(
            examSessionCommittees,
            eq(examSessionCommittees.examSessionId, examSessions.id)
        )
        .where(eq(examSessionCommittees.committeeId, committee.committeeId));
    
    return {
        success: true,
        data: result
    };
}