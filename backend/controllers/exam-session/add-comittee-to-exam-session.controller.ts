import addComitteeToExamSessionService from "@services/exam-session/add-comittee-to-exam-session.service";
import { addCommiteeToExamSessionSchema } from "@validation/exam-session.schema";
import { Request, Response } from "express";

export default async (req: Request, res: Response) =>{

    const payload = addCommiteeToExamSessionSchema.parse(req.body);

    const result = await addComitteeToExamSessionService(payload);

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