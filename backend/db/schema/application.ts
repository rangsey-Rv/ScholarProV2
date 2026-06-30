import { pgEnum, pgTable, timestamp, integer, boolean, real } from 'drizzle-orm/pg-core';
import { students } from './student';
import { batches } from './batch';
import { attachments } from './attachment';
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed"]);
export const applicationStatusEnum = pgEnum("application_status", [
    "submitted",
    "shortlisted",
    "shortlisted_email_sent", 
    "assessment_scheduled",
    'graded',
    "accepted",
    "accepted_email_sent",   
    "rejected",
    "incomplete"
  ]);

export const applications = pgTable("applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id),
  batchId: integer("batch_id")
    .notNull()
    .references(() => batches.id),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("pending"),
  status: applicationStatusEnum("status").notNull().default("submitted"),
  attachmentId: integer("attachment_id")
    .notNull()
    .references(() => attachments.id),
  isApplyForScholarShip: boolean("is_apply_for_scholarShip").notNull(),
  scholarshipPercentage: real("scholarship_percentage"),
  isMathTestSkipped: boolean("is_math_test_skipped").notNull().default(false),
  isEnglishTestSkipped: boolean("is_english_test_skipped")
    .notNull()
    .default(false),
  isMathAssigned: boolean("is_math_assigned").notNull().default(false),
  isEnglishAssigned: boolean("is_english_assigned").notNull().default(false),
  isInterviewAssigned: boolean("is_interview_assigned")
    .notNull()
    .default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});