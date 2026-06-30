import { db } from "../../db";
import { students } from "../../db/schema/student";
import { applications } from "../../db/schema/application";
import { personalInfo } from "../../db/schema/personal-info";
import { parentGuardianInfos } from "../../db/schema/parent-guardian-info";
import { educationBackground } from "../../db/schema/education-background";
import { appliedPrograms } from "../../db/schema/applied-program";
import { attachments } from "../../db/schema/attachment";
import { batches } from "../../db/schema/batch";
import { majors } from "../../db/schema/major";
import { eq } from "drizzle-orm";

interface ApplicationDetail {
  // Application Info
  applicationId: number;
  batchName: string;
  submittedDate: Date;
  applicationStatus: string;
  isEnglishTestSkipped: boolean;
  isMathTestSkipped: boolean;
  paymentStatus: string;
  scholarshipPercentage: number;

  // Personal Info
  personalInfo: {
    fullNameEnglish: string | null;
    fullNameKhmer: string | null;
    nationality: string;
    gender: string;
    dateOfBirth: Date | null;
    placeOfBirth: string;
    address: string;
    phoneNumber: string | null;
    email: string | null;
    idDocument?: {
      type: string;
      url: string;
    };
  };

  // Parent/Guardian Info
  parentGuardianInfo: {
    name: string;
    nationality: string;
    relationship: string;
    occupation: string;
    phoneNumber: string;
    address: string;
  };

  // Education Background
  educationBackground: {
    // High School
    highSchool: {
      schoolName: string;
      location: string;
      academicYear: string;
      overallGrade: string;
      mathGrade: string;
      englishGrade: string;
      certificateUrl?: string;
    };
    // University (if applicable)
    university?: {
      institutionName: string;
      major: string;
      currentYear: number;
    };
    // English Proficiency (if applicable)
    englishProficiency?: {
      hasCertificate: boolean;
      certificateUrl?: string;
    };
  };

  // Applied Program
  appliedProgram: {
    programName: string;
    isApplyingScholarship: boolean;
    requestedTerm: Date;
    considerNextIntake: boolean;
    referralSource: string;
  };

  // Documents
  documents: {
    personalIdDocument?: {
      type: string;
      url: string;
    };
    highSchoolCertificate?: {
      type: string;
      url: string;
    };
    englishCertificate?: {
      type: string;
      url: string;
    };
    paymentReceipt?: {
      type: string;
      url: string;
    };
  };
}

export class ViewApplicationDetailService {

  async getApplicationDetail(applicationId: number): Promise<ApplicationDetail | null> {

    // 1. Get application with related data
    const application = await db
      .select()
      .from(applications)
      .where(eq(applications.id, applicationId))
      .limit(1);

    if (application.length === 0) {
      return null;
    }

    const app = application[0];

    // 2. Get student info
    const student = await db
      .select()
      .from(students)
      .where(eq(students.id, app.studentId))
      .limit(1);

    if (student.length === 0) {
      return null;
    }

    const studentData = student[0];

    // 3. Get batch info
    const batch = await db
      .select()
      .from(batches)
      .where(eq(batches.id, app.batchId))
      .limit(1);

    const batchData = batch[0];

    // 4. Get personal info with attachment
    const personalInfoData = await db
      .select()
      .from(personalInfo)
      .where(eq(personalInfo.studentId, studentData.id))
      .limit(1);

    const personal = personalInfoData[0];

    // Get personal info attachment
    let personalAttachment = null;
    if (personal?.attachmentId) {
      const personalAttachmentData = await db
        .select()
        .from(attachments)
        .where(eq(attachments.id, personal.attachmentId))
        .limit(1);
      personalAttachment = personalAttachmentData[0];
    }

    // 5. Get parent/guardian info
    const parentGuardianData = await db
      .select()
      .from(parentGuardianInfos)
      .where(eq(parentGuardianInfos.studentId, studentData.id))
      .limit(1);

    const parentGuardian = parentGuardianData[0];

    // 6. Get education background with certificates
    const educationData = await db
      .select()
      .from(educationBackground)
      .where(eq(educationBackground.appId, applicationId))
      .limit(1);

    const education = educationData[0];

    // Get grade 12 certificate
    let grade12Certificate = null;
    if (education?.grade12CertificateId) {
      const grade12CertData = await db
        .select()
        .from(attachments)
        .where(eq(attachments.id, education.grade12CertificateId))
        .limit(1);
      grade12Certificate = grade12CertData[0];
    }

    // Get english certificate
    let englishCertificate = null;
    if (education?.englishCertificateId) {
      const englishCertData = await db
        .select()
        .from(attachments)
        .where(eq(attachments.id, education.englishCertificateId))
        .limit(1);
      englishCertificate = englishCertData[0];
    }

    // 7. Get applied program with major name
    const appliedProgramData = await db
      .select({
        appliedProgram: appliedPrograms,
        majorName: majors.majorName,
      })
      .from(appliedPrograms)
      .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
      .where(eq(appliedPrograms.appId, applicationId))
      .limit(1);

    const appliedProgram = appliedProgramData[0]?.appliedProgram;
    const majorName = appliedProgramData[0]?.majorName;

    // 8. Get payment receipt attachment
    let paymentAttachment = null;
    if (app.attachmentId) {
      const paymentAttachmentData = await db
        .select()
        .from(attachments)
        .where(eq(attachments.id, app.attachmentId))
        .limit(1);
      paymentAttachment = paymentAttachmentData[0];
    }

    // 9. Build the response
    const result: ApplicationDetail = {
      // Application Info
      applicationId: app.id,
      batchName: batchData?.batchName || "Unknown Batch",
      submittedDate: app.createdAt,
      applicationStatus: app.status || "pending",
      isEnglishTestSkipped: app.isEnglishTestSkipped,
      isMathTestSkipped: app.isMathTestSkipped,
      paymentStatus: app.paymentStatus,
      scholarshipPercentage: app.scholarshipPercentage || 0,

      // Personal Info
      personalInfo: {
        fullNameEnglish: studentData.nameEn || "N/A",
        fullNameKhmer: studentData.nameKh || "N/A",
        nationality: personal?.nationality || "N/A",
        gender: personal?.gender || "N/A",
        dateOfBirth: personal?.dob || studentData.dateOfBirth || null,
        placeOfBirth: personal?.placeOfBirth || "N/A",
        address: personal?.address || "N/A",
        phoneNumber: studentData.phoneNumber || "N/A",
        email: studentData.email,
        idDocument:
          personalAttachment && personalAttachment.fileUrl !== "placeholder"
            ? {
              type: personalAttachment.type,
              url: personalAttachment.fileUrl,
            }
            : undefined,
      },

      // Parent/Guardian Info
      parentGuardianInfo: {
        name: parentGuardian?.name || "N/A",
        nationality: parentGuardian?.nationality || "N/A",
        relationship: parentGuardian?.relationship || "N/A",
        occupation: parentGuardian?.job || "N/A",
        phoneNumber: parentGuardian?.phoneNumber || "N/A",
        address: parentGuardian?.address || "N/A",
      },

      // Education Background
      educationBackground: {
        // High School
        highSchool: {
          schoolName: education?.highSchoolName || "N/A",
          location: education?.schoolLocation || "N/A",
          academicYear: education?.academicYear || "N/A",
          overallGrade: education?.overallGrade || "N/A",
          mathGrade: education?.mathGrade || "N/A",
          englishGrade: education?.englishGrade || "N/A",
          certificateUrl:
            grade12Certificate && grade12Certificate.fileUrl !== "placeholder"
              ? grade12Certificate.fileUrl
              : undefined,
        },
        // University (only if bachelor_degree)
        university:
          education?.educationLevel === "bachelor_degree"
            ? {
              institutionName: education.institutionName,
              major: education.major || "N/A",
              currentYear: education.currentYear || 0,
            }
            : undefined,
        // English Proficiency
        englishProficiency: {
          hasCertificate: education?.hasEnglishCertificate === "yes",
          certificateUrl:
            englishCertificate && englishCertificate.fileUrl !== "placeholder"
              ? englishCertificate.fileUrl
              : undefined,
        },
      },

      // Applied Program
      appliedProgram: {
        programName: majorName || "N/A",
        isApplyingScholarship: appliedProgram?.isApplyingScholarship || false,
        requestedTerm: appliedProgram?.requestedTerm || new Date(),
        considerNextIntake: appliedProgram?.considerNextIntake || false,
        referralSource: appliedProgram?.referralSource || "N/A",
      },

      // Documents
      documents: {
        personalIdDocument:
          personalAttachment && personalAttachment.fileUrl !== "placeholder"
            ? {
              type: personalAttachment.type,
              url: personalAttachment.fileUrl,
            }
            : undefined,
        highSchoolCertificate:
          grade12Certificate && grade12Certificate.fileUrl !== "placeholder"
            ? {
              type: grade12Certificate.type,
              url: grade12Certificate.fileUrl,
            }
            : undefined,
        englishCertificate:
          englishCertificate && englishCertificate.fileUrl !== "placeholder"
            ? {
              type: englishCertificate.type,
              url: englishCertificate.fileUrl,
            }
            : undefined,
        paymentReceipt:
          paymentAttachment && paymentAttachment.fileUrl !== "placeholder"
            ? {
              type: paymentAttachment.type,
              url: paymentAttachment.fileUrl,
            }
            : undefined,
      },
    };

    return result;
  }

  // Get all applications (list view)
  async getAllApplications(): Promise<Array<{
    applicationId: number;
    studentName: string;
    email: string;
    program: string;
    batchName: string;
    submittedDate: Date;
    applicationStatus: string;
    paymentStatus: string;
  }>> {
    const allApplications = await db
      .select({
        applicationId: applications.id,
        studentId: applications.studentId,
        batchId: applications.batchId,
        submittedDate: applications.createdAt,
        applicationStatus: applications.status,
        paymentStatus: applications.paymentStatus,
      })
      .from(applications);

    const results = await Promise.all(
      allApplications.map(async (app) => {
        // Get student
        const student = await db
          .select()
          .from(students)
          .where(eq(students.id, app.studentId))
          .limit(1);

        // Get batch
        const batch = await db
          .select()
          .from(batches)
          .where(eq(batches.id, app.batchId))
          .limit(1);

        // Get applied program with major
        const program = await db
          .select({
            majorName: majors.majorName,
          })
          .from(appliedPrograms)
          .innerJoin(majors, eq(majors.id, appliedPrograms.interestMajorId))
          .where(eq(appliedPrograms.appId, app.applicationId))
          .limit(1);

        return {
          applicationId: app.applicationId,
          studentName: student[0]?.nameEn || 'N/A',
          email: student[0]?.email || 'N/A',
          program: program[0]?.majorName || 'N/A',
          batchName: batch[0]?.batchName || 'N/A',
          submittedDate: app.submittedDate,
          applicationStatus: app.applicationStatus || 'pending',
          paymentStatus: app.paymentStatus,
        };
      })
    );

    return results;
  }
}
