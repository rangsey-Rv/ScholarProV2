import { useState, useEffect } from "react";
import { apiClient } from "@/api/api";
import { API_ENDPOINTS } from "@/api/endpoint";
import type { Applicant } from "../types";

// Helper function to format date strings to normal date format
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString || "";
  }
};

export function useApplicantData(applicantId: string | string[]) {
  const [studentData, setStudentData] = useState<Applicant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          `${API_ENDPOINTS.APPLICANT}/${applicantId}`,
        );
        const applicant = response?.data?.data || response?.data;

        if (applicant) {
          // Map API response to local Applicant type
          const mapped: Applicant = {
            id: String(applicant.applicationId || applicant.id),
            submittedDate: applicant.submittedDate,
            applicationStatus: applicant.applicationStatus,
            number:
              applicant.number ||
              `APP-${applicant.applicationId || applicant.id}`,
            personalInfo: {
              fullNameEnglish:
                applicant.personalInfo?.fullNameEnglish ||
                applicant.nameEn ||
                applicant.name,
              fullNameKhmer:
                applicant.personalInfo?.fullNameKhmer || applicant.nameKh,
              gender: applicant.personalInfo?.gender || applicant.gender,
              nationality:
                applicant.personalInfo?.nationality || applicant.nationality,
              dateOfBirth: formatDate(
                applicant.personalInfo?.dateOfBirth || applicant.dateOfBirth,
              ),
              placeOfBirth:
                applicant.personalInfo?.placeOfBirth || applicant.placeOfBirth,
              address: applicant.personalInfo?.address || applicant.address,
              phoneNumber:
                applicant.personalInfo?.phoneNumber ||
                applicant.phoneNumber ||
                applicant.phone,
              email: applicant.personalInfo?.email || applicant.email,
              idDocument: {
                type: applicant.personalInfo?.idDocument?.type || "",
                url: applicant.personalInfo?.idDocument?.url || "",
              },
            },
            parentGuardianInfo: {
              name:
                applicant.parentGuardianInfo?.name || applicant.guardianName,
              nationality:
                applicant.parentGuardianInfo?.nationality ||
                applicant.guardianNationality,
              relationship:
                applicant.parentGuardianInfo?.relationship ||
                applicant.relationship,
              occupation:
                applicant.parentGuardianInfo?.occupation ||
                applicant.guardianOccupation,
              phoneNumber:
                applicant.parentGuardianInfo?.phoneNumber ||
                applicant.guardianPhone,
              address:
                applicant.parentGuardianInfo?.address ||
                applicant.guardianAddress,
            },
            educationBackground: {
              highSchool: {
                schoolName:
                  applicant.educationBackground?.highSchool?.schoolName ||
                  applicant.highSchoolName,
                location:
                  applicant.educationBackground?.highSchool?.location ||
                  applicant.schoolLocation,
                academicYear:
                  applicant.educationBackground?.highSchool?.academicYear ||
                  applicant.academicYear,
                overallGrade:
                  applicant.educationBackground?.highSchool?.overallGrade ||
                  applicant.overallGrade,
                mathGrade:
                  applicant.educationBackground?.highSchool?.mathGrade ||
                  applicant.mathGrade,
                englishGrade:
                  applicant.educationBackground?.highSchool?.englishGrade ||
                  applicant.englishGrade,
                certificateUrl:
                  applicant.educationBackground?.highSchool?.certificateUrl ||
                  "",
              },
              currentEducation: {
                institutionName:
                  applicant.educationBackground?.currentEducation
                    ?.institutionName || applicant.institutionName,
                major:
                  applicant.educationBackground?.currentEducation?.major ||
                  applicant.major,
                currentYear:
                  applicant.educationBackground?.currentEducation
                    ?.currentYear || applicant.currentYear,
              },
              englishProficiency: {
                hasCertificate:
                  applicant.educationBackground?.currentEducation
                    ?.englishProficiency?.hasCertificate ||
                  applicant.hasEnglishCertificate === "yes"
                    ? "yes"
                    : "no",
                certificateUrl:
                  applicant.educationBackground?.currentEducation
                    ?.englishProficiency?.certificateUrl || "",
              },
            },
            appliedProgram: {
              programName:
                applicant.appliedProgram?.programName ||
                applicant.program ||
                applicant.major,
              isApplyingScholarship:
                applicant.appliedProgram?.isApplyingScholarship ||
                applicant.scholarship,
              requestedTerm: formatDate(
                applicant.appliedProgram?.requestedTerm ||
                  applicant.requestedTerm,
              ),
              considerNextIntake: applicant.appliedProgram?.considerNextIntake,
              referralSource: applicant.appliedProgram?.referralSource || "",
            },
            documents: {
              personalIdDocument: {
                type: applicant.documents?.personalIdDocument?.type || "",
                url: applicant.documents?.personalIdDocument?.url || "",
              },
              highSchoolCertificate: {
                type: applicant.documents?.highSchoolCertificate?.type || "",
                url: applicant.documents?.highSchoolCertificate?.url || "",
              },
              englishCertificate: {
                type: applicant.documents?.englishCertificate?.type || "",
                url: applicant.documents?.englishCertificate?.url || "",
              },
              paymentReceipt: {
                type: applicant.documents?.paymentReceipt?.type || "",
                url: applicant.documents?.paymentReceipt?.url || "",
              },
            },
            nameEn:
              applicant.personalInfo?.fullNameEnglish ||
              applicant.nameEn ||
              applicant.name,
            name: applicant.name || applicant.nameEn,
            nameKh: applicant.personalInfo?.fullNameKhmer || applicant.nameKh,
            gender: applicant.personalInfo?.gender || applicant.gender,
            nationality:
              applicant.personalInfo?.nationality || applicant.nationality,
            dateOfBirth: formatDate(
              applicant.personalInfo?.dateOfBirth || applicant.dateOfBirth,
            ),
            dateApplied: formatDate(
              applicant.dateApplied || applicant.createdAt,
            ),
            placeOfBirth:
              applicant.personalInfo?.placeOfBirth || applicant.placeOfBirth,
            country: applicant.personalInfo?.country || applicant.country,
            address: applicant.personalInfo?.address || applicant.address,
            phoneNumber:
              applicant.personalInfo?.phoneNumber ||
              applicant.phoneNumber ||
              applicant.phone,
            phone: applicant.phone || applicant.phoneNumber,
            email: applicant.personalInfo?.email || applicant.email,
            "Parent/Guardian Name":
              applicant.parentGuardianInfo?.name || applicant.guardianName,
            "Relationship to Student":
              applicant.parentGuardianInfo?.relationship ||
              applicant.relationship,
            "Parent Nationality":
              applicant.parentGuardianInfo?.nationality ||
              applicant.guardianNationality,
            "Parent Job":
              applicant.parentGuardianInfo?.occupation ||
              applicant.guardianOccupation,
            "Parent Phone Number":
              applicant.parentGuardianInfo?.phoneNumber ||
              applicant.guardianPhone,
            "Parent Address":
              applicant.parentGuardianInfo?.address ||
              applicant.guardianAddress,
            educationLevel:
              applicant.educationBackground?.level || applicant.educationLevel,
            institutionName:
              applicant.educationBackground?.currentEducation
                ?.institutionName || applicant.institutionName,
            currentYear:
              applicant.educationBackground?.currentEducation?.currentYear ||
              applicant.currentYear,
            academicYear:
              applicant.educationBackground?.highSchool?.academicYear ||
              applicant.academicYear,
            highSchoolName:
              applicant.educationBackground?.highSchool?.schoolName ||
              applicant.highSchoolName,
            schoolLocation:
              applicant.educationBackground?.highSchool?.location ||
              applicant.schoolLocation,
            overallGrade:
              applicant.educationBackground?.highSchool?.overallGrade ||
              applicant.overallGrade,
            mathGrade:
              applicant.educationBackground?.highSchool?.mathGrade ||
              applicant.mathGrade,
            englishGrade:
              applicant.educationBackground?.highSchool?.englishGrade ||
              applicant.englishGrade,
            university:
              applicant.educationBackground?.currentEducation
                ?.institutionName ||
              applicant.university ||
              applicant.institutionName,
            major:
              applicant.educationBackground?.currentEducation?.major ||
              applicant.major,
            ielts: applicant.ielts,
            toefl: applicant.toefl,
            baci: applicant.baci,
            hasEnglishCertificate: applicant.educationBackground
              ?.englishProficiency?.hasCertificate
              ? "yes"
              : "no",
            program: applicant.program || applicant.major,
            scholarship: applicant.scholarship,
            "Interest Major":
              applicant.appliedProgram?.programName || applicant.major,
            "Is Applying Scholarship":
              applicant.appliedProgram?.isApplyingScholarship ||
              applicant.scholarship,
            "Requested Term": formatDate(
              applicant.appliedProgram?.requestedTerm ||
                applicant.requestedTerm,
            ),
            "Referral Source":
              applicant.appliedProgram?.referralSource || applicant.source,
            // status: applicant.status,
            status: applicant.applicationStatus,
            batch: applicant.batch || applicant.batchName,
            batchId: applicant.batchId,
            awardAmount: applicant.awardAmount,
            notes: applicant.notes,
            evaluations: applicant.evaluations,
            evaluation: applicant.evaluation,
            mathScore: applicant.mathScore,
            englishScore: applicant.englishScore,
          };

          setStudentData(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch student data:", err);
        setError("Failed to load applicant data");
      } finally {
        setIsLoading(false);
      }
    };

    if (applicantId) {
      fetchStudentData();
    }
  }, [applicantId]);

  return { studentData, isLoading, error, refetch: () => {} };
}
