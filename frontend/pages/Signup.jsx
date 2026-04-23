import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem, InputAdornment, IconButton, Grid } from "@mui/material";
import { Briefcase, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authService } from "../services/api";

const C = {
  bg: '#0F172A', surface: '#1E293B', border: '#334155',
  primary: '#6366F1', secondary: '#8B5CF6',
  text: '#F1F5F9', muted: '#94A3B8',
};

// Label always shrunk above the field — prevents overlap with startAdornment icon
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    background: '#0F172A',
    color: '#F1F5F9',
    fontSize: '0.9rem',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: '#94A3B8',
    fontSize: '0.875rem',
    '&.MuiInputLabel-shrink': { color: '#94A3B8', transform: 'translate(14px, -9px) scale(0.75)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
  '& .MuiSelect-icon': { color: '#94A3B8' },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px #0F172A inset',
    WebkitTextFillColor: '#F1F5F9',
    caretColor: '#F1F5F9',
  },
};

const menuProps = {
  PaperProps: {
    sx: {
      background: '#1E293B', border: '1px solid #334155',
      '& .MuiMenuItem-root': {
        color: '#F1F5F9', fontSize: '0.875rem',
        '&:hover': { background: 'rgba(99,102,241,0.15)' },
      },
    },
  },
};

const genderOptions = [
  { value: 'male',   label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other',  label: 'Other' },
];

// Shared InputLabelProps — always shrunk so label sits above, never over the icon
const shrinkLabel = { shrink: true };

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', gender: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCp, setShowCp]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const signup = async () => {
    const { name, email, password, confirmPassword, phoneNumber, gender } = form;
    if (!name || !email || !password || !confirmPassword || !phoneNumber || !gender) {
      setError('Please fill in all fields'); return;
    }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const result = await authService.signup(form);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('role', result.user.role);
        navigate(result.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else {
        setError(result.error || 'Signup failed');
      }
    } catch {
      setError('Connection error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .signup-form { animation: fadeUp 0.4s ease; }
      `}</style>

      {/* Left decorative panel — desktop only */}
      <Box sx={{
        flex: 1, display: { xs: 'none', md: 'flex' },
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        background: `linear-gradient(135deg,${C.primary}22,${C.secondary}11)`,
        borderRight: `1px solid ${C.border}`, p: 6,
      }}>
        <Box sx={{ animation: 'float 4s ease-in-out infinite', mb: 4 }}>
          <Box sx={{
            width: 80, height: 80, borderRadius: 20,
            background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 16px 48px ${C.primary}44`,
          }}>
            <Briefcase size={40} color="#fff" />
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 800, color: C.text, fontSize: '2rem', textAlign: 'center', mb: 1 }}>
          Join RecruitHub
        </Typography>
        <Typography sx={{ color: C.primary, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', mb: 2, letterSpacing: 1 }}>
          Connect. Hire. Grow.
        </Typography>
        <Typography sx={{ color: C.muted, textAlign: 'center', maxWidth: 300, lineHeight: 1.8, fontSize: '0.95rem' }}>
          Create your account and start your journey to your dream job
        </Typography>
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
          {['✓ Track all your applications', '✓ Get interview notifications', '✓ Build your profile'].map(s => (
            <Box key={s} sx={{ p: 2, borderRadius: 2, background: C.surface, border: `1px solid ${C.border}` }}>
              <Typography sx={{ color: C.text, fontSize: '0.875rem' }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1, display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'center',
        p: { xs: '24px 16px', sm: '40px 32px' },
        overflowY: 'auto', minHeight: '100vh',
      }}>
        <Box className="signup-form" sx={{ width: '100%', maxWidth: { xs: '100%', sm: 440 }, py: { xs: 1, sm: 0 } }}>

          {/* Mobile logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: 13,
              background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 8px 24px ${C.primary}44`,
            }}>
              <Briefcase size={26} color="#fff" />
            </Box>
          </Box>

          <Box sx={{ mb: 3, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography sx={{
              fontWeight: 800, color: C.text, mb: 0.5, lineHeight: 1.25,
              fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.875rem' },
            }}>
              Create Account
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: { xs: '0.82rem', sm: '0.9rem' } }}>
              Fill in your details to get started
            </Typography>
          </Box>

          {/* Fields — consistent spacing via Grid */}
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Full Name"
                value={form.name} onChange={e => set('name', e.target.value)}
                placeholder="John Doe"
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><User size={16} color={C.muted} /></InputAdornment> } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth label="Email" type="email"
                value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Mail size={16} color={C.muted} /></InputAdornment> } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Password"
                type={showPw ? 'text' : 'password'}
                value={form.password} onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Lock size={16} color={C.muted} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPw(p => !p)} size="small" sx={{ color: C.muted, p: '5px' }}>
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Confirm Password"
                type={showCp ? 'text' : 'password'}
                value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start"><Lock size={16} color={C.muted} /></InputAdornment>,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCp(p => !p)} size="small" sx={{ color: C.muted, p: '5px' }}>
                          {showCp ? <EyeOff size={15} /> : <Eye size={15} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Phone Number"
                value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
                placeholder="+1 234 567 8900"
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><Phone size={16} color={C.muted} /></InputAdornment> } }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select fullWidth label="Gender"
                value={form.gender} onChange={e => set('gender', e.target.value)}
                InputLabelProps={shrinkLabel} sx={fieldSx}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><User size={16} color={C.muted} /></InputAdornment> } }}
                SelectProps={{ MenuProps: menuProps }}
              >
                {genderOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </TextField>
            </Grid>

          </Grid>

          {error && (
            <Box sx={{ mt: 2, p: 1.5, borderRadius: 2, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <Typography sx={{ color: '#F87171', fontSize: '0.8rem' }}>{error}</Typography>
            </Box>
          )}

          <Button
            fullWidth onClick={signup} disabled={loading}
            endIcon={<ArrowRight size={16} />}
            sx={{
              mt: 2.5, py: { xs: 1.25, sm: 1.5 },
              borderRadius: 2, fontWeight: 700,
              fontSize: { xs: '0.875rem', sm: '0.95rem' },
              textTransform: 'none',
              background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
              color: '#fff', minHeight: 48,
              boxShadow: `0 4px 20px ${C.primary}44`,
              transition: 'all 0.2s',
              '&:hover': { transform: 'translateY(-1px)', boxShadow: `0 8px 28px ${C.primary}66` },
              '&:disabled': { opacity: 0.6 },
            }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          <Typography sx={{
            textAlign: 'center', mt: 2.5,
            color: C.muted, fontSize: { xs: '0.82rem', sm: '0.875rem' },
          }}>
            Already have an account?{' '}
            <Box component="span" onClick={() => navigate('/')}
              sx={{ color: C.primary, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Sign In
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
