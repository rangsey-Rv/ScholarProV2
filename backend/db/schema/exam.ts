import { pgTable, integer, timestamp, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { applications } from './application';
import { examSessions } from './exam-session';

export const examStatusEnum = pgEnum("exam_status", ["scheduled", "in_progress", "cancelled", "completed"]);

export const exams = pgTable('exams', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    appId: integer('app_id').notNull().references(() => applications.id),
    examSessionId: integer('exam_session_id').notNull().references(() => examSessions.id),
    status: examStatusEnum("status").notNull().default("scheduled"),
    
  totalScore: numeric('total_score', {
    precision: 12,
    scale: 2,
  }).default('0'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});