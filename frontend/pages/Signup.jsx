import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, TextField, Button, Typography, MenuItem, InputAdornment, IconButton, Grid } from "@mui/material";
import { Briefcase, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authService } from "../services/api";

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', text:'#F1F5F9', muted:'#94A3B8' };

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#0F172A', color: '#F1F5F9',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#94A3B8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
  '& .MuiSelect-icon': { color: '#94A3B8' },
  '& .MuiMenuItem-root': { background: '#1E293B' },
};

const genderOptions = [
  { value:'male',   label:'Male' },
  { value:'female', label:'Female' },
  { value:'other',  label:'Other' },
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name:'', email:'', password:'', confirmPassword:'', phoneNumber:'', gender:'' });
  const [showPw, setShowPw]   = useState(false);
  const [showCp, setShowCp]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

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
    <Box sx={{ display:'flex', minHeight:'100vh', background: C.bg }}>
      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .signup-form { animation: fadeUp 0.5s ease; }
      `}</style>

      {/* Left decorative panel */}
      <Box sx={{ flex:1, display:{ xs:'none', md:'flex' }, flexDirection:'column', justifyContent:'center', alignItems:'center',
        background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)`,
        borderRight:`1px solid ${C.border}`, p:6 }}>
        <Box sx={{ animation:'float 4s ease-in-out infinite', mb:4 }}>
          <Box sx={{ width:80, height:80, borderRadius:20, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 16px 48px ${C.primary}44` }}>
            <Briefcase size={40} color="#fff" />
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight:800, color: C.text, textAlign:'center', mb:2 }}>Join ATS System</Typography>
        <Typography sx={{ color: C.muted, textAlign:'center', maxWidth:300, lineHeight:1.8 }}>
          Create your account and start your journey to your dream job
        </Typography>
        <Box sx={{ mt:6, display:'flex', flexDirection:'column', gap:2, width:'100%', maxWidth:280 }}>
          {['✓ Track all your applications','✓ Get interview notifications','✓ Build your profile'].map(s => (
            <Box key={s} sx={{ display:'flex', alignItems:'center', gap:2, p:2, borderRadius:2,
              background: C.surface, border:`1px solid ${C.border}` }}>
              <Typography sx={{ color: C.text, fontSize:14 }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', p:4, overflowY:'auto' }}>
        <Box className="signup-form" sx={{ width:'100%', maxWidth:440 }}>
          <Box sx={{ mb:4 }}>
            <Typography variant="h4" sx={{ fontWeight:800, color: C.text, mb:1 }}>Create Account</Typography>
            <Typography sx={{ color: C.muted }}>Fill in your details to get started</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={e => handleChange('name', e.target.value)} sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color={C.muted}/></InputAdornment> }} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color={C.muted}/></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => handleChange('password', e.target.value)} sx={fieldSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock size={18} color={C.muted}/></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPw(p => !p)} size="small" sx={{ color: C.muted }}>{showPw ? <EyeOff size={16}/> : <Eye size={16}/>}</IconButton></InputAdornment>,
                }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Confirm Password" type={showCp ? 'text' : 'password'} value={form.confirmPassword} onChange={e => handleChange('confirmPassword', e.target.value)} sx={fieldSx}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock size={18} color={C.muted}/></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowCp(p => !p)} size="small" sx={{ color: C.muted }}>{showCp ? <EyeOff size={16}/> : <Eye size={16}/>}</IconButton></InputAdornment>,
                }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" value={form.phoneNumber} onChange={e => handleChange('phoneNumber', e.target.value)} sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Phone size={18} color={C.muted}/></InputAdornment> }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField select fullWidth label="Gender" value={form.gender} onChange={e => handleChange('gender', e.target.value)} sx={fieldSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><User size={18} color={C.muted}/></InputAdornment> }}
                SelectProps={{ MenuProps: { PaperProps: { sx: { background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } } }}>
                {genderOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          {error && (
            <Box sx={{ mt:2, p:1.5, borderRadius:2, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)' }}>
              <Typography sx={{ color:'#F87171', fontSize:13 }}>{error}</Typography>
            </Box>
          )}

          <Button fullWidth onClick={signup} disabled={loading} endIcon={<ArrowRight size={18}/>}
            sx={{ mt:3, py:1.5, borderRadius:2, fontWeight:700, fontSize:16, textTransform:'none',
              background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              color:'#fff', boxShadow:`0 4px 24px ${C.primary}44`,
              transition:'all 0.2s', '&:hover':{ transform:'translateY(-1px)', boxShadow:`0 8px 32px ${C.primary}66` },
              '&:disabled':{ opacity:0.6 } }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>

          <Typography sx={{ textAlign:'center', mt:3, color: C.muted, fontSize:14 }}>
            Already have an account?{' '}
            <Box component="span" onClick={() => navigate('/')}
              sx={{ color: C.primary, fontWeight:700, cursor:'pointer', '&:hover':{ textDecoration:'underline' } }}>
              Sign In
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
