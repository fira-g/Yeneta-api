import Story from "../models/stories.model.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/multer.middleware.js";

export const getStoriesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const stories = await Story.find({ category });
    if (stories.length == 0 || !stories) {
      return res.status(404).json({ message: "No match found." });
    }
    res.status(200).json(stories);
  } catch (error) {
    console.log("Error in getStoriesByCategory controller", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const uploadStory = async (req, res) => {
  const { title, category, image, text } = req.body;
  let image_url;
  try {
    if (req.file) {
      await cloudinary.uploader.upload(req.file.path, function (err, result) {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: "Failed",
            message: err.message,
          });
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
      res
        .status(201)
        .json({ message: "Story uploaded Successfully!", newStory });
    }
  } catch (error) {
    console.log("Error in uploadStory controller", error);
    res
      .status(500)
      .json({ message: "Internal Server Error.", Error: error.message });
  }
};
