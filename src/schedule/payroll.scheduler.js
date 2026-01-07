import cron from 'node-cron';
import payrollService from '../services/payrollRun.service.js';

cron.schedule('0 2 1 * *', async () => {
  await payrollService.runMonthlyPayroll();
});
