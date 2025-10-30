


import mongoose from "mongoose";

let isConnected = false; // track MongoDB connection

export async function connect() {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return;
  }

  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in your environment variables");
    throw new Error("MONGO_URI not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;

    mongoose.connection.on("connected", () => {
      console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Something went wrong while connecting to MongoDB!", error);
    throw error;
  }
}
