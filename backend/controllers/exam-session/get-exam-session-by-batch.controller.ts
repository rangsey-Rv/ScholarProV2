import  getExamSessionByBatch  from "@services/exam-session/get-exam-session-by-batch.service";
import { Request, Response } from "express";

export default async( req : Request , res : Response) => {
  const batchId = Number(req.params.id);
  const result = await getExamSessionByBatch(batchId);
   if (!result || !result.success) {
     return res.status(404).json({
       success: false,
       message: result.msg,
     });
   }

   return res.status(200).json({
     success: true,
     message: result.msg,
     data: result.data,
   });
}
