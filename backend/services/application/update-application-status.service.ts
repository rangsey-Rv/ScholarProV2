import { db } from "@db";
import { applications } from "@db/schema/application";
import { updateApplicationSchema } from "@validation/updateApplicationSchema";
import { ValidationError, NotFoundError } from "@utils/errors";
import { eq } from "drizzle-orm";

export class ApplicationUpdateService {
  static async execute(applicationId: number, payload: unknown) {
    const parsed = updateApplicationSchema.safeParse(payload);

    if (!parsed.success) {
      throw new ValidationError(parsed.error.format());
    }

    const updateData = parsed.data;

    if (Object.keys(updateData).length === 0) {
      throw new ValidationError("No fields provided for update");
    }

    if (updateData.scholarshipPercentage !== undefined) {
      updateData.status = "accepted";
    }
    const [updatedApplication] = await db
      .update(applications)
      .set(updateData)
      .where(eq(applications.id, applicationId))
      .returning();
    
      if (!updatedApplication) {
        throw new NotFoundError("Application not found");
      }

    return updatedApplication;
  }
}
