import Parent from "../models/parent.model.js";
import jwt from "jsonwebtoken";

export const protectRout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Bearer token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - Token missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token." });
    }

    const user = await Parent.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protector middleware", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const isPremium = async (req, res, next) => {
  const user = req.user;
  try {
    const isPremium = await user.isPremium;
    if (!isPremium) {
      return res
        .status(400)
        .json({ message: "Unauthorized - Not a premium User." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in premium middleware", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
