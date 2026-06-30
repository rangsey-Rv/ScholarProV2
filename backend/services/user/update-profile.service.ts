import { db } from "@db";
import { users } from "@db/schema/user";
import { admins } from "@db/schema/admin";
import { eq } from "drizzle-orm";
import { updateProfileSchema } from "@validation/user/user.schema";
import z from "zod";
import { committees } from "@db/schema/committee";
type updateProfilePayload = z.infer<typeof updateProfileSchema>
import getProfileService from "./get-profile.service";
import { appLogger, userLogger } from "@utils/logger";

export default async (userId: string, payload: updateProfilePayload) => {
    
    const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId));

    if(!user){
        throw new Error("User not found");
        
    };
    
    const userPayload: any = {};
    if (payload.phoneNumber !== undefined) userPayload.phoneNumber = payload.phoneNumber;
    if (payload.profileUrl !== undefined) userPayload.profileUrl = payload.profileUrl;
   
    if (Object.keys(userPayload).length > 0) {
        await db.update(users).set(userPayload).where(eq(users.id, userId));
    } 

    if (user.role === "admin") {
        const adminPayload: any = {};
        if (payload.name !== undefined) adminPayload.name = payload.name;
        
        if (Object.keys(adminPayload).length > 0) {
            await db.update(admins).set(adminPayload).where(eq(admins.userId, userId));
        }
    }
    else if (user.role === "committee") {
        const committeePayload: any = {};
        if (payload.name !== undefined) committeePayload.name = payload.name;
        if (payload.departmentId !== undefined) committeePayload.departmentId = payload.departmentId;
    
        if (Object.keys(committeePayload).length > 0) {
            await db.update(committees).set(committeePayload).where(eq(committees.userId, userId));
        }
    }
    return await getProfileService(userId);

}