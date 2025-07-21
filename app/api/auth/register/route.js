// app/api/auth-actions/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/app/lib/db';
import User from '@/app/lib/models/User';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hashed, role: 'tenant' });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
