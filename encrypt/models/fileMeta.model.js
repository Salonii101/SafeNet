const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },         // original file name
  storedName: { type: String, required: true },       // encrypted/random name on disk
  size: { type: Number, required: true },             // in bytes
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // uploader
  path: { type: String, required: true },             // local or cloud storage path
  mimeType: { type: String, required: true },         // e.g. image/png, application/pdf
  isEncrypted: { type: Boolean, default: false },
  expiryDate: { type: Date },                         // optional: auto delete
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema);
