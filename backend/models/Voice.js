const mongoose = require('mongoose');

const voiceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  // We can use the MongoDB _id as the voiceId, or keep the client-generated one if we want to preserve that logic.
  // The client generates a timestamp-based ID. Let's keep a separate 'id' field to match the frontend logic for now.
  id: {
    type: String,
    required: true
  },
  text: String,
  translation: String,
  isCustom: {
    type: Boolean,
    default: false
  },
  downloadURL: String, // URL to the file
  filePath: String, // Local path on server
  type: String,
  name: String,
  size: Number,
  lastModified: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Voice', voiceSchema);
