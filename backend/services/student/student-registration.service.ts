import { db } from "@db";
import { students } from "@db/schema/student";
import { personalInfo } from "@db/schema/personal-info";
import { parentGuardianInfos } from "@db/schema/parent-guardian-info";
import { applications } from "@db/schema/application";
import { educationBackground } from "@db/schema/education-background";
import { appliedPrograms } from "@db/schema/applied-program";
import { studentRegistrationSchema, type StudentRegistrationInput } from "@validation/student-registration.schema";
import { ValidationError, ConflictError, InternalServerError } from "@utils/errors";
import { eq } from "drizzle-orm";
import { AttachmentService } from "@services/attachment/attachment.service";

export class StudentRegistrationService {
  static async execute(
    payload: any,
    personalDocuments?: Express.Multer.File[],
    paymentProof?: Express.Multer.File[]
  ) {
    // Validate the complete registration data
    const parsed = studentRegistrationSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.format());
    }

    const data = parsed.data;

    // Check for duplicate email
    const existingStudentByEmail = await db
      .select()
      .from(students)
      .where(eq(students.email, data.student.email))
      .limit(1);

    if (existingStudentByEmail.length > 0) {
      throw new ConflictError(`Student with email ${data.student.email} already exists`);
    }

    // Check for duplicate phone number
    const existingStudentByPhone = await db
      .select()
      .from(students)
      .where(eq(students.phoneNumber, data.student.phoneNumber))
      .limit(1);

    if (existingStudentByPhone.length > 0) {
      throw new ConflictError(`Student with phone number ${data.student.phoneNumber} already exists`);
    }

    try {
      // Start transaction - create all records
      const result = await db.transaction(async (tx) => {
        // 0. Create attachment records for uploaded files
        let personalInfoAttachmentId = 1; // Default placeholder
        let applicationAttachmentId = 1; // Default placeholder
        
        // Create attachments for personal documents (Birth Certificate, National ID, Passport)
        if (personalDocuments && personalDocuments.length > 0) {
          const personalDocAttachmentIds = await AttachmentService.createAttachments(
            personalDocuments,
            'personalInfo'
          );
          
          if (personalDocAttachmentIds.length > 0) {
            personalInfoAttachmentId = personalDocAttachmentIds[0]; // Use first attachment for personal info
          }
        }
        
        // Create attachment for payment proof
        if (paymentProof && paymentProof.length > 0) {
          const paymentProofAttachmentIds = await AttachmentService.createAttachments(
            paymentProof,
            'application_fee'
          );
          
          if (paymentProofAttachmentIds.length > 0) {
            applicationAttachmentId = paymentProofAttachmentIds[0]; // Use for application
          }
        }

        // 1. Create student record
        const [createdStudent] = await tx
          .insert(students)
          .values({
            nameEn: data.student.nameEn,
            nameKh: data.student.nameKh,
            email: data.student.email,
            phoneNumber: data.student.phoneNumber,
            dateOfBirth: data.student.dateOfBirth,
            status: 'active',
          })
          .returning();

        if (!createdStudent) {
          throw new InternalServerError("Failed to create student record");
        }

        // 2. Create application record
        const [createdApplication] = await tx
          .insert(applications)
          .values({
            studentId: createdStudent.id,
            batchId: data.application.batchId,
            isApplyForScholarShip: data.application.isApplyForScholarShip,
            scholarshipPercentage: data.application.scholarshipPercentage,
            paymentStatus: paymentProof && paymentProof.length > 0 ? 'completed' : 'pending',
            status: paymentProof && paymentProof.length > 0 ? 'submitted' : 'incomplete', // Application is incomplete until payment is made
            attachmentId: applicationAttachmentId, // Use actual attachment ID
          })
          .returning();

        if (!createdApplication) {
          throw new InternalServerError("Failed to create application record");
        }

        // 3. Create personal info record
        const [createdPersonalInfo] = await tx
          .insert(personalInfo)
          .values({
            studentId: createdStudent.id,
            nationality: data.personalInfo.nationality,
            gender: data.personalInfo.gender,
            dob: data.personalInfo.dateOfBirth,
            placeOfBirth: data.personalInfo.placeOfBirth,
            address: data.personalInfo.address,
            attachmentId: personalInfoAttachmentId, // Use actual attachment ID
          })
          .returning();

        if (!createdPersonalInfo) {
          throw new InternalServerError("Failed to create personal info record");
        }

        // 4. Create parent/guardian info record
        const [createdParentGuardianInfo] = await tx
          .insert(parentGuardianInfos)
          .values({
            studentId: createdStudent.id,
            name: data.parentGuardianInfo.name,
            relationship: data.parentGuardianInfo.relationship,
            nationality: data.parentGuardianInfo.nationality,
            address: data.parentGuardianInfo.address,
            job: data.parentGuardianInfo.jobPosition,
            phoneNumber: data.parentGuardianInfo.phoneNumber,
          })
          .returning();

        if (!createdParentGuardianInfo) {
          throw new InternalServerError("Failed to create parent/guardian info record");
        }

        // 5. Create education background record
        const [createdEducationBackground] = await tx
          .insert(educationBackground)
          .values({
            appId: createdApplication.id,
            educationLevel: data.educationBackground.currentEducationLevel === 'university' 
              ? 'bachelor_degree' 
              : 'high_school',
            major: data.educationBackground.major,
            institutionName: data.educationBackground.institutionName || data.educationBackground.highSchoolName,
            currentYear: data.educationBackground.yearOfStudy,
            academicYear: data.educationBackground.academicYear,
            highSchoolName: data.educationBackground.highSchoolName,
            schoolLocation: `${data.educationBackground.schoolCity}, ${data.educationBackground.schoolCountry}`,
            overallGrade: data.educationBackground.overallGrade,
            mathGrade: data.educationBackground.mathGrade,
            englishGrade: data.educationBackground.englishGrade,
            hasEnglishCertificate: data.educationBackground.hasEnglishCertificate,
            // Note: Certificate attachments will need to be handled separately
            grade12CertificateId: 1, // Placeholder
            englishCertificateId: 1, // Placeholder
          })
          .returning();

        if (!createdEducationBackground) {
          throw new InternalServerError("Failed to create education background record");
        }

        // 6. Create applied program record
        const [createdAppliedProgram] = await tx
          .insert(appliedPrograms)
          .values({
            appId: createdApplication.id,
            interestMajorId: data.appliedProgram.interestMajorId,
            isApplyingScholarship: data.appliedProgram.isApplyingScholarship,
            requestedTerm: data.appliedProgram.requestedTerm,
            considerNextIntake: data.appliedProgram.considerNextIntake,
            referralSource: data.appliedProgram.referralSource,
          })
          .returning();

        if (!createdAppliedProgram) {
          throw new InternalServerError("Failed to create applied program record");
        }

        // Return complete registration data
        return {
          student: createdStudent,
          application: createdApplication,
          personalInfo: createdPersonalInfo,
          parentGuardianInfo: createdParentGuardianInfo,
          educationBackground: createdEducationBackground,
          appliedProgram: createdAppliedProgram,
        };
      });

      return result;
    } catch (error) {
      // If it's already one of our custom errors, rethrow it
      if (error instanceof ValidationError || 
          error instanceof ConflictError || 
          error instanceof InternalServerError) {
        throw error;
      }
      
      // Otherwise, wrap it in an InternalServerError
      throw new InternalServerError(
        `Failed to create student registration: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get complete student registration details by student ID
   */
  static async getById(studentId: number) {
    const [student] = await db
      .select()
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    if (!student) {
      throw new ValidationError("Student not found");
    }

    // Get related data
    const [personalInfoData] = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.studentId, studentId))
      .limit(1);

    const [parentGuardianInfoData] = await db
      .select()
      .from(parentGuardianInfos)
      .where(eq(parentGuardianInfos.studentId, studentId))
      .limit(1);

    const applicationsData = await db
      .select()
      .from(applications)
      .where(eq(applications.studentId, studentId));

    // Get education background and applied programs for each application
    const applicationsWithDetails = await Promise.all(
      applicationsData.map(async (app) => {
        const [eduBackground] = await db
          .select()
          .from(educationBackground)
          .where(eq(educationBackground.appId, app.id))
          .limit(1);

        const [appliedProgramData] = await db
          .select()
          .from(appliedPrograms)
          .where(eq(appliedPrograms.appId, app.id))
          .limit(1);

        return {
          ...app,
          educationBackground: eduBackground,
          appliedProgram: appliedProgramData,
        };
      })
    );

    return {
      student,
      personalInfo: personalInfoData,
      parentGuardianInfo: parentGuardianInfoData,
      applications: applicationsWithDetails,
    };
  }
}
