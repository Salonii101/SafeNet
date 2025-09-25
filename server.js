import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth/routes/authRouter.js";   
import encryptRoutes from "./encrypt/routes/file.route.js"; 

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/encrypt", encryptRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(" MongoDB connected"))
  .catch(err => console.error(" MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
