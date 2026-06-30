import { pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const department = pgTable('departments', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departmentName: varchar('department_name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
