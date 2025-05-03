import Event from "../models/events.model.js";
import customError from "../utils/customError.js";
import sendEmail from "../utils/sendEmail.js";
import { tryCatch } from "../utils/tryCatch.js";
import { validateCreateEvent } from "../validators/events.validator.js";
import cloudinary from "../config/cloudinary.js";

export const getEvents = tryCatch(async (req, res) => {
  const events = await Event.find({}).sort({ dueDate: 1 });
  if (events.length == 0 || !events) {
    throw new customError(404, "No Event found.");
  }
  res.json({ events: events });
});

export const createEvent = tryCatch(async (req, res) => {
  validateCreateEvent(req.body, res);
  const { title, description, dueDate, attendanceCapacity } = req.body;
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
  const newEvent = new Event({
    title,
    description,
    dueDate,
    image: image_url,
    attendanceCapacity,
  });

  if (newEvent) {
    await newEvent.save();
  } else {
    throw new customError(400, "Invalid data");
  }

  res
    .status(201)
    .json({ message: "Event created successfully.", event: newEvent });
});

export const rsvp = tryCatch(async (req, res) => {
  const user = req.user;

  const event = await Event.findById(req.params.eventId);
  const bookedList = event.bookedParents;
  if (!(event.attendanceCapacity > bookedList.length)) {
    throw new customError(400, "All seats are taken");
  }
  bookedList.push({
    parentID: user._id,
    seatOrder: bookedList.length + 1,
  });
  await event.save();

  const rsvpSuccess = {
    email: user.email,
    subject: "Seat Reserved Successfully.",
    message: `Congrats, you have successfully secured your spot for the event ${event.title} !!\nYour Seat order is ${bookedList.length}. \n\nShow this email for the coordinators when you come kindly!`,
  };
  await sendEmail(rsvpSuccess);
  res.status(200).json({ message: "Seat reserved successfully." });
});
export const getMyEvents = tryCatch(async (req, res) => {
  const events = await Event.find({});
  const myEvents = events.filter((event) =>
    event?.bookedParents?.some((parent) => parent.parentID.equals(req.user._id))
  );

  if (myEvents.length == 0 || !myEvents) {
    throw new customError(404, "No events yet.");
  }
  res.status(200).json({ events: myEvents });
});
