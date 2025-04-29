import express from "express";
import {
  createEvent,
  getEvents,
  getMyEvents,
  rsvp,
} from "../controllers/events.controller.js";
import { isPremium, protectRout } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/myEvents", protectRout, getMyEvents);
router.post("/", protectRout, isPremium, upload.single("image"), createEvent);
router.post("/:eventId/rsvp", protectRout, rsvp);

export default router;
