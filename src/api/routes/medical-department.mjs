import express from "express";
import medicalDepartment from "../model/medical-department.mjs";

const router = express.Router();

router.post("/create", async (request, response) => {
  try {
    const existingDepartment = await medicalDepartment.findOne({
      name: request.body.name,
    });

    if (existingDepartment) {
      return response.status(400).json({
        message: "Medical department already exists",
        status: "error",
      });
    }

    const newMedicalDepartment = new medicalDepartment({
      name: request.body.name,
      description: request.body.description,
    });

    await newMedicalDepartment.save();

    response.status(201).json({
      message: "Medical department created successfully",
      status: "success",
      data: newMedicalDepartment,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.get("/", async (request, response) => {
  try {
    const medicalDepartments = await medicalDepartment.find();
    response.status(200).json({
      message: "Medical departments retrieved successfully",
      status: "success",
      data: medicalDepartments,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.get("/:id", async (request, response) => {
  try {
    const medicalDepartment = await medicalDepartment.findById(
      request.params.id,
    );
    response.status(200).json({
      message: "Medical department retrieved successfully",
      status: "success",
      data: medicalDepartment,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.put("/:id", async (request, response) => {
  try {
    const medicalDepartment = await medicalDepartment.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true },
    );
    response.status(200).json({
      message: "Medical department updated successfully",
      status: "success",
      data: medicalDepartment,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const medicalDepartment = await medicalDepartment.findByIdAndDelete(
      request.params.id,
    );
    response.status(200).json({
      message: "Medical department deleted successfully",
      status: "success",
      data: medicalDepartment,
    });
  } catch (error) {
    response.status(500).json({
      message: error.message,
      status: "error",
    });
  }
});

export default router;
