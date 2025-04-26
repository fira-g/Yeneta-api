import Event from "../models/events.model.js";
import sendEmail from "../services/sendEmail.js";

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ dueDate: 1 });
    if (events.length == 0 || !events) {
      return res.status(404).json({ messages: "No event found" });
    }
    res.json({ events: events });
  } catch (error) {
    console.log("Error in getEvents controller", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const createEvent = async (req, res) => {
  const { title, description, dueDate, attendanceCapacity } = req.body;
  try {
    if (!title || !description || !dueDate || !attendanceCapacity) {
      return res
        .status(400)
        .json({ message: "All required feilds must be filled." });
    }
    const newEvent = new Event({
      title,
      description,
      dueDate,
      attendanceCapacity,
    });
    if (newEvent) {
      await newEvent.save();
    } else {
      return res.status(400).json({ message: "Invalid data input" });
    }
    res
      .status(201)
      .json({ message: "Event created successfully.", event: newEvent });
  } catch (error) {}
};

export const rsvp = async (req, res) => {
  const user = req.user;

  try {
    const event = await Event.findById(req.params.eventId);
    const bookedList = event.bookedParents;
    if (!(event.attendanceCapacity > bookedList.length)) {
      return res.status(400).json({ message: "Sorry, all seats are taken." });
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
  } catch (error) {
    console.log("Error in RSVP controller", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
