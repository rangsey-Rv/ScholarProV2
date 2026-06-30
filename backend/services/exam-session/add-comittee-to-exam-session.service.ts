import { db } from "@db";
import { examSessionCommittees } from "@db/schema/exam-session-committee";
import { addCommiteeToExamSessionSchema } from "@validation/exam-session.schema";
import z from "zod";
import { committees } from "@db/schema/committee";
import { inArray } from "drizzle-orm";

type addCommiteeToExamSessionPayload = z.infer<
  typeof addCommiteeToExamSessionSchema
>;

export default async (payload: addCommiteeToExamSessionPayload, tx?: any) => {
  const dbInstance = tx || db;

  if (!payload) {
    return {
      success: false,
      msg: "Payload is required",
    };
  }
  const committeeIds = [...new Set(payload.map((item) => item.committeeId))];

  const existingCommittees = await dbInstance
    .select({ id: committees.id })
    .from(committees)
    .where(inArray(committees.id, committeeIds));

  if (existingCommittees.length !== committeeIds.length) {
    const foundIds = existingCommittees.map((c: { id: string }) => c.id);
    const missingIds = committeeIds.filter((id) => !foundIds.includes(id));

    return {
      success: false,
      msg: `Committee not found: ${missingIds.join(", ")}`,
    };
  }
  const uniquePayload = payload.filter(
    (item, index) => committeeIds.indexOf(item.committeeId) === index
  );
  const result = await dbInstance
    .insert(examSessionCommittees)
    .values(uniquePayload)
    .returning();

  if (!result) {
    return {
      success: false,
      msg: "Fail to add committee.",
    };
  }

  return {
    success: true,
    msg: `${result.length} committ added successfully`,
    data: result,
  };
};
