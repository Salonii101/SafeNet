
import express from "express";
import fileUploadController from "../controllers/file.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ dest: "temp/" });

router.post("/api/files/", upload.single("file"), fileUploadController);


export default router;
