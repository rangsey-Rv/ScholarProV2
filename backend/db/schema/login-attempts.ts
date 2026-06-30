import {
  pgTable,
  serial,
  varchar,
  uuid,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users } from "./user";

export const loginAttempts = pgTable("login_attempts", {
  id: serial("id").primaryKey(),
  ip: varchar("ip", { length: 60 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  success: boolean("success").notNull(),
  attemptedAt: timestamp("attempted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
