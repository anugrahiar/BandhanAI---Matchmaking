import Notes from '../components/Notes';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [aiScores, setAiScores] = useState({});
  const [loadingAI, setLoadingAI] = useState({});
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    axios.get(`http://localhost:5000/api/profiles/${id}`, { headers }).then(r => setProfile(r.data));
    axios.get(`http://localhost:5000/api/matches/${id}`, { headers }).then(r => setMatches(r.data));
  }, [id, token]);

  async function getAIScore(match) {
    if (aiScores[match.id]) return;
    setLoadingAI(prev => ({ ...prev, [match.id]: true }));
    try {
      const res = await axios.post('http://localhost:5000/api/matches/ai-score', {
        client: profile, candidate: match
      }, { headers: { Authorization: `Bearer ${token}` } });
      setAiScores(prev => ({ ...prev, [match.id]: res.data.explanation }));
    } catch {
      setAiScores(prev => ({ ...prev, [match.id]: 'AI analysis unavailable.' }));
    }
    setLoadingAI(prev => ({ ...prev, [match.id]: false }));
  }

  if (!profile) return <div style={{ padding:'2rem' }}>Loading...</div>;

  const field = (label, value) => value !== undefined && value !== null && value !== '' ? (
    <div style={{ marginBottom:'0.5rem' }}>
      <span style={{ fontSize:'0.78rem', color:'#9ca3af', display:'block' }}>{label}</span>
      <span style={{ fontWeight:500 }}>{value}</span>
    </div>
  ) : null;

  const getAge = dob => new Date().getFullYear() - new Date(dob).getFullYear();
  const fmtIncome = v => v ? `₹${(v/100000).toFixed(1)}L/yr` : '-';

  return (
    <div style={{ minHeight:'100vh', background:'#f9fafb' }}>

     
      <div style={{ background:'white', padding:'1rem 2rem', borderBottom:'1px solid #e5e7eb', display:'flex', alignItems:'center', gap:'1rem' }}>
        <button onClick={() => navigate('/dashboard')} style={{ padding:'0.4rem 0.8rem', border:'1px solid #d1d5db', borderRadius:'8px', background:'white', cursor:'pointer' }}>← Back</button>
        <h1 style={{ margin:0, fontSize:'1.1rem', fontWeight:600 }}>{profile.firstName} {profile.lastName}</h1>
        <span style={{
          marginLeft:'0.5rem', fontSize:'0.75rem', padding:'0.2rem 0.75rem',
          borderRadius:'20px', fontWeight:600,
          background: profile.status==='Active'?'#d1fae5': profile.status==='Matched'?'#dbeafe':'#fef3c7',
          color: profile.status==='Active'?'#065f46': profile.status==='Matched'?'#1e3a8a':'#92400e'
        }}>
          {profile.status}
        </span>
      </div>

      <div style={{ padding:'2rem' }}>

        
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>

         
          <div style={{ background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', padding:'1.5rem' }}>
            <h2 style={{ marginTop:0, marginBottom:'1.25rem', fontSize:'1rem', color:'#be185d' }}>Profile Details</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 1rem' }}>
              {field('First Name', profile.firstName)}
              {field('Last Name', profile.lastName)}
              {field('Gender', profile.gender)}
              {field('Age', `${getAge(profile.dateOfBirth)} years`)}
              {field('Date of Birth', profile.dateOfBirth)}
              {field('City', profile.city)}
              {field('Country', profile.country)}
              {field('Height', `${profile.height} cm`)}
              {field('Marital Status', profile.maritalStatus)}
              {field('Religion', profile.religion)}
              {field('Caste', profile.caste)}
              {field('Email', profile.email)}
              {field('Phone', profile.phone)}
              {field('College', profile.ugCollege)}
              {field('Degree', profile.degree)}
              {field('Company', profile.company)}
              {field('Designation', profile.designation)}
              {field('Income', fmtIncome(profile.income))}
              {field('Languages', Array.isArray(profile.languages) ? profile.languages.join(', ') : profile.languages)}
              {field('Siblings', String(profile.siblings))}
              {field('Family Type', profile.familyType)}
              {field('Diet', profile.diet)}
              {field('Smoke', profile.smoke)}
              {field('Drink', profile.drink)}
              {field('Want Kids', profile.wantKids)}
              {field('Open to Relocate', profile.openToRelocate)}
              {field('Open to Pets', profile.openToPets)}
              {field('Manglik', profile.manglik ? 'Yes' : 'No')}
              {field('Complexion', profile.complexion)}
              {field('Hobbies', Array.isArray(profile.hobbies) ? profile.hobbies.join(', ') : profile.hobbies)}
            </div>
            {profile.about && (
              <p style={{ marginTop:'1rem', color:'#6b7280', fontSize:'0.9rem', fontStyle:'italic' }}>
                "{profile.about}"
              </p>
            )}
          </div>

          
          <div style={{ background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', padding:'1.5rem' }}>
            <h2 style={{ marginTop:0, marginBottom:'1.25rem', fontSize:'1rem', color:'#be185d' }}>Suggested Matches</h2>
            {matches.length === 0 && (
              <p style={{ color:'#9ca3af', fontSize:'0.9rem' }}>No matches found.</p>
            )}
            {matches.map(m => (
              <div key={m.id} style={{ border:'1px solid #e5e7eb', borderRadius:'10px', padding:'1rem', marginBottom:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <p style={{ margin:0, fontWeight:600 }}>{m.firstName} {m.lastName}</p>
                    <p style={{ margin:'0.2rem 0', fontSize:'0.82rem', color:'#6b7280' }}>{getAge(m.dateOfBirth)} yrs • {m.city} • {m.designation}</p>
                    <p style={{ margin:'0.2rem 0', fontSize:'0.82rem', color:'#6b7280' }}>{m.religion} • {fmtIncome(m.income)}</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:'1.4rem', fontWeight:700, color: m.matchScore >= 70 ? '#059669' : m.matchScore >= 45 ? '#d97706' : '#6b7280' }}>
                      {m.matchScore}
                    </div>
                    <span style={{
                      fontSize:'0.72rem', padding:'0.1rem 0.5rem', borderRadius:'12px', fontWeight:600,
                      background: m.matchLabel==='High Potential'?'#d1fae5': m.matchLabel==='Good Match'?'#fef3c7':'#f3f4f6',
                      color: m.matchLabel==='High Potential'?'#065f46': m.matchLabel==='Good Match'?'#92400e':'#374151'
                    }}>
                      {m.matchLabel}
                    </span>
                  </div>
                </div>

               
                <div style={{ marginTop:'0.5rem', display:'flex', flexWrap:'wrap', gap:'0.3rem' }}>
                  {m.matchReasons.map(r => (
                    <span key={r} style={{ fontSize:'0.7rem', padding:'0.15rem 0.5rem', background:'#fce7f3', color:'#9d174d', borderRadius:'12px' }}>
                      {r}
                    </span>
                  ))}
                </div>

                
                {aiScores[m.id] && (
                  <p style={{ marginTop:'0.5rem', fontSize:'0.8rem', color:'#374151', background:'#fdf2f8', padding:'0.5rem', borderRadius:'8px', margin:'0.5rem 0 0' }}>
                    🤖 {aiScores[m.id]}
                  </p>
                )}

                
                <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.75rem' }}>
                  <button
                    onClick={() => getAIScore(m)}
                    disabled={loadingAI[m.id] || !!aiScores[m.id]}
                    style={{
                      flex:1, padding:'0.4rem', fontSize:'0.8rem',
                      border:'1px solid #f9a8d4', borderRadius:'6px',
                      background: aiScores[m.id] ? '#fdf2f8' : 'white',
                      color:'#be185d', cursor: aiScores[m.id] ? 'default' : 'pointer'
                    }}>
                    {loadingAI[m.id] ? 'Analysing...' : aiScores[m.id] ? '✅ Scored' : '🤖 AI Score'}
                  </button>
                  <button
                    onClick={() => setModal(m)}
                    style={{ flex:1, padding:'0.4rem', fontSize:'0.8rem', border:'none', borderRadius:'6px', background:'#be185d', color:'white', cursor:'pointer' }}>
                    Send Match ✉️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

   
        <div style={{ marginTop:'1.5rem' }}>
          <Notes profileId={id} />
        </div>

      </div>

      
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
          <div style={{ background:'white', borderRadius:'16px', padding:'2rem', width:'440px', maxWidth:'90vw' }}>
            <h2 style={{ marginTop:0 }}>Send Match</h2>
            <p style={{ color:'#6b7280', fontSize:'0.9rem' }}>You're about to introduce:</p>
            <div style={{ background:'#fdf2f8', borderRadius:'10px', padding:'1rem', marginBottom:'1rem' }}>
              <p style={{ margin:'0 0 0.25rem', fontWeight:600 }}>{profile.firstName} {profile.lastName}</p>
              <p style={{ margin:0, fontSize:'0.85rem', color:'#6b7280' }}>↕️</p>
              <p style={{ margin:'0.25rem 0 0', fontWeight:600 }}>{modal.firstName} {modal.lastName}</p>
              <p style={{ margin:'0.25rem 0 0', fontSize:'0.82rem', color:'#6b7280' }}>{modal.city} • {modal.designation} • Match score: {modal.matchScore}</p>
            </div>
            <p style={{ fontSize:'0.85rem', color:'#374151' }}>
              A match email will be sent to <strong>{profile.email}</strong> and <strong>{modal.email}</strong> with each other's basic profile.
            </p>
            <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.25rem' }}>
              <button
                onClick={() => setModal(null)}
                style={{ flex:1, padding:'0.6rem', border:'1px solid #d1d5db', borderRadius:'8px', background:'white', cursor:'pointer' }}>
                Cancel
              </button>
              <button
                onClick={() => { alert(`✅ Match sent! ${profile.firstName} & ${modal.firstName} have been introduced.`); setModal(null); }}
                style={{ flex:1, padding:'0.6rem', border:'none', borderRadius:'8px', background:'#be185d', color:'white', fontWeight:600, cursor:'pointer' }}>
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}