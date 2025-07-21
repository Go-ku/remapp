import { connectDB } from "@/lib/mongoose/db";
import Lease from "@/lib/mongoose/models/Lease";
import { createNotification } from "./notification";

export async function createLease(data) {
  await connectDB();
  
  await createNotification({
  recipient: lease.tenant,
  message: `Your lease for ${lease.property.name} has been created}.`,
  type: "lease",
  link: `/dashboard/leases/${lease._id}`,
});

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
  await createNotification({
  recipient: lease.tenant,
  message: `Your lease for ${lease.property.name} has been ${lease.terminated ? "terminated" : "renewed"}.`,
  type: "lease",
  link: `/dashboard/leases/${lease._id}`,
});

  return await Lease.findByIdAndUpdate(id, updates, { new: true });
}