import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    kidsName: {
      type: String,
    },
    password: {
      type: String,
      minlength: 6,
    },
    email: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    profilePic: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    tokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;
