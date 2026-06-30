import { db } from '@db';
import { students } from '@db/schema/student';
import { z } from 'zod';
import { ValidationError, NotFoundError } from '@utils/errors';
import { eq } from 'drizzle-orm'; 

export const updateStudentStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'graduated', 'suspended']),
});

export class UpdateStudentStatusService {
  static async execute(studentId: number, payload: unknown) {
    const parsed = updateStudentStatusSchema.safeParse(payload);
    if (!parsed.success) throw new ValidationError(parsed.error.format());

     const data: Partial<UpdateStudentStatusService> = parsed.data;

    const [updatedStudent] = await db
      .update(students)
      .set(data)
      .where(eq(students.id, studentId))
      .returning();

    if (!updatedStudent) throw new NotFoundError(`Student ${studentId} not found`);

    return updatedStudent;
  }
}
