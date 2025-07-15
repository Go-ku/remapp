import { connectDB } from "@/lib/mongoose/db";
import Payment from "@/lib/mongoose/models/Payment";

export async function createPayment(data) {
  await connectDB();
  return await Payment.create(data);
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
  return await Payment.find().populate("lease tenant").sort({ paidAt: -1 });
}
