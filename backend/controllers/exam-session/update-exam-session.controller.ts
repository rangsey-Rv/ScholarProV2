import updateExamSessionService from "@services/exam-session/update-exam-session.service";
import { updateExamSessionSchema , examSessionIdSchema } from "@validation/exam-session.schema";
import { Request, Response } from "express";

export default async (req: Request, res: Response) =>{

    const examSessionId = examSessionIdSchema.parse({ id: req.params.id });
    const payload = updateExamSessionSchema.partial().parse(req.body);
    const result = await updateExamSessionService(examSessionId.id, payload);

    if (!result || !result.success) {
        return res.status(404).json({
            success: false,
            message: result.msg,
        })
    }

    return res.status(200).json({
        success: true,
        message: result.msg,
        data: result.data
    })
} 
