import { pgTable , timestamp, integer, varchar, pgEnum} from 'drizzle-orm/pg-core';
import { batches } from './batch'; 
import { subjects } from './subject';
import { faculties } from './faculty';

export const examSessionStatusEnum = pgEnum('exam_session_status', [
    'scheduled',   // Fixed typo
    'ongoing',     // Added intermediate state
    'completed',   // Consistent past tense
    'cancelled'    // Consistent past tense
]);

export const examSessions = pgTable('exam_sessions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    batchId: integer('batch_id').notNull().references(() => batches.id),
    subjectId: integer('subject_id').notNull().references(() => subjects.id),
    facultyId: integer('faculty_id').references(() => faculties.id),
    sessionName: varchar('session_name', { length: 100 }).notNull(),
    location: varchar('location', { length: 255 }),
    capacity: integer('capacity').notNull(),
    examDate: timestamp('exam_date').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time').notNull(),
    breakStart: timestamp('break_start'),
    breakEnd: timestamp('break_end'),
    status: examSessionStatusEnum('status').notNull().default('scheduled'), // Fixed default
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
