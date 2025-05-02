import express from "express";

import upload from "../middlewares/multer.middleware.js";
import { isPremium, protectRout } from "../middlewares/auth.middleware.js";
import { getSongs, uploadSong } from "../controllers/songs.controller.js";

const router = express.Router();

router.get("/", getSongs);
router.post("/", protectRout, isPremium, upload.single("audio"), uploadSong);
export default router;
