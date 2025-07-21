import { connectDB } from "../";
import Invoice from "../models/Invoice";

export async function getAllInvoices() {
  await connectDB();
  return await Invoice.find({})
    .populate("tenant")
    .populate("property")
    .sort({ dueDate: -1 });
}
export async function markInvoiceAsPaid(invoiceId) {
  await connectDB();
  return await Invoice.findByIdAndUpdate(invoiceId, {
    status: "paid",
    paidAt: new Date(),
  });
}
export async function getInvoicesByTenantId(tenantId) {
  await connectDB();
  return await Invoice.find({ tenant: tenantId })
    .populate("property")
    .sort({ dueDate: -1 });
}
export async function getInvoicesByLandlordId(landlordId) {
  await connectDB();

  return await Invoice.find({})
    .populate({
      path: "property",
      match: { owner: landlordId },
    })
    .populate("tenant lease")
    .then((invoices) => invoices.filter((inv) => inv.property !== null));
}

export function getInvoiceStatus(invoice) {
  const now = new Date();
  const isOverdue =
    new Date(invoice.dueDate) < now && invoice.status !== "paid";

  if (isOverdue) return "overdue";
  return invoice.status;
}

export async function updatePaidAmount(invoiceId, newAmount) {
  await connectDB();
  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) throw new Error("Invoice not found");

  invoice.paidAmount = Number(newAmount);

  if (invoice.paidAmount >= invoice.amount) {
    invoice.status = "paid";
    invoice.paidAt = new Date();
  } else {
    invoice.status = "unpaid";
  }

  await invoice.save();
}
