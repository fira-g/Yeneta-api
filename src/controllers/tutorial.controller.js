import Tutorial from "../models/tutorial.model.js";
import { tryCatch } from "../utils/tryCatch.js";
import customError from "../utils/customError.js";

export const getTutorialsBySubject = tryCatch(async (req, res) => {
  const { subject, level } = req.query;

  if (!subject) {
    throw new customError(400, "Subject is required in query");
  }

  const tutorials = await Tutorial.find({
    subject: subject.toUpperCase(),
    level,
  });
  res.status(200).json({ tutorials });
});
export const createTutorial = tryCatch(async (req, res) => {
  const { subject, title, image, video, text, level } = req.body;

  if (!subject || !title) {
    throw new customError(400, "title and subject required in subject");
  }

  const tutorial = new Tutorial({
    subject: subject.toUpperCase(),
    title,
    image,
    video,
    text,
    level,
  });

  await tutorial.save();
  res.status(201).json({ message: "Tutorial created", tutorial });
});
