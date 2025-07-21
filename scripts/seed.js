// scripts/seed.js
import mongoose from "mongoose";
import { config } from "dotenv";
config();


import User from "../app/lib/models/User.js";
import Lease from "../app/lib/models/Lease.js";
import Tenant from "../app/lib/models/Tenant.js";
import Payment from "../app/lib/models/Payment.js";
import Invoice from "../app/lib/models/Invoice.js";
import Property from "../app/lib/models/Property.js";
import Notification from "../app/lib/models/Notification.js";
const MONGO_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    // Clear collections
    await Promise.all([
      User.deleteMany(),
      Property.deleteMany(),
      Tenant.deleteMany(),
      Lease.deleteMany(),
      Invoice.deleteMany(),
      Payment.deleteMany(),
      Notification.deleteMany(),
    ]);

    // Create users
    const admin = await User.create({ name: "Admin", email: "admin@example.com", role: "admin" });
    const landlord = await User.create({ name: "Landlord", email: "landlord@example.com", role: "landlord" });
    const tenantUser = await User.create({ name: "Tenant User", email: "tenant@example.com", role: "tenant" });

    // Create property
    const property = await Property.create({
      name: "Green Villas Apt 1",
      location: "Lusaka Central",
      type: "residential",
      status: "vacant",
      monthlyRent: 3500,
      owner: landlord._id,
    });

    // Create tenant
    const tenant = await Tenant.create({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "0977123456",
      user: tenantUser._id,
    });

    // Create lease
    const lease = await Lease.create({
      property: property._id,
      tenant: tenant._id,
      rentAmount: 3500,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-12-31"),
    });

    // Update property to mark as occupied
    await Property.findByIdAndUpdate(property._id, { status: "occupied" });

    // Create invoice
    const invoice = await Invoice.create({
      lease: lease._id,
      property: property._id,
      tenant: tenant._id,
      dueDate: new Date("2024-02-01"),
      amount: 3500,
      status: "unpaid",
    });

    // Create payment
    const payment = await Payment.create({
      lease: lease._id,
      tenant: tenant._id,
      invoice: invoice._id,
      amount: 3500,
      method: "cash",
      type: "rent",
      receiptNumber: "RCPT-0001",
      paidAt: new Date("2024-02-02"),
      status: "successful",
    });

    // Create notification
   await Notification.create({
  recipient: tenantUser._id, // ✅ correct
  message: "Thank you for your payment of ZMW 3500.",
  type: "payment",
});


    console.log("✅ Seed complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
