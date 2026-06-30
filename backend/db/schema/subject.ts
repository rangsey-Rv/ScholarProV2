import { pgTable, varchar, integer, timestamp,real } from 'drizzle-orm/pg-core';

export const subjects = pgTable('subjects', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  subjectName: varchar('subject_name', { length: 255 }).notNull(),
  weight: real("weight").notNull(), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

