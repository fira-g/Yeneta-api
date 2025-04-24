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
  },
  { timestamps: true }
);

const Parent = mongoose.model("Parent", parentSchema);

export default Parent;
