import { connectDB } from "@/lib/mongoose/db";
import Property from "@/lib/mongoose/models/Property";

export async function getAllProperties() {
  await connectDB();
  return await Property.find().sort({ createdAt: -1 }).populate("owner");
}

export async function getPropertyById(id) {
  await connectDB();
  return await Property.findById(id).populate("owner");
}

export async function createProperty(data) {
  await connectDB();
  return await Property.create(data);
}

export async function updateProperty(id, updates) {
  await connectDB();
  return await Property.findByIdAndUpdate(id, updates, { new: true });
}

export async function deleteProperty(id) {
  await connectDB();
  return await Property.findByIdAndDelete(id);
}
