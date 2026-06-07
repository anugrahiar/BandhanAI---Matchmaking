import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!form.username || !form.password) {
      setError('Please enter both username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch {
      setError('Invalid username or password');
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #fce7f3 100%)'
    }}>

     
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '900px',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(190,24,93,0.12)'
      }}>

       
        <div style={{
          flex: 1,
          background: 'linear-gradient(160deg, #be185d 0%, #9d174d 60%, #831843 100%)',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minWidth: '280px'
        }}>
          
          <div>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💍</div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'white' }}>BandhanAI</h1>
            <p style={{ margin: '0.5rem 0 0', color: '#fce7f3', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Smart matchmaking,<br />powered by AI
            </p>
          </div>

          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { icon: '🤖', text: 'AI-powered match scoring' },
              { icon: '👥', text: 'Manage 100+ client profiles' },
              { icon: '💌', text: 'One-click match introductions' },
              { icon: '📝', text: 'Private matchmaker notes' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{f.icon}</span>
                <span style={{ color: '#fce7f3', fontSize: '0.85rem' }}>{f.text}</span>
              </div>
            ))}
          </div>

         
          <p style={{ margin: 0, color: '#f9a8d4', fontSize: '0.78rem' }}>
            © 2026 BandhanAI · For matchmakers only
          </p>
        </div>

        
        <div style={{
          flex: 1,
          background: 'white',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <h2 style={{ margin: '0 0 0.4rem', fontSize: '1.5rem', fontWeight: 700, color: '#1f2937' }}>
            Welcome back 👋
          </h2>
          <p style={{ margin: '0 0 2rem', color: '#9ca3af', fontSize: '0.88rem' }}>
            Sign in to your matchmaker dashboard
          </p>

          
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: '8px', padding: '0.65rem 0.85rem',
              marginBottom: '1.25rem', fontSize: '0.85rem', color: '#dc2626'
            }}>
              ⚠️ {error}
            </div>
          )}

          
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
            Username
          </label>
          <input
            value={form.username}
            onChange={e => { setForm({ ...form, username: e.target.value }); setError(''); }}
            placeholder="Enter your username"
            style={{
              display: 'block', width: '100%', padding: '0.7rem 0.85rem',
              marginBottom: '1.25rem', border: '1.5px solid #e5e7eb',
              borderRadius: '10px', boxSizing: 'border-box', fontSize: '0.95rem',
              outline: 'none', transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#be185d'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
          />

       
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.3rem' }}>
            Password
          </label>
          <input
            type="password"
            value={form.password}
            onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
            placeholder="Enter your password"
            style={{
              display: 'block', width: '100%', padding: '0.7rem 0.85rem',
              marginBottom: '1.75rem', border: '1.5px solid #e5e7eb',
              borderRadius: '10px', boxSizing: 'border-box', fontSize: '0.95rem',
              outline: 'none', transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.borderColor = '#be185d'}
            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

         
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '0.85rem',
              background: loading ? '#f9a8d4' : '#be185d',
              color: 'white', border: 'none', borderRadius: '10px',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem', letterSpacing: '0.3px', transition: 'background 0.2s'
            }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          
          <div style={{
            marginTop: '1.5rem', padding: '0.85rem 1rem',
            background: '#fdf2f8', borderRadius: '10px',
            border: '1px dashed #f9a8d4'
          }}>
            <p style={{ margin: '0 0 0.3rem', fontSize: '0.75rem', fontWeight: 600, color: '#be185d' }}>
              DEMO CREDENTIALS
            </p>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#9d174d' }}>
              Username: <strong>matchmaker1</strong>
            </p>
            <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#9d174d' }}>
              Password: <strong>tdc@123</strong>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}