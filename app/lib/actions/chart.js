import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Property from "@/models/Property";

export async function getMonthlyRevenueByLandlord(landlordId) {
  await connectDB();

  const pipeline = [
    {
      $match: { status: "successful" },
    },
    {
      $lookup: {
        from: "leases",
        localField: "lease",
        foreignField: "_id",
        as: "lease",
      },
    },
    { $unwind: "$lease" },
    {
      $lookup: {
        from: "properties",
        localField: "lease.property",
        foreignField: "_id",
        as: "property",
      },
    },
    { $unwind: "$property" },
    {
      $match: { "property.owner": landlordId },
    },
    {
      $group: {
        _id: {
          year: { $year: "$paidAt" },
          month: { $month: "$paidAt" },
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 },
    },
  ];

  const result = await Payment.aggregate(pipeline);

  return result.map((r) => ({
    month: `${r._id.year}-${String(r._id.month).padStart(2, "0")}`,
    total: r.total,
  }));
}
