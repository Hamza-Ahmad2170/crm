import cron from "node-cron";
import { markOverdueInvoices } from "@/modules/invoices/invoices.service.js";

export function startOverdueInvoiceJob() {
  // runs once daily at 1:00 AM — invoices become overdue based on date, not time,
  // so once a day is enough; no need for hourly/minute-level granularity
  cron.schedule("0 1 * * *", async () => {
    try {
      const { markedOverdue } = await markOverdueInvoices();
      console.log(
        `[overdue-job] marked ${markedOverdue} invoice(s) as overdue`,
      );
    } catch (err) {
      console.error("[overdue-job] failed:", err);
    }
  });

  console.log("[overdue-job] scheduled — daily at 01:00");
}
