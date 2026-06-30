import { Request, Response } from "express";
import { SubjectService } from "@services/subject/subject.service";
import { asyncHandler } from "@utils/async-handler";

export const getSubjects = asyncHandler(async (req: Request, res: Response) => {
  const result = await SubjectService.getAllSubjects();
  res.json({ success: true, data: result });
});

export const createSubject = asyncHandler(async (req: Request, res: Response) => {
  const { subjectName, weight } = req.body;

  if (!subjectName || weight === undefined) {
    res.status(400).json({
      success: false,
      message: "subjectName and weight are required",
    });
    return;
  }

  const result = await SubjectService.createSubject({ subjectName, weight });

  if (result.status === "exists") {
    res.status(409).json({
      success: false,
      message: result.message,
      data: result.data,
    });
    return;
  }

  res.status(201).json({
    success: true,
    message: "Subject created successfully",
    data: result.data,
  });
});

export const adjustSubjectWeight = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { weight } = req.body;

  if (weight === undefined) {
    res.status(400).json({
      success: false,
      message: "weight is required",
    });
    return;
  }

  const result = await SubjectService.adjustSubjectWeight(id, weight);

  if (result.status === "not_found") {
    res.status(404).json({
      success: false,
      message: result.message,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Subject weight updated successfully",
    data: result.data,
  });
});

export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const result = await SubjectService.deleteSubject(id);

  if (result.status === "not_found") {
    res.status(404).json({
      success: false,
      message: result.message,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Subject deleted successfully",
  });
});
