// routes/scanRouter.js

import express from "express";
import multer from "multer";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  scanFile,
  scanUrl,
  getAnalysis,
  aiInference,
} from "../controllers/scanController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage for uploaded files

// ✅ File scan (requires login)
router.post("/file", isAuthenticated, upload.single("file"), scanFile);

// ✅ URL scan (requires login)
router.post("/url", isAuthenticated, scanUrl);

// ✅ Fetch analysis results (requires login)
router.get("/analysis/:id", isAuthenticated, getAnalysis);

// ✅ AI model inference (requires login)
router.post("/ai", isAuthenticated, aiInference);

export default router;
