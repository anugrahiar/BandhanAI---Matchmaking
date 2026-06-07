import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Notes({ profileId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/notes/${profileId}`, { headers })
      .then(r => setNotes(r.data.notes))
      .catch(() => {});
  }, [profileId]);

  async function addNote() {
    if (!text.trim()) return;
    setSaving(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/notes/${profileId}`
,
        { text },
        { headers }
      );
      setNotes(prev => [res.data, ...prev]);
      setText('');
    } catch {}
    setSaving(false);
  }

  async function deleteNote(noteId) {
    try {
     axios.delete(`${process.env.REACT_APP_API_URL}/api/notes/${profileId}/${noteId}`
,
        { headers }
      );
      setNotes(prev => prev.filter(n => n.id !== noteId));
    } catch {}
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div style={{ background:'white', borderRadius:'12px', border:'1px solid #e5e7eb', padding:'1.5rem', marginTop:'1.5rem' }}>
      <h2 style={{ marginTop:0, marginBottom:'1.25rem', fontSize:'1rem', color:'#be185d' }}>
        📝 Matchmaker Notes
      </h2>

      
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', marginBottom:'1.5rem' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a note from your meeting or call..."
          rows={3}
          style={{
            width:'100%', padding:'0.75rem', border:'1px solid #d1d5db',
            borderRadius:'8px', fontSize:'0.9rem', resize:'vertical',
            fontFamily:'inherit', boxSizing:'border-box',
            outline:'none'
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.ctrlKey) addNote();
          }}
        />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:'0.75rem', color:'#9ca3af' }}>Ctrl + Enter to save</span>
          <button
            onClick={addNote}
            disabled={saving || !text.trim()}
            style={{
              padding:'0.5rem 1.25rem', background: saving || !text.trim() ? '#e5e7eb' : '#be185d',
              color: saving || !text.trim() ? '#9ca3af' : 'white',
              border:'none', borderRadius:'8px', cursor: saving || !text.trim() ? 'not-allowed' : 'pointer',
              fontWeight:600, fontSize:'0.85rem', transition:'all 0.2s'
            }}>
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>

      
      {notes.length === 0 ? (
        <div style={{ textAlign:'center', padding:'2rem', color:'#9ca3af', fontSize:'0.9rem', background:'#f9fafb', borderRadius:'8px' }}>
          No notes yet. Add your first note above.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {notes.map(note => (
            <div key={note.id} style={{
              background:'#fdf2f8', borderRadius:'10px', padding:'1rem',
              borderLeft:'3px solid #be185d', position:'relative'
            }}>
              <p style={{ margin:'0 0 0.5rem', fontSize:'0.9rem', color:'#1f2937', lineHeight:1.6 }}>
                {note.text}
              </p>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'0.75rem', color:'#6b7280' }}>
                  🕐 {formatDate(note.createdAt)} · {note.author}
                </span>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{
                    background:'none', border:'none', cursor:'pointer',
                    color:'#ef4444', fontSize:'0.75rem', padding:'0.2rem 0.5rem',
                    borderRadius:'4px'
                  }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}