import cron from "node-cron";
import { applyPerformanceBonus} from "../services/bonus.service.js";

// it run once every year(April 1st, 12:00 AM)
cron.schedule("0 0 1 4 *", async () => {
  try {
    console.log("Yearly performance bonus cron started");
    await applyPerformanceBonus(new Date().getFullYear());
    console.log("Yearly performance bonus cron completed");
  } catch (err) {
    console.error("Performance bonus cron failed:", err);
  }
  },
  {
    timezone: "Asia/Kolkata"
  });
