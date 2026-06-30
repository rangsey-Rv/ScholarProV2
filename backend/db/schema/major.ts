import {
  pgTable,
  varchar,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core";
import { faculties } from './faculty';

export const majors = pgTable('majors', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    majorName: varchar('major_name', { length: 255 }).notNull(),
    facultyId: integer('faculty_id').notNull().references((): any=> faculties.id),
    tuitionFee: numeric("tuition_fee", { precision: 10, scale: 2 }).notNull(), // Add this
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
});
