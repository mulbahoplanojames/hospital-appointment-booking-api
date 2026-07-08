import http from "http";
import app from "./app.mjs";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const mongoDBUrl = process.env.CONNECTION_STRING;

const server = http.createServer(app);

mongoose
  .connect(mongoDBUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(process.env.PORT, () => {
      console.log(`Server is running on port localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
