

import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
    type: { type: String, enum: ["residential", "commercial", "mixed-use"] },
    status: { type: String, enum: ["vacant", "occupied", "under_maintenance"], default: "vacant" },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: String,
    imageUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);
