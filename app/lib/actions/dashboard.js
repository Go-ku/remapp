import { connectDB } from "../db";
import Property from "../models/Property";
import Lease from "../models/Lease";
import Tenant from "../models/Tenant";
import Payment from "../models/Payment";

export async function getAdminStats() {
  await connectDB();

  const [propertyCount, tenantCount, leaseCount, paymentSum] =
    await Promise.all([
      Property.countDocuments(),
      Tenant.countDocuments(),
      Lease.countDocuments(),
      Payment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

  return {
    properties: propertyCount,
    tenants: tenantCount,
    leases: leaseCount,
    totalIncome: paymentSum[0]?.total || 0,
  };
}

export async function getLandlordStats(landlordId) {
  await connectDB();

  // Step 1: Find landlord's properties
  const properties = await Property.find({ landlord: landlordId }).select(
    "_id"
  );

  const propertyIds = properties.map((p) => p._id);

  if (!propertyIds.length) {
    return {
      properties: 0,
      tenants: 0,
      leases: 0,
      totalIncome: 0,
    };
  }

  // Step 2: Find leases on those properties
  const leases = await Lease.find({ property: { $in: propertyIds } }).select(
    "_id tenant"
  );

  const leaseIds = leases.map((l) => l._id);
  const tenantIds = leases.map((l) => l.tenant?.toString());

  // Step 3: Sum payments on those leases
  const paymentSum = await Payment.aggregate([
    {
      $match: {
        lease: { $in: leaseIds.map((id) => new mongoose.Types.ObjectId(id)) },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return {
    properties: propertyIds.length,
    tenants: new Set(tenantIds).size,
    leases: leaseIds.length,
    totalIncome: paymentSum[0]?.total || 0,
  };
}

export async function getTenantStats(tenantId) {
  await connectDB();

  const lease = await Lease.findOne({ tenant: tenantId }).populate("property");

  if (!lease) return { lease: null, payments: [] };

  const payments = await Payment.find({ lease: lease._id })
    .sort({ paidAt: -1 })
    .limit(5);

  return {
    lease,
    payments,
  };
}
