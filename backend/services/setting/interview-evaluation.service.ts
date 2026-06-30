import { db } from "@db"; 
import { interviewCriterias } from "@db/schema/interview-criteria";
import { eq } from "drizzle-orm";

interface CriteriaInput {
  name: string;
  weight: number;
  isActive?: boolean;
}

export async function createOrUpdateInterviewCriteria(input: CriteriaInput) {
  const { name, weight, isActive = true } = input;

  if (isActive) {
    const activeCriterias = await db
      .select()
      .from(interviewCriterias)
      .where(eq(interviewCriterias.isActive, true));

    const totalWeight =
      activeCriterias
        .filter((c) => c.name !== name)
        .reduce((sum, c) => sum + c.weight, 0) + weight;

    if (totalWeight > 100) {
      return {
        status: "error",
        message: `The total weight of active criteria cannot exceed 100%. Current total: ${totalWeight}%`,
      };
    }
  }

  const existing = await db
    .select()
    .from(interviewCriterias)
    .where(eq(interviewCriterias.name, name));

  if (existing.length > 0) {
    const updated = await db
      .update(interviewCriterias)
      .set({
        weight,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(interviewCriterias.name, name))
      .returning();

    return {
      status: "updated",
      data: updated[0],
    };
  }

  const created = await db
    .insert(interviewCriterias)
    .values({
      name,
      weight,
      isActive,
    })
    .returning();

  return {
    status: "created",
    data: created[0],
  };
}

export async function setCriteriaStatus(id: number, status: boolean) {
  const existing = await db
    .select()
    .from(interviewCriterias)
    .where(eq(interviewCriterias.id, id));

  if (existing.length === 0) {
    return {
      status: "not_found",
      message: `Criteria with id '${id}' does not exist`,
    };
  }

  if (status && !existing[0].isActive) {
    const activeCriterias = await db
      .select()
      .from(interviewCriterias)
      .where(eq(interviewCriterias.isActive, true));

    const totalWeight =
      activeCriterias.reduce((sum, c) => sum + (c.weight ?? 0), 0) +
      (existing[0].weight ?? 0);

    if (totalWeight > 100) {
      return {
        status: "error",
        message: `The total weight of active criteria cannot exceed 100%. Activating this would reach ${totalWeight}%`,
      };
    }
  }

  const updated = await db
    .update(interviewCriterias)
    .set({
      isActive: status,
      updatedAt: new Date(),
    })
    .where(eq(interviewCriterias.id, id))
    .returning();

  return {
    status: "updated",
    data: updated[0],
  };
}

export async function setCriteriaActive(id: number) {
  return setCriteriaStatus(id, true);
}

export async function setCriteriaInactive(id: number) {
  return setCriteriaStatus(id, false);
}