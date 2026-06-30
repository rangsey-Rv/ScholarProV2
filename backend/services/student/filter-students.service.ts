import { db } from '@db';
import { students } from '@db/schema/student';
import { eq, and, gte, lte, like } from 'drizzle-orm';

export interface StudentFilterOptions {
  id?: number;
  email?: string;
  status?: 'active' | 'passed' | 'failed' | 'reapplying' | 'blacklisted';

  createdFrom?: Date;
  createdTo?: Date;
}

export class FilterStudentsService {

  static async execute(filters: StudentFilterOptions = {}) {
    const conditions = [];

    if (filters.id !== undefined) {
      conditions.push(eq(students.id, filters.id));
    }

    if (filters.email !== undefined) {
      conditions.push(like(students.email, `%${filters.email}%`)); 
    }

    if (filters.status !== undefined) {
      conditions.push(eq(students.status, filters.status));
    }


    if (filters.createdFrom !== undefined) {
      conditions.push(gte(students.createdAt, filters.createdFrom));
    }

    if (filters.createdTo !== undefined) {
      conditions.push(lte(students.createdAt, filters.createdTo));
    }

    const query = db.select().from(students);
    const results = conditions.length > 0 ? await query.where(and(...conditions)) : await query;

    return results;
  }
}
