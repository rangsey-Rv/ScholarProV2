import { pgTable, integer, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { students } from './student';
import { attachments } from './attachment';

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const personalInfo = pgTable('personal_info', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    studentId: integer('student_id').notNull().references(() => students.id),
    nationality: varchar('nationality', { length: 255 }).notNull(),
    gender: genderEnum('gender').notNull(),
    dob: timestamp('dob').notNull(),
    placeOfBirth: varchar('place_of_birth', { length: 255 }).notNull(),
    address: varchar('address', { length: 255 }).notNull(),
    attachmentId: integer('attachment_id').notNull().references(() => attachments.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});