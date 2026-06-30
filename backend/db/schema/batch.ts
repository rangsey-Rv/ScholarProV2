import { pgTable, varchar, integer, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const batchStatusEnum = pgEnum('batch_status', ['complete', 'cancelled', 'active', 'closed'])
//   'active',      // Currently accepting applications
//   'closed',      // No longer accepting applications
//   'in_review',   // Applications under review
//   'completed',   // All scholarships awarded
//   'cancelled'    // Batch cancelled

export const batches = pgTable('batches', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    batchName: varchar('batch_name', { length: 255 }).notNull(),
    startDate: timestamp('start_date').notNull(),
    endDate: timestamp('end_date').notNull(),
    description: varchar('description'),
    status: batchStatusEnum('status').notNull().default('active'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})