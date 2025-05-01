import express from "express";
import {
  getAllQuizzes,
  markQuiz,
  createQuiz,
} from "../controllers/quiz.controller.js";
import { protectRout } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRout, getAllQuizzes);
router.post("/", protectRout, createQuiz);
router.post("/mark/:quizId", protectRout, markQuiz);

export default router;
