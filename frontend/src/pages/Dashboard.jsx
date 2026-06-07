import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const STATUS_COLORS = {
  'Active':   { bg:'#d1fae5', color:'#065f46' },
  'Matched':  { bg:'#fce7f3', color:'#9d174d' },
  'On Hold':  { bg:'#fef3c7', color:'#92400e' },
};

const GENDER_ICON = { 'Male': '👨', 'Female': '👩' };

export default function Dashboard() {
  const [profiles, setProfiles]   = useState([]);
  const [search, setSearch]       = useState('');
  const [filterGender, setFilterGender] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const navigate = useNavigate();
  const name  = localStorage.getItem('name');
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/profiles`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setProfiles(r.data));
  }, [token]);

  function getAge(dob) {
    return new Date().getFullYear() - new Date(dob).getFullYear();
  }

  function logout() {
    localStorage.clear();
    navigate('/');
  }

  const filtered = profiles.filter(p => {
    const matchSearch = `${p.firstName} ${p.lastName} ${p.city} ${p.designation}`
      .toLowerCase().includes(search.toLowerCase());
    const matchGender = filterGender === 'All' || p.gender === filterGender;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchGender && matchStatus;
  });

  
  const total   = profiles.length;
  const active  = profiles.filter(p => p.status === 'Active').length;
  const matched = profiles.filter(p => p.status === 'Matched').length;
  const onHold  = profiles.filter(p => p.status === 'On Hold').length;

  return (
    <div style={{ minHeight:'100vh', background:'#fff5f7' }}>

      <div style={{
        background:'white', padding:'0.85rem 2rem',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        borderBottom:'2px solid #fce7f3',
        boxShadow:'0 2px 12px rgba(190,24,93,0.06)'
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <span style={{ fontSize:'1.6rem' }}>💍</span>
          <div>
            <h1 style={{ margin:0, fontSize:'1.15rem', fontWeight:700, color:'#be185d' }}>BandhanAI</h1>
            <p style={{ margin:0, fontSize:'0.75rem', color:'#9ca3af' }}>Matchmaker Dashboard</p>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
          <div style={{ textAlign:'right' }}>
            <p style={{ margin:0, fontSize:'0.82rem', fontWeight:600, color:'#1f2937' }}>{name}</p>
            <p style={{ margin:0, fontSize:'0.72rem', color:'#9ca3af' }}>Senior Matchmaker</p>
          </div>
          <div style={{
            width:'36px', height:'36px', borderRadius:'50%',
            background:'linear-gradient(135deg, #be185d, #9d174d)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'white', fontWeight:700, fontSize:'0.9rem'
          }}>
            {name?.charAt(0)}
          </div>
          <button onClick={logout} style={{
            padding:'0.4rem 1rem', border:'1.5px solid #fce7f3',
            borderRadius:'8px', background:'white', cursor:'pointer',
            color:'#be185d', fontSize:'0.82rem', fontWeight:600
          }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ padding:'2rem' }}>

        
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'2rem' }}>
          {[
            { label:'Total Clients',  value: total,   icon:'👥', bg:'#fdf2f8', color:'#be185d' },
            { label:'Active',         value: active,  icon:'✅', bg:'#d1fae5', color:'#065f46' },
            { label:'Matched',        value: matched, icon:'💍', bg:'#fce7f3', color:'#9d174d' },
            { label:'On Hold',        value: onHold,  icon:'⏸️', bg:'#fef3c7', color:'#92400e' },
          ].map(s => (
            <div key={s.label} style={{
              background:'white', borderRadius:'14px', padding:'1.25rem 1.5rem',
              border:`1px solid ${s.bg}`,
              boxShadow:'0 2px 8px rgba(190,24,93,0.05)',
              display:'flex', alignItems:'center', gap:'1rem'
            }}>
              <div style={{
                width:'44px', height:'44px', borderRadius:'12px',
                background:s.bg, display:'flex', alignItems:'center',
                justifyContent:'center', fontSize:'1.3rem'
              }}>
                {s.icon}
              </div>
              <div>
                <p style={{ margin:0, fontSize:'1.6rem', fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</p>
                <p style={{ margin:'0.2rem 0 0', fontSize:'0.78rem', color:'#9ca3af' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        
        <div style={{
          display:'flex', justifyContent:'space-between', alignItems:'center',
          marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem'
        }}>
          <div>
            <h2 style={{ margin:0, fontSize:'1.05rem', fontWeight:700, color:'#1f2937' }}>
              My Clients
              <span style={{
                marginLeft:'0.5rem', fontSize:'0.78rem', fontWeight:600,
                background:'#fce7f3', color:'#be185d',
                padding:'0.15rem 0.6rem', borderRadius:'20px'
              }}>
                {filtered.length} shown
              </span>
            </h2>
          </div>

          <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', flexWrap:'wrap' }}>
            
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'0.7rem', top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:'0.9rem' }}>🔍</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, city, role..."
                style={{
                  padding:'0.5rem 0.85rem 0.5rem 2.2rem',
                  border:'1.5px solid #fce7f3', borderRadius:'10px',
                  width:'220px', fontSize:'0.85rem', outline:'none'
                }}
                onFocus={e => e.target.style.borderColor='#be185d'}
                onBlur={e => e.target.style.borderColor='#fce7f3'}
              />
            </div>

           
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              style={{
                padding:'0.5rem 0.85rem', border:'1.5px solid #fce7f3',
                borderRadius:'10px', fontSize:'0.85rem', background:'white',
                color:'#374151', cursor:'pointer', outline:'none'
              }}>
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

          
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              style={{
                padding:'0.5rem 0.85rem', border:'1.5px solid #fce7f3',
                borderRadius:'10px', fontSize:'0.85rem', background:'white',
                color:'#374151', cursor:'pointer', outline:'none'
              }}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Matched">Matched</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

      
        <div style={{
          background:'white', borderRadius:'16px',
          border:'1px solid #fce7f3', overflow:'hidden',
          boxShadow:'0 4px 16px rgba(190,24,93,0.06)'
        }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'linear-gradient(135deg, #fff1f2, #fdf2f8)', borderBottom:'2px solid #fce7f3' }}>
                {['Client', 'Age', 'City', 'Gender', 'Designation', 'Marital Status', 'Status', ''].map(h => (
                  <th key={h} style={{
                    padding:'0.85rem 1rem', textAlign:'left',
                    fontSize:'0.78rem', color:'#be185d', fontWeight:700,
                    letterSpacing:'0.3px', textTransform:'uppercase'
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding:'3rem', textAlign:'center', color:'#9ca3af', fontSize:'0.9rem' }}>
                    No clients found matching your search.
                  </td>
                </tr>
              )}
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  style={{ borderBottom:'1px solid #fff1f2', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fff5f7'}
                  onMouseLeave={e => e.currentTarget.style.background='white'}
                >
                 
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{
                        width:'34px', height:'34px', borderRadius:'50%',
                        background:`linear-gradient(135deg, ${i % 2 === 0 ? '#fce7f3, #be185d' : '#fff1f2, #9d174d'})`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:'0.8rem', fontWeight:700, color:'white', flexShrink:0
                      }}>
                        {p.firstName?.charAt(0)}{p.lastName?.charAt(0)}
                      </div>
                      <span style={{ fontWeight:600, fontSize:'0.9rem', color:'#1f2937' }}>
                        {p.firstName} {p.lastName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding:'0.85rem 1rem', color:'#6b7280', fontSize:'0.88rem' }}>{getAge(p.dateOfBirth)}</td>
                  <td style={{ padding:'0.85rem 1rem', color:'#6b7280', fontSize:'0.88rem' }}>📍 {p.city}</td>
                  <td style={{ padding:'0.85rem 1rem', fontSize:'0.88rem' }}>
                    {GENDER_ICON[p.gender]} {p.gender}
                  </td>
                  <td style={{ padding:'0.85rem 1rem', color:'#6b7280', fontSize:'0.85rem' }}>{p.designation}</td>
                  <td style={{ padding:'0.85rem 1rem', color:'#6b7280', fontSize:'0.85rem' }}>{p.maritalStatus}</td>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <span style={{
                      padding:'0.25rem 0.7rem', borderRadius:'20px',
                      fontSize:'0.72rem', fontWeight:700,
                      ...(STATUS_COLORS[p.status] || {})
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding:'0.85rem 1rem' }}>
                    <button
                      onClick={() => navigate(`/profile/${p.id}`)}
                      style={{
                        padding:'0.35rem 0.9rem', background:'#be185d',
                        color:'white', border:'none', borderRadius:'8px',
                        cursor:'pointer', fontSize:'0.8rem', fontWeight:600,
                        transition:'background 0.2s'
                      }}
                      onMouseEnter={e => e.target.style.background='#9d174d'}
                      onMouseLeave={e => e.target.style.background='#be185d'}
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <p style={{ textAlign:'center', marginTop:'2rem', fontSize:'0.78rem', color:'#d1d5db' }}>
          BandhanAI · Smart Matchmaking Platform · {new Date().getFullYear()}
        </p>

      </div>
    </div>
  );
}