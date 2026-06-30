import { ImportApplicationService } from '@services/application/import-application.service';
import { db } from '@db';
import { mockDrizzleChain } from '../../mocks/drizzle.mock';

// Mock DB
jest.mock('@db', () => ({
  db: {
    select: jest.fn(),
    transaction: jest.fn(),
  },
}));

describe('ImportApplicationService', () => {
  let service: ImportApplicationService;
  let mockChain: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ImportApplicationService();
    mockChain = mockDrizzleChain();
    (db.select as jest.Mock).mockReturnValue(mockChain);
  });

  const mockRows: any[] = [
    {
      "Email Address": "test@example.com",
      "Full Name (Khmer)": "តេស្ត",
      "Full Name (English)": "Test Student",
      "Nationality": "Cambodian",
      "Gender": "Male",
      "Date of Birth": "2000-01-01",
      "Place of Birth": "Phnom Penh",
      "Address": "Phnom Penh",
      "Phone Number": "012345678",
      "Personal Info Attachment Type": "image/jpeg",
      "Personal Info File URL": "http://example.com/photo.jpg",
      "Parent/Guardian Name": "Parent Name",
      "Relationship to Student": "Father",
      "Parent Nationality": "Cambodian",
      "Parent Address": "Phnom Penh",
      "Parent Job": "Farmer",
      "Parent Phone Number": "012345678",
      "Education Level": "High School",
      "Major": "General",
      "Institution Name": "Test High School",
      "Current Year": "12",
      "Academic Year": "2023",
      "High School Name": "Test High School",
      "School Location": "Phnom Penh",
      "Overall Grade": "A",
      "Math Grade": "A",
      "English Grade": "A",
      "Grade 12 Certificate Type": "pdf",
      "Grade 12 Certificate URL": "http://example.com/grade12.pdf",
      "Has English Certificate": "No",
      "English Certificate URL": "",
      "Interest Major": "Computer Science",
      "Interest Major ID": "1",
      "Is Applying Scholarship": "Yes",
      "Requested Term": "2024-01-01",
      "Consider Next Intake": "Yes",
      "Referral Source": "Facebook",
      "Payment Status": "Paid",
      "Attachment Type": "receipt",
      "File URL": "http://example.com/receipt.pdf"
    }
  ];

  describe('importFromCSV', () => {
    it('should throw error if no data provided', async () => {
      await expect(service.importFromCSV([], 1)).rejects.toThrow("No data provided for import");
    });

    it('should throw error if batch not found', async () => {
      mockChain.then.mockImplementation((cb: any) => cb([])); // Batch not found

      await expect(service.importFromCSV(mockRows, 999)).rejects.toThrow(/Batch with ID 999 not found/);
    });

    it('should throw error if batch is not active', async () => {
      mockChain.then.mockImplementation((cb: any) => cb([{ id: 1, status: 'closed', batchName: 'Batch 1' }]));

      await expect(service.importFromCSV(mockRows, 1)).rejects.toThrow(/is not active/);
    });

    it('should handle chunk processing failure (Partial Failure)', async () => {
      // 1. Batch check passes
      mockChain.then.mockImplementation((cb: any) => cb([{ id: 1, status: 'active' }]));

      // 2. Transaction fails (simulating chunk error)
      (db.transaction as jest.Mock).mockRejectedValue(new Error("Database constraint violation"));

      const result = await service.importFromCSV(mockRows, 1);

      expect(result.success).toBe(0);
      expect(result.failed).toBe(1); // 1 row in mockRows
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should catch unexpected errors and rethrow with "Import failed"', async () => {
      // Simulate unexpected error during batch check (e.g. DB connection dies)
      (db.select as jest.Mock).mockImplementation(() => {
        throw new Error("Unexpected Crash");
      });

      await expect(service.importFromCSV(mockRows, 1)).rejects.toThrow("Unexpected Crash");
    });
  });
});
