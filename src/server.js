import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/events.route.js";
import passport from "passport";
import { initializeGoogleAuth } from "./controllers/google.auth.controller.js";
import storyRoutes from "./routes/stories.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
initializeGoogleAuth();

app.use("/api/parents", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stories", storyRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
