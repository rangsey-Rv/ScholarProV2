import { db } from "@db";
import { exams } from "@db/schema/exam";
import { eq } from "drizzle-orm";
import { interviewSelection } from "@db/schema/interview-selection";
import { subjects } from "@db/schema/subject";
import { examSessions } from "@db/schema/exam-session";
export class UpdateExamRecordService {

  async excludeStudentFromExam(examId: number) {
    // Check if exam exists
    const existingExam = await db
      .select({examSessionId: exams.examSessionId, status: exams.status})
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!existingExam || existingExam.length === 0) {
      throw new Error("Exam record not found");
    }

    // Check if exam is already cancelled
    if (existingExam[0].status === "cancelled") {
      throw new Error("This exam is already cancelled");
    }

    const [subject] = await db.select({subjectId: examSessions.subjectId}).from(examSessions).where(eq(examSessions.id, existingExam[0].examSessionId));

    if(subject.subjectId === 3){
      await db.delete(interviewSelection).where(eq(interviewSelection.examId, examId));
    }


    // Update exam status to "cancelled"
    const updatedExam = await db
      .update(exams)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(eq(exams.id, examId))
      .returning();

    return updatedExam[0];
  }

  
  //  Get exam status
   
  async getExamStatus(examId: number) {
    const exam = await db
      .select()
      .from(exams)
      .where(eq(exams.id, examId))
      .limit(1);

    if (!exam || exam.length === 0) {
      throw new Error("Exam record not found");
    }

    return exam[0];
  }
}

export const updateExamRecordService = new UpdateExamRecordService();
