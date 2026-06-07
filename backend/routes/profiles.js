const express = require('express');
const jwt = require('jsonwebtoken');
const profiles = require('../data/profiles.json');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}


router.get('/', auth, (req, res) => {
  const myProfiles = profiles.filter(p => p.assignedMatchmaker === req.user.name.toLowerCase().replace(' ', '') || true);
  res.json(myProfiles);
});


router.get('/:id', auth, (req, res) => {
  const profile = profiles.find(p => p.id === req.params.id);
  if (!profile) return res.status(404).json({ message: 'Not found' });
  res.json(profile);
});

module.exports = router;