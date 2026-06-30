import { Router } from 'express';
import { getCommittees } from '@controllers/commitee/get-committees.controller';
import { getAvailableCommittees } from '@controllers/commitee/get-available-committees.controller';
import { authenticateUser } from '@middleware/authenticate-user';

const router = Router();

// Get all committees
router.get('/', authenticateUser , getCommittees);

// Get committees available for exam session assignment
router.get('/available', authenticateUser ,  getAvailableCommittees);

export default router;
