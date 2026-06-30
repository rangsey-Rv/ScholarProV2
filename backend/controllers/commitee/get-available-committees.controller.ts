import { Request, Response } from 'express';
import { GetAvailableCommitteesService } from '@services/committee/get-available-committees.service';
import { asyncHandler } from '@utils/async-handler';

export const getAvailableCommittees = asyncHandler(async (req: Request, res: Response) => {
  let examSessionId;
  
  if (req.query.examSessionId) {
    examSessionId = parseInt(req.query.examSessionId as string);
  } else {
    examSessionId = undefined;
  }

  const committees = await GetAvailableCommitteesService.getAvailableCommittees(examSessionId);

  res.status(200).json({
    success: true,
    data: committees,
  });
});
