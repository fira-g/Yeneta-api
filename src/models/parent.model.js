import mongoose from "mongoose";

const parentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
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
