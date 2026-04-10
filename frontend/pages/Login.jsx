import { useState } from "react";
import { useNavigat from "react";
import { authService } from "../services/api";
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase } from "lucide-react";

const C = {
  bg:      '#0F172A',
  surface: '#1E293B',
  border:  '#334155',
  primary: '#6366F1',
  secondary:'#8B5CF6',
  text:    '#F1F5F9',
  muted:   '#94A3B8',
  danger:  '#F87171',
};

const Input = ({ icon: Icon, type = 'text', placeholder, value, onChange, right }) => (
  <div style={{ position:'relative', marginBottom:12 }}>
    <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color: C.muted, display:'flex' }}>
      <Icon size={16}/>
    </div>
    <input
      type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{
        width:'100%', padding:'11px 40px 11px 38px', borderRadius:8,
        background: C.bg, border:`1px solid ${C.border}`,
        color: C.text, fontSize:14, outline:'none', boxSizing:'border-box',
        transition:'border-color 0.2s',
      }}
      onFocus={e => e.target.style.borderColor = C.primary}
      onBlur={e => e.target.style.borderColor = C.border}
    />
    {right && <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)' }}>{right}</div>}
  </div>
);

const SocialBtn = ({ label, color, children }) => (
  <button titesult = await authService.login(email, password);
      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('role', result.user.role);
        navigate(result.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else {
        setError(result.error || 'Login failed');
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
        .login-card { animation: fadeUp 0.5s ease; }
      `}</style>

      {/* Left panel */}
      <Box sx={{ flex:1, display:{ xs:'none', md:'flex' }, flexDirection:'column', justifyContent:'center', alignItems:'center',
        background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)`,
        borderRight:`1px solid ${C.border}`, p:6 }}>
        <Box sx={{ animation:'float 4s ease-in-out infinite', mb:4 }}>
          <Box sx={{ width:80, height:80, borderRadius:20, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
            display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 16px 48px ${C.primary}44` }}>
            <Briefcase size={40} color="#fff" />
          </Box>
        </Box>
        <Typography variant="h3" sx={{ fontWeight:800, color: C.text, textAlign:'center', mb:2 }}>
          ATS System
        </Typography>
        <Typography sx={{ color: C.muted, textAlign:'center', maxWidth:320, lineHeight:1.8 }}>
          Streamline your hiring process with our modern Applicant Tracking System
        </Typography>
        <Box sx={{ mt:6, display:'flex', gap:3 }}>
          {['248 Candidates','32 Jobs','18 Hired'].map(s => (
            <Box key={s} sx={{ textAlign:'center', p:2, borderRadius:2, background:`${C.surface}`, border:`1px solid ${C.border}` }}>
              <Typography sx={{ color: C.text, fontWeight:700, fontSize:18 }}>{s.split(' ')[0]}</Typography>
              <Typography sx={{ color: C.muted, fontSize:12 }}>{s.split(' ')[1]}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', p:4 }}>
        <Box className="login-card" sx={{ width:'100%', maxWidth:420 }}>
          <Box sx={{ mb:4 }}>
            <Typography variant="h4" sx={{ fontWeight:800, color: C.text, mb:1 }}>Welcome back</Typography>
            <Typography sx={{ color: C.muted }}>Sign in to your account to continue</Typography>
          </Box>

          <TextField fullWidth label="Email" type="email" value={email}
            onChange={e => setEmail(e.target.value)} sx={fieldSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={18} color={C.muted} /></InputAdornment> }} />

          <TextField fullWidth label="Password" type={showPw ? 'text' : 'password'} value={password}
            onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} sx={fieldSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Lock size={18} color={C.muted} /></InputAdornment>,
              endAdornment: <InputAdornment position="end">
                <IconButton onClick={() => setShowPw(p => !p)} size="small" sx={{ color: C.muted }}>
                  {showPw ? <EyeOff size={18}/> : <Eye size={18}/>}
                </IconButton>
              </InputAdornment>,
            }} />

          {error && (
            <Box sx={{ mb:2, p:1.5, borderRadius:2, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)' }}>
              <Typography sx={{ color:'#F87171', fontSize:13 }}>{error}</Typography>
            </Box>
          )}

          <Button fullWidth onClick={login} disabled={loading} endIcon={<ArrowRight size={18}/>}
            sx={{ py:1.5, borderRadius:2, fontWeight:700, fontSize:16, textTransform:'none',
              background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              color:'#fff', boxShadow:`0 4px 24px ${C.primary}44`,
              transition:'all 0.2s', '&:hover':{ transform:'translateY(-1px)', boxShadow:`0 8px 32px ${C.primary}66` },
              '&:disabled':{ opacity:0.6 } }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>

          <Typography sx={{ textAlign:'center', mt:3, color: C.muted, fontSize:14 }}>
            Don't have an account?{' '}
            <Box component="span" onClick={() => navigate('/signup')}
              sx={{ color: C.primary, fontWeight:700, cursor:'pointer', '&:hover':{ textDecoration:'underline' } }}>
              Sign Up
            </Box>
          </Typography>
          <Typography sx={{ textAlign:'center', mt:1.5, color: C.muted, fontSize:13 }}>
            <Box component="span" onClick={() => navigate('/forgot-password')}
              sx={{ color: C.muted, cursor:'pointer', '&:hover':{ color: C.primary, textDecoration:'underline' } }}>
              Forgot your password?
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
