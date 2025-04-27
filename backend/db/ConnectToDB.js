import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

async function ConnectToDb() {
  try {
    // Connect to the database
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log database connection success
    console.log(
      "✅ Connected To Database",
      connection.connection.host,
      ":",
      connection.connection.port
    );
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1); // Stop the app if DB connection fails
  }
}

export default ConnectToDb;
