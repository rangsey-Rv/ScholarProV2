import { Request, Response } from "express";
import getCriteriaService from "@services/criteria/get-criteria.service";

export default async (req: Request, res: Response) => {
  const result = await getCriteriaService();

  if (!result?.success || !result) {
    res.status(404).json({
      success: false,
      message: result.msg,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: result.data,
  });
};