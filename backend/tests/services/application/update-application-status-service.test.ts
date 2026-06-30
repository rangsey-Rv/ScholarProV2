
jest.mock('@validation/application.schema', () => ({
  updateStatusSchema: {
    safeParse: jest.fn().mockImplementation((data) => {
      // ✅ simple validation mock
      if (data.status && ['submitted', 'shortlisted', 'assessment_scheduled', 'graded', 'accepted', 'rejected', 'incomplete'].includes(data.status)) {
        return { success: true, data };
      }
      return { success: false, error: { format: () => ({ status: 'Invalid status' }) } };
    }),
  },
}));

jest.mock('drizzle-orm', () => ({
  eq: jest.fn(),
}));

// ✅ Mock db
jest.mock('@db', () => ({
  db: {
    update: jest.fn(),
  },
}));


import { db } from '@db';
import { applications } from '@db/schema/application';
import { ApplicationUpdateService } from '@services/application/update-application-status.service';
import { NotFoundError, ValidationError } from '@utils/errors';
import { eq } from 'drizzle-orm';


describe('ApplicationUpdateService', () => {
  let mockUpdate: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUpdate = {
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      returning: jest.fn(),
    };
    (db.update as jest.Mock).mockReturnValue(mockUpdate);
  });

  it('should update the status successfully', async () => {
    const applicationId = 1;
    const payload = { status: 'shortlisted' };
    const updatedApp = { id: applicationId, status: 'shortlisted' };

    mockUpdate.returning.mockResolvedValue([updatedApp]);
    (eq as jest.Mock).mockReturnValue(`eq(applications.id,${applicationId})`);

    const result = await ApplicationUpdateService.execute(applicationId, payload);

    expect(db.update).toHaveBeenCalledWith(applications);
    expect(mockUpdate.set).toHaveBeenCalledWith(payload);
    expect(mockUpdate.where).toHaveBeenCalledWith(`eq(applications.id,${applicationId})`);
    expect(result).toEqual(updatedApp);
  });

  it('should throw ValidationError for invalid payload', async () => {
    const applicationId = 1;
    const invalidPayload = { status: 'invalid-status' };

    let error: any;
    try {
      await ApplicationUpdateService.execute(applicationId, invalidPayload);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe('ValidationError');
  });

  it('should throw NotFoundError if no record updated', async () => {
    const applicationId = 999;
    const payload = { status: 'accepted' };

    mockUpdate.returning.mockResolvedValue([]);
    (eq as jest.Mock).mockReturnValue(`eq(applications.id,${applicationId})`);

    let error: any;
    try {
      await ApplicationUpdateService.execute(applicationId, payload);
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(NotFoundError);
    expect(error.name).toBe('NotFoundError');

    expect(db.update).toHaveBeenCalledWith(applications);
    expect(mockUpdate.set).toHaveBeenCalledWith(payload);
    expect(mockUpdate.where).toHaveBeenCalledWith(`eq(applications.id,${applicationId})`);
  });
});
