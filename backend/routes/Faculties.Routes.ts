import express from 'express';
import { getFaculties } from '@controllers/faculty/get-faculty.controller';
import { authenticateUser } from '@middleware/authenticate-user';

const router = express.Router();

router.get('/', authenticateUser , getFaculties);

export default router;
