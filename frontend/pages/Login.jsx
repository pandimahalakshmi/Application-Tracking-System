import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import { Box } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

const C = {
  bg:      '#F0F4FF',
  surface: '#FFFFFF',
  card:    '#FFFFFF',
  border:  '#D1D9F0',
  primary: '#5B5BD6',
  grad:    'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
  text:    '#111827',
  muted:   '#4B5563',
  danger:  '#DC2626',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusPw, setFocusPw]       = useState(false);

  const login = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    try {
      setLoading(true); setError("");
      const r = await authService.login(email, password);
      if (r.success) {
        localStorage.setItem("user", JSON.stringify(r.user));
        localStorage.setItem("role", r.user.role);
        navigate(r.user.role === "admin" ? "/dashboard" : "/userdashboard");
      } else { setError(r.error || "Login failed"); }
    } catch { setError("Connection error."); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 20% 30%, #5B5BD614 0%, transparent 55%),
                   radial-gradient(ellipse at 80% 70%, #7C3AED10 0%, transparent 55%),
                   ${C.bg}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: '20px', fontFamily: 'Inter,-apple-system,sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.05)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .login-card { animation: fadeSlide 0.4s ease; }
        input::placeholder { color: #9CA3AF; }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(91,91,214,0.45) !important; }
        .submit-btn:active { transform: scale(0.98); }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position:'fixed', top:'-10%', left:'-5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle, rgba(91,91,214,0.15) 0%, transparent 70%)', animation:'pulse 5s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', right:'-5%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', animation:'pulse 6s ease-in-out infinite 1s', pointerEvents:'none' }}/>

      {/* Card */}
      <div className="login-card" style={{
        width: '100%', maxWidth: 400,
        background: C.card, borderRadius: 24, padding: '36px 28px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 16px 48px rgba(91,91,214,0.14), 0 3px 12px rgba(0,0,0,0.06)',
        position: 'relative',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: C.grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 8px 24px rgba(91,91,214,0.35)',
            animation: 'floatUp 4s ease-in-out infinite',
          }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
              <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              <circle cx="16" cy="16" r="3.5" fill="white"/>
              <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span style={{ color: C.text, fontWeight: 800, fontSize: 18, letterSpacing: 0.5 }}>RecruitHub</span>
          <span style={{ color: C.primary, fontWeight: 600, fontSize: 11, letterSpacing: 2, marginTop: 2 }}>CONNECT · HIRE · GROW</span>
        </div>

        {/* Heading */}
        <h2 style={{ color: C.text, fontWeight: 800, fontSize: 22, margin: '0 0 6px', textAlign: 'center' }}>Welcome Back</h2>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', margin: '0 0 24px' }}>Sign in to continue to your account</p>

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ display:'block', color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>Email address</label>
          <div style={{ position: 'relative' }}>
            <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity: 0.5 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={focusEmail ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round">
              <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
            </svg>
            <input type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusEmail(true)} onBlur={() => setFocusEmail(false)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{
                width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10,
                border: `1.5px solid ${focusEmail ? C.primary : C.border}`,
                background: focusEmail ? '#EEF2FF' : '#F0F4FF',
                color: C.text, fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: 'inherit',
                boxShadow: focusEmail ? `0 0 0 3px ${C.primary}18` : 'none',
              }}/>
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ display:'block', color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity: 0.5 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={focusPw ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input type={showPw ? 'text' : 'password'} placeholder="Enter your password" value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusPw(true)} onBlur={() => setFocusPw(false)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{
                width: '100%', padding: '11px 40px 11px 40px', borderRadius: 10,
                border: `1.5px solid ${focusPw ? C.primary : C.border}`,
                background: focusPw ? '#EEF2FF' : '#F0F4FF',
                color: C.text, fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: 'inherit',
                boxShadow: focusPw ? `0 0 0 3px ${C.primary}18` : 'none',
              }}/>
            <button onClick={() => setShowPw(p => !p)}
              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color: C.muted, display:'flex', padding:0 }}>
              {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div style={{ textAlign: 'right', marginBottom: 20 }}>
          <span onClick={() => navigate('/forgot-password')}
            style={{ color: C.primary, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            Forgot Password?
          </span>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: C.danger, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button className="submit-btn" onClick={login} disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 50, border: 'none',
            fontWeight: 700, fontSize: 14, background: C.grad, color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: 0.3,
            boxShadow: '0 6px 20px rgba(91,91,214,0.35)',
          }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        {/* Sign up */}
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 20 }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/signup')} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>
            Create one free
          </span>
        </p>
      </div>
    </Box>
  );
}
