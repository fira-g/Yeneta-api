import mongoose from "mongoose";
import Tutorial from "./tutorial.model.js";

const quizSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
    },
    questions: [
      {
        question: {
          type: String,
        },
        options: [String],
        correctAnswer: {
          type: String,
        },
        explanation: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
