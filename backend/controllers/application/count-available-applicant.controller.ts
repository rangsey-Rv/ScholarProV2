import { Request, Response } from "express";
import countAvailableApplicantService from "@services/application/count-available-applicant.service";

export default async (req: Request, res: Response) => {
  const batchId = Number(req.params.batchId);

  const result = await countAvailableApplicantService(batchId);

  if (!result || !result.success) {
    res.status(404).json({
      success: false,
      message: "Something went wrong",
    });
    return;
  }

  res.status(200).json({
    success: true,
    availableAppForMath: result.availableAppForMath,
    availableAppForEnglish: result.availableAppForEnglish,
    availableAppForInterview: result.availableAppForInterview,
  });
};
