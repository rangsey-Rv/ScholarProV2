import { getDashboardData } from "@controllers/dashboard/dashboard.controller";
import { getDashboardStatistics } from "@services/dashboard/dashboard.service";
import { Request, Response } from "express";
import { closeDbConnection } from "@db";

// Mock the Service
jest.mock("@services/dashboard/dashboard.service");

describe("Dashboard Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(async () => {
    await closeDbConnection();
  });

  it("should return 200 and data on success", async () => {
    const mockStats = {
      overview: { totalApplicants: 10 },
      charts: {},
    };
    (getDashboardStatistics as jest.Mock).mockResolvedValue(mockStats);

    await getDashboardData(req as Request, res as Response, next);

    expect(getDashboardStatistics).toHaveBeenCalledWith(undefined);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockStats,
    });
  });

  it("should pass batchId from query to service", async () => {
    req.query = { batchId: "123" };
    (getDashboardStatistics as jest.Mock).mockResolvedValue({});

    await getDashboardData(req as Request, res as Response, next);

    expect(getDashboardStatistics).toHaveBeenCalledWith(123);
  });

  it("should call next() if service throws error", async () => {
    const error = new Error("Service Error");
    (getDashboardStatistics as jest.Mock).mockRejectedValue(error);

    await getDashboardData(req as Request, res as Response, next);

    // Wait for the async handler to catch the error
    await new Promise((resolve) => setImmediate(resolve));

    expect(next).toHaveBeenCalledWith(error);
  });
});
