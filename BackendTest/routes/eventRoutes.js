import express from "express";
import { createEvent, getEvents, updateEvent, deleteEvent } from "../controller/eventController.js";



const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
