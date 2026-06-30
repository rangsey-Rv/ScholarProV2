import { pgTable, integer, varchar, timestamp, pgEnum, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { users , roleEnum } from '@db/schema/user';

export const statusEnum = pgEnum("status", ["pending", "accept", "fail"]);

export const inviteUsers = pgTable("invite_users", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  role: roleEnum("role").notNull(),
  invitedBy: uuid("invited_by")
    .notNull()
    .references(() => users.id),
  token: varchar('token', { length: 255 }),
  status: statusEnum("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
