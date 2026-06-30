
import { z } from 'zod';
import { studentStatusEnum } from '@db/schema/student';

export const createStudentWithApplicationSchema = z.object({
  student: z.object({
    nameEn: z.string().min(1, 'English name is required'),
    nameKh: z.string().min(1, 'Khmer name is required'),
    email: z.string().email(),
    phoneNumber: z.string().min(1, 'Phone number is required'),
    dateOfBirth: z.coerce.date().optional(),
    status: z.enum(studentStatusEnum.enumValues).default('active'),
  }),
  application: z.any(), 
});
