import mongoose from "mongoose";

const TenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    nationalId: String,
    address: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema);
