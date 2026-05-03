import { useState } from 'react';
import { Box, TextField, Button, Typography, Card } from '@mui/material';
import { Mail, ArrowLeft, Send, Link, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const C = {
  bg:       '#F0F4FF',
  card:     '#FFFFFF',
  border:   '#D1D9F0',
  primary:  '#5B5BD6',
  secondary:'#7C3AED',
  text:     '#111827',
  muted:    '#4B5563',
  success:  '#059669',
};
const BASE = API_BASE_URL;

const fSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#F0F4FF', color: C.text,
    '& fieldset': { borderColor: C.border },
    '&:hover fieldset': { borderColor: C.primary },
    '&.Mui-focused fieldset': { borderColor: C.primary, borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: C.muted },
  '& .MuiInputLabel-root.Mui-focused': { color: C.primary },
  '& input': { color: C.text },
};

export default function ForgotPassword() {
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resetUrl, setResetUrl] = useState('');
  const [error, setError]       = useState('');

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
        setEmailSent(d.emailSent !== false);
        if (d.resetUrl) setResetUrl(d.resetUrl);
      } else {
        setError(d.error || 'Failed to send reset email. Please try again.');
      }
    } catch { setError('Network error. Please check your connection.'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh',
      background:`radial-gradient(ellipse at 20% 30%, ${C.primary}14 0%, transparent 55%),
                  radial-gradient(ellipse at 80% 70%, ${C.secondary}10 0%, transparent 55%),
                  ${C.bg}`,
      fontFamily:"'Poppins', sans-serif", p:2 }}>

      <Card elevation={0} sx={{ p:{ xs:3, sm:4 }, width:'100%', maxWidth:440,
        background: C.card, border:`1px solid ${C.border}`, borderRadius:3,
        boxShadow:'0 16px 48px rgba(91,91,214,0.12), 0 3px 12px rgba(0,0,0,0.06)' }}>

        {/* ── SUCCESS: email sent ── */}
        {sent && emailSent && (
          <Box sx={{ textAlign:'center', py:2 }}>
            <Box sx={{ width:64, height:64, borderRadius:'50%', background:`${C.primary}18`,
              display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:2 }}>
              <Send size={28} color={C.primary}/>
            </Box>
            <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>
              Check your email
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:14, mb:3, lineHeight:1.6 }}>
              We sent a password reset link to{' '}
              <strong style={{ color: C.text }}>{email}</strong>.
              <br/>The link expires in 24 hours.
            </Typography>
            <Button onClick={() => navigate('/login')} variant="contained"
              sx={{ borderRadius:50, textTransform:'none', fontWeight:700,
                background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                boxShadow:`0 5px 18px ${C.primary}44`, px:4 }}>
              Back to Login
            </Button>
          </Box>
        )}

        {/* ── SUCCESS: email not configured — show direct link ── */}
        {sent && !emailSent && (
          <Box sx={{ textAlign:'center', py:1 }}>
            <Box sx={{ width:64, height:64, borderRadius:'50%', background:`${C.success}15`,
              display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:2 }}>
              <CheckCircle2 size={28} color={C.success}/>
            </Box>
            <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>
              Reset Link Ready
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:13.5, mb:3, lineHeight:1.6 }}>
              Email service is not configured on the server. Click the button below to reset your password directly.
            </Typography>
            <Button fullWidth variant="contained" onClick={() => window.location.href = resetUrl}
              sx={{ borderRadius:50, textTransform:'none', fontWeight:700, mb:2, py:1.4,
                background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                boxShadow:`0 5px 18px ${C.primary}44`,
                '&:hover':{ transform:'translateY(-1px)' } }}>
              Reset My Password →
            </Button>
            <Box sx={{ p:1.5, borderRadius:2, background:'#F0F4FF', border:`1px solid ${C.border}`, mb:2 }}>
              <Typography sx={{ color: C.muted, fontSize:11, mb:0.5, fontWeight:600 }}>Or copy this link:</Typography>
              <Typography sx={{ color: C.primary, fontSize:11, wordBreak:'break-all', cursor:'pointer',
                '&:hover':{ textDecoration:'underline' } }}
                onClick={() => { navigator.clipboard.writeText(resetUrl); }}>
                {resetUrl}
              </Typography>
            </Box>
            <Button onClick={() => navigate('/login')}
              sx={{ color: C.muted, textTransform:'none', fontSize:13 }}>
              Back to Login
            </Button>
          </Box>
        )}

        {/* ── FORM ── */}
        {!sent && (
          <>
            <Button startIcon={<ArrowLeft size={16}/>} onClick={() => navigate('/login')}
              sx={{ color: C.muted, textTransform:'none', mb:2.5, p:0,
                '&:hover':{ color: C.primary, background:'transparent' } }}>
              Back
            </Button>

            <Typography variant="h5" sx={{ fontWeight:700, color: C.text, mb:0.5 }}>
              Forgot Password
            </Typography>
            <Typography sx={{ color: C.muted, fontSize:13.5, mb:3 }}>
              Enter your email to receive a reset link
            </Typography>

            <TextField fullWidth label="Email" type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              sx={fSx}
              InputProps={{ startAdornment: <Mail size={16} color={C.muted} style={{ marginRight:8 }}/> }}/>

            {error && (
              <Box sx={{ mb:2, p:1.5, borderRadius:2,
                background:'rgba(220,38,38,0.07)', border:'1px solid rgba(220,38,38,0.2)' }}>
                <Typography sx={{ color:'#DC2626', fontSize:13 }}>{error}</Typography>
              </Box>
            )}

            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
              sx={{ py:1.4, borderRadius:50, fontWeight:700, textTransform:'none',
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
