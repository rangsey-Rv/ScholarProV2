import { db } from "../../db";
import { students } from "../../db/schema/student";
import { applications } from "../../db/schema/application";
import { personalInfo } from "../../db/schema/personal-info";
import { parentGuardianInfos } from "../../db/schema/parent-guardian-info";
import { educationBackground } from "../../db/schema/education-background";
import { appliedPrograms } from "../../db/schema/applied-program";
import { attachments } from "../../db/schema/attachment";
import { majors } from "../../db/schema/major";
import { batches } from "../../db/schema/batch";
import { eq, inArray } from "drizzle-orm";
import { validateGoogleDriveUrl } from "@utils/validate-url";

interface CSVRow {
  "Email Address": string;
  "Full Name (Khmer)": string;
  "Full Name (English)": string;
  Nationality: string;
  Gender: string;
  "Date of Birth": string;
  "Place of Birth": string;
  Address: string;
  "Phone Number": string;
  "Personal Info Attachment Type": string;
  "Personal Info File URL": string;
  "Parent/Guardian Name": string;
  "Relationship to Student": string;
  "Parent Nationality": string;
  "Parent Address": string;
  "Parent Job": string;
  "Parent Phone Number": string;
  "Education Level": string;
  Major: string;
  "Institution Name": string;
  "Current Year"?: string;
  "Academic Year": string;
  "High School Name": string;
  "School Location": string;
  "Overall Grade": string;
  "Math Grade": string;
  "English Grade": string;
  "Grade 12 Certificate Type": string;
  "Grade 12 Certificate URL": string;
  "Has English Certificate": string;
  "English Certificate URL"?: string;
  "Interest Major"?: string; // For backward compatibility
  "Interest Major ID"?: string;
  "Is Applying Scholarship": string;
  "Requested Term": string;
  "Consider Next Intake": string;
  "Referral Source": string;
  "Email Consent": string;
  "Payment Status": string;
  "Attachment Type": string;
  "File URL": string;
}

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string; details?: any }>;
  warnings?: Array<{ row: number; email: string; warning: string }>;
}

export class ImportApplicationService {
  private CHUNK_SIZE = 20; // Small chunks to avoid PostgreSQL parameter limits (max 65,534 params)

  private toBoolean(value: string): boolean {
    if (!value) return false;
    const normalized = value.toLowerCase().trim();
    return normalized === "yes" || normalized === "true" || normalized === "1";
  }

  private validateEmail(email: string): void {
    if (!email || email.trim() === "") {
      throw new Error("Email address is required");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format: '${email}'`);
    }
  }

  private validatePhoneNumber(phone: string): void {
    if (!phone || phone.trim() === "") {
      throw new Error("Phone number is required");
    }
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      throw new Error(
        `Invalid phone number length: '${phone}' (must be 8-15 digits)`
      );
    }
  }

  private validateRequired(
    value: string | undefined,
    fieldName: string
  ): string {
    if (!value || value.trim() === "") {
      throw new Error(`${fieldName} is required but was empty or missing`);
    }
    return value.trim();
  }

  private async validateMajorIds(
    majorIds: number[]
  ): Promise<Map<number, boolean>> {
    const uniqueIds = [...new Set(majorIds)];
    const existingMajors = await db
      .select({ id: majors.id })
      .from(majors)
      .where(inArray(majors.id, uniqueIds));

    return new Map(existingMajors.map((m) => [m.id, true]));
  }

  private getMajorNameToIdMap = async (
    txOrDb: any = db
  ): Promise<Map<string, number>> => {
    const allMajors = await txOrDb
      .select({ id: majors.id, name: majors.majorName })
      .from(majors);

    return new Map(
      allMajors.map((m: any) => [m.name.toLowerCase().trim(), m.id])
    );
  };

  private async resolveMajorId(
    row: CSVRow,
    majorNameMap: Map<string, number>
  ): Promise<number> {
    // Try Interest Major ID first (new format)
    const majorIdStr = row["Interest Major ID"];
    if (majorIdStr && majorIdStr.trim() !== "") {
      const id = parseInt(majorIdStr);
      if (isNaN(id) || id <= 0) {
        throw new Error(
          `Invalid Interest Major ID: '${majorIdStr}'. Must be a positive integer.`
        );
      }
      return id;
    }

    // Fall back to Interest Major name (old format)
    const majorName = row["Interest Major"];
    if (!majorName || majorName.trim() === "") {
      throw new Error(
        "Either Interest Major ID or Interest Major name is required"
      );
    }

    const normalizedName = majorName.toLowerCase().trim();
    const majorId = majorNameMap.get(normalizedName);

    if (!majorId) {
      throw new Error(
        `Major name '${majorName}' not found in database. Available majors: ${Array.from(
          majorNameMap.keys()
        ).join(", ")}`
      );
    }

    return majorId;
  }

  private parseDate(dateString: string, fieldName: string): Date {
    if (!dateString || dateString.trim() === "") {
      throw new Error(`${fieldName} is empty or missing`);
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error(`${fieldName} has invalid date format: '${dateString}'`);
    }

    const year = date.getFullYear();
    if (year < 1900 || year > 2100) {
      throw new Error(`${fieldName} has unrealistic year: ${year}`);
    }

    return date;
  }

  private chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  private extractDbError(error: any): string {
    if (!error) return "Unknown error";

    // Check if it's a Drizzle error with a cause (the actual DB error)
    const actualError = error.cause || error;
    const errorStr = actualError.message || String(actualError);

    // Extract PostgreSQL error code and message
    if (actualError.code) {
      const pgErrors: Record<string, string> = {
        "23505": "Duplicate entry (unique constraint violation)",
        "23503": "Foreign key constraint violation",
        "23502": "Not null constraint violation",
        "22001": "String data too long",
        "22P02": "Invalid text representation",
        "23514": "Check constraint violation",
      };

      const pgError =
        pgErrors[actualError.code] || `Database error (${actualError.code})`;
      const detail =
        actualError.detail ||
        actualError.constraint ||
        actualError.column ||
        "";
      return detail ? `${pgError}: ${detail}` : pgError;
    }

    // Extract the actual error before "Failed query:" if it exists
    if (errorStr.includes("Failed query:")) {
      const parts = errorStr.split("Failed query:");
      const cleanError = parts[0].trim();
      if (cleanError && cleanError !== "Error:") {
        return cleanError;
      }
    }

    // Check for common error patterns
    if (errorStr.includes("MAX_PARAMETERS_EXCEEDED")) {
      return "Too many parameters in query (reduce chunk size)";
    }

    // Limit error message length
    return errorStr.length > 300
      ? errorStr.substring(0, 300) + "..."
      : errorStr;
  }

  async importFromCSV(rows: CSVRow[], batchId: number): Promise<ImportResult> {
    const result: ImportResult = {
      success: 0,
      failed: 0,
      errors: [],
      warnings: [],
    };

    if (!rows || rows.length === 0) {
      throw new Error("No data provided for import");
    }

    // Validate batch exists
    const batch = await db
      .select()
      .from(batches)
      .where(eq(batches.id, batchId))
      .limit(1);
    if (batch.length === 0) {
      throw new Error(
        `Batch with ID ${batchId} not found. Please create the batch first or use a valid batch ID.`
      );
    }

    // Check batch status
    if (batch[0].status !== "active") {
      throw new Error(
        `Batch "${batch[0].batchName}" (ID: ${batchId}) is not active. Current status: ${batch[0].status}. Only active batches can accept new applications.`
      );
    }

    try {
      const chunks = this.chunk(rows, this.CHUNK_SIZE);

      // Process all chunks in parallel - fail fast, no retries
      const chunkResults = await Promise.allSettled(
        chunks.map((chunk, index) =>
          this.processChunk(chunk, index * this.CHUNK_SIZE, batchId)
        )
      );

      // Aggregate results
      chunkResults.forEach((chunkResult, index) => {
        const chunk = chunks[index];
        const chunkStartIndex = index * this.CHUNK_SIZE;

        if (chunkResult.status === "fulfilled") {
          result.success += chunk.length;
        } else {
          // Entire chunk failed - mark all rows as failed
          result.failed += chunk.length;
          const error = chunkResult.reason;
          const errorMsg = this.extractDbError(error);

          chunk.forEach((row, rowIndex) => {
            const rowNumber = chunkStartIndex + rowIndex + 2;
            result.errors.push({
              row: rowNumber,
              email: row?.["Email Address"] || "Unknown",
              error: errorMsg,
              details: undefined,
            });
          });
        }
      });

      return result;
    } catch (error) {
      throw new Error(
        `Import failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  private async processChunk(
    chunk: CSVRow[],
    startIndex: number,
    batchId: number
  ): Promise<void> {
    try {
      await db.transaction(async (tx) => {
        // 1. Handle students - deduplicate within chunk
        const uniqueEmails = [
          ...new Set(chunk.map((r) => r["Email Address"]).filter(Boolean)),
        ];

        if (uniqueEmails.length === 0) {
          throw new Error("No valid email addresses found in chunk");
        }

        const emailToRowMap = new Map<string, CSVRow>();
        chunk.forEach((r) => {
          const email = r["Email Address"];
          if (email && !emailToRowMap.has(email)) {
            emailToRowMap.set(email, r);
          }
        });

        // Get existing students
        const existingStudents = await tx
          .select()
          .from(students)
          .where(inArray(students.email, uniqueEmails));

        const existingEmails = new Set(existingStudents.map((s) => s.email));

        // Prepare new students data
        const newStudentsData = uniqueEmails
          .filter((email) => !existingEmails.has(email))
          .map((email) => {
            const r = emailToRowMap.get(email)!;
            this.validateEmail(r["Email Address"]);
            this.validatePhoneNumber(r["Phone Number"]);

            return {
              nameEn: this.validateRequired(
                r["Full Name (English)"],
                "Full Name (English)"
              ),
              nameKh: this.validateRequired(
                r["Full Name (Khmer)"],
                "Full Name (Khmer)"
              ),
              email: r["Email Address"],
              phoneNumber: r["Phone Number"],
              dateOfBirth: this.parseDate(r["Date of Birth"], "Date of Birth"),
              status: "active" as const,
            };
          });

        // Insert new students (handle empty array)
        let insertedStudents: any[] = [];
        if (newStudentsData.length > 0) {
          try {
            insertedStudents = await tx
              .insert(students)
              .values(newStudentsData)
              .returning();
          } catch (error: any) {
            // Re-throw with better error message
            throw new Error(this.extractDbError(error));
          }
        }

        // Create student map
        const studentMap = new Map<string, number>([
          ...existingStudents.map((s) => [s.email, s.id] as [string, number]),
          ...insertedStudents.map((s) => [s.email, s.id] as [string, number]),
        ]);

        // 2. Bulk create all attachments (4 per row) with URL validation
        const allAttachments = chunk.flatMap((r) => {
          // Validate all file URLs are from Google Drive
          validateGoogleDriveUrl(r["File URL"], "File URL");
          validateGoogleDriveUrl(
            r["Personal Info File URL"],
            "Personal Info File URL"
          );
          validateGoogleDriveUrl(
            r["Grade 12 Certificate URL"],
            "Grade 12 Certificate URL"
          );

          // English Certificate URL is optional
          if (
            r["English Certificate URL"] &&
            r["English Certificate URL"].trim() !== ""
          ) {
            validateGoogleDriveUrl(
              r["English Certificate URL"],
              "English Certificate URL"
            );
          }

          return [
            {
              type: this.validateRequired(
                r["Attachment Type"],
                "Attachment Type"
              ),
              fileUrl: this.validateRequired(r["File URL"], "File URL"),
            },
            {
              type: r["Personal Info Attachment Type"] || "placeholder",
              fileUrl: r["Personal Info File URL"] || "placeholder",
            },
            {
              type: r["Grade 12 Certificate Type"] || "grade12_certificate",
              fileUrl: r["Grade 12 Certificate URL"] || "placeholder",
            },
            {
              type: "english_certificate",
              fileUrl: r["English Certificate URL"] || "placeholder",
            },
          ];
        });

        const createdAttachments = await tx
          .insert(attachments)
          .values(allAttachments)
          .returning({ id: attachments.id });

        // 3. Bulk create applications
        const applicationValues = chunk.map((r, i) => {
          const studentId = studentMap.get(r["Email Address"]);
          if (!studentId) {
            throw new Error(
              `Student ID not found for email: ${r["Email Address"]}`
            );
          }

          return {
            studentId,
            batchId: batchId,
            paymentStatus: "pending" as any,
            attachmentId: createdAttachments[i * 4].id,
            isApplyForScholarShip: this.toBoolean(r["Is Applying Scholarship"]),
            scholarshipPercentage: null,
          };
        });

        const createdApplications = await tx
          .insert(applications)
          .values(applicationValues)
          .returning({ id: applications.id });

        // 4. Prepare all related data
        const personalInfoData = chunk.map((r, i) => ({
          studentId: studentMap.get(r["Email Address"])!,
          nationality: r["Nationality"],
          gender: r["Gender"].toLowerCase() as "male" | "female" | "other",
          dob: this.parseDate(r["Date of Birth"], "Date of Birth"),
          placeOfBirth: r["Place of Birth"],
          address: r["Address"],
          attachmentId: createdAttachments[i * 4 + 1].id,
        }));

        const parentData = chunk.map((r) => ({
          studentId: studentMap.get(r["Email Address"])!,
          name: r["Parent/Guardian Name"],
          relationship: r["Relationship to Student"],
          nationality: r["Parent Nationality"],
          address: r["Parent Address"],
          job: r["Parent Job"],
          phoneNumber: r["Parent Phone Number"],
        }));

        const educationData = chunk.map((r, i) => {
          const currentYearStr = r["Current Year"];
          const currentYear = currentYearStr ? parseInt(currentYearStr) : null;

          if (
            currentYearStr &&
            (isNaN(currentYear!) || currentYear! < 1 || currentYear! > 10)
          ) {
            throw new Error(
              `Invalid Current Year value: '${currentYearStr}'. Must be between 1 and 10.`
            );
          }

          return {
            appId: createdApplications[i].id,
            educationLevel: this.validateRequired(
              r["Education Level"],
              "Education Level"
            )
              .toLowerCase()
              .replace(/ /g, "_") as any,
            major: r["Major"] || null,
            institutionName: this.validateRequired(
              r["Institution Name"],
              "Institution Name"
            ),
            currentYear,
            academicYear: this.validateRequired(
              r["Academic Year"],
              "Academic Year"
            ),
            highSchoolName: this.validateRequired(
              r["High School Name"],
              "High School Name"
            ),
            schoolLocation: this.validateRequired(
              r["School Location"],
              "School Location"
            ),
            overallGrade: this.validateRequired(
              r["Overall Grade"],
              "Overall Grade"
            ) as any,
            mathGrade: this.validateRequired(
              r["Math Grade"],
              "Math Grade"
            ) as any,
            englishGrade: this.validateRequired(
              r["English Grade"],
              "English Grade"
            ) as any,
            grade12CertificateId: createdAttachments[i * 4 + 2].id,
            hasEnglishCertificate: (r["Has English Certificate"] === "Yes"
              ? "yes"
              : "no") as any,
            englishCertificateId: createdAttachments[i * 4 + 3].id,
          };
        });

        // Get major name to ID mapping once for the whole chunk
        const majorNameMap = await this.getMajorNameToIdMap(tx);

        // Create program data with resolved major IDs
        const programData = chunk.map((r, i) => {
          const interestMajorValue = r["Interest Major"];

          if (!interestMajorValue) {
            throw new Error(
              `Interest Major field is missing or empty for row ${i + 1}`
            );
          }

          const majorName = interestMajorValue.toLowerCase().trim();
          const majorId = majorNameMap.get(majorName);

          if (!majorId) {
            const availableMajors = Array.from(majorNameMap.keys()).join(", ");
            throw new Error(
              `Major '${interestMajorValue}' (normalized: '${majorName}') not found. Available: ${availableMajors}`
            );
          }

          return {
            appId: createdApplications[i].id,
            interestMajorId: majorId,
            isApplyingScholarship: this.toBoolean(r["Is Applying Scholarship"]),
            requestedTerm: this.parseDate(
              r["Requested Term"],
              "Requested Term"
            ),
            considerNextIntake: this.toBoolean(r["Consider Next Intake"]),
            referralSource: r["Referral Source"],
          };
        });

        // Validate all major IDs exist
        const majorIds = programData.map((p) => p.interestMajorId);
        const validMajorIds = await this.validateMajorIds(majorIds);
        const invalidMajor = majorIds.find((id) => !validMajorIds.has(id));
        if (invalidMajor) {
          throw new Error(
            `Interest Major ID ${invalidMajor} does not exist in database`
          );
        }

        // 5. Execute all inserts in parallel
        await Promise.all([
          tx.insert(personalInfo).values(personalInfoData),
          tx.insert(parentGuardianInfos).values(parentData),
          tx.insert(educationBackground).values(educationData),
          tx.insert(appliedPrograms).values(programData),
        ]);
      });
    } catch (error: any) {
      // Re-throw with cleaned error message
      throw new Error(this.extractDbError(error));
    }
  }
}
