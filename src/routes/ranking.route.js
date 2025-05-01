import express from "express";
import {
  getLeaderboard,
  getWeeklyWinners,
} from "../controllers/ranking.controller.js";

const router = express.Router();

router.get("/leaderboard", getLeaderboard);

router.get("/winners/weekly", getWeeklyWinners);

export default router;
