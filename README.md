# 💍 BandhanAI — AI-Powered Matchmaking Dashboard

> An intelligent internal tool for professional matchmakers to manage client profiles, 
> discover compatible matches, and streamline the matchmaking journey — powered by AI.

---

## 🔗 Live Demo
- **Frontend:** (add Vercel link after deployment)
- **Backend:** (add Render link after deployment)

## 🔐 Demo Credentials
| Username | Password | Role |
|---|---|---|
| matchmaker1 | tdc@123 | Senior Matchmaker — Riya Kapoor |
| matchmaker2 | tdc@456 | Matchmaker — Arjun Mehta |

---

## 📖 Write-Up

### Tech Choices
BandhanAI is built on a React.js frontend and a Node.js + Express backend, 
communicating via a REST API. React was chosen for its component-based 
architecture which makes it easy to build reusable UI elements like profile 
cards, match tiles, and the notes panel. Node.js was selected for the backend 
because it shares the same JavaScript runtime as the frontend, making the 
codebase consistent and easy to maintain for a solo developer or small team. 
Authentication is handled via JSON Web Tokens (JWT) — a stateless, secure, 
and scalable approach that ensures only authenticated matchmakers can access 
client data. Profile data is stored in a flat JSON file to keep the stack 
simple and portable, avoiding the need for a database setup during the MVP 
phase. Groq's LLaMA 3.1 model is used for AI analysis because it offers a 
genuinely free API tier with fast inference speeds — making it the most 
practical choice for a production-ready MVP without incurring API costs.

### Matching Logic
The matching algorithm is gender-specific, reflecting real-world matrimonial 
preferences observed on platforms like Shaadi.com and BharatMatrimony. For 
male clients, the algorithm scores female candidates higher if they are 
younger, shorter, earn comparably, and share the same view on having children 
— factors that statistically drive compatibility preferences in the Indian 
matrimonial space. For female clients, the algorithm prioritizes male 
candidates who are non-smokers, come from nuclear families, are financially 
stable (at least 1.2x the client's income), and are open to relocation — 
reflecting preferences for independence, stability, and lifestyle 
compatibility. Both genders receive shared compatibility scoring on religion 
(+20 points), views on kids (+15 points), diet (+10 points), shared languages 
(+10 points), and relocation openness (+10 points). The final score is capped 
at 100 and labeled as High Potential (70+), Good Match (45–69), or Possible 
Match (below 45). The top 10 matches are returned ranked by score.

### How AI Is Used
Each suggested match card has an AI Score button that calls the Groq API 
with a structured prompt containing both profiles' key attributes — age, 
city, religion, designation, income, and views on children. The LLaMA 3.1 
model returns a 2-sentence human-readable compatibility assessment such as 
"Priya and Arjun share the same religion and dietary preferences, making 
them culturally well-aligned. Arjun's financial stability and willingness 
to relocate make him a strong long-term match for Priya." This adds a layer 
of natural language reasoning on top of the numerical score, giving 
matchmakers a quick narrative they can use when presenting matches to clients. 
The AI analysis is generated on-demand (not pre-computed) to save API calls 
and is cached in the component state so it doesn't re-fetch on re-renders.

### Assumptions Made
Several assumptions were made during development to scope the MVP 
appropriately. First, all 100 client profiles are dummy-generated using a 
Node.js script with realistic Indian names, cities, companies, and 
matrimonial attributes — in production these would come from a real database 
with verified profiles. Second, the "Send Match" feature simulates an email 
introduction via a confirmation modal and alert — a real implementation would 
integrate an email service like SendGrid or Nodemailer. Third, matchmaker 
notes are persisted to a local JSON file on the server — in production this 
would be replaced with a database like PostgreSQL or MongoDB. Fourth, the 
app currently supports two hardcoded matchmaker accounts — a real system 
would have a proper user management system with role-based access control. 
Finally, the matching logic uses a rule-based scoring system rather than 
a trained ML model — this is intentional for transparency and 
explainability, and can be upgraded to a vector similarity or collaborative 
filtering approach as data grows.

---

## 🚀 Features
- 🔐 JWT-based matchmaker login with session management
- 📊 Dashboard with stats — total, active, matched, on hold counts
- 🔍 Search and filter clients by name, city, gender, status
- 👤 Full biodata profile view with 30+ Indian matrimonial fields
- 💡 Gender-specific AI matching algorithm with scored reasons
- 🤖 On-demand Groq AI match analysis in plain English
- 💌 Send Match modal simulating email introductions
- 📝 Private matchmaker notes per client (saved to backend)
- 📱 Clean responsive UI aligned with matrimonial industry aesthetics

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | React.js | Component-based, fast dev |
| Routing | React Router DOM | Client-side navigation |
| HTTP | Axios | Clean API calls |
| Backend | Node.js + Express | Lightweight REST API |
| Auth | JSON Web Token (JWT) | Stateless, secure |
| Data | JSON files | Simple MVP storage |
| AI | Groq — LLaMA 3.1 8B | Free, fast inference |
| Styling | Inline CSS | No dependency overhead |

---

## 📁 Project Structure

\`\`\`
matchmaker/
├── backend/
│   ├── data/
│   │   ├── profiles.json        # 100 dummy profiles
│   │   ├── notes.json           # Matchmaker notes storage
│   │   └── generateProfiles.js  # Profile generation script
│   ├── routes/
│   │   ├── auth.js              # Login + JWT
│   │   ├── profiles.js          # Profile CRUD
│   │   ├── matches.js           # Matching algo + AI scoring
│   │   └── notes.js             # Notes CRUD
│   ├── .env                     # Secret keys (not in repo)
│   ├── server.js                # Express entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx         # Login screen
    │   │   ├── Dashboard.jsx     # Client list + stats
    │   │   └── Profile.jsx       # Biodata + matches + notes
    │   ├── components/
    │   │   └── Notes.jsx         # Notes component
    │   ├── App.js                # Routes
    │   └── index.js
    └── package.json
\`\`\`

---

## ⚙️ Run Locally

### Prerequisites
- Node.js v18+
- npm

### Backend
\`\`\`bash
cd backend
npm install
# Create .env file with:
# JWT_SECRET=tdc_secret_key_2025
# PORT=5000
# GROQ_API_KEY=your_groq_key_here
npm run dev
\`\`\`

### Generate Profiles (first time only)
\`\`\`bash
cd backend/data
node generateProfiles.js
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm start
\`\`\`

Open `http://localhost:3000` and login with `matchmaker1 / tdc@123`

---

## 🎯 Matching Algorithm Details

### For Male Clients
| Factor | Points |
|---|---|
| Same religion | +20 |
| Same view on kids | +15 |
| Candidate is younger | +15 |
| Compatible income | +10 |
| Compatible height | +10 |
| Open to relocate | +10 |
| Same diet | +10 |
| Shared language | +10 |

### For Female Clients
| Factor | Points |
|---|---|
| Same religion | +20 |
| Same view on kids | +15 |
| Partner financially stronger (1.2x) | +10 |
| Nuclear family | +10 |
| Partner willing to relocate | +10 |
| Same diet | +10 |
| Non-smoker | +10 |
| Shared language | +10 |
| Responsible drinker | +5 |

### Score Labels
| Score | Label |
|---|---|
| 70 and above | 🟢 High Potential |
| 45 — 69 | 🟡 Good Match |
| Below 45 | ⚪ Possible Match |

---

Made by Anugrah Rai

