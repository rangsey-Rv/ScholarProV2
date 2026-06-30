import { pgTable, integer, timestamp, } from 'drizzle-orm/pg-core';
import { exams } from './exam';

export const interviewSelection = pgTable('interview_selection', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    examId: integer("exam_id").notNull().references(()=>exams.id),
    slotStart: timestamp('slot_start').notNull(),
    slotEnd: timestamp('slot_end').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
