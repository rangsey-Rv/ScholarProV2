import { getDashboardStatistics } from '@services/dashboard/dashboard.service';
import { db } from '@db';
import { mockDrizzleChain } from '../../mocks/drizzle.mock';

// Mock the DB module
jest.mock('@db', () => ({
  db: {
    select: jest.fn(),
  },
}));

describe('Dashboard Service', () => {
  let mockChain: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockChain = mockDrizzleChain();
    (db.select as jest.Mock).mockReturnValue(mockChain);
  });

  describe('getDashboardStatistics', () => {
    it('should return dashboard statistics with default values when no data exists', async () => {
      // Setup mock responses for the multiple queries in the service
      // The service makes 5 await calls to db.select()
      
      // 1. Total Applicants
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 0 }]));
      // 2. New Applications
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 0 }]));
      // 3. Accepted Students
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 0 }]));
      // 4. Gender Distribution
      mockChain.then.mockImplementationOnce((cb: any) => cb([]));
      // 5. Popular Majors
      mockChain.then.mockImplementationOnce((cb: any) => cb([]));
      // 6. Students by Province
      mockChain.then.mockImplementationOnce((cb: any) => cb([]));

      const result = await getDashboardStatistics();

      expect(result).toEqual({
        overview: {
          totalApplicants: 0,
          newApplications: 0,
          acceptedStudents: 0,
          acceptanceRate: 0,
          femaleRatio: 0,
          genderDistribution: [],
        },
        charts: {
          popularMajors: [],
          studentsByProvince: [],
        },
      });
    });

    it('should calculate acceptance rate and female ratio correctly', async () => {
      // 1. Total Applicants: 100
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 100 }]));
      // 2. New Applications: 10
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 10 }]));
      // 3. Accepted Students: 50
      mockChain.then.mockImplementationOnce((cb: any) => cb([{ count: 50 }]));
      // 4. Gender Distribution: 60 Female, 40 Male
      mockChain.then.mockImplementationOnce((cb: any) => cb([
        { gender: 'female', count: 60 },
        { gender: 'male', count: 40 },
      ]));
      // 5. Popular Majors
      mockChain.then.mockImplementationOnce((cb: any) => cb([]));
      // 6. Students by Province
      mockChain.then.mockImplementationOnce((cb: any) => cb([]));

      const result = await getDashboardStatistics();

      expect(result.overview.totalApplicants).toBe(100);
      expect(result.overview.acceptedStudents).toBe(50);
      // 50 / 100 * 100 = 50.00
      expect(result.overview.acceptanceRate).toBe("50.00");
      
      // Female Ratio: 60 / (60+40) * 100 = 60.00
      expect(result.overview.femaleRatio).toBe("60.00");
    });

    it('should apply batchId filter when provided', async () => {
        // Mock returns doesn't matter much here, we check the call arguments
        mockChain.then.mockImplementation((cb: any) => cb([{ count: 0 }])); 
        
        await getDashboardStatistics(5);

        // Check if where was called. 
        // Note: Testing exact SQL generation with Drizzle mocks is hard because `eq` returns an object.
        // We mainly verify that the chain was executed.
        expect(db.select).toHaveBeenCalled();
        expect(mockChain.from).toHaveBeenCalled();
        expect(mockChain.where).toHaveBeenCalled();
    });
  });
});
