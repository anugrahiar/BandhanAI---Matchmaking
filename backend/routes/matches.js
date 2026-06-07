require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const profiles = require('../data/profiles.json');
const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { res.status(401).json({ message: 'Invalid token' }); }
}

function scoreMatch(client, candidate) {
  let score = 0;
  const reasons = [];

  if (client.religion === candidate.religion) { score += 20; reasons.push('Same religion'); }
  if (client.wantKids === candidate.wantKids) { score += 15; reasons.push('Same view on kids'); }
  if (client.openToRelocate === 'Yes' || candidate.openToRelocate === 'Yes') { score += 10; reasons.push('Open to relocate'); }
  if (client.diet === candidate.diet) { score += 10; reasons.push('Similar diet'); }

  const commonLangs = (client.languages || []).filter(l => (candidate.languages || []).includes(l));
  if (commonLangs.length > 0) { score += 10; reasons.push(`Speaks ${commonLangs[0]}`); }

  if (client.gender === 'Male') {
    const clientAge = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();
    const candAge = new Date().getFullYear() - new Date(candidate.dateOfBirth).getFullYear();
    if (candAge < clientAge) { score += 15; reasons.push('Younger partner'); }
    if (candidate.income <= client.income) { score += 10; reasons.push('Compatible income'); }
    if (candidate.height < client.height) { score += 10; reasons.push('Compatible height'); }
  }

  if (client.gender === 'Female') {
    if (candidate.familyType === 'Nuclear') { score += 10; reasons.push('Nuclear family'); }
    if (candidate.smoke === 'No') { score += 10; reasons.push('Non-smoker'); }
    if (candidate.drink === 'No' || candidate.drink === 'Occasionally') { score += 5; reasons.push('Responsible drinking habits'); }
    if (candidate.openToRelocate === 'Yes') { score += 10; reasons.push('Partner willing to relocate'); }
    const incomeRatio = candidate.income / (client.income || 1);
    if (incomeRatio >= 1.2) { score += 10; reasons.push('Financially strong partner'); }
  }

  const label = score >= 70 ? 'High Potential' : score >= 45 ? 'Good Match' : 'Possible Match';
  return { score: Math.min(score, 100), label, reasons };
}


router.post('/ai-score', auth, async (req, res) => {
  const { client, candidate } = req.body;
  const clientAge = new Date().getFullYear() - new Date(client.dateOfBirth).getFullYear();
  const candAge = new Date().getFullYear() - new Date(candidate.dateOfBirth).getFullYear();

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 150,
      messages: [
        {
          role: 'system',
          content: 'You are an expert Indian matrimonial matchmaker. Give concise 2-sentence compatibility assessments.'
        },
        {
          role: 'user',
          content: `Assess this match:
Client: ${client.firstName}, ${clientAge} yrs, ${client.city}, ${client.religion}, ${client.designation}, income ₹${(client.income/100000).toFixed(1)}L, wants kids: ${client.wantKids}, diet: ${client.diet}
Candidate: ${candidate.firstName}, ${candAge} yrs, ${candidate.city}, ${candidate.religion}, ${candidate.designation}, income ₹${(candidate.income/100000).toFixed(1)}L, wants kids: ${candidate.wantKids}, diet: ${candidate.diet}

Give a 2-sentence compatibility assessment.`
        }
      ]
    });

    const text = completion.choices[0].message.content;
    res.json({ explanation: text });

  } catch (err) {
    console.error('Groq error:', err.message);
    res.status(500).json({ explanation: 'AI analysis unavailable.' });
  }
});


router.get('/:clientId', auth, (req, res) => {
  const client = profiles.find(p => p.id === req.params.clientId);
  if (!client) return res.status(404).json({ message: 'Client not found' });

  const oppositeGender = client.gender === 'Male' ? 'Female' : 'Male';
  const pool = profiles.filter(p => p.gender === oppositeGender);

  const matches = pool.map(candidate => {
    const { score, label, reasons } = scoreMatch(client, candidate);
    return { ...candidate, matchScore: score, matchLabel: label, matchReasons: reasons };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

  res.json(matches);
});

module.exports = router;