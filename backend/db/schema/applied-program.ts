import { pgTable, integer, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { applications } from './application';
import { majors } from './major';
export const appliedPrograms = pgTable('applied_programs', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    appId: integer('app_id')
        .notNull()
        .references((): any => applications.id),
    // interestMajor: varchar('interest_major', { length: 255 }).notNull(),
    interestMajorId: integer('interest_major_id').notNull().references((): any => majors.id),
    isApplyingScholarship: boolean('is_applying_scholarship').notNull(),
    requestedTerm: timestamp('requested_term'),
    considerNextIntake: boolean('consider_next_intake'),
    referralSource: varchar('referral_source', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),    
});
