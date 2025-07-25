import { connectDB } from "../db";
import Tenant from "../models/Tenant";

export async function getAllTenants() {
  await connectDB();
  return await Tenant.find().sort({ createdAt: -1 });
}

export async function getTenantById(id) {
  await connectDB();
  return await Tenant.findById(id);
}

export async function createTenant(data) {
  await connectDB();
  return await Tenant.create(data);
}

export async function updateTenant(id, updates) {
  await connectDB();
  return await Tenant.findByIdAndUpdate(id, updates, { new: true });
}

export async function deleteTenant(id) {
  await connectDB();
  return await Tenant.findByIdAndDelete(id);
}
