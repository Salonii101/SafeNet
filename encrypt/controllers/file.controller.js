import fs from "fs";
import path from "path";
import s3 from "../config/aws.config.js"; 
import File from "../models/fileMeta.model.js";
import { encryptFile } from "../utils/encrypt.util.js";

import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const fileUploadController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const tempFilePath = file.path;

    // Encrypt file
    encryptFile(tempFilePath, process.env.ENCRYPT_PASSWORD);

    const encryptedFilePath = tempFilePath + ".enc";
    const encryptedBuffer = fs.readFileSync(encryptedFilePath);

    const s3Key = `${Date.now()}-${file.originalname}`;

    // Upload encrypted file to S3
    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: encryptedBuffer,
      ACL: "private",
    });

    await s3.send(putCommand);

    // Save file metadata in DB
    const savedFile = await File.create({
      filename: s3Key,
      path: `s3://${process.env.S3_BUCKET}/${s3Key}`,
      originalName: file.originalname,
      storedName: s3Key,
      size: file.size,
      mimeType: file.mimetype,
      s3Url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
      uploader: req.user?.id || "demoUser",
    });

    // Delete temp files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(encryptedFilePath);

    // Generate signed URL
    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 300 });

    return res.json({
      message: "File uploaded & encrypted successfully",
      file: savedFile,
      downloadUrl: signedUrl,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "File upload failed" });
  }
};

export default fileUploadController;
