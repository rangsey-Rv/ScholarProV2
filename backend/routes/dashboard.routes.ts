import { Router } from 'express';
import { authenticateUser } from '@middleware/authenticate-user';
import { getDashboardData } from '../controllers/dashboard/dashboard.controller';

const router = Router();

router.get('/', authenticateUser , getDashboardData);


export default router;
