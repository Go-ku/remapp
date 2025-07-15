import mongoose from "mongoose";

const LeaseSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    startDate: Date,
    endDate: Date,
    rentAmount: Number,
    paymentFrequency: { type: String, enum: ["monthly", "quarterly", "annually"], default: "monthly" },
    status: { type: String, enum: ["active", "terminated", "pending"], default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Lease || mongoose.model("Lease", LeaseSchema);
