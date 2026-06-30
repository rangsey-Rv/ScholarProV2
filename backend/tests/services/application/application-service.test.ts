// tests/unit/application/applicationService.test.ts
import { z } from "zod";
import { db } from "@db";
import { students } from "@db/schema/student";
import { applications } from "@db/schema/application";
import { CreateSingleApplicationService } from "@services/application/create-single-application.service";
import { ValidationError, NotFoundError } from "@utils/errors";

// ✅ Mock validation schema
const mockCreateStudentWithApplicationsSchema = z.object({
  student: z.object({
    nameEn: z.string(),
    nameKh: z.string(),
    email: z.string().email(),
    phoneNumber: z.string(),
    dateOfBirth: z.string().optional(),
    status: z.string().optional(),
  }),
  applications: z.array(
    z.object({
      batchId: z.number(),
      isApplyForScholarShip: z.boolean().optional(),
      scholarshipPercentage: z.number().min(0).max(100).optional(),
      paymentStatus: z.enum(["pending", "completed", "failed"]).optional(),
      status: z
        .enum([
          "submitted",
          "shortlisted",
          "assessment_scheduled",
          "graded",
          "accepted",
          "rejected",
          "incomplete",
        ])
        .optional(),
    })
  ),
});

// ✅ Mock the schema import
jest.mock("@validation/application.schema", () => ({
  createStudentWithApplicationsSchema: {
    safeParse: jest.fn((payload) => {
      const result = mockCreateStudentWithApplicationsSchema.safeParse(payload);
      return result;
    }),
  },
}));

// ✅ Mock DB
jest.mock("@db", () => ({
  db: {
    transaction: jest.fn(),
  },
}));

describe("ApplicationService.createWithStudent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create student and applications successfully", async () => {
    const payload = {
      student: {
        nameEn: "John",
        nameKh: "ចន",
        email: "john@example.com",
        phoneNumber: "0123456789",
      },
      applications: [
        {
          batchId: 1,
          isApplyForScholarShip: true,
        },
        {
          batchId: 2,
          isApplyForScholarShip: false,
        },
      ],
    };

    const mockCreatedStudent = { id: 123 };
    const mockInsertedApplications = [
      { id: 1, studentId: 123, batchId: 1 },
      { id: 2, studentId: 123, batchId: 2 },
    ];

    const mockTx = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest
        .fn()
        .mockResolvedValueOnce([mockCreatedStudent])
        .mockResolvedValueOnce(mockInsertedApplications),
    };

    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(mockTx));

    const result = await CreateSingleApplicationService.createWithStudent(
      payload
    );

    expect(db.transaction).toHaveBeenCalled();
    expect(mockTx.insert).toHaveBeenCalledWith(students);
    expect(mockTx.insert).toHaveBeenCalledWith(applications);
    expect(result).toEqual({
      student: mockCreatedStudent,
      applications: mockInsertedApplications,
    });
  });

  it("should throw ValidationError for invalid payload", async () => {
    const invalidPayload = { student: { nameEn: 123 }, applications: [] };
    try {
      await CreateSingleApplicationService.createWithStudent(invalidPayload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.name).toBe('ValidationError');
    }
  });

  it("should throw NotFoundError if student creation fails", async () => {
    const payload = {
      student: {
        nameEn: "John",
        nameKh: "ចន",
        email: "john@example.com",
        phoneNumber: "0123",
      },
      applications: [{ batchId: 1 }],
    };

    const mockTx = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValueOnce([]), // Student creation fails
    };

    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(mockTx));

    try {
      await CreateSingleApplicationService.createWithStudent(payload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundError);
      expect(e.name).toBe('NotFoundError');
    }
  });

  it("should throw NotFoundError if application creation fails", async () => {
    const payload = {
      student: {
        nameEn: "John",
        nameKh: "ចន",
        email: "john@example.com",
        phoneNumber: "0123",
      },
      applications: [{ batchId: 1 }],
    };

    const mockTx = {
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest
        .fn()
        .mockResolvedValueOnce([{ id: 123 }])
        .mockResolvedValueOnce([]), // Application creation fails
    };

    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(mockTx));

    try {
      await CreateSingleApplicationService.createWithStudent(payload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundError);
      expect(e.name).toBe('NotFoundError');
    }
  });
});
