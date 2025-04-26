import express from "express";
import {
  getStoriesByCategory,
  uploadStory,
} from "../controllers/stories.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { isPremium, protectRout } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/:category", getStoriesByCategory);
router.post("/", protectRout, isPremium, upload.single("image"), uploadStory);
export default router;
