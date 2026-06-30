import { pgTable, integer, varchar, timestamp ,uuid} from 'drizzle-orm/pg-core';
import { users } from './user';
import { department } from './department';
import { v7 as uuidv7 } from "uuid";

export const committees = pgTable('committees', {
    id: uuid("id")
        .primaryKey()
        .$defaultFn(() => uuidv7()),
    userId: uuid('user_id').notNull().references(() => users.id),
    departmentId: integer('department_id').references(() => department.id),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
