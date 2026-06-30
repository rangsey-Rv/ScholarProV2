import  getStudentsByExamSession  from "@services/exam-session/get-applicant-by-exam-session.service";
import { Request, Response } from "express";

export default async(req: Request, res: Response)=> {
  const sessionId = Number(req.params.id);
  const result = await getStudentsByExamSession(sessionId);
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
