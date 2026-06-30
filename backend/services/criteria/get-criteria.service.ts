import { interviewCriterias } from "@db/schema/interview-criteria";
import { db } from "@db";
import { eq } from "drizzle-orm";

export default async()=>{
    const criteria = await db.select({
        id: interviewCriterias.id,
        name: interviewCriterias.name,
        weight: interviewCriterias.weight,
        isActive: interviewCriterias.isActive,
    }).from(interviewCriterias);

    if(!criteria || criteria.length === 0) {
        return {
            success: false,
            msg : "Unable to fetch cirteria at the moment. Please try again later"
        }
    }

    return {
        success: true,
        data: criteria
    }
}