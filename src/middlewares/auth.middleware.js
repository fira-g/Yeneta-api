import Parent from "../models/parent.model.js";
import jwt from "jsonwebtoken";
import { tryCatch } from "../utils/tryCatch.js";
import customError from "../utils/customError.js";

export const protectRout = tryCatch(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new customError(401, "Unauthorized - no Bearer token provided.");
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

  if (!token) {
    throw new customError(401, "Unauthorized - Token missing.");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded) {
    throw new customError(401, "Unauthorized - Invalid token.");
  }

  const user = await Parent.findById(decoded.userId).select("-password");
  if (!user) {
    throw new customError(404, "User not found");
  }

  req.user = user;
  next();
});

export const isPremium = tryCatch(async (req, res, next) => {
  const user = req.user;

  const isPremium = await user.isPremium;
  if (!isPremium) {
    throw new customError(400, "Unauthorized - not a premium user.");
  }
  req.user = user;
  next();
});
