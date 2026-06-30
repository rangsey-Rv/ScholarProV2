import { pgTable, uuid, text, decimal, timestamp, pgEnum, varchar, integer } from "drizzle-orm/pg-core";
import { applications } from "./application";

export const transactionStatusEnum = pgEnum("transaction_status", [
  "PENDING",
  "SUCCESS",
  "FAILED",
]);

export const currencyEnum = pgEnum("currency", ["KHR", "USD"]);

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicationId: integer("application_id").references(() => applications.id).notNull(),
  khqrString: text("khqr_string").notNull(),
  md5Hash: varchar("md5_hash", { length: 255 }).notNull(), // Indexed for fast lookups
  deeplink: text("deeplink"), // Store the generated deeplink
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: currencyEnum("currency").default("USD").notNull(),
  status: transactionStatusEnum("status").default("PENDING").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
