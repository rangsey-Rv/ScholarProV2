import { db } from '@db';
import { students } from '@db/schema/student';
import { createStudentSchema, CreateStudentInput } from '@validation/application.schema';
import { ValidationError, NotFoundError } from '@utils/errors';
import { eq } from 'drizzle-orm'; 

export class UpdateStudentInfoService {
  static async execute(studentId: number, payload: unknown) {
    const parsed = createStudentSchema.partial().safeParse(payload);
    if (!parsed.success) throw new ValidationError(parsed.error.format());

    const data: Partial<CreateStudentInput> = parsed.data;

    const [updatedStudent] = await db
      .update(students)
      .set(data)
      .where(eq(students.id, studentId)) 
      .returning();

    if (!updatedStudent) throw new NotFoundError(`Student ${studentId} not found`);

    return updatedStudent;
  }
}
