import Student from "../models/student.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

export const registerStudentForEvent = async (req, res) => {
  try {
    const { studentId, eventId } = req.body;

    const student = await Student.findById(studentId);
    const event = await Event.findById(eventId);

    if (!student || !event) {
      return res.status(404).json({ error: "Student or Event not found" });
    }

    const alreadyRegistered = await Registration.findOne({ student: studentId, event: eventId });
    if (alreadyRegistered) {
      return res.status(400).json({ error: "Student already registered for this event" });
    }

    const registration = new Registration({
      student: studentId,
      event: eventId,
    });
    await registration.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `Registration Confirmed for ${event.title}`,
      text: `Hello ${student.name},\n\nYou have successfully registered for "${event.title}" on ${event.date.toDateString()} at ${event.venue}.\n\nBest Regards,\nEvent Team`,
    });

    res.status(201).json({ message: "Registration successful", registration });
  } catch (err) {
    console.error("Error in registration:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registrations = await Registration.find({ event: eventId })
      .populate("student", "name email year")
      .populate("event", "title date venue");

    if (registrations.length === 0) {
      return res.status(404).json({ message: "No registrations found for this event" });
    }

    res.json(registrations);
  } catch (err) {
    console.error("Error fetching registrations:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
