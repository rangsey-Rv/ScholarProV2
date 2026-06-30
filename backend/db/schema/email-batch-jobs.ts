import {
  pgTable,
  integer,
  varchar,
  timestamp,
  pgEnum,
  uuid,
} from "drizzle-orm/pg-core";
import { admins } from "./admin";

export const emailBatchJobStatusEnum = pgEnum("email_batch_job_status", [
  "queued",
  "processing",
  "completed",
]);

export const emailBatchJobs = pgTable("email_batch_jobs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  adminId: uuid("admin_id")
    .notNull()
    .references(() => admins.id),
  templateName: varchar("template_name", { length: 255 }).notNull(),
  totalCount: integer("total_count").notNull(),
  sentCount: integer("sent_count").notNull().default(0),
  failedCount: integer("failed_count").notNull().default(0),
  status: emailBatchJobStatusEnum("status").notNull().default("queued"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});
