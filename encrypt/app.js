// server.js
import express from "express";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import multer from "multer";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import fileRoutes from "./routes/file.route.js"; 

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", fileRoutes);

// ===================== Health Check =====================
app.get("/", (req, res) => {
  res.send("SafeNET server is running");
});

export default app; 
