import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/events.route.js";
import passport from "passport";
import { initializeGoogleAuth } from "./controllers/google.auth.controller.js";
import storyRoutes from "./routes/stories.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import tutorialRoutes from "./routes/tutorials.route.js";
import quizRoutes from "./routes/quiz.route.js";
import rankRoutes from "./routes/ranking.route.js";
import {
  authRateLimiter,
  rateLimiter,
} from "./middlewares/rateLimiter.middleware.js";
dotenv.config();

export const app = express();
app.use(express.json());
app.use(passport.initialize());
initializeGoogleAuth();

app.use(rateLimiter);
app.use("/api/parents", authRateLimiter, authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/tutorials", tutorialRoutes);
app.use("/api/quizes", quizRoutes);
app.use("/api/rank", rankRoutes);
app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
