import { pgTable, integer, varchar, boolean, timestamp ,uuid} from "drizzle-orm/pg-core";
import { users } from "./user";

export const userTokens = pgTable('user_tokens', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: uuid('user_id').notNull().references(()=>users.id),
  token: varchar('token', { length: 1024 }), 
  expiredAt: timestamp('expired_at').notNull(),
  isUsed: boolean('is_used').notNull().default(false), 
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
