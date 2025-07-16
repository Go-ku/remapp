import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    lease: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lease",
      required: true,
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    method: {
      type: String,
      enum: ["momo", "cash", "bank_transfer"],
      default: "momo",
    },
    type: {
      type: String,
      enum: ["rent", "deposit", "maintenance"],
      default: "rent",
    },
    receiptNumber: String,
    invoice: { type: mongoose.Schema.Types.ObjectId, ref: "Invoice" },
    status: {
      type: String,
      enum: ["successful", "pending", "failed"],
      default: "successful",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
