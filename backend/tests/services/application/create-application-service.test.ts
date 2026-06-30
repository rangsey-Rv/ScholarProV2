// tests/unit/application/createApplicationService.test.ts
import { z } from "zod";
import { db } from "@db";
import { applications } from "@db/schema/application";
import { CreateApplicationService } from "@services/application/create-application.service";
import { ValidationError, NotFoundError } from "@utils/errors";

const mockCreateApplicationSchema = z.object({
  batchId: z.number().int(),
  attachmentId: z.number().optional(),
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
});

jest.mock("@validation/application.schema", () => ({
  createApplicationSchema: {
    safeParse: jest.fn((payload) => {
      const result = mockCreateApplicationSchema.safeParse(payload);
      return result;
    }),
  },
}));

// ✅ Mock DB
jest.mock("@db", () => ({
  db: {
    insert: jest.fn(),
  },
}));

describe("CreateApplicationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create an application successfully", async () => {
    const studentId = 123;
    const payload = {
      batchId: 456,
      isApplyForScholarShip: true,
    };

    const mockCreatedApplication = {
      id: 1,
      studentId,
      batchId: 456,
      isApplyForScholarShip: true,
      status: "submitted",
    };

    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockCreatedApplication]),
    };
    (db.insert as jest.Mock).mockReturnValue(mockInsert);

    const result = await CreateApplicationService.execute(studentId, payload);

    expect(db.insert).toHaveBeenCalledWith(applications);
    expect(mockInsert.values).toHaveBeenCalledWith({ ...payload, studentId });
    expect(result).toEqual(mockCreatedApplication);
  });

  it("should throw ValidationError for invalid payload", async () => {
    const studentId = 123;
    const invalidPayload = { batchId: "not-a-number" };

    let error: any;
    try {
      await CreateApplicationService.execute(studentId, invalidPayload);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe('ValidationError');
  });

  it("should throw NotFoundError if DB insert returns nothing", async () => {
    const studentId = 123;
    const payload = {
      batchId: 456,
      isApplyForScholarShip: true,
    };

    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
    };
    (db.insert as jest.Mock).mockReturnValue(mockInsert);

    let error: any;
    try {
      await CreateApplicationService.execute(studentId, payload);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.name).toBe('NotFoundError');
  });
});
