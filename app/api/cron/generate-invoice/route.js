// cron/monthlyInvoiceJob.js
import { connectDB } from "@/lib/db";
import Lease from "@/models/Lease";
import { createInvoice } from "@/lib/mongoose/actions/invoiceActions";

export async function runMonthlyInvoiceJob() {
  await connectDB();

  const activeLeases = await Lease.find({ terminated: false }).populate("tenant property");

  const now = new Date();
  const dueDate = new Date(now.getFullYear(), now.getMonth(), 5); // Invoices due on the 5th of the month

  for (const lease of activeLeases) {
    await createInvoice({
      leaseId: lease._id,
      amount: lease.rentAmount,
      dueDate,
    });
  }

  console.log(`✅ Generated invoices for ${activeLeases.length} active leases.`);
}
