import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Lease from "@/lib/mongoose/models/Lease";
import Invoice from "@/lib/mongoose/models/Invoice";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  await connectDB();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed
  const dueDate = new Date(year, month, 5); // e.g. due on 5th

  const leases = await Lease.find({ status: "active" }).populate("tenant property");

  const invoices = [];

  for (const lease of leases) {
    // Prevent duplicate invoice for same lease/month
    const exists = await Invoice.findOne({
      lease: lease._id,
      issuedAt: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    });

    if (exists) continue;

    invoices.push({
      lease: lease._id,
      tenant: lease.tenant._id,
      property: lease.property._id,
      amount: lease.monthlyRent,
      dueDate,
      invoiceNumber: `INV-${uuidv4().slice(0, 8).toUpperCase()}`,
    });
  }

  if (invoices.length > 0) {
    await Invoice.insertMany(invoices);
  }

  return NextResponse.json({ created: invoices.length });
}
