import Parent from "../models/parent.model.js";
import generateToken from "../services/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../services/sendEmail.js";
export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    const existingUser = await Parent.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "email already exists try to signIn." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Parent({
      fullName,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      await newUser.save();
      const token = await generateToken(newUser._id);
      res.status(201).json({
        message: "Account created successfully.",
        token,
        fullName: newUser.fullName,
        _id: newUser._id,
      });
    }
  } catch (error) {
    console.log("Error in signup controller. ", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Parent.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalis credentials" });
    }
    const token = await generateToken(user._id);
    res.status(200).json({
      message: "Logged in successfully.",
      token,
      fullName: user.fullName,
      _id: user._id,
    });
  } catch (error) {
    console.log("Error in login controller. ", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const passwordResetRequest = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Parent.findOne({ email });
    if (!email) {
      return res.status(404).json({ message: "Email not found." });
    }
    const resetToken = crypto.randomBytes(10).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    user.resetToken = hashedToken;
    user.tokenExpiration = Date.now() + 10 * 60 * 1000;
    await user.save();

    //send the link
    try {
      const resetURL = `${req.protocol}://${req.get(
        "host"
      )}/api/parents/password/reset/${resetToken}`;
      const resetMessage = {
        email: user.email,
        message: `Here is a link to reset Your password. If You did'nt request for a password reset simply ignore this message\n\n${resetURL}\n\nThe link expires in 10 minutes.`,
        subject: "Yeneta-App - Reset your password.",
      };
      await sendEmail(resetMessage);
      res.status(200).json({
        status: "success",
        message: "Password reset email sent successfully.",
      });
    } catch (error) {
      user.resetToken = null;
      user.tokenExpiration = null;
      await user.save();
      console.log("error sending password reset email", error.message);
      return res.json({ message: "failed to send password reset link." });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log(
      "Error in passwordResetRequest controller",
      error.message,
      error
    );
  }
};

export const resetPassword = async (req, res) => {
  const resetToken = req.params.token;

  const { email, newPassword } = req.body;
  try {
    console.log(resetToken);

    const user = await Parent.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Email not found. Try to sign up." });
    }
    if (!user.resetToken) {
      return res.status(404).json({ message: "request doesnt found" });
    }
    const isTokenValid = await bcrypt.compare(resetToken, user.resetToken);
    if (!isTokenValid) {
      return res
        .status(400)
        .json({ message: "Unauthorized - invalid token used." });
    }

    if (user.tokenExpiration < Date.now()) {
      return res.status(400).json({ message: "Unauthorized - Token expired." });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    //clear the resetToken
    user.tokenExpiration = null;
    user.resetToken = null;
    await user.save();
    res.json({ message: "password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("Error in resetPassword controller", error.message, error);
  }
};
