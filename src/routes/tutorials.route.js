import express from "express";
import {
  getTutorialsBySubject,
  createTutorial,
} from "../controllers/tutorial.controller.js";
import { protectRout } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRout, getTutorialsBySubject);

router.post("/", protectRout, createTutorial);
export default router;
