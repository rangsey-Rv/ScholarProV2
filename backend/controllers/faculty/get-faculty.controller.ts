import { Request, Response } from 'express';
import { asyncHandler } from '@utils/async-handler';
import { getFaculties as getFacultiesService } from '@services/faculty/faculty.service';

export const getFaculties = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await getFacultiesService();
  
  res.json(result);
});
