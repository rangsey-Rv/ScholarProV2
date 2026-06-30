import createExamSessionService from '@services/exam-session/create-exam-session.service';
import { db } from '@db';
import { batches } from '@db/schema/batch';
import { committees } from '@db/schema/committee';
import { subjects } from '@db/schema/subject';
import { faculties } from '@db/schema/faculty';
import { examSessions } from '@db/schema/exam-session';
import autoAssignApplicantService from '@services/exam-session/auto-assign-applicant.service';
import addComitteeToExamSessionService from '@services/exam-session/add-comittee-to-exam-session.service';

// Mock DB
jest.mock('@db', () => ({
  db: {
    transaction: jest.fn(),
    select: jest.fn(),
  },
}));

// Mock dependencies
jest.mock('@services/exam-session/auto-assign-applicant.service', () => jest.fn());
jest.mock('@services/exam-session/add-comittee-to-exam-session.service', () => jest.fn());

describe('CreateExamSessionService', () => {
  let mockTx: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup transaction mock
    const mockTxObj: any = {};
    const returnTx = () => mockTxObj;
    
    mockTxObj.insert = jest.fn(returnTx);
    mockTxObj.values = jest.fn(returnTx);
    mockTxObj.returning = jest.fn();
    mockTxObj.update = jest.fn(returnTx);
    mockTxObj.set = jest.fn(returnTx);
    mockTxObj.where = jest.fn(returnTx);
    
    mockTx = mockTxObj;
    (db.transaction as jest.Mock).mockImplementation(async (cb) => cb(mockTx));

    // Setup db.select chain
    const mockDbChain: any = {};
    const returnChain = () => mockDbChain;
    
    mockDbChain.from = jest.fn(returnChain);
    mockDbChain.where = jest.fn();
    mockDbChain.limit = jest.fn();
    mockDbChain.then = jest.fn((resolve) => resolve([])); // Default empty result
    
    (db.select as jest.Mock).mockReturnValue(mockDbChain);
  });

  const validPayload = {
    sessionName: 'Session 1',
    location: 'Room 101',
    subjectId: 1,
    facultyId: 1,
    committeeIds: ['00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002'],
    examDate: new Date('2023-01-01'),
    startTime: new Date('2023-01-01T09:00:00Z'),
    endTime: new Date('2023-01-01T12:00:00Z'),
    breakStart: new Date('2023-01-01T10:00:00Z'),
    breakEnd: new Date('2023-01-01T10:15:00Z'),
    capacity: 10,
  };

  it('should create exam session successfully', async () => {
    // Mock validations
    const mockDbChain = (db.select as jest.Mock)();
    
    // 1. Batch check (where -> Promise)
    mockDbChain.where.mockResolvedValueOnce([{ id: 1 }]);
    
    // 2. Committee check (where -> Promise)
    mockDbChain.where.mockResolvedValueOnce([{ id: 1 }, { id: 2 }]);
    
    // 3. Subject check (where -> Chain, limit -> Promise)
    mockDbChain.where.mockReturnValueOnce(mockDbChain);
    mockDbChain.limit.mockResolvedValueOnce([{ id: 1 }]);
    
    // 4. Faculty check (where -> Chain, limit -> Promise)
    mockDbChain.where.mockReturnValueOnce(mockDbChain);
    mockDbChain.limit.mockResolvedValueOnce([{ id: 1 }]);

    // Mock insert
    mockTx.returning.mockResolvedValueOnce([{ id: 100 }]);

    // Mock dependencies
    (addComitteeToExamSessionService as jest.Mock).mockResolvedValue({ success: true });
    (autoAssignApplicantService as jest.Mock).mockResolvedValue({ assignedCount: 5 });

    const result = await createExamSessionService(1, validPayload);

    expect(result.success).toBe(true);
    expect(result.msg).toBe('Create session successfully');
    expect(mockTx.insert).toHaveBeenCalledWith(examSessions);
    expect(addComitteeToExamSessionService).toHaveBeenCalled();
    expect(autoAssignApplicantService).toHaveBeenCalled();
  });

  it('should fail if batchId is missing', async () => {
    const result = await createExamSessionService(0, validPayload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Require batch Id');
  });

  it('should fail if batch not found', async () => {
    const mockDbChain = (db.select as jest.Mock)();
    mockDbChain.where.mockResolvedValueOnce([]); // Batch not found

    const result = await createExamSessionService(1, validPayload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Batch not found');
  });

  it('should fail if committees not found', async () => {
    const mockDbChain = (db.select as jest.Mock)();
    mockDbChain.where
      .mockResolvedValueOnce([{ id: 1 }]) // Batch found
      .mockResolvedValueOnce([]); // Committees not found

    const result = await createExamSessionService(1, validPayload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Committe not found');
  });

  it('should fail if subject not found', async () => {
    const mockDbChain = (db.select as jest.Mock)();
    mockDbChain.where
      .mockResolvedValueOnce([{ id: 1 }]) // Batch found
      .mockResolvedValueOnce([{ id: 1 }]) // Committees found
      .mockReturnValueOnce(mockDbChain); // Subject check (where -> Chain)
      
    mockDbChain.limit.mockResolvedValueOnce([]); // Subject not found

    const result = await createExamSessionService(1, validPayload);
    expect(result.success).toBe(false);
    expect(result.msg).toBe('Invalid subjectId');
  });

  it('should calculate capacity for subject 3 (Interview)', async () => {
    const interviewPayload = {
      ...validPayload,
      subjectId: 3,
      startTime: new Date('2023-01-01T08:00:00Z'),
      endTime: new Date('2023-01-01T12:00:00Z'), // 4 hours = 240 mins
      breakStart: new Date('2023-01-01T10:00:00Z'),
      breakEnd: new Date('2023-01-01T10:30:00Z'), // 30 mins break
      // Net work time = 210 mins
    };

    // Mock validations
    const mockDbChain = (db.select as jest.Mock)();
    
    // 1. Batch
    mockDbChain.where.mockResolvedValueOnce([{ id: 1 }]);
    // 2. Committee
    mockDbChain.where.mockResolvedValueOnce([{ id: 1 }]);
    // 3. Subject
    mockDbChain.where.mockReturnValueOnce(mockDbChain);
    mockDbChain.limit.mockResolvedValueOnce([{ id: 3 }]);
    // 4. Faculty
    mockDbChain.where.mockReturnValueOnce(mockDbChain);
    mockDbChain.limit.mockResolvedValueOnce([{ id: 1 }]);

    mockTx.returning.mockResolvedValueOnce([{ id: 100 }]);
    (addComitteeToExamSessionService as jest.Mock).mockResolvedValue({ success: true });
    (autoAssignApplicantService as jest.Mock).mockResolvedValue({ assignedCount: 5 });

    await createExamSessionService(1, interviewPayload);

    expect(mockTx.values).toHaveBeenCalledWith(expect.objectContaining({
      capacity: 12
    }));
  });
});
