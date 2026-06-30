import { getExamsByCommittee } from "@services/exam-session/get-exam-by-committee.service";
import { Request, Response } from "express";


export default async (req: Request, res: Response) => {
    const userId = String(req.user?.id);
    console.log(userId);
    const result = await getExamsByCommittee(userId);

    if (!result || !result.success) {
        res.status(404).json({
            success: false,
            message: result?.msg || "Exams not found"
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: result.data
    });
}
