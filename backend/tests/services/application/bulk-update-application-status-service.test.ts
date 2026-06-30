// tests/unit/application/bulkUpdateApplicationStatusService.test.ts
import { db } from '@db';
import { applications } from '@db/schema/application';
import { BulkUpdateApplicationStatusService } from '@services/application/bulk-update-application-status.service';
import { ValidationError } from '@utils/errors';
import { inArray } from 'drizzle-orm';
import { z } from 'zod';

// ✅ Mock the bulkUpdateStatusSchema
const mockBulkUpdateStatusSchema = z.object({
  ids: z.array(z.number().int().positive()),
  status: z.enum([
    'submitted',
    'shortlisted',
    'assessment_scheduled',
    'graded',
    'accepted',
    'rejected',
    'incomplete',
  ]),
});

// ✅ Mock the schema import
jest.mock('@validation/application.schema', () => ({
  bulkUpdateStatusSchema: {
    safeParse: jest.fn((payload) => mockBulkUpdateStatusSchema.safeParse(payload)),
  },
}));

// ✅ Mock DB and inArray
jest.mock('@db', () => ({
  db: {
    update: jest.fn(),
  },
}));

jest.mock('drizzle-orm', () => ({
  inArray: jest.fn(),
}));

describe('BulkUpdateApplicationStatusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should bulk update statuses successfully', async () => {
    const payload = { ids: [1, 2, 3], status: 'rejected' };
    const mockUpdated = [
      { id: 1, status: 'rejected' },
      { id: 2, status: 'rejected' },
      { id: 3, status: 'rejected' },
    ];

    const mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue(mockUpdated),
    };

    (db.update as jest.Mock).mockReturnValue(mockUpdate);
    (inArray as jest.Mock).mockImplementation((column, ids) => `IN_ARRAY(${column}, ${ids})`);

    const result = await BulkUpdateApplicationStatusService.execute(payload);

    expect(db.update).toHaveBeenCalledWith(applications);
    expect(mockUpdate.set).toHaveBeenCalledWith({ status: 'rejected' });
    expect(mockUpdate.where).toHaveBeenCalled();
    expect(mockUpdate.returning).toHaveBeenCalled();
    expect(result).toEqual(mockUpdated);
  });

  it('should throw ValidationError for invalid payload', async () => {
    const invalidPayload = { ids: ['wrong'], status: 'unknown' };
    let error: any;
    try {
      await BulkUpdateApplicationStatusService.execute(invalidPayload);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe('ValidationError');
  });

  it('should handle empty update result', async () => {
    const payload = { ids: [999], status: 'rejected' };
    const mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([]), // No rows updated
    };

    (db.update as jest.Mock).mockReturnValue(mockUpdate);
    (inArray as jest.Mock).mockImplementation((column, ids) => `IN_ARRAY(${column}, ${ids})`);

    const result = await BulkUpdateApplicationStatusService.execute(payload);

    expect(result).toEqual([]); // Service just returns whatever DB returned
  });
});
