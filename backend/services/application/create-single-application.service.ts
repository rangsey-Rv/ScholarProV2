import { db } from '@db';
import { applications } from '@db/schema/application';
import { students } from '@db/schema/student';
import { createStudentWithApplicationsSchema } from '@validation/application.schema';
import { NotFoundError, ValidationError } from '@utils/errors';

export class CreateSingleApplicationService {
  static async createWithStudent(payload: unknown) {

    const parsed = createStudentWithApplicationsSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.format());
    }

    const { student, applications: applicationsData } = parsed.data;


    return await db.transaction(async (tx) => {
      // Create student
      const [createdStudent] = await tx
        .insert(students)
        .values(student)
        .returning({ id: students.id });

      if (!createdStudent) throw new NotFoundError('Student creation failed');

      const applicationsWithStudentId = applicationsData.map((app) => ({
        ...app,
        studentId: createdStudent.id,
      }));


      const insertedApplications = await tx
        .insert(applications)
        .values(applicationsWithStudentId)
        .returning();

      if (!insertedApplications || insertedApplications.length === 0) {
        throw new NotFoundError('Application creation failed');
      }

      return { student: createdStudent, applications: insertedApplications };
    });
  }
}
export { NotFoundError, ValidationError };

