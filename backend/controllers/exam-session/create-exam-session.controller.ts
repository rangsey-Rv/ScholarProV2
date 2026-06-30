import { Request, Response } from 'express';
import createExamSessionService from '@services/exam-session/create-exam-session.service';
import { createExamSessionSchema } from '@validation/exam-session.schema'

export default async (req: Request, res: Response)=>{
    const batchId = Number(req.params.batchId);
    const payload = createExamSessionSchema.parse(req.body);

    const result = await createExamSessionService(batchId,payload);


    if (!result || !result.success){
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