import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbConfig.js';
import cors from 'cors';
import eventRoutes from "./routes/eventRoutes.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.use("/api/students", studentRoutes);
connectDB();
app.listen(port, () => {
  console.log(`Server running on ${port}`);
});