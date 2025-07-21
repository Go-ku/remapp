import bcrypt from "bcryptjs"
import { connectDB } from "../db";
import User from "../models/User";

export async function registerUser({ name, email, password }) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "tenant", // or "landlord", etc.
  });

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
