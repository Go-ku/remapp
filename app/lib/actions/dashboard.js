import { connectDB } from "../db";
import Property from "../models/Property";
import Lease from "../models/Lease";
import Tenant from "../models/Tenant";
import Payment from "../models/Payment";

export async function getAdminDashboardData() {
  await connectDB();

  const [totalProperties, totalTenants, totalLeases] = await Promise.all([
    Property.countDocuments(),
    Tenant.countDocuments(),
    Lease.countDocuments({ terminated: false }),
  ]);

  // Monthly revenue
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const payments = await Payment.aggregate([
    {
      $match: {
        paidAt: { $gte: startOfMonth },
        status: "successful",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const monthlyRevenue = payments[0]?.total || 0;

  return {
    totalProperties,
    totalTenants,
    totalLeases,
    monthlyRevenue,
  };
}

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
export async function getLandlordDashboardData(landlordId) {
  await connectDB();

  const [properties, leases, tenants, payments] = await Promise.all([
    Property.find({ owner: landlordId }).select("_id"),
    Lease.find({ property: { $in: await Property.find({ owner: landlordId }).distinct("_id") }, terminated: false }),
    Tenant.countDocuments({}), // Optional: or filter to only active tenants under leases above
    Payment.aggregate([
      {
        $match: {
          status: "successful",
        },
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
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const totalRevenue = payments[0]?.total || 0;

  return {
    totalProperties: properties.length,
    totalLeases: leases.length,
    totalTenants: tenants,
    totalRevenue,
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

export async function getTenantData(tenantId) {
  await connectDB();

  const lease = await Lease.findOne({ tenant: tenantId }).populate("property");
  const invoices = await Invoice.find({ tenant: tenantId }).sort({ dueDate: -1 });
  const payments = await Payment.find({ tenant: tenantId }).sort({ paidAt: -1 });

  return { lease, invoices, payments };
}