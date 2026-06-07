const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('Groq key loaded:', !!process.env.GROQ_API_KEY);

const app = express();
// app.use(cors());

app.use(cors({
  origin: ['http://localhost:3000', 'https://bandhan-ai-matchmaking-h2ox.vercel.app'],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/notes', require('./routes/notes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));