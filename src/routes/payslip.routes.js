import express from 'express';
import {generate,downloadPayslip} from '../controllers/payslip.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.post('/generate',authenticate,generate);//It is internally calculated
router.post('/download',authenticate,downloadPayslip);

export default router;