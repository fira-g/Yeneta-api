import mongoose from "mongoose";
import Parent from "./parent.model.js";
import Quiz from "./quiz.model.js";

const scoresSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: Parent,
    },
    quizId: {
      type: mongoose.Types.ObjectId,
      ref: Quiz,
    },
    score: {
      type: Number,
      required: true,
    },
    remark: {
      type: String,
    },
  },
  { timestamps: true }
);

const Score = mongoose.model("Score", scoresSchema);
export default Score;
