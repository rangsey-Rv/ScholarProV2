import { pgTable, varchar, boolean, timestamp, pgEnum, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const roleEnum = pgEnum("role", ["admin", "committee", "student"])

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  email: varchar("email", { length: 255 }).unique(), // Made nullable for Telegram users
  password: varchar("password", { length: 255 }),
  provider: varchar("provider", { length: 50 }).notNull().default("local"),
  providerId: varchar("provider_id", { length: 255 }),
  role: roleEnum("role").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  phoneNumber: varchar("phone_number", { length: 20 }),
  profileUrl: varchar("profile_url"),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("provider_provider_id_idx").on(table.provider, table.providerId),
]);
