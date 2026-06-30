import { InterviewScoreService } from '@services/interview/grade-score.service';
import { db } from '@db';
import { interviewScores } from '@db/schema/interview-score';

// Mock DB
jest.mock('@db', () => ({
  db: {
    transaction: jest.fn((cb) => cb({
      select: jest.fn(),
      insert: jest.fn(),
    })),
  },
}));

describe('InterviewScoreService', () => {
  let service: InterviewScoreService;
  let mockTx: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new InterviewScoreService();

    // Setup transaction mock
    const mockTxObj: any = {};
    const returnTx = () => mockTxObj;
    
    mockTxObj.select = jest.fn(returnTx);
    mockTxObj.from = jest.fn(returnTx);
    mockTxObj.where = jest.fn(returnTx);
    mockTxObj.insert = jest.fn(returnTx);
    mockTxObj.update = jest.fn(returnTx);
    mockTxObj.values = jest.fn(returnTx);
    mockTxObj.onConflictDoUpdate = jest.fn(returnTx);
    mockTxObj.set = jest.fn(returnTx);
    mockTxObj.returning = jest.fn();
    
    mockTx = mockTxObj;
    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(mockTx));
  });

  it('should update score successfully', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 30 };

    // Mock responses for validation checks
    mockTx.where
      .mockResolvedValueOnce([{ committeeId: 1 }]) // Committee found
      .mockResolvedValueOnce([{ weight: 40 }])     // Criteria found (weight 40)
      .mockResolvedValueOnce([{ examSessionId: 100 }]) // Exam session found
      .mockResolvedValueOnce([{ committeeId: 1 }]) // Committee assigned to session
      .mockResolvedValueOnce([{ score: 30 }]); // Select scores for total calculation

    mockTx.returning
      .mockResolvedValueOnce([{ id: 1, score: 30 }]) // Insert/Update score result
      .mockResolvedValueOnce([{ id: 1 }]); // Update exam result

    const result = await service.updateScoreByCriteria(payload);

    expect(result.success).toBe(true);
    expect(result.msg).toBe("Score updated successfully");
    expect(mockTx.insert).toHaveBeenCalledWith(interviewScores);
  });

  it('should fail if score is negative', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: -5 };
    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Score cannot be negative');
  });

  it('should fail if committee not found', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 30 };
    mockTx.where.mockResolvedValueOnce([]); // No committee

    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Committee not found');
  });

  it('should fail if criteria not found', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 30 };
    mockTx.where
      .mockResolvedValueOnce([{ committeeId: 1 }])
      .mockResolvedValueOnce([]); // No criteria

    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Criteria not found');
  });

  it('should fail if score > criteria weight', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 50 };
    mockTx.where
      .mockResolvedValueOnce([{ committeeId: 1 }])
      .mockResolvedValueOnce([{ weight: 40 }]); // Weight is 40

    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Score cannot be bigger than 40');
  });

  it('should fail if exam session not found', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 30 };
    mockTx.where
      .mockResolvedValueOnce([{ committeeId: 1 }])
      .mockResolvedValueOnce([{ weight: 40 }])
      .mockResolvedValueOnce([]); // No exam session

    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Exam session not found');
  });

  it('should fail if committee not assigned to session', async () => {
    const payload = { examId: 1, userId: 'user1', criteriaId: 1, score: 30 };
    mockTx.where
      .mockResolvedValueOnce([{ committeeId: 1 }])
      .mockResolvedValueOnce([{ weight: 40 }])
      .mockResolvedValueOnce([{ examSessionId: 100 }])
      .mockResolvedValueOnce([]); // Not assigned

    const result = await service.updateScoreByCriteria(payload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('You are not assigned to this exam session');
  });
});
