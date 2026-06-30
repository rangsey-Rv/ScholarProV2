import { db } from '@db';
import { students } from '@db/schema/student';
import { applications } from '@db/schema/application';
import { createStudentWithApplicationsSchema } from '@validation/application.schema';
import { ValidationError, NotFoundError } from '@utils/errors';

export class CreateStudentService {
  static async execute(payload: unknown) {
    const parsed = createStudentWithApplicationsSchema.safeParse(payload);
    if (!parsed.success) throw new ValidationError(parsed.error.format());

    const { student, applications: applicationsData } = parsed.data;

    return await db.transaction(async (tx) => {
      // Create student
      const [createdStudent] = await tx
        .insert(students)
        .values(student)
        .returning({ id: students.id });

      if (!createdStudent) throw new NotFoundError('Student creation failed');

      // Assign studentId to applications
      const applicationsWithStudentId = applicationsData.map((app) => ({
        ...app,
        studentId: createdStudent.id,
      }));

      // Insert applications
      const insertedApplications = await tx
        .insert(applications)
        .values(applicationsWithStudentId)
        .returning();

      return { student: createdStudent, applications: insertedApplications };
    });
  }
}
