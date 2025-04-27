import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin", "employee", "manager"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to hash the password before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Only hash the password if it's modified

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next(); // Proceed with saving the user
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

// Method to compare the given password with the stored hashed password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare the given password with the stored hash
};
const User = mongoose.model("User", userSchema);

export default User;
