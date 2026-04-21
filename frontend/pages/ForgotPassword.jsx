import { useState } from 'react';
import { Box, TextField, Button, Typography, Card } from '@mui/material';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', text:'#F1F5F9', muted:'#94A3B8' };
const BASE = API_BASE_URL;

const fSx = {
  mb:2,
  '& .MuiOutlinedInput-root':{ borderRadius:2, background: C.bg, color: C.text, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary, borderWidth:2 } },
  '& .MuiInputLabel-root':{ color: C.muted },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
  '& input:-webkit-autofill':{ WebkitBoxShadow:`0 0 0 100px ${C.bg} inset`, WebkitTextFillColor: C.text },
};

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async () => {
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${BASE}/auth/forgot-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (d.success) {
        setSent(true);
      } else {
        // Show the real error from backend
        setError(d.error || 'Failed to send reset email');
        // In dev mode, show the reset URL directly
        if (d.devResetUrl) {
          console.log('Dev reset URL:', d.devResetUrl);
          setError(`${d.error} — Check browser console for reset URL`);
        }
      }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background: C.bg }}>
      <Card sx={{ p:4, width:'100%', maxWidth:420, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        {sent ? (
          <Box sx={{ textAlign:'center', py:2 }}>
            <Box sx={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}22`, display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:2 }}>
              <Send size={28} color={C.primary}/>
            </Box>
            <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>Check your email</Typography>
            <Typography sx={{ color: C.muted, fontSize:14, mb:3 }}>We sent a password reset link to <strong style={{ color: C.text }}>{email}</strong></Typography>
            <Button onClick={() => navigate('/')} sx={{ color: C.primary, textTransform:'none' }}>Back to Login</Button>
          </Box>
        ) : (
          <>
            <Button startIcon={<ArrowLeft size={16}/>} onClick={() => navigate('/')} sx={{ color: C.muted, textTransform:'none', mb:2, p:0 }}>Back</Button>
            <Typography variant="h5" sx={{ fontWeight:700, color: C.text, mb:0.5 }}>Forgot Password</Typography>
            <Typography sx={{ color: C.muted, fontSize:14, mb:3 }}>Enter your email to receive a reset link</Typography>
            <TextField fullWidth label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()} sx={fSx}
              InputProps={{ startAdornment: <Mail size={18} color={C.muted} style={{ marginRight:8 }}/> }} />
            {error && <Box sx={{ mb:2, p:1.5, borderRadius:2, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)' }}><Typography sx={{ color:'#F87171', fontSize:13 }}>{error}</Typography></Box>}
            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
              sx={{ py:1.5, borderRadius:2, fontWeight:700, textTransform:'none', background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow:'none' }}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
}
