import { pgTable, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const faculties = pgTable('faculties', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    facultyName: varchar('faculty_name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});

//id = 1 Engineering
//id = 2 Business 
//id = 3 Art & Humanities
//id = 4 Applied Science
//id = 5 Build Environment