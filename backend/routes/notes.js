require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const NOTES_FILE = path.join(__dirname, '../data/notes.json');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
}

function readNotes() {
  try { return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8')); }
  catch { return {}; }
}

function writeNotes(data) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
}


router.get('/:profileId', auth, (req, res) => {
  const notes = readNotes();
  res.json({ notes: notes[req.params.profileId] || [] });
});


router.post('/:profileId', auth, (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ message: 'Note text required' });

  const notes = readNotes();
  if (!notes[req.params.profileId]) notes[req.params.profileId] = [];

  const newNote = {
    id: Date.now().toString(),
    text: text.trim(),
    author: req.user.name,
    createdAt: new Date().toISOString()
  };

  notes[req.params.profileId].unshift(newNote);
  writeNotes(notes);
  res.json(newNote);
});


router.delete('/:profileId/:noteId', auth, (req, res) => {
  const notes = readNotes();
  if (!notes[req.params.profileId]) return res.status(404).json({ message: 'Not found' });
  notes[req.params.profileId] = notes[req.params.profileId].filter(n => n.id !== req.params.noteId);
  writeNotes(notes);
  res.json({ message: 'Deleted' });
});

module.exports = router;