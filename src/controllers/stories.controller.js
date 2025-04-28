import Story from "../models/stories.model.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/multer.middleware.js";
import { tryCatch } from "../utils/tryCatch.js";
import customError from "../utils/customError.js";
import { validateUploadStory } from "../validators/stories.validation.js";

export const getStoriesByCategory = tryCatch(async (req, res) => {
  const { category } = req.params;
  const stories = await Story.find({ category });
  if (stories.length == 0 || !stories) {
    throw new customError(404, "No match found");
  }
  res.status(200).json(stories);
});

export const uploadStory = tryCatch(async (req, res) => {
  validateUploadStory(req.body);
  const { title, category, image, text } = req.body;
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
  const newStory = new Story({
    title,
    category,
    image: image_url,
    text,
  });
  if (newStory) {
    await newStory.save();
    res.status(201).json({ message: "Story uploaded Successfully!", newStory });
  }
});
