import express from 'express';
import { BatchController } from '@controllers/batch/batch.controller';
import { asyncHandler } from '@utils/async-handler';
import { authenticateUser } from '@middleware/authenticate-user';

const router = express.Router();

//Get all batches
router.get('/', authenticateUser,asyncHandler(BatchController.getAllBatchesController));

// Get a specific batch by ID
router.get('/:id', authenticateUser,asyncHandler(BatchController.getBatchByIdController));

//Create a new batch
router.post('/',authenticateUser, asyncHandler(BatchController.createBatchController));

//Update a batch
router.patch('/:id', asyncHandler(BatchController.updateBatchController));

export default router;