// config/aws.js
require("dotenv").config();
const { S3Client } = require("@aws-sdk/client-s3");

require('dotenv').config() ;

console.log(process.env.AWS_REGION) ;

// Create an S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

module.exports = s3;
