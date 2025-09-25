const fs = require("fs");
const path = require("path");
const s3 = require("../config/aws.config"); // AWS v3 S3Client
const File = require("../models/fileMeta.model");
const { encryptFile } = require("../utils/encrypt.util");

const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const fileUploadController = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const file = req.file;
    const tempFilePath = file.path;
    encryptFile(tempFilePath, process.env.ENCRYPT_PASSWORD);

    const encryptedFilePath = tempFilePath + ".enc";
    const encryptedBuffer = fs.readFileSync(encryptedFilePath);

    const s3Key = `${Date.now()}-${file.originalname}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: encryptedBuffer,
      ACL: "private",
    });

    await s3.send(putCommand); 


    const savedFile = await File.create({
    filename: s3Key,
    path: `s3://${process.env.S3_BUCKET}/${s3Key}`, // or keep local temp path if needed
    originalName: file.originalname,
    storedName: s3Key,
    size: file.size,
    mimeType: file.mimetype,
    s3Url: `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
    uploader: req.user?.id || "demoUser",
  });



    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(encryptedFilePath);

    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3, getCommand, { expiresIn: 300 });

    return res.json({
      message: "✅ File uploaded & encrypted successfully",
      file: savedFile,
      downloadUrl: signedUrl,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "File upload failed" });
  }
};

module.exports = fileUploadController;
