import { Request, Response } from "express";
import {
  createOrUpdateInterviewCriteria,
  setCriteriaActive,
  setCriteriaInactive,
} from "@services/setting/interview-evaluation.service";

export async function handleCreateOrUpdateCriteria(
  req: Request,
  res: Response,
) {
  try {
    const { name, weight, isActive } = req.body;

    if (!name || weight === undefined || weight === null) {
      return res.status(400).json({
        status: "error",
        message: "name and weight are required",
      });
    }

    const result = await createOrUpdateInterviewCriteria({
      name,
      weight,
      isActive,
    });

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
}

export async function handleActivateCriteria(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await setCriteriaActive(Number(id));

    if (result.status === "not_found") {
      return res.status(404).json(result);
    }

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
}

export async function handleDeactivateCriteria(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await setCriteriaInactive(Number(id));

    if (result.status === "not_found") {
      return res.status(404).json(result);
    }

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server error",
    });
  }
}
