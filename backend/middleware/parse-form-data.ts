import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to convert form-data string values to correct types
 * This is needed because multipart/form-data sends all values as strings
 */
export const parseFormData = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) {
    // Convert numeric fields
    const numericFields = [
      'appliedProgram.interestMajorId',
      'application.batchId',
      'application.scholarshipPercentage'
    ];

    // Convert boolean fields
    const booleanFields = [
      'appliedProgram.isApplyingScholarship',
      'appliedProgram.considerNextIntake',
      'application.isApplyForScholarShip'
    ];

    // Helper to get nested value
    const getNestedValue = (obj: any, path: string) => {
      const keys = path.split('.');
      let current = obj;
      for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
          current = current[key];
        } else {
          return undefined;
        }
      }
      return current;
    };

    // Helper to set nested value
    const setNestedValue = (obj: any, path: string, value: any) => {
      const keys = path.split('.');
      const lastKey = keys.pop()!;
      let current = obj;
      
      for (const key of keys) {
        if (!(key in current)) {
          current[key] = {};
        }
        current = current[key];
      }
      
      current[lastKey] = value;
    };

    // 1. Expand bracket notation (e.g., student[nameEn]) into nested objects
    const expandedBody: any = {};
    for (const [key, value] of Object.entries(req.body)) {
      // Convert "student[nameEn]" to "student.nameEn"
      const dotPath = key.replace(/\[([^\]]+)\]/g, '.$1');
      setNestedValue(expandedBody, dotPath, value);
    }
    
    // Replace flat req.body with our properly nested structure
    req.body = expandedBody;

    // Convert numeric fields
    numericFields.forEach(field => {
      const value = getNestedValue(req.body, field);
      if (value !== undefined && value !== null && value !== '') {
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          setNestedValue(req.body, field, numValue);
        }
      }
    });

    // Convert boolean fields
    booleanFields.forEach(field => {
      const value = getNestedValue(req.body, field);
      if (value !== undefined && value !== null) {
        // Handle string boolean values
        if (typeof value === 'string') {
          const boolValue = value.toLowerCase() === 'true' || value === '1';
          setNestedValue(req.body, field, boolValue);
        }
      }
    });
  }

  next();
};
