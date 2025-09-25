// controllers/scanController.js
import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";

/**
 * POST /api/scan/file
 * Uploads a file to VirusTotal and returns analysis
 */
export const scanFile = catchAsyncErrors(async (req, res, next) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const filePath = req.file.path;
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath), req.file.originalname);

  try {
    const resp = await axios.post("https://www.virustotal.com/api/v3/files", form, {
      headers: {
        ...form.getHeaders(),
        "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        accept: "application/json",
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    // Cleanup temp file
    fs.unlink(filePath, (err) => {
      if (err) console.error("File cleanup failed:", err.message);
    });

    return res.status(200).json(resp.data);
  } catch (err) {
    fs.unlink(filePath, () => {});
    console.error("VirusTotal Error:", err?.response?.data || err.message);
    return res.status(500).json({
      error: "VirusTotal file upload error",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * POST /api/scan/url
 * Sends a URL to VirusTotal for scanning
 */
export const scanUrl = catchAsyncErrors(async (req, res, next) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Missing url in body" });

  const form = new FormData();
  form.append("url", url);

  try {
    const resp = await axios.post("https://www.virustotal.com/api/v3/urls", form, {
      headers: {
        ...form.getHeaders(),
        "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        accept: "application/json",
      },
    });

    return res.status(200).json(resp.data);
  } catch (err) {
    console.error("VirusTotal URL scan error:", err?.response?.data || err.message);
    return res.status(500).json({
      error: "VirusTotal URL scan error",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * GET /api/scan/analysis/:id
 * Fetches analysis results from VirusTotal by ID
 */
export const getAnalysis = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  try {
    const resp = await axios.get(`https://www.virustotal.com/api/v3/analyses/${id}`, {
      headers: {
        "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        accept: "application/json",
      },
    });

    return res.status(200).json(resp.data);
  } catch (err) {
    console.error("VirusTotal analysis fetch error:", err?.response?.data || err.message);
    return res.status(500).json({
      error: "Error fetching VirusTotal analysis",
      details: err?.response?.data || err.message,
    });
  }
});

/**
 * POST /api/scan/ai
 * Sends input to Hugging Face AI model
 */
export const aiInference = catchAsyncErrors(async (req, res, next) => {
  const { model, input } = req.body;
  if (!model || !input)
    return res.status(400).json({ error: "Both model and input are required" });

  try {
    const resp = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: input },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 60000, // 1 minute timeout
      }
    );

    return res.status(200).json(resp.data);
  } catch (err) {
    console.error("Hugging Face AI error:", err?.response?.data || err.message);
    return res.status(500).json({
      error: "AI model call failed",
      details: err?.response?.data || err.message,
    });
  }
});
