import express from 'express';

import payrollRunRoutes from './routes/payrollRun.routes.js';
import bonusRoutes from './routes/bonus.routes.js';
import payslipRoutes from './routes/payslip.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import notificationRoutes from './routes/notification.router.js';
import fixedAmountRoutes from './routes/fixedamount.routes.js';
import deductionRoutes from './routes/deduction.router.js';
import { requestLogger, errorHandler } from './middleware/requestLogger.middleware.js';

const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api/payroll-run', payrollRunRoutes);
app.use('/api/bonus', bonusRoutes);
app.use('/api/deduction', deductionRoutes);
app.use('/api/payslip', payslipRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/fixed-amount', fixedAmountRoutes);

app.use(errorHandler);

export default app;
