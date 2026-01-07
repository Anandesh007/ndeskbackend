import express from 'express';
import * as adminNotify from '../services/adminNotification.service.js';
import * as empNotify from '../services/employeeNotification.service.js';
import { notificationController } from '../controllers/notification.controller.js';
import { authenticate } from '../middleware/authenticate.middleware.js';
import { allowedRoles } from '../middleware/role.middleware.js';

const router = express.Router();

const controllers = notificationController({
    allEmployeeMail:empNotify.allEmployeeMail,
    sendMonthlySummary:adminNotify.sendMonthlySummary
});

router.post('/admin-summary',controllers.sendMonthlySummaryController);//it is internally triggered
router.post('/send-payslip',authenticate,allowedRoles(1),controllers.sendAllPayslipsController);//internally triggered for testing purpose and also by the admin

export default router;
