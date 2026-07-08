import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import user from "../model/user.mjs";

const router = express.Router();

router.post("/register", async (request, response) => {
  const { name, email, password, age, weight, height } = request.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new user({
      name,
      email,
      password: hashedPassword,
      age,
      weight,
      height,
    });

    await newUser
      .save()
      .then(() => {
        response.status(201).json({ message: "User created successfully" });
      })
      .catch((error) => {
        response.status(500).json({ message: error.message });
      });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return response.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordValid) {
      return response.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: foundUser.email, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    response.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
});

export default router;
