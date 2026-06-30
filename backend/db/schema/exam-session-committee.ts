import { pgTable, integer, timestamp,uuid } from 'drizzle-orm/pg-core';
import { examSessions } from './exam-session';
import { committees } from './committee';

export const examSessionCommittees = pgTable('exam_session_committees', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    examSessionId: integer('exam_session_id').notNull().references(() => examSessions.id),
    committeeId: uuid('committee_id').notNull().references(() => committees.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
