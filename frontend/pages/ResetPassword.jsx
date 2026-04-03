import { useState } from 'react';
import { Box, TextField, Button, Typography, Card, InputAdornment, IconButton } from '@mui/material';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', text:'#F1F5F9', muted:'#94A3B8' };
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fSx = {
  mb:2,
  '& .MuiOutlinedInput-root':{ borderRadius:2, background: C.bg, color: C.text, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary, borderWidth:2 } },
  '& .MuiInputLabel-root':{ color: C.muted },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
};

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  const handleSubmit = async () => {
    if (!password || password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const d = await r.json();
      d.success ? setSuccess(true) : setError(d.error || 'Reset failed');
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background: C.bg }}>
      <Card sx={{ p:4, width:'100%', maxWidth:420, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        {success ? (
          <Box sx={{ textAlign:'center', py:2 }}>
            <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:1 }}>Password Reset!</Typography>
            <Typography sx={{ color: C.muted, mb:3 }}>Your password has been updated successfully.</Typography>
            <Button variant="contained" onClick={() => navigate('/')}
              sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow:'none' }}>
              Go to Login
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight:700, color: C.text, mb:0.5 }}>Reset Password</Typography>
            <Typography sx={{ color: C.muted, fontSize:14, mb:3 }}>Enter your new password</Typography>
            <TextField fullWidth label="New Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} sx={fSx}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock size={18} color={C.muted}/></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(p => !p)} size="small" sx={{ color: C.muted }}>{showPw ? <EyeOff size={16}/> : <Eye size={16}/>}</IconButton></InputAdornment>,
              }} />
            <TextField fullWidth label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} sx={fSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><Lock size={18} color={C.muted}/></InputAdornment> }} />
            {error && <Box sx={{ mb:2, p:1.5, borderRadius:2, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)' }}><Typography sx={{ color:'#F87171', fontSize:13 }}>{error}</Typography></Box>}
            <Button fullWidth variant="contained" onClick={handleSubmit} disabled={loading}
              sx={{ py:1.5, borderRadius:2, fontWeight:700, textTransform:'none', background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow:'none' }}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </Button>
          </>
        )}
      </Card>
    </Box>
  );
}
