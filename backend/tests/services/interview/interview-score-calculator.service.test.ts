import { InterviewScoreCalculatorService } from '@services/interview/interview-score-calculator.service';
import { db } from '@db';


// Mock DB
jest.mock('@db', () => ({
  db: {
    select: jest.fn(),
  },
}));

describe('InterviewScoreCalculatorService', () => {
  let service: InterviewScoreCalculatorService;
  let mockSelect: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InterviewScoreCalculatorService();

    // Setup chainable mocks
    mockSelect = {
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
    };
    (db.select as jest.Mock).mockReturnValue(mockSelect);
  });

  it('should calculate final score correctly', async () => {
    const mockCriterias = [
      { id: 1, name: 'Communication', weight: 40, isActive: true },
      { id: 2, name: 'Technical', weight: 60, isActive: true },
    ];

    const mockScores = [
      { criteriaId: 1, score: 80, examId: 1, committeeId: 'user1' },
      { criteriaId: 2, score: 90, examId: 1, committeeId: 'user1' },
    ];

    // Mock responses
    mockSelect.where
      .mockResolvedValueOnce(mockCriterias) // First call: Get criterias
      .mockResolvedValueOnce(mockScores);   // Second call: Get scores

    const result = await service.calculateFinalScore(1, 'user1');

    // Calculation: (80 * 0.4) + (90 * 0.6) = 32 + 54 = 86
    expect(result).toBe(86);
  });

  it('should throw error if no active criteria found', async () => {
    mockSelect.where.mockResolvedValueOnce([]); // No criterias

    await expect(service.calculateFinalScore(1, 'user1'))
      .rejects.toThrow('No active interview criteria found.');
  });

  it('should throw error if total weight is not 100%', async () => {
    const mockCriterias = [
      { id: 1, name: 'Communication', weight: 40, isActive: true },
      { id: 2, name: 'Technical', weight: 40, isActive: true }, // Total 80
    ];

    mockSelect.where.mockResolvedValueOnce(mockCriterias);

    await expect(service.calculateFinalScore(1, 'user1'))
      .rejects.toThrow('Total criteria weight must equal 100%. Current: 80%');
  });

  it('should throw error if no scores found', async () => {
    const mockCriterias = [
      { id: 1, name: 'Communication', weight: 100, isActive: true },
    ];

    mockSelect.where
      .mockResolvedValueOnce(mockCriterias)
      .mockResolvedValueOnce([]); // No scores

    await expect(service.calculateFinalScore(1, 'user1'))
      .rejects.toThrow('No interview scores found for this exam and committee.');
  });

  it('should throw error if a criteria score is missing', async () => {
    const mockCriterias = [
      { id: 1, name: 'Communication', weight: 50, isActive: true },
      { id: 2, name: 'Technical', weight: 50, isActive: true },
    ];

    const mockScores = [
      { criteriaId: 1, score: 80, examId: 1, committeeId: 'user1' },
      // Missing score for criteria 2
    ];

    mockSelect.where
      .mockResolvedValueOnce(mockCriterias)
      .mockResolvedValueOnce(mockScores);

    await expect(service.calculateFinalScore(1, 'user1'))
      .rejects.toThrow('Missing score for criteria: Technical');
  });
});
