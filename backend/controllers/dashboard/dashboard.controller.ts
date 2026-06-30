import { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/async-handler';
import { getDashboardStatistics } from '../../services/dashboard/dashboard.service';
import { appLogger, auditLogger } from '@utils/logger';


export const getDashboardData = asyncHandler(async (req: Request, res: Response) => {
    const batchId = req.query.batchId ? parseInt(req.query.batchId as string) : undefined;

     auditLogger.info({
        message: 'Dashboard data requested',
        userId: req.user?.id,
        batchId
    });
    
 try {
        const data = await getDashboardStatistics(batchId);

        appLogger.info({
            message: 'Dashboard data retrieved successfully',
            userId: req.user?.id,
            batchId
        });

        res.status(200).json({
            success: true,
            data
        });
    } catch (err) {
        appLogger.error({
            message: 'Failed to get dashboard data',
            userId: req.user?.id,
            batchId,
            error: err instanceof Error ? err.message : String(err)
        });
        throw err;
    }
});