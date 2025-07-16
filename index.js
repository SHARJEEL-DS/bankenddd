import express from "express";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from './Controllers/passport.js';  
import session from 'express-session'; 
import authRoutes from './Routes/auth.js'; 
import userRoutes from "./Routes/user.js";

import bodyParser from 'body-parser';
import taskRoutes from "./Routes/taskRoutes.js"; // Make sure .js is added if you're using ES modules

dotenv.config();

const app = express();
const Port = process.env.Port || 8000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
const corsOptions = {
  // origin: "https://putko-main.vercel.app", // Uncomment for deployment
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Session and Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log("MongoDB is connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
};

// Test Route
app.get('/', (req, res) => {
  res.json({ message: "API is working" });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.use('/api', taskRoutes);

// Start the server
app.listen(Port, () => {
  connectDB();
  console.log("Server is running on port " + Port);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
