import { useState } from 'react';
import { Box, Button, Typography, Card, InputAdornment, IconButton } from '@mui/material';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const FONT = "'Poppins', 'Inter', sans-serif";

const C = {
  bg:       '#F0F4FF',
  surface:  '#FFFFFF',
  border:   '#D1D9F0',
  primary:  '#5B5BD6',
  secondary:'#7C3AED',
  text:     '#111827',
  muted:    '#4B5563',
  danger:   '#DC2626',
  success:  '#059669',
};

const BASE = API_BASE_URL;

const inputStyle = (focus) => ({
  width: '100%',
  padding: '12px 44px 12px 44px',
  borderRadius: 10,
  border: `1.5px solid ${focus ? C.primary : C.border}`,
  background: focus ? '#EEF2FF' : '#F8FAFF',
  color: C.text,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'all 0.2s',
  fontFamily: FONT,
  boxShadow: focus ? `0 0 0 3px ${C.primary}18` : 'none',
});

function PasswordField({ label, value, onChange, show, onToggle }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3, fontFamily: FONT }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {/* Lock icon left */}
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', display: 'flex', opacity: 0.5, pointerEvents: 'none' }}>
          <Lock size={16} color={focus ? C.primary : C.muted} />
        </div>
        <input
          type={show ? 'text' : 'password'}
          placeholder={`Enter ${label.toLowerCase()}`}
          value={value}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={inputStyle(focus)}
        />
        {/* Eye icon right */}
        <button
          onClick={onToggle}
          style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 0 }}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [showCp, setShowCp]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);

  const handleSubmit = async () => {
    if (!password) { setError('Please enter a new password'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }

    setLoading(true); setError('');
    try {
      const r = await fetch(`${BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const d = await r.json();
      if (d.success) {
        setSuccess(true);
      } else {
        // Detect token expiry specifically
        if (d.error?.toLowerCase().includes('invalid') || d.error?.toLowerCase().includes('expired')) {
          setTokenExpired(true);
        }
        setError(d.error || 'Reset failed');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        @keyframes floatY { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulse  { 0%,100%{opacity:0.25;transform:scale(1)} 50%{opacity:0.45;transform:scale(1.05)} }
        .rp-card { animation: fadeUp 0.4s ease; }
        .rp-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(91,91,214,0.45) !important; }
        .rp-btn:active { transform: scale(0.98); }
        input::placeholder { color: #9CA3AF; font-family: ${FONT}; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 20% 30%, ${C.primary}14 0%, transparent 55%),
                     radial-gradient(ellipse at 80% 70%, ${C.secondary}10 0%, transparent 55%),
                     ${C.bg}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, fontFamily: FONT, position: 'relative', overflow: 'hidden',
      }}>

        {/* Decorative blobs */}
        <div style={{ position:'fixed', top:'-8%', left:'-4%', width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle,${C.primary}18 0%,transparent 70%)`, animation:'pulse 6s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'fixed', bottom:'-8%', right:'-4%', width:220, height:220, borderRadius:'50%', background:`radial-gradient(circle,${C.secondary}12 0%,transparent 70%)`, animation:'pulse 7s ease-in-out infinite 2s', pointerEvents:'none' }}/>

        <div className="rp-card" style={{
          width: '100%', maxWidth: 420,
          background: C.surface,
          borderRadius: 24,
          padding: '36px 32px',
          border: `1px solid ${C.border}`,
          boxShadow: '0 16px 48px rgba(91,91,214,0.14), 0 3px 12px rgba(0,0,0,0.06)',
        }}>

          {/* Logo */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom: 24 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 15,
              background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10,
              boxShadow: `0 8px 24px ${C.primary}35`,
              animation: 'floatY 4s ease-in-out infinite',
            }}>
              <Lock size={22} color="#fff" />
            </div>
            <span style={{ color: C.text, fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>RecruitHub</span>
            <span style={{ color: C.primary, fontWeight: 600, fontSize: 10, letterSpacing: 2, marginTop: 2 }}>CONNECT · HIRE · GROW</span>
          </div>

          {/* ── SUCCESS STATE ── */}
          {success ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: `${C.success}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle2 size={32} color={C.success} />
              </div>
              <h2 style={{ color: C.text, fontWeight: 800, fontSize: 20, margin: '0 0 8px', fontFamily: FONT }}>Password Reset!</h2>
              <p style={{ color: C.muted, fontSize: 14, margin: '0 0 24px', lineHeight: 1.6, fontFamily: FONT }}>
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <button className="rp-btn" onClick={() => navigate('/')}
                style={{
                  width: '100%', padding: '13px', borderRadius: 50, border: 'none',
                  fontWeight: 700, fontSize: 14,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                  color: '#fff', cursor: 'pointer', fontFamily: FONT, letterSpacing: 0.3,
                  boxShadow: `0 6px 20px ${C.primary}35`, transition: 'all 0.2s',
                }}>
                Go to Login
              </button>
            </div>

          ) : (
            <>
              <h2 style={{ color: C.text, fontWeight: 800, fontSize: 22, margin: '0 0 6px', textAlign: 'center', fontFamily: FONT }}>
                Reset Password
              </h2>
              <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', margin: '0 0 24px', fontFamily: FONT }}>
                Enter your new password below
              </p>

              <PasswordField
                label="New Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                show={showPw}
                onToggle={() => setShowPw(p => !p)}
              />
              <PasswordField
                label="Confirm Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                show={showCp}
                onToggle={() => setShowCp(p => !p)}
              />

              {/* Error box */}
              {error && (
                <div style={{
                  marginBottom: 16, padding: '12px 14px', borderRadius: 10,
                  background: 'rgba(220,38,38,0.07)',
                  border: '1px solid rgba(220,38,38,0.2)',
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                }}>
                  <AlertCircle size={15} color={C.danger} style={{ flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <p style={{ color: C.danger, fontSize: 13, margin: 0, fontFamily: FONT }}>{error}</p>
                    {tokenExpired && (
                      <p style={{ color: C.muted, fontSize: 12, margin: '6px 0 0', fontFamily: FONT }}>
                        Your reset link has expired or was already used.{' '}
                        <span
                          onClick={() => navigate('/forgot-password')}
                          style={{ color: C.primary, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          Request a new one →
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              <button
                className="rp-btn"
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  width: '100%', padding: '13px', borderRadius: 50, border: 'none',
                  fontWeight: 700, fontSize: 14,
                  background: `linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s', fontFamily: FONT, letterSpacing: 0.3,
                  boxShadow: `0 6px 20px ${C.primary}35`,
                }}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>

              <p style={{ color: C.muted, fontSize: 12, textAlign: 'center', marginTop: 16, fontFamily: FONT }}>
                Remember your password?{' '}
                <span onClick={() => navigate('/')} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>
                  Sign in
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
