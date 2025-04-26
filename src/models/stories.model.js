import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: {
        values: ["ASTRONAUNT", "SCIENTIST", "DOCTOR", "ACTOR", "TERET"],
        message:
          "The available subjects are 'ASTRONAUNT', 'SCIENTIST' , 'DOCTOR', 'ACTOR'& 'TERET'. ",
      },
    },
    image: {
      type: String, // url from cloudinary
      default: "",
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Story = mongoose.model("Story", storySchema);

export default Story;
