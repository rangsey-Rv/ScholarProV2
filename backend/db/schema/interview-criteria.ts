import { pgTable, integer, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const interviewCriterias = pgTable('interview_criterias', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    weight: integer('weight').notNull(),
    isActive: boolean('isActive').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
