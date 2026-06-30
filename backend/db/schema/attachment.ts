import { pgTable, integer, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';


export const attachmentTypeEnum = pgEnum("type", ['personalInfo', 'certificate', 'student_id_card', 'english_certificate', 'application_fee'])

export const attachments = pgTable('attachments', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    type: varchar('type', { length: 255 }).notNull(),
    fileUrl: varchar('file_url', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
