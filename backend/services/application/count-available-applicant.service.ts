import { sql, eq, and } from "drizzle-orm";
import { db } from "@db";
import { applications } from "@db/schema/application";
import { faculties } from "@db/schema/faculty";
import { majors } from "@db/schema/major";
import { appliedPrograms } from "@db/schema/applied-program";
import { batches } from "@db/schema/batch";

export default async(batchId: number)=>{
    if(!batchId || batchId < 0){
        return {success: false, msg: "Invalide batch Id"}
    }

    const batch = await db.select().from(batches).where(eq(batches.id, batchId));

    if(!batch || batch.length === 0){
        return { success: false, msg: "Batch not found" };
    }
    const availableAppForMath = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${applications.id})`.mapWith(Number),
      })
      .from(applications)
      .where(and(eq(applications.isMathAssigned, false),eq(applications.batchId, batchId)));

    const availableAppForEnglish = await db
      .select({
        count: sql<number>`COUNT(DISTINCT ${applications.id})`.mapWith(Number),
      })
      .from(applications)
      .where(
        and(
          eq(applications.isEnglishAssigned, false),
          eq(applications.batchId, batchId)
        )
      );

    const availableAppForInterview = await db
      .select({
        facultyName: faculties.facultyName,
        applicantCount: sql<number>`COUNT(DISTINCT ${applications.id})`.mapWith(
          Number
        ),
      })
      .from(applications)
      .innerJoin(appliedPrograms, eq(applications.id, appliedPrograms.appId))
      .innerJoin(majors, eq(appliedPrograms.interestMajorId, majors.id))
      .innerJoin(faculties, eq(majors.facultyId, faculties.id))
      .where(
        and(
          eq(applications.isInterviewAssigned, false),
          eq(applications.batchId, batchId)
        )
      )
      .groupBy(faculties.facultyName);

    return {
      success: true,
      availableAppForMath: availableAppForMath,
      availableAppForEnglish: availableAppForEnglish,
      availableAppForInterview: availableAppForInterview,
    };  
}