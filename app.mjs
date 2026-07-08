import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./src/api/routes/auth.mjs";
import userRoutes from "./src/api/routes/users.mjs";
import doctorAvaliabilityRoutes from "./src/api/routes/doctor-avaliability.mjs";
import medicalDepartmentRoutes from "./src/api/routes/medical-department.mjs";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors(corsOptions));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/doctor-avaliability", doctorAvaliabilityRoutes);
app.use("/medical-departments", medicalDepartmentRoutes);

app.use((request, response, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, request, response, next) => {
  response.status(error.status || 500);
  response.json({
    error: {
      message: error.message,
    },
  });
});

export default app;
