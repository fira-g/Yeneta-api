import cloudinary from "../config/cloudinary.js";
import Song from "../models/songs.model.js";
import customError from "../utils/customError.js";
import { tryCatch } from "../utils/tryCatch.js";

export const getSongs = tryCatch(async (req, res) => {
  const songs = await Song.find();
  if (!songs || songs.length == 0) {
    throw new customError(404, "No song found.");
  }
  res.status(200).json({ songs });
});
export const uploadSong = tryCatch(async (req, res) => {
  const { title } = req.body;
  let audio_url;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video", // Important: Treat as video for audio
      public_id: req.file.originalname.split(".").slice(0, -1).join("."), // Use filename as public ID
      overwrite: true,
    });

    audio_url = result.secure_url;
  } else {
    console.log("no audio selected");
  }
  const newSong = new Song({
    title,
    audio: audio_url,
  });
  if (newSong) {
    await newSong.save();
    res.status(201).json({ message: "song uploaded Successfully!", newSong });
  }
});
