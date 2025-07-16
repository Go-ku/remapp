import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    lease: { type: mongoose.Schema.Types.ObjectId, ref: "Lease", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["unpaid", "paid", "overdue"], default: "unpaid" },
    issuedAt: { type: Date, default: Date.now },
    paidAt: { type: Date },
    invoiceNumber: { type: String, unique: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema);
