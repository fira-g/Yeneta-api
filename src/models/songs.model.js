import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    audio: {
      type: String,
    },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

export default Song;
