import updateExamSessionService from "@services/exam-session/update-exam-session.service";
import { db } from "@db";
import { examSessions } from "@db/schema/exam-session";

// Mock DB
jest.mock(
  "@services/exam-session/update-auto-assign-applicant.service",
  () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
      success: true,
      msg: "Exam session updated and applicants re-assigned successfully",
      assignedCount: 5,
    }),
  })
);
jest.mock("@db", () => ({
  db: {
    select: jest.fn(),
    update: jest.fn(),
  },
}));

describe("UpdateExamSessionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup db.select chain
    const mockSelectChain = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      then: jest.fn((resolve) => resolve([])),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelectChain);

    // Setup db.update chain
    const mockUpdateChain = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]),
    };
    (db.update as jest.Mock).mockReturnValue(mockUpdateChain);
  });

  const payload = {
    sessionName: "Updated Session",
    location: "Room 102",
  };

  it("should update exam session successfully", async () => {
    // Mock select finding the session with status: "scheduled"
    const mockSelectChain = (db.select as jest.Mock)();
    mockSelectChain.then.mockImplementationOnce((resolve: any) =>
      resolve([{ id: 1, status: "scheduled" }])
    );

    // Mock update returning the updated session
    const mockUpdateChain = (db.update as jest.Mock)();
    mockUpdateChain.returning.mockResolvedValue([{ id: 1, ...payload }]);

    const result = await updateExamSessionService(1, payload);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should fail if exam session not found", async () => {
    // Mock select returning empty (default is empty, but let's be explicit)
    const mockSelectChain = (db.select as jest.Mock)();
    mockSelectChain.then.mockImplementationOnce((resolve: any) =>
      resolve(undefined)
    ); // or []

    const result = await updateExamSessionService(1, payload);

    expect(result.success).toBe(false);
    expect(result.msg).toBe("Exam Session not found");
  });

  it("should fail if update returns empty", async () => {
    // Mock select finding the session with non-scheduled status
    const mockSelectChain = (db.select as jest.Mock)();
    mockSelectChain.then.mockImplementationOnce((resolve: any) =>
      resolve([{ id: 1, status: "ongoing" }])
    );

    // Mock update returning empty
    const mockUpdateChain = (db.update as jest.Mock)();
    mockUpdateChain.returning.mockResolvedValue([]);

    const result = await updateExamSessionService(1, payload);

    expect(result.success).toBe(false);
    expect(result.msg).toBe(
      "Not allow to update exam session that is ongoing or complete"
    );
  });
});
