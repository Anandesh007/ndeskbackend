import express from 'express';
import {manualPay} from '../controllers/payment.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/manual',authenticate,allowedRoles(1),manualPay);

export default router;