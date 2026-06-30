import { db } from '@db';
import { faculties } from '@db/schema/faculty';
import { asc } from 'drizzle-orm';

export const getFaculties = async () => {
  const result = await db.select().from(faculties).orderBy(asc(faculties.id));
  if(!result || result.length === 0){
    return {
      success: false,
      msg: "No faculty found"
    }
  }
  return { success: true, data: result };
};
