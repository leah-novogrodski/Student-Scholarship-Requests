import express from 'express';
const router = express.Router();

import { createRequest } from '../controllers/request.js';
import { auth } from '../Middlewares/auth-middleware.js';

router.post('/', auth, createRequest);

export default router;