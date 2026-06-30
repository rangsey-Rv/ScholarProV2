import { Request, Response } from 'express';
import { getAllBatches, getBatchById, createBatch, updateBatch } from '@services/batch/batch.service';

export class BatchController {
    static async getAllBatchesController(req: Request, res: Response) {
        const result = await getAllBatches();
        res.status(200).send({ batches: result.data });
    }

    static async getBatchByIdController(req: Request, res: Response) {
        const { id } = req.params;
        const result = await getBatchById(Number.parseInt(id));
        if (result.success) {
            res.status(200).send({ batch: result.data });
        } else {
            res.status(404).send({ message: result.msg });
        }
    }

    static async createBatchController(req: Request, res: Response) {
        const result = await createBatch(req.body);
        if (result.success) {
            res.status(201).send({ message: result.msg, batch: result.data });
        } else {
            res.status(400).send({ message: result.msg });
        }
    }

    static async updateBatchController(req: Request, res: Response) {
        const { id } = req.params;
        const result = await updateBatch(Number.parseInt(id), req.body);
        if (result.success) {
            res.status(200).send({ message: result.msg, batch: result.data });
        } else {
            res.status(404).send({ message: result.msg });
        }
    }
}