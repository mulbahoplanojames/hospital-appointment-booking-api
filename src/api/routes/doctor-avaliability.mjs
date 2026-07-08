import express from "express";
import doctorAvaliability from "../model/doctor-avaliability.mjs";
import { authenticateToken, requireAdmin } from "../middleware/auth.mjs";

const router = express.Router();

router.post(
  "/create",
  authenticateToken,
  requireAdmin,
  async (request, response) => {
    const { doctor, day, startTime, endTime } = request.body;

    try {
      const doctorAvailability = new doctorAvaliability({
        doctor,
        day,
        startTime,
        endTime,
      });

      await doctorAvailability.save();

      response.status(201).json({
        message: "Doctor availability created successfully",
        doctorAvailability,
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

router.get("/", authenticateToken, requireAdmin, async (request, response) => {
  try {
    const doctorAvailability = await doctorAvaliability.find();
    response.status(200).json({
      message: "Doctor availability fetched successfully",
      doctorAvailability,
      status: "success",
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.patch(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (request, response) => {
    const { id } = request.params;
    const { doctor, day, startTime, endTime } = request.body;

    try {
      const doctorAvailability = await doctorAvaliability.findByIdAndUpdate(
        id,
        {
          doctor,
          day,
          startTime,
          endTime,
        },
        {
          new: true,
        },
      );

      if (!doctorAvailability) {
        return response.status(404).json({
          message: "Doctor availability not found",
          status: "error",
        });
      }

      response.status(200).json({
        message: "Doctor availability updated successfully",
        doctorAvailability,
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
      const doctorAvailability = await doctorAvaliability.findByIdAndDelete(id);

      if (!doctorAvailability) {
        return response.status(404).json({
          message: "Doctor availability not found",
          status: "error",
        });
      }

      response.status(200).json({
        message: "Doctor availability deleted successfully",
        doctorAvailability,
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
