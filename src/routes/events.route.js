import express from "express";
import {
  createEvent,
  getEvents,
  rsvp,
} from "../controllers/events.controller.js";
import { isPremium, protectRout } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", protectRout, isPremium, createEvent);
router.post("/:eventId/rsvp", protectRout, rsvp);

export default router;
