import User from "../models/user.model.js";
import { generateTokens, setCookies } from "../utils/GenrateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Step 1: Validate if all required fields are provided
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Step 2: Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Step 3: Create a new user instance and save to the database
    const newUser = new User({
      name,
      email,
      password, // Password will be hashed automatically due to the pre-save hook in the schema
      role,
    });

    // Save the new user document to the database
    await newUser.save();

    // Step 4: Generate accessToken and refreshToken after successful registration
    const { accessToken, refreshToken } = generateTokens(newUser._id); // Generate tokens with the user ID

    // Step 5: Set the generated tokens as cookies
    setCookies(res, accessToken, refreshToken);

    // Step 6: Respond with success message
    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password (you can use any method, like bcrypt to compare password)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate tokens for the user
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Set cookies in the response
    setCookies(res, accessToken, refreshToken);

    // Send response with success message
    res.status(200).json({
      message: "Login successful",
      accessToken, // Optionally send the access token in response body
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

export const logoutUser = (req, res) => {
  try {
    //   const refreshToken = req.cookies.refreshToken;
    //   if (refreshToken) {
    //     const decoded = jwt.verify(
    //       refreshToken,
    //       process.env.REFRESH_TOKEN_SECRET
    //     );
    //     await redis.del(`refresh_token:${decoded.userId}`);
    //   }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
