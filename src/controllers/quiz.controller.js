import Quiz from "../models/quiz.model.js";
import Score from "../models/scores.model.js";
import { tryCatch } from "../utils/tryCatch.js";
import customError from "../utils/customError.js";

export const getAllQuizzes = tryCatch(async (req, res) => {
  const { subject } = req.query;
  const quizzes = await Quiz.find({ subject: subject.toUpperCase() });
  res.status(200).json({ quizzes });
});

export const markQuiz = tryCatch(async (req, res) => {
  const { quizId } = req.params;
  const { answers } = req.body; // User's answers array

  if (!answers || answers.length === 0) {
    throw new customError(400, "answers required");
  }
  const quiz = await Quiz.findById(quizId);
  const userScore = await Score.findOne({
    userId: req.user._id,
    quizId: quizId,
  });

  if (!quiz) {
    throw new customError(404, "Quiz not found");
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (question.correctAnswer === answers[index].toUpperCase()) {
      score++;
    }
  });

  if (userScore) {
    userScore.score = Math.max(userScore?.score, score);
    await userScore.save();
  } else {
    const newScore = new Score({
      userId: req.user._id,
      quizId: quizId,
      score,
    });
    await newScore.save();
  }

  console.log(userScore.score);
  res.status(200).json({
    message: "Quiz marked successfully",
    score: score,
    totalMarks: quiz.questions.length,
  });
});

export const createQuiz = tryCatch(async (req, res) => {
  const { subject, level, questions } = req.body;

  if (!subject || !level || !questions) {
    return res
      .status(400)
      .json({ error: "Tutorial ID, level, and questions are required" });
  }
  let image_url;
  if (req.file) {
    await cloudinary.uploader.upload(req.file.path, function (err, result) {
      if (err) {
        console.log(err);
        throw new customError(500, err.message);
      }

      image_url = result.secure_url;
    });
  }

  const quiz = new Quiz({
    subject: subject.toUpperCase(),
    level,
    questions,
    image: image_url,
  });
  console.log(quiz);
  await quiz.save();
  res.status(201).json({ message: "Quiz created successfully", quiz });
});
