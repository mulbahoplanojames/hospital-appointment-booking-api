import express from "express";
import user from "../model/user.mjs";
import { authenticateToken, requireAdmin } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", authenticateToken, requireAdmin, async (request, response) => {
  try {
    const users = await user.find();

    const userUrls = users.map((user) => {
      return `http://localhost:8080/users/${user._id}`;
    });

    response.json({
      length: users.length,
      users,
      status: "success",
      info: userUrls,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (request, response) => {
    const { id } = request.params;
    const { name, email, age, weight, height, role, specialties } =
      request.body;

    try {
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (age !== undefined) updateData.age = age;
      if (weight !== undefined) updateData.weight = weight;
      if (height !== undefined) updateData.height = height;
      if (role !== undefined) updateData.role = role;
      if (specialties !== undefined) updateData.specialties = specialties;

      const updatedUser = await user.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return response.status(404).json({ message: "User not found" });
      }

      response.json({
        message: "User updated successfully",
        user: updatedUser,
        status: "success",
      });
    } catch (error) {
      response.status(500).json({
        message: error.message,
        status: "error",
      });
    }
  },
);

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (request, response) => {
    const { id } = request.params;

    try {
      const deletedUser = await user.findByIdAndDelete(id);

      if (!deletedUser) {
        return response.status(404).json({ message: "User not found" });
      }

      response.json({
        message: "User deleted successfully",
        user: deletedUser,
        status: "success",
      });
    } catch (error) {
      response.status(500).json({
        message: error.message,
        status: "error",
      });
    }
  },
);

export default router;
