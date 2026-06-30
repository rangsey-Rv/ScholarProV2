import { pgTable, integer, varchar, timestamp } from 'drizzle-orm/pg-core';
import { students } from './student';

export const parentGuardianInfos = pgTable('parent_guardian_infos', {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer('student_id')
    .notNull()
    .references((): any => students.id),
  name: varchar('name', { length: 255 }).notNull(),
  relationship: varchar('relationship', { length: 100 }).notNull(),
  nationality: varchar('nationality', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  job: varchar('job', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
