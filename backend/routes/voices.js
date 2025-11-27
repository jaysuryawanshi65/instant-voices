const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Voice = require('../models/Voice');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Get all voices (global - visible to everyone)
router.get('/', async (req, res) => {
  try {
    // Fetch ALL voices regardless of userId to make them global
    const voices = await Voice.find({});
    
    // Convert array to object keyed by id (to match Firebase structure expected by frontend)
    const voicesMap = {};
    voices.forEach(voice => {
      voicesMap[voice.id] = voice;
    });

    res.json(voicesMap);
  } catch (error) {
    console.error('Error fetching voices:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create/Upload a voice
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { userId, id, text, translation, isCustom, name, type, size, lastModified } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    let audioData = '';

    if (req.file) {
      // Read file and convert to base64 for MongoDB storage
      const fileBuffer = fs.readFileSync(req.file.path);
      const base64Audio = fileBuffer.toString('base64');
      audioData = `data:${req.file.mimetype};base64,${base64Audio}`;
      
      // Delete the temporary file since we're storing in DB
      fs.unlinkSync(req.file.path);
    }

    // Check if voice exists (search by id only since voices are global)
    let voice = await Voice.findOne({ id });

    if (voice) {
      // Update existing voice
      voice.text = text;
      voice.translation = translation;
      voice.userId = userId;
      if (req.file) {
        voice.downloadURL = audioData;
        voice.type = type;
        voice.name = name;
        voice.size = size;
        voice.lastModified = lastModified;
      }
      voice.updatedAt = Date.now();
    } else {
      // Create new voice
      voice = new Voice({
        userId,
        id,
        text,
        translation,
        isCustom: isCustom === 'true' || isCustom === true,
        downloadURL: audioData,
        filePath: '',
        name,
        type,
        size,
        lastModified
      });
    }

    await voice.save();
    res.json(voice);
  } catch (error) {
    console.error('Error saving voice:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a voice (global - anyone can delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const voice = await Voice.findOneAndDelete({ id });

    if (!voice) {
      return res.status(404).json({ error: 'Voice not found' });
    }

    // No file deletion needed since we store in MongoDB as base64

    res.json({ message: 'Voice deleted successfully' });
  } catch (error) {
    console.error('Error deleting voice:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
