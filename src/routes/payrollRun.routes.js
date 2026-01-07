import express from 'express';
import {runPayroll,getPayrollsController} from '../controllers/payrollRun.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';
const router = express.Router();

router.post('/run',authenticate,allowedRoles(1),runPayroll);//it is internally calculated 
router.get("/filter",authenticate,allowedRoles(1),getPayrollsController);//it is triggered by admin

export default router;
