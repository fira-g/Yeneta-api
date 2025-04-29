import mongoose from "mongoose";
import Parent from "./parent.model.js";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minlength: [20, "minimum of 20 charachters are expected"],
    },
    dueDate: {
      type: Date,
      required: true,
    },
    attendanceCapacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
    },
    image: {
      type: String,
    },
    bookedParents: [
      {
        parentID: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Parent,
        },
        seatOrder: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", eventSchema);
export default Event;
