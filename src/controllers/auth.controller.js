import Parent from "../models/parent.model.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import {
  validateLogin,
  validatePasswordResetRequest,
  validateResetPassword,
  validateSignup,
} from "../validators/auth.validator.js";
import { tryCatch } from "../utils/tryCatch.js";
import customError from "../utils/customError.js";
import cloudinary from "../config/cloudinary.js";

export const signup = tryCatch(async (req, res) => {
  validateSignup(req.body, res);

  const { email, kidsName, fullName, password } = req.body;

  const existingUser = await Parent.findOne({ email });
  if (existingUser) {
    throw new customError(400, "email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Parent({
    fullName,
    email,
    kidsName,
    password: hashedPassword,
  });
  if (newUser) {
    await newUser.save();
    const { password: pass, ...userToSend } = newUser._doc;
    const token = await generateToken(newUser._id);
    res.status(201).json({
      message: "Account created successfully.",
      token: token,
      user: userToSend,
    });
  }
});

export const login = tryCatch(async (req, res) => {
  validateLogin(req.body, res);
  const { email, password } = req.body;
  const user = await Parent.findOne({ email });
  if (!user) {
    throw new customError(400, "Invalid credentials");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new customError(400, "Invalid credentials");
  }

  const { password: pass, ...userToSend } = user._doc;
  const token = await generateToken(user._id);
  res.status(200).json({
    message: "Logged in successfully.",
    token: token,
    user: userToSend,
  });
});

export const passwordResetRequest = tryCatch(async (req, res) => {
  validatePasswordResetRequest(req.body, res);

  const { email } = req.body;
  const user = await Parent.findOne({ email });
  if (!email) {
    return res.status(404).json({ message: "Email not found." });
  }

  // generate 6-digit OTP
  const randomNumber = Math.floor(Math.random() * 1000000);
  const formattedNumber = randomNumber.toString().padStart(6, "0");

  const hashedToken = await bcrypt.hash(formattedNumber, 10);
  user.resetToken = hashedToken;
  user.tokenExpiration = Date.now() + 10 * 60 * 1000;
  await user.save();

  //send the link
  try {
    const resetMessage = {
      email: user.email,
      message: `Here an OTP to reset your password\n\n${formattedNumber}\n\nThis OTP is valid for only 10 minutes.`,
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
    return res
      .status(400)
      .json({ message: "failed to send password reset link." });
  }
});

export const resetPassword = tryCatch(async (req, res) => {
  validateResetPassword(req.body, res);

  const resetToken = req.body.otp;

  const { email, newPassword } = req.body;

  const user = await Parent.findOne({ email });
  if (!user) {
    throw new customError(404, "Email not found");
  }
  if (!user.resetToken) {
    throw new customError(404, "request not found");
  }
  const isTokenValid = await bcrypt.compare(resetToken, user.resetToken);
  if (!isTokenValid) {
    throw new customError(400, "Unauthorized - invalid token");
  }

  if (user.tokenExpiration < Date.now()) {
    throw new customError(400, "unauthorized - token expired.");
  }
  // hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  //clear the resetToken
  user.tokenExpiration = null;
  user.resetToken = null;
  await user.save();
  res.json({ message: "password updated successfully!" });
});

export const updateProfile = tryCatch(async (req, res) => {
  let image_url;

  if (req.file) {
    await cloudinary.uploader.upload(req.file.path, function (err, result) {
      if (err) {
        console.log(err);
        throw new customError(500, err.message);
      }

      image_url = result.secure_url;
    });
  } else {
    console.log("no image selected");
  }
  req.user.profilePic = image_url;
  await req.user.save();
  res.status(200).json({ message: "Profile updated.", user: req.user });
});
