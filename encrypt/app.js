const express = require('express') ;
const bcrypt = require('bcrypt') ;
const mongoose = require('mongoose') ;
const multer = require('multer') ;
const jsonwebtoken = require('jsonwebtoken') ;
const dotenv = require('dotenv') ;
const fileRoutes = require('./routes/file.route') ;

dotenv.config() ;

const app = express() ;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", fileRoutes);

// ===================== Health Check =====================
app.get("/", (req, res) => {
  res.send("✅ SafeNET server is running");
});



module.exports = app ;
