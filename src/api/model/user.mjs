import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["patient", "admin", "doctor"],
      required: true,
      default: "patient",
    },
    age: Number,
    avatar: String,
    height: Number,
    weight: Number,
    specialties: {
      type: [String],
      required: function () {
        return this.role === "doctor";
      },
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalDepartment",
      required: function () {
        return this.role === "doctor";
      },
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
