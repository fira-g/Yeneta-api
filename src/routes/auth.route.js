import express from "express";
import passport from "passport";
import generateToken from "../services/generateToken.js";
import {
  login,
  passwordResetRequest,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";

const baseUrl = process.env.FRONTEND_URL;
const router = express.Router();

router.post("/register", signup);
router.post("/login", login);
router.post("/password/reset/request", passwordResetRequest);
router.post("/password/reset/:token", resetPassword);

router.get("/password/reset/:token", (req, res) => {
  res.send("reset ur password");
  // password reseting page
});
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${baseUrl}/api/parents/login`, // Redirect to login on failure
    session: false,
  }),
  async (req, res) => {
    // Authentication successful, generate JWT and redirect to frontend
    if (req.user) {
      const token = await generateToken(req.user._id);
      res.status(201).json({ token, message: "Log in successful." });
      console.log(token);
      // res.redirect(`${baseUrl}/auth/success?token=${token}`); // Or set in header/local storage
    }
  }
);

export default router;
