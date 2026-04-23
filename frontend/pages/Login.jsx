import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Link } from "@mui/material";
import { Eye, EyeOff, Mail, Lock, Briefcase, ArrowRight } from "lucide-react";

const C = {
  bg: '#0F172A', surface: '#1E293B', border: '#334155',
  primary: '#6366F1', secondary: '#8B5CF6',
  text: '#F1F5F9', muted: '#94A3B8', danger: '#F87171',
};

// Label is placed ABOVE the input (variant="filled" style via shrink)
// Using InputLabelProps shrink + notched keeps label always above, never overlapping icon
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
  // Keep label always shrunk (above the field) so it never clashes with the icon
  '& .MuiInputLabel-root': {
    color: '#94A3B8',
    fontSize: '0.875rem',
    '&.MuiInputLabel-shrink': { color: '#94A3B8', transform: 'translate(14px, -9px) scale(0.75)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: '0 0 0 100px #0F172A inset',
    WebkitTextFillColor: '#F1F5F9',
    caretColor: '#F1F5F9',
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const login = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    try {
      setLoading(true); setError("");
      const result = await authService.login(email, password);
      if (result.success) {
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("role", result.user.role);
        navigate(result.user.role === "admin" ? "/dashboard" : "/userdashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch {
      setError("Connection error. Backend not running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') login(); };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: C.bg }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>

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
        <Typography sx={{ color: C.text, fontWeight: 800, fontSize: '2rem', textAlign: 'center', mb: 1 }}>
          RecruitHub
        </Typography>
        <Typography sx={{ color: C.primary, fontWeight: 600, fontSize: '0.9rem', textAlign: 'center', mb: 2, letterSpacing: 1 }}>
          Connect. Hire. Grow.
        </Typography>
        <Typography sx={{ color: C.muted, textAlign: 'center', maxWidth: 300, lineHeight: 1.8, fontSize: '0.95rem' }}>
          Streamline your hiring process with our modern Applicant Tracking System
        </Typography>
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: 280 }}>
          {['✓ Smart candidate tracking', '✓ Automated notifications', '✓ Interview scheduling'].map(s => (
            <Box key={s} sx={{ p: 2, borderRadius: 2, background: C.surface, border: `1px solid ${C.border}` }}>
              <Typography sx={{ color: C.text, fontSize: '0.875rem' }}>{s}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box sx={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        p: { xs: '24px 16px', sm: '40px 32px' },
        minHeight: '100vh',
      }}>
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 400, md: 420 } }}>

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

          <Typography sx={{
            fontWeight: 800, color: C.text, mb: 0.5, lineHeight: 1.25,
            fontSize: { xs: '1.35rem', sm: '1.6rem', md: '1.875rem' },
            textAlign: { xs: 'center', sm: 'left' },
          }}>
            Welcome back
          </Typography>
          <Typography sx={{
            color: C.muted, mb: 3,
            fontSize: { xs: '0.82rem', sm: '0.9rem' },
            textAlign: { xs: 'center', sm: 'left' },
          }}>
            Sign in to your account
          </Typography>

          {/* Email field */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
            InputLabelProps={{ shrink: true }}
            placeholder="you@example.com"
            sx={{ ...fieldSx, mb: 2 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} color={C.muted} />
                  </InputAdornment>
                ),
              },
            }}
          />

          {/* Password field */}
          <TextField
            fullWidth
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            InputLabelProps={{ shrink: true }}
            placeholder="••••••••"
            sx={{ ...fieldSx, mb: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} color={C.muted} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPw(p => !p)} size="small" sx={{ color: C.muted, p: '6px' }}>
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ textAlign: 'right', mb: 2.5 }}>
            <Link onClick={() => navigate('/forgot-password')} sx={{
              color: C.primary, cursor: 'pointer', textDecoration: 'none',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              '&:hover': { textDecoration: 'underline' },
            }}>
              Forgot password?
            </Link>
          </Box>

          {error && (
            <Box sx={{ mb: 2, p: 1.5, borderRadius: 2, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)' }}>
              <Typography sx={{ color: C.danger, fontSize: '0.8rem' }}>{error}</Typography>
            </Box>
          )}

          <Button
            fullWidth onClick={login} disabled={loading}
            endIcon={<ArrowRight size={16} />}
            sx={{
              py: { xs: 1.25, sm: 1.5 },
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
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>

          <Typography sx={{
            textAlign: 'center', mt: 3,
            color: C.muted, fontSize: { xs: '0.82rem', sm: '0.875rem' },
          }}>
            Don't have an account?{' '}
            <Box component="span" onClick={() => navigate('/signup')}
              sx={{ color: C.primary, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Sign Up
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
