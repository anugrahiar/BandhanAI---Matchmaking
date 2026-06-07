const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const USERS = [
  { id: 1, username: 'matchmaker1', password: 'tdc@123', name: 'Anugrah Rai' },
  { id: 2, username: 'matchmaker2', password: 'tdc@456', name: 'Arjun Mehta' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, name: user.name });
});

module.exports = router;