import { connectDB } from "@/lib/mongoose/db";
import Lease from "@/lib/mongoose/models/Lease";

export async function createLease(data) {
  await connectDB();
  return await Lease.create(data);
}

export async function getAllLeases() {
  await connectDB();
  return await Lease.find()
    .populate("tenant")
    .populate("property")
    .sort({ createdAt: -1 });
}
export async function updateLease(id, updates) {
  await connectDB();
  return await Lease.findByIdAndUpdate(id, updates, { new: true });
}