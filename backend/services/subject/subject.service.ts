import { db } from '@db';
import { subjects } from '@db/schema/subject';
import { asc } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

interface CreateSubjectInput {
  subjectName: string;
  weight: number;
}


export class SubjectService {
  static async getAllSubjects() {
    const result = await db
      .select()
      .from(subjects)
      .orderBy(asc(subjects.subjectName));

    return result;
  }

  // CREATE new subject

  static async  createSubject(input: CreateSubjectInput) {
  const { subjectName, weight } = input;

  // optional: check duplicate name
  const existing = await db
    .select()
    .from(subjects)
    .where(eq(subjects.subjectName, subjectName));

  if (existing.length > 0) {
    return {
      status: "exists",
      message: `Subject '${subjectName}' already exists`,
      data: existing[0],
    };
  }

  const created = await db
    .insert(subjects)
    .values({
      subjectName,
      weight,
    })
    .returning();

  return {
    status: "created",
    data: created[0],
  };
}

  // Expects subjectName and weight
  static async adjustSubjectWeight(id: number, weight: number) {

  const existing = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id));

  if (existing.length === 0) {
    return {
      status: "not_found",
      message: `Subject with id ${id} does not exist`,
    };
  }


  const updated = await db
    .update(subjects)
    .set({
      weight,
      updatedAt: new Date(),
    })
    .where(eq(subjects.id, id))
    .returning();

  return {
    status: "updated",
    data: updated[0],
  };
}
static async deleteSubject(id: number) {
  // Check if subject exists
  const existing = await db
    .select()
    .from(subjects)
    .where(eq(subjects.id, id));

  if (existing.length === 0) {
    return {
      status: "not_found",
      message: `Subject with id ${id} does not exist`,
    };
  }

  // Safe delete
  await db.delete(subjects).where(eq(subjects.id, id));

  return {
    status: "deleted",
    message: `Subject with id ${id} has been deleted`,
  };
}
}
