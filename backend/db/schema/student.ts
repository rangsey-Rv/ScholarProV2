import { pgTable, integer, varchar, timestamp, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { users } from './user';

export const studentStatusEnum = pgEnum('student_status', [
    'active',        // Can apply, no current scholarship
    'passed',        // Won a scholarship (current recipient)
    'failed',        // Did not pass most recent application
    'reapplying',    // Failed before, applying again
    'blacklisted'    // Cannot apply anymore (violations)
]);

export const students = pgTable('students', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: uuid('user_id').references(() => users.id),
    nameEn: varchar('name_en', { length: 100 }),
    nameKh: varchar('name_kh', { length: 100 }),
    email: varchar('email', { length: 255 }).unique(),
    phoneNumber: varchar('phone_number', { length: 20 }).unique(),
    dateOfBirth: timestamp('date_of_birth'),
    status: studentStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});