// tests/unit/application/filterApplicationsService.test.ts
import { db } from "@db";
import { applications } from "@db/schema/application";
import { FilterApplicationsService, ApplicationFilterOptions } from "@services/application/filter-applications.service";
import { eq, and, gte } from "drizzle-orm";

// ✅ Mock the drizzle-orm helpers
jest.mock("drizzle-orm", () => ({
  eq: jest.fn(),
  and: jest.fn(),
  gte: jest.fn(),
  lte: jest.fn(),
}));

// ✅ Mock the db
jest.mock("@db", () => ({
  db: {
    select: jest.fn(),
  },
}));

describe("FilterApplicationsService", () => {
  let mockQuery: any;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the chainable query
    mockQuery = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockResolvedValue([
        { id: 1, studentId: 101, status: "submitted" },
        { id: 2, studentId: 102, status: "shortlisted" },
      ]),
    };
    (db.select as jest.Mock).mockReturnValue(mockQuery);
  });

  it("should return all applications if no filters are provided", async () => {
    mockQuery.where.mockResolvedValue(undefined); // simulate no where
    (mockQuery.from as jest.Mock).mockReturnValue(mockQuery);
    
    const result = await FilterApplicationsService.execute();
    
    expect(db.select).toHaveBeenCalled();
    expect(mockQuery.from).toHaveBeenCalledWith(applications);
    expect(result).toEqual(mockQuery); // returns query object since no where applied
  });

  it("should filter applications by studentId", async () => {
    const filters: ApplicationFilterOptions = { studentId: 101 };
    (eq as jest.Mock).mockReturnValue("eq(studentId,101)");
    (and as jest.Mock).mockReturnValue("AND(eq(studentId,101))");

    const result = await FilterApplicationsService.execute(filters);

    expect(eq).toHaveBeenCalledWith(applications.studentId, 101);
    expect(and).toHaveBeenCalledWith("eq(studentId,101)");
    expect(mockQuery.where).toHaveBeenCalledWith("AND(eq(studentId,101))");
    expect(result).toEqual([
      { id: 1, studentId: 101, status: "submitted" },
      { id: 2, studentId: 102, status: "shortlisted" },
    ]);
  });

  it("should filter by multiple criteria", async () => {
    const filters: ApplicationFilterOptions = {
      studentId: 101,
      status: "submitted",
      createdFrom: new Date("2025-01-01"),
    };

    (eq as jest.Mock).mockImplementation((col, val) => `eq(${col},${val})`);
    (gte as jest.Mock).mockImplementation((col, val) => `gte(${col},${val})`);
    (and as jest.Mock).mockImplementation((...conds) => `AND(${conds.join(",")})`);

    const result = await FilterApplicationsService.execute(filters);

    expect(eq).toHaveBeenCalledWith(applications.studentId, 101);
    expect(eq).toHaveBeenCalledWith(applications.status, "submitted");
    expect(gte).toHaveBeenCalledWith(applications.createdAt, filters.createdFrom);
    expect(and).toHaveBeenCalled();
    expect(mockQuery.where).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 1, studentId: 101, status: "submitted" },
      { id: 2, studentId: 102, status: "shortlisted" },
    ]);
  });
});
