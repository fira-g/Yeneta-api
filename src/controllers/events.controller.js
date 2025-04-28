import Event from "../models/events.model.js";
import customError from "../utils/customError.js";
import sendEmail from "../utils/sendEmail.js";
import { tryCatch } from "../utils/tryCatch.js";
import { validateCreateEvent } from "../validators/events.validator.js";

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

  const newEvent = new Event({
    title,
    description,
    dueDate,
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
    throw customError(400, "All seats are taken");
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
