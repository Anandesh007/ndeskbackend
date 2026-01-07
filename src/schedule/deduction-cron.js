import cron from "node-cron";
import { calculateDeductionForEmployee } from "../services/payrollCalculation.service.js";
import { getPreviousMonthYear } from "../utils/date.util.js";

// it runs on 1st day of every month at 12:05 AM (IST)
const {month,year}=getPreviousMonthYear();
cron.schedule("5 0 1 * *",async () => {
    try {
      await calculateDeductionForEmployee({month,year});
    } catch (err) {
      console.error("Deduction cron error:", err.message);
    }
  },
  {
    timezone: "Asia/Kolkata"
  }
);
