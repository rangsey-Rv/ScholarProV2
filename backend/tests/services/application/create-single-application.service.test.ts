import { CreateSingleApplicationService } from '@services/application/create-single-application.service';
import { db } from '@db';
import { ValidationError, NotFoundError } from '@utils/errors';
import { createStudentWithApplicationsSchema } from "@validation/application.schema";

// Mock DB
jest.mock('@db', () => ({
  db: {
    transaction: jest.fn(),
  },
}));

// Mock Validation Schema to bypass Zod issues in test environment
jest.mock('@validation/application.schema', () => ({
  createStudentWithApplicationsSchema: {
    safeParse: jest.fn((payload) => ({
      success: true,
      data: payload, // Return payload as is
    })),
  },
}));

describe('CreateSingleApplicationService', () => {
  const mockPayload = {
    student: {
      nameEn: 'Sokha',
      nameKh: 'សុខា',
      email: 'sokha@example.com',
      phoneNumber: '012345678',
      dateOfBirth: new Date().toISOString(),
    },
    applications: [
      {
        batchId: 1,
        isApplyForScholarShip: true,
        isMathTestSkipped: false,
        isEnglishTestSkipped: false,
        isMathAssigned: false,
        isEnglishAssigned: false,
        isInterviewAssigned: false,
        attachmentId: 1,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should throw ValidationError if payload is invalid', async () => {
    // We need to override the mock for this specific test to simulate failure
    
    (
      createStudentWithApplicationsSchema.safeParse as jest.Mock
    ).mockReturnValueOnce({
      success: false,
      error: { format: () => ({}) },
    });

    const invalidPayload = { ...mockPayload, student: {} }; 

    try {
      await CreateSingleApplicationService.createWithStudent(invalidPayload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(ValidationError);
      expect(e.name).toBe('ValidationError');
    }

    expect(db.transaction).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if student creation fails inside transaction', async () => {
    // Mock transaction to execute the callback
    (db.transaction as jest.Mock).mockImplementation(async (callback) => {
      const mockTx = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([]), // Return empty array = failure
      };
      return callback(mockTx);
    });

    try {
      await CreateSingleApplicationService.createWithStudent(mockPayload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundError);
      expect(e.name).toBe('NotFoundError');
    }
  });

  it('should throw NotFoundError if application creation fails inside transaction', async () => {
    (db.transaction as jest.Mock).mockImplementation(async (callback) => {
      const mockTx = {
        insert: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        // First call (student) succeeds
        // Second call (application) returns empty
        returning: jest.fn()
            .mockResolvedValueOnce([{ id: 1 }]) 
            .mockResolvedValueOnce([]), 
      };
      return callback(mockTx);
    });

    try {
      await CreateSingleApplicationService.createWithStudent(mockPayload);
      fail('Expected an error to be thrown');
    } catch (e: any) {
      expect(e).toBeInstanceOf(NotFoundError);
      expect(e.name).toBe('NotFoundError');
    }
  });

  it('should propagate unexpected database errors', async () => {
    const dbError = new Error('Database connection failed');
    (db.transaction as jest.Mock).mockRejectedValue(dbError);

    await expect(
      CreateSingleApplicationService.createWithStudent(mockPayload)
    ).rejects.toThrow('Database connection failed');
  });
});
