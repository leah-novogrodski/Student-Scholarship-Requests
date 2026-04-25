import express from 'express';
const router = express.Router();

import { createRequest } from '../controllers/request.js';
import { auth } from '../Middlewares/auth-middleware.js';
import { getMyRequest } from '../controllers/request.js';

router.post('/', auth, createRequest);
router.get('/my-request', auth, getMyRequest);

export default router;