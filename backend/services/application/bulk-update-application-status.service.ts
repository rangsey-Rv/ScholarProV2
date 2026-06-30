import { db } from "@db";
import { applications } from "@db/schema/application";
import { bulkUpdateStatusSchema } from "@validation/application.schema";
import { ValidationError } from "@utils/errors";
import { inArray } from "drizzle-orm";

export class BulkUpdateApplicationStatusService {
  static async execute(payload: any) {
    const parsed = bulkUpdateStatusSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.format());
    }

    const { ids, status } = parsed.data;

    const updatedApps = await db
      .update(applications)
      .set({ status })
      .where(inArray(applications.id, ids))
      .returning();

    return updatedApps;
  }
}
