import express from "express";
import { createStudent, getStudents } from "../controller/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);

export default router;