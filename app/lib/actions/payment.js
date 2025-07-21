import { connectDB } from "@/lib/db";
import Payment from "@/lib/models/Payment";
import Invoice from "@/lib/models/Invoice";

export async function createPayment(data) {
  await connectDB();

  const lease = await Lease.findById(data.lease).populate("tenant property");

  if (!lease) throw new Error("Lease not found");

  // 🎯 Try to find a matching unpaid invoice for this lease
  const invoice = await Invoice.findOne({
    lease: lease._id,
    tenant: lease.tenant._id,
    status: { $ne: "paid" },
  });

  if (invoice) {
    const existingPayment = await Payment.findOne({ invoice: invoice._id });

    if (existingPayment) {
      throw new Error("A payment already exists for this invoice.");
    }
  }
  // 🎟 Generate receipt/invoice numbers
  const receiptNumber =
    data.receiptNumber ||
    `RCPT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const invoiceNumber =
    invoice?.invoiceNumber ||
    `INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  const payment = new Payment({
    lease: lease._id,
    tenant: lease.tenant._id,
    property: lease.property._id,
    invoice: invoice?._id || null,
    amount: data.amount,
    method: data.method,
    type: data.type,
    status: "successful",
    paidAt: new Date(),
    receiptNumber,
    invoiceNumber,
  });

  await payment.save();

  // ✅ If invoice found, mark as paid
  if (invoice) {
    const totalPaid = invoice.paidAmount || 0;
    const newTotal = totalPaid + data.amount;

    if (newTotal > invoice.amount) {
      throw new Error("Payment exceeds invoice balance.");
    }

    invoice.paidAmount = newTotal;

    if (newTotal >= invoice.amount) {
      invoice.status = "paid";
      invoice.paidAt = new Date();
    }

    await invoice.save();
  }

  return payment;
}

export async function getPaymentsByTenant(tenantId) {
  await connectDB();
  return await Payment.find({ tenant: tenantId }).populate("lease tenant");
}

export async function getPaymentsByLease(leaseId) {
  await connectDB();
  return await Payment.find({ lease: leaseId }).populate("lease tenant");
}

export async function getPaymentById(id) {
  await connectDB();
  return await Payment.findById(id).populate("lease tenant");
}

export async function getAllPayments() {
  await connectDB();
  return await Payment.find()
    .populate("lease tenant invoice")
    .sort({ paidAt: -1 });
}
