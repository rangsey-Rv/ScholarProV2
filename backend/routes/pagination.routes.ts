// routes/pagination.routes.ts
import { Router } from 'express';
import { UpdatePaginationLimit } from '@controllers/setting/pagination-config.controller';
import { authenticateUser } from '@middleware/authenticate-user';

const router = Router();

// Endpoint to update default pagination limit
router.put('/pagination/limit',authenticateUser , UpdatePaginationLimit);

export default router;
