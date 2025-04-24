import mongoose from "mongoose";

const tutorialSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      enum: {
        values: ["MATH", "SCIENCE", "AMHARIC", "ENGLISH"],
        message:
          "The available subjects are 'MATH' , 'SCIENCE', 'AMHARIC'& 'ENGLISH'. ",
      },
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String, //url from cloudinary
      default: "",
    },
    video: {
      type: String, //url from cloudinary
      default: "",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tutorial = mongoose.model("Tutorial", tutorialSchema);

export default Tutorial;
