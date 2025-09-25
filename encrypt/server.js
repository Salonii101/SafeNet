
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js"; 

dotenv.config();

console.log("Dev Environment");

mongoose
  .connect(process.env.MONGODB_CONNECTION_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 3300, () => {
      console.log("Everything running perfectly");
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
