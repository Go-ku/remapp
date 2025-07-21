import { connectDB } from "../";
import Lease from "@/lib/models/Lease";
import Invoice from "@/lib/models/Invoice";
import { createNotification } from "./notification";
import { v4 as uuidv4 } from "uuid";

export async function createInvoice({
  leaseId,
  amount,
  dueDate,
  type = "rent",
}) {
  await connectDB();

  const lease = await Lease.findById(leaseId).populate("tenant property");
  if (!lease) throw new Error("Lease not found");

  const invoiceNumber = `INV-${uuidv4().slice(0, 8).toUpperCase()}`;

  const invoice = await Invoice.create({
    lease: lease._id,
    tenant: lease.tenant._id,
    property: lease.property._id,
    amount,
    dueDate,
    type,
    invoiceNumber,
    status: "unpaid",
  });

  // 🔔 Send notification to tenant
  await createNotification({
    recipient: lease.tenant._id,
    message: `New invoice #${invoiceNumber} is available for ${lease.property.name}`,
    type: "invoice",
    link: `/dashboard/invoices/${invoice._id}`,
  });

  return invoice;
}
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
  const isPaid = invoice.status === "paid";
  const isOverdue = new Date(invoice.dueDate) < now && !isPaid;

  if (isPaid) return "paid";
  if (isOverdue) return "overdue";
  return "unpaid";
}
