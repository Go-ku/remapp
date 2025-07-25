import { connectDB } from "../db";
import Payment from "../models/Payment";
import Invoice from "../models/Invoice";
import Tenant from "../models/Tenant";
import Lease from "../models/Lease";
import { createNotification } from "./notification";
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
  await createNotification({
  recipient: lease.landlord, // Make sure landlord is accessible
  message: `Payment of ZMW ${payment.amount} received from ${lease.tenant.name}.`,
  type: "payment",
  link: `/dashboard/payments/${payment._id}`,
});
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
    .populate([
      { path: "lease", select: "property" },
      { path: "tenant", select: "name" },
      { path: "invoice", select: "invoiceNumber" }
    ])
    .sort({ paidAt: -1 });
}
export async function getPaymentsForInvoice(invoiceId) {
  await connectDB();
  return await Payment.find({ invoice: invoiceId })
    .sort({ paidAt: -1 })
    .populate("tenant");
}

export async function getRecentPaymentsByLandlord(landlordId, limit = 5) {
  await connectDB();

  return await Payment.find({ status: "successful" })
    .populate({
      path: "lease",
      populate: [
        { path: "tenant", select: "name" },
        { path: "property", match: { owner: landlordId }, select: "name" },
      ],
    })
    .sort({ paidAt: -1 })
    .limit(limit)
    .lean();
}
