import { db } from "@db";
import { applications } from "@db/schema/application";
import { createApplicationSchema } from "@validation/application.schema";
import { ValidationError, NotFoundError } from "@utils/errors";

export class CreateApplicationService {
  static async execute(studentId: number, payload: any) {
    const parsed = createApplicationSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.format());
    }

    const [createdApplication] = await db
      .insert(applications)
      .values({ ...parsed.data, studentId })
      .returning();

    if (!createdApplication) {
      throw new NotFoundError("Application not created");
    }

    return createdApplication;
  }
}
