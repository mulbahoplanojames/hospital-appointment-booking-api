import jwt from "jsonwebtoken";
import user from "../model/user.mjs";

export const authenticateToken = async (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({ message: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundUser = await user.findOne({ email: decoded.email });

    if (!foundUser) {
      return response.status(404).json({ message: "User not found" });
    }

    request.user = foundUser;
    next();
  } catch (error) {
    return response.status(403).json({ message: "Invalid or expired token" });
  }
};

export const requireAdmin = (request, response, next) => {
  if (request.user.role !== "admin") {
    return response.status(403).json({ message: "Admin access required" });
  }
  next();
};
