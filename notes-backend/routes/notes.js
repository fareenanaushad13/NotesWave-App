// const express = require('express');
// const Note = require('../models/Note');
// const authMiddleware = require('../middleware/auth');

// const router = express.Router();

// // Get all notes of logged-in user
// router.get('/', authMiddleware, async (req, res) => {
//   try {
//     const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
//     res.json(notes);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Add a new note
// router.post('/', authMiddleware, async (req, res) => {
//   try {
//     const newNote = new Note({
//       user: req.user,
//       title: req.body.title,
//       content: req.body.content,
//     });

//     const savedNote = await newNote.save();
//     res.status(201).json(savedNote);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Update a note
// router.put('/:id', authMiddleware, async (req, res) => {
//   try {
//     const note = await Note.findOne({ _id: req.params.id, user: req.user });
//     if (!note) return res.status(404).json({ message: "Note not found" });

//     note.title = req.body.title;
//     note.content = req.body.content;
//     const updatedNote = await note.save();

//     res.json(updatedNote);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Delete a note
// router.delete('/:id', authMiddleware, async (req, res) => {
//   try {
//     const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
//     if (!note) return res.status(404).json({ message: "Note not found" });

//     res.json({ message: "Note deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/auth');
const jwt = require('jsonwebtoken');

const router = express.Router();

const SECRET = process.env.JWT_SECRET || 'default_secret';

// Helper functions
const encrypt = (text) => {
  return jwt.sign({ data: text }, SECRET);
};

const decrypt = (token) => {
  const decoded = jwt.verify(token, SECRET);
  return decoded.data;
};

// GET all notes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });

    const decryptedNotes = notes.map(note => {
      try {
        return {
          ...note.toObject(),
          title: decrypt(note.title),
          content: decrypt(note.content),
        };
      } catch (err) {
        console.error(`Decryption failed for note ${note._id}:`, err);
        return {
          ...note.toObject(),
          title: 'Decryption failed',
          content: 'Decryption failed',
        };
      }
    });

    res.json(decryptedNotes);
  } catch (err) {
    console.error("GET /notes server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new note
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newNote = new Note({
      user: req.user,
      title: encrypt(req.body.title),
      content: encrypt(req.body.content),
    });

    const savedNote = await newNote.save();

    // Send back decrypted for immediate UI update
    res.status(201).json({
      ...savedNote.toObject(),
      title: req.body.title,
      content: req.body.content
    });
  } catch (err) {
    console.error("POST /notes server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update a note
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.title = encrypt(req.body.title);
    note.content = encrypt(req.body.content);
    const updatedNote = await note.save();

    res.json({
      ...updatedNote.toObject(),
      title: req.body.title,
      content: req.body.content
    });
  } catch (err) {
    console.error("PUT /notes server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a note
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("DELETE /notes server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
