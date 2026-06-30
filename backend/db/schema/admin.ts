import { pgTable, varchar,timestamp,uuid} from "drizzle-orm/pg-core";
import { users } from './user'; 
import { v7 as uuidv7 } from "uuid";

export const admins = pgTable("admins", {
  id: uuid("id")
          .primaryKey()
          .$defaultFn(() => uuidv7()),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
