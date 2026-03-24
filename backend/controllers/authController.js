import { usersData } from "../models/data.js";

export const signup = (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phoneNumber,
      qualification,
      gender,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phoneNumber ||
      !qualification ||
      !gender
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUser = usersData.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newId = usersData.length > 0 ? Math.max(...usersData.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      name,
      email,
      password,
      role: "user",
      phoneNumber,
      qualification,
      gender,
    };

    usersData.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: userWithoutPassword,
      token: "dummy-jwt-token-" + newId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const userByEmail = usersData.find((u) => u.email === email);

    if (!userByEmail) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (userByEmail.password !== password) {
      return res.status(401).json({ error: "Password is wrong" });
    }

    const user = userByEmail;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
      token: "dummy-jwt-token-" + user.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const logout = (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

export const getProfile = (req, res) => {
  try {
    const userId = req.params.id;
    const user = usersData.find((u) => u.id == userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
