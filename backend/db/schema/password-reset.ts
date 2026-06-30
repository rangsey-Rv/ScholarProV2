import { pgTable, integer, varchar, timestamp ,uuid} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { users } from "./user";

export const passwordResets = pgTable("password_resets", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  token: varchar("token", { length: 255 }),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
