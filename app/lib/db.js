  import mongoose from "mongoose";
  import { MongoClient } from "mongodb";

  const MONGODB_URI = process.env.MONGODB_URI;
  const client = new MongoClient(MONGODB_URI);
const clientPromise = client.connect();

export default clientPromise;
  if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  let cached = global.mongoose || { conn: null, promise: null };

  export async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;
    global.mongoose = cached;
    return cached.conn;
  }

