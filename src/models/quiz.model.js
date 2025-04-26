import mongoose from "mongoose";
import Tutorial from "./tutorial.model.js";

const quizSchema = new mongoose.Schema(
  {
    sourceTutorialId: {
      type: mongoose.Types.ObjectId,
      ref: Tutorial,
    },
    level:{
      type:Number
    },
    questions: [
      {
        question: {
          type: String,
        },
        options: {
          type: String,
        },
        correctAnswer: {
          type: String,
        },
        explanation:{
          type:String
        }
      },
    ],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
