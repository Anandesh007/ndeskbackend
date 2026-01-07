import cron from 'node-cron';
import { getPreviousMonthYear } from '../utils/date.util';
import { allEmployeeMail } from '../services/employeeNotification.service';

cron.schedule("0 9 2 * *", async () => {
    try {
      const {month,year}=getPreviousMonthYear();

      await sendMonthlySummary({ month, year });
    } catch (err) {
      console.error("Payroll summary cron error:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
);

cron.schedule("0 10 2 * *", async () => {
    try {
      await allEmployeeMail();
    } catch (err) {
      console.error("Payslip mail cron error:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
);