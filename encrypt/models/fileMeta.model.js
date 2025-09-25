
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },         
  storedName: { type: String, required: true },       
  size: { type: Number, required: true },             
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  path: { type: String, required: true },             
  mimeType: { type: String, required: true },         
  isEncrypted: { type: Boolean, default: false },
  expiryDate: { type: Date },                         
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("File", fileSchema);
