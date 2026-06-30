import { db } from "@db";
import { examSessions } from "@db/schema/exam-session";
import { updateExamSessionSchema } from "@validation/exam-session.schema";
import z, { success } from "zod";
import { eq } from "drizzle-orm";
import updateAutoAssignApplicantService from "./update-auto-assign-applicant.service";

type UpdateExamSessionPayload = z.infer<typeof updateExamSessionSchema>;

export default async (
  id: number,
  examSessionPayload: UpdateExamSessionPayload
) => {
  const examSession = await db
    .select()
    .from(examSessions)
    .where(eq(examSessions.id, id));

  if (!examSession || examSession.length === 0) {
    return { success: false, msg: "Exam Session not found" };
  }

  if (examSession[0].status !== "scheduled"){
    return {
        success: false,
        msg: "Not allow to update exam session that is ongoing or complete"
    }
  }
    const result = await updateAutoAssignApplicantService(
      id,
      examSessionPayload
    );
  return {
    success: true,
    data: result
  };
};
