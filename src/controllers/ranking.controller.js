// File: controllers/leaderboard.controller.js
import Score from "../models/scores.model.js";
import Parent from "../models/parent.model.js";
import mongoose from "mongoose";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: "$userId",
          totalScore: { $sum: "$score" },
          lastQuizDate: { $max: "$updatedAt" },
        },
      },
      {
        $lookup: {
          from: "parents",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.kidsName",
          totalScore: 1,
          lastQuizDate: 1,
        },
      },
      { $sort: { totalScore: -1 } },
    ]);

    res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      data: leaderboard,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching leaderboard", error });
  }
};

// GET /api/winners/weekly
export const getWeeklyWinners = async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const winners = await Score.aggregate([
      {
        $match: {
          updatedAt: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: "$userId",
          weeklyScore: { $sum: "$score" },
          quizzesTaken: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "parents",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.kidsName",
          weeklyScore: 1,
          quizzesTaken: 1,
        },
      },
      { $sort: { weeklyScore: -1 } },
      { $limit: 1 },
    ]);

    res.status(200).json({
      success: true,
      message: "Weekly winners announced",
      weekStart: startOfWeek.toISOString().slice(0, 10),
      weekEnd: endOfWeek.toISOString().slice(0, 10),
      winners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching weekly winners",
      error,
    });
  }
};
