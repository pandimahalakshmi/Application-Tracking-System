import { useState } from 'react';
import { Box, TextField, Button, Typography, Card } from '@mui/material';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const C = {
  bg:      '#F0F4FF',
  card:    '#FFFFFF',
  border:  '#E2E5F0',
  primary: '#5B5BD6',
  secondary:'#7C3AED',
  text:    '#111827',
  muted:   '#6B7280',
};
const BASE = API_BASE_URL;

const fSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#F7F8FC', color: C.text,
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.primary },
    '&.Mui-focused fieldset': { borderColor: C.primary, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: C.muted },
  '& .MuiInputLabel-root.Mui-focused': { color: C.primary },
  '& input': { color: C.text },
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
        setError(d.error || 'Failed to send reset email. Please try again.');
        if (d.devResetUrl) console.log('Dev reset URL:', d.devResetUrl);
      }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh',
      background:`radial-gradient(ellipse at 20% 30%, ${C.primary}14 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, ${C.secondary}10 0%, transparent 55%), ${C.bg}`,
      fontFamily:"'Poppins', sans-serif" }}>
      <Card elevation={0} sx={{ p:{ xs:3, sm:4 }, width:'100%', maxWidth:420,
        background: C.card, border:`1px solid ${C.border}`, borderRadius:3,
        boxShadow:'0 16px 48px rgba(91,91,214,0.12), 0 3px 12px rgba(0,0,0,0.06)' }}>

        {sent ? (
          <Box sx={{ textAlign:'center', py:2 }}>
            <Box sx={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}18`,
              display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:2 }}>
              <Send size={28} color={C.primary}/>
            </Box>
            <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1, fontFamily:'inherit' }}>
              Check your email
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:14, mb:3, fontFamily:'inherit' }}>
              We sent a password reset link to{' '}
              <strong style={{ color: C.text }}>{email}</strong>
            </Typography>
            <Button onClick={() => navigate('/login')}
              sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontFamily:'inherit' }}>
              Back to Login
            </Button>
          </Box>
        ) : (
          <>
            <Button startIcon={<ArrowLeft size={16}/>} onClick={() => navigate('/login')}
              sx={{ color: C.muted, textTransform:'none', mb:2.5, p:0, fontFamily:'inherit',
                '&:hover':{ color: C.primary, background:'transparent' } }}>
              Back
            </Button>

            <Typography variant="h5" sx={{ fontWeight:700, color: C.text, mb:0.5, fontFamily:'inherit' }}>
              Forgot Password
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:13.5, mb:3, fontFamily:'inherit' }}>
              Enter your email to receive a reset link
            </Typography>

            <TextField fullWidth label="Email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              sx={fSx}
              InputProps={{ startAdornment: <Mail size={16} color={C.muted} style={{ marginRight:8 }}/> }}/>

            {error && (
              <Box sx={{ mb:2, p:1.5, borderRadius:2,
                background:'#FEF2F2', border:'1px solid rgba(220,38,38,0.2)' }}>
                <Typography sx={{ color:'#DC2626', fontSize:13, fontFamily:'inherit' }}>{error}</Typography>
              </Box>
            )}

            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
              sx={{ py:1.4, borderRadius:50, fontWeight:700, textTransform:'none', fontFamily:'inherit',
                fontSize:14, letterSpacing:0.3,
                background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                boxShadow:`0 5px 18px ${C.primary}44`,
                '&:hover':{ boxShadow:`0 8px 24px ${C.primary}55`, transform:'translateY(-1px)' },
                '&:disabled':{ opacity:0.7 } }}>
              {loading ? 'Sending…' : 'Send Reset Link'}
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
}
