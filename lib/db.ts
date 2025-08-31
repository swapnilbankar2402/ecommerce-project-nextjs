import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("⚠️ Please add MONGODB_URI in .env");
}

// Global is used to maintain cache in development (hot reloads)
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "ecommerce",
        bufferCommands: false,
      })
      .then((mongoose) => {
        console.log("Database connected");
        return mongoose;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
