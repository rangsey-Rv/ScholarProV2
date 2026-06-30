import { pgTable, integer, unique, timestamp, uuid } from "drizzle-orm/pg-core";
import { exams } from "./exam";
import { interviewCriterias } from "./interview-criteria";
import { committees } from "./committee";
export const interviewScores = pgTable("interview_scores", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  examId: integer("exam_id")
    .notNull()
    .references(() => exams.id),
  criteriaId: integer("criteria_id")
    .notNull()
    .references(() => interviewCriterias.id),
  committeeId: uuid("committee_id")
    .notNull()
    .references(() => committees.id),
  score: integer("score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  uniqueExamCriteria: unique().on(table.examId, table.criteriaId, table.committeeId),
}));
