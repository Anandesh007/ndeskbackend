import prisma from '../prisma/client.js';
import {processPayment} from '../services/payment.service.js';
import { getPreviousMonthYear } from '../utils/date.util.js';

const {month,year}=getPreviousMonthYear();

export const runAutoPay = async () => {

  const payrolls = await prisma.payroll.findMany({
    where: {month,year}
  });
  console.log(payrolls);
  for (const payroll of payrolls) {
    try {
      await processPayment({
        month,
        year,
        employeeId:payroll.employee_id,
        mode: 'AUTO'
      });

    } catch (e) {     
      console.log(`Skipped payment for ${payroll.employee_id}: ${e.message}`);
    }
  }
};
