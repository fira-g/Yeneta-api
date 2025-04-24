import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/parents", authRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server running on port : ${port}`);
  connectDB();
});
