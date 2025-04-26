import express from "express";
import {
  createEvent,
  getEvents,
  rsvp,
} from "../controllers/events.controller.js";
import { protectRout } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createEvent);
router.post("/:eventId/rsvp", protectRout, rsvp);

export default router;
