import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";

export async function getRecentActivityByLandlord(landlordId, limit = 5) {
  await connectDB();

  return await Notification.find({ recipientRole: "landlord", landlord: landlordId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}
