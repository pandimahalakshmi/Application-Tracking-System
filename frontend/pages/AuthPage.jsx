import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase } from "lucide-react";

/* ── Palette ── */
const P  = '#6366F1';
const S  = '#8B5CF6';
const BG = '#0F172A';
const SF = '#1E293B';
const BR = '#334155';
const TX = '#F1F5F9';
const MU = '#94A3B8';
const ER = '#F87171';

/* ── Shared input style ── */
const inp = (focus) => ({
  width: '100%',
  padding: '13px 14px 13px 42px',
  borderRadius: 10,
  background: BG,
  border: `1.5px solid ${focus ? P : BR}`,
  color: TX,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit',
});

/* ── Field component ── */
function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: focus ? P : MU, display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
        <Icon size={15} />
      </div>
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={inp(focus)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      />
      {right && (
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
          {right}
        </div>
      )}
    </div>
  );
}

/* ── Gender select ── */
function GenderSelect({ value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 12 }}>
      <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: focus ? P : MU, display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
        <User size={15} />
      </div>
      <select
        value={value} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...inp(focus), paddingLeft: 42, appearance: 'none', color: value ? TX : MU }}
      >
        <option value="" disabled style={{ background: SF }}>Gender</option>
        {['Male', 'Female', 'Other'].map(g => (
          <option key={g} value={g.toLowerCase()} style={{ background: SF, color: TX }}>{g}</option>
        ))}
      </select>
    </div>
  );
}

/* ── Error box ── */
function ErrBox({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.12)', border: `1px solid ${ER}55`, color: ER, fontSize: 13 }}>
      {msg}
    </div>
  );
}

/* ── Primary button ── */
function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      style={{
        width: '100%', padding: '13px', borderRadius: 10, border: 'none',
        fontWeight: 700, fontSize: 15,
        background: `linear-gradient(135deg,${P},${S})`,
        color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1, transition: 'all 0.2s',
        fontFamily: 'inherit', letterSpacing: 0.3,
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}
    >
      {loading ? 'Please wait…' : children}
    </button>
  );
}

/* ── Ghost button (overlay panel) ── */
function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '11px 32px', borderRadius: 24,
        border: '2px solid rgba(255,255,255,0.85)',
        background: 'transparent', color: '#fff',
        fontWeight: 700, fontSize: 14, cursor: 'pointer',
        transition: 'all 0.2s', fontFamily: 'inherit',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function AuthPage({ mode: modeProp }) {
  const navigate = useNavigate();
  const location = useLocation();

  const mode     = modeProp || (location.pathname === '/signup' ? 'signup' : 'signin');
  const isSignup = mode === 'signup';

  const goSignin = () => navigate('/');
  const goSignup = () => navigate('/signup');

  /* Sign-in state */
  const [siEmail,  setSiEmail]  = useState('');
  const [siPass,   setSiPass]   = useState('');
  const [siShowPw, setSiShowPw] = useState(false);
  const [siErr,    setSiErr]    = useState('');
  const [siLoad,   setSiLoad]   = useState(false);

  /* Sign-up state */
  const [su, setSu] = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', gender: '' });
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowCp, setSuShowCp] = useState(false);
  const [suErr,    setSuErr]    = useState('');
  const [suLoad,   setSuLoad]   = useState(false);

  const set = (k, v) => setSu(p => ({ ...p, [k]: v }));

  const login = async () => {
    if (!siEmail || !siPass) { setSiErr('Please fill all fields'); return; }
    setSiLoad(true); setSiErr('');
    try {
      const r = await authService.login(siEmail, siPass);
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else setSiErr(r.error || 'Login failed');
    } catch { setSiErr('Connection error'); }
    finally { setSiLoad(false); }
  };

  const signup = async () => {
    const { name, email, password, confirmPassword, phoneNumber, gender } = su;
    if (!name || !email || !password || !confirmPassword || !phoneNumber || !gender) { setSuErr('Please fill all fields'); return; }
    if (password !== confirmPassword) { setSuErr('Passwords do not match'); return; }
    setSuLoad(true); setSuErr('');
    try {
      const r = await authService.signup(su);
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else setSuErr(r.error || 'Signup failed');
    } catch { setSuErr('Connection error'); }
    finally { setSuLoad(false); }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .auth-card { animation: fadeUp 0.45s ease; }

        /* Overlay slides left when signup, right when signin */
        .overlay-panel {
          position: absolute;
          top: 0; height: 100%;
          width: 45%;
          z-index: 10;
          background: linear-gradient(135deg, ${P}, ${S});
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 32px;
          transition: left 0.6s cubic-bezier(0.4,0,0.2,1),
                      border-radius 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .overlay-panel.signin { left: 55%; border-radius: 20px 0 0 20px; }
        .overlay-panel.signup { left: 0%;  border-radius: 0 20px 20px 0; }

        /* Form panels */
        .form-panel {
          position: absolute;
          top: 0; height: 100%;
          width: 55%;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 40px 44px;
          transition: opacity 0.4s ease, transform 0.4s ease;
          overflow-y: auto;
        }
        .form-panel.signin-form {
          left: 0;
          opacity: ${isSignup ? 0 : 1};
          transform: ${isSignup ? 'translateX(-30px)' : 'none'};
          pointer-events: ${isSignup ? 'none' : 'auto'};
        }
        .form-panel.signup-form {
          right: 0;
          opacity: ${isSignup ? 1 : 0};
          transform: ${isSignup ? 'none' : 'translateX(30px)'};
          pointer-events: ${isSignup ? 'auto' : 'none'};
        }

        /* ── Tablet (600–959px): same two-panel layout, tighter ── */
        @media (min-width: 600px) and (max-width: 959px) {
          .overlay-panel { width: 42%; padding: 28px 20px; }
          .overlay-panel.signin { left: 58%; }
          .form-panel { width: 58%; padding: 32px 28px; }
          .form-panel.signup-form { right: 0; }
          .overlay-desc { display: none !important; }
        }

        /* ── Mobile (<600px): single column, no overlay ── */
        @media (max-width: 599px) {
          .auth-wrapper {
            flex-direction: column !important;
            max-width: 100% !important;
            min-height: 100vh !important;
            border-radius: 0 !important;
            overflow-y: auto !important;
          }
          .overlay-panel { display: none !important; }
          .form-panel {
            position: static !important;
            width: 100% !important;
            padding: 24px 20px 32px !important;
            padding-top: 72px !important;
            opacity: 1 !important;
            transform: none !important;
            pointer-events: auto !important;
            display: none;
          }
          .form-panel.active-mobile { display: flex !important; }
          .mobile-tabs { display: flex !important; }

          /* Smaller text on mobile */
          .form-panel h2       { font-size: 18px !important; margin-bottom: 4px !important; }
          .form-panel p        { font-size: 12px !important; }
          .form-panel span     { font-size: 13px !important; }
          .form-panel input,
          .form-panel select   { font-size: 14px !important; padding: 11px 12px 11px 38px !important; }
          .form-panel button   { font-size: 13px !important; padding: 11px !important; }
          .form-panel .brand-icon { width: 38px !important; height: 38px !important; border-radius: 10px !important; }
          .form-panel .brand-icon svg { width: 18px !important; height: 18px !important; }

          /* Stack password fields vertically on mobile */
          .form-panel .grid-2col { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
        @media (min-width: 600px) {
          .mobile-tabs { display: none !important; }
        }

        input::placeholder { color: ${MU}; }
        select option { background: ${SF}; }
      `}</style>

      {/* Page background */}
      <div style={{
        minHeight: '100vh',
        background: `radial-gradient(ellipse at 20% 50%, ${P}18 0%, transparent 60%),
                     radial-gradient(ellipse at 80% 50%, ${S}18 0%, transparent 60%),
                     ${BG}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', fontFamily: 'Inter,-apple-system,sans-serif',
      }}>

        {/* Card */}
        <div className="auth-card auth-wrapper" style={{
          display: 'flex',
          width: '100%', maxWidth: 900,
          minHeight: 580,
          background: SF,
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55)',
          border: `1px solid ${BR}`,
          position: 'relative',
        }}>

          {/* ── Mobile tabs ── */}
          <div className="mobile-tabs" style={{
            position: 'sticky', top: 0, left: 0, right: 0, zIndex: 20,
            display: 'none', background: SF, borderBottom: `1px solid ${BR}`,
          }}>
            {[{ key: 'signin', label: 'Sign In' }, { key: 'signup', label: 'Sign Up' }].map(({ key, label }) => (
              <button key={key}
                onClick={key === 'signin' ? goSignin : goSignup}
                style={{
                  flex: 1, padding: '14px', border: 'none', background: 'transparent',
                  color: mode === key ? P : MU,
                  fontWeight: mode === key ? 700 : 400,
                  fontSize: 14, cursor: 'pointer',
                  borderBottom: mode === key ? `2px solid ${P}` : '2px solid transparent',
                  transition: 'all 0.2s', fontFamily: 'inherit',
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ══ SIGN IN FORM ══ */}
          <div className={`form-panel signin-form${!isSignup ? ' active-mobile' : ''}`}>
            <div style={{ marginBottom: 28, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div className="brand-icon" style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg,${P},${S})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${P}44`,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" fill="#fff" opacity="0.9"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                    <circle cx="19" cy="5" r="4" fill="#10B981"/>
                    <path d="M17 5l1.5 1.5L21 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color: TX, fontWeight: 800, fontSize: 16, letterSpacing: 0.3 }}>RecruitHub</span>
              </div>
              <h2 style={{ color: TX, fontWeight: 800, fontSize: 26, margin: '0 0 6px' }}>Sign In</h2>
              <p style={{ color: MU, fontSize: 14, margin: 0 }}>Welcome back! Enter your credentials</p>
            </div>

            <Field icon={Mail} type="email" placeholder="Email address" value={siEmail} onChange={e => setSiEmail(e.target.value)} />
            <Field icon={Lock} type={siShowPw ? 'text' : 'password'} placeholder="Password" value={siPass} onChange={e => setSiPass(e.target.value)}
              right={
                <button onClick={() => setSiShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MU, display: 'flex', padding: 0 }}>
                  {siShowPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <div style={{ textAlign: 'right', marginBottom: 18 }}>
              <span
                onClick={() => navigate('/forgot-password')}
                style={{ color: MU, fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = P}
                onMouseLeave={e => e.target.style.color = MU}
              >
                Forgot password?
              </span>
            </div>

            <ErrBox msg={siErr} />
            <PrimaryBtn onClick={login} loading={siLoad} disabled={siLoad}>Sign In</PrimaryBtn>

            {/* Mobile-only link */}
            <p style={{ color: MU, fontSize: 13, textAlign: 'center', marginTop: 18 }}>
              No account?{' '}
              <span onClick={goSignup} style={{ color: P, fontWeight: 700, cursor: 'pointer' }}>Sign Up</span>
            </p>
          </div>

          {/* ══ SIGN UP FORM ══ */}
          <div className={`form-panel signup-form${isSignup ? ' active-mobile' : ''}`}>
            <div style={{ marginBottom: 20, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div className="brand-icon" style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `linear-gradient(135deg,${P},${S})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 24px ${P}44`,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4" fill="#fff" opacity="0.9"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                    <circle cx="19" cy="5" r="4" fill="#10B981"/>
                    <path d="M17 5l1.5 1.5L21 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span style={{ color: TX, fontWeight: 800, fontSize: 16, letterSpacing: 0.3 }}>RecruitHub</span>
              </div>
              <h2 style={{ color: TX, fontWeight: 800, fontSize: 26, margin: '0 0 6px' }}>Create Account</h2>
              <p style={{ color: MU, fontSize: 14, margin: 0 }}>Join us and start your journey</p>
            </div>

            <Field icon={User}  placeholder="Full Name"    value={su.name}          onChange={e => set('name', e.target.value)} />
            <Field icon={Mail}  type="email" placeholder="Email address" value={su.email} onChange={e => set('email', e.target.value)} />

            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field icon={Lock} type={suShowPw ? 'text' : 'password'} placeholder="Password" value={su.password} onChange={e => set('password', e.target.value)}
                right={<button onClick={() => setSuShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MU, display: 'flex', padding: 0 }}>{suShowPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
              <Field icon={Lock} type={suShowCp ? 'text' : 'password'} placeholder="Confirm" value={su.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                right={<button onClick={() => setSuShowCp(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MU, display: 'flex', padding: 0 }}>{suShowCp ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
            </div>

            <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field icon={Phone} placeholder="Phone Number" value={su.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} />
              <GenderSelect value={su.gender} onChange={e => set('gender', e.target.value)} />
            </div>

            <ErrBox msg={suErr} />
            <PrimaryBtn onClick={signup} loading={suLoad} disabled={suLoad}>Create Account</PrimaryBtn>

            <p style={{ color: MU, fontSize: 13, textAlign: 'center', marginTop: 14 }}>
              Have an account?{' '}
              <span onClick={goSignin} style={{ color: P, fontWeight: 700, cursor: 'pointer' }}>Sign In</span>
            </p>
          </div>

          {/* ══ SLIDING OVERLAY PANEL ══ */}
          <div className={`overlay-panel ${isSignup ? 'signup' : 'signin'}`}>

            {/* Floating icon */}
            <div style={{ animation: 'floatY 3.5s ease-in-out infinite', marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: 18,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(8px)',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="7" r="4" fill="#fff" opacity="0.9"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
                  <circle cx="19" cy="5" r="4" fill="#10B981"/>
                  <path d="M17 5l1.5 1.5L21 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, textAlign: 'center', margin: '0 0 4px', lineHeight: 1.3 }}>
              {isSignup ? 'Welcome Back!' : 'Hello, Friend!'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center', letterSpacing: '0.08em', margin: '0 0 10px', fontWeight: 600 }}>
              Connect. Hire. Grow.
            </p>

            {/* Description */}
            <p className="overlay-desc" style={{ color: 'rgba(255,255,255,0.82)', textAlign: 'center', fontSize: 13, lineHeight: 1.75, marginBottom: 22, maxWidth: 220 }}>
              {isSignup
                ? 'Sign in with your credentials to continue managing your recruitment pipeline.'
                : 'Register now to track applications, schedule interviews, and land your dream job.'}
            </p>

            {/* CTA */}
            <GhostBtn onClick={isSignup ? goSignin : goSignup}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </GhostBtn>

            {/* Animated illustration */}
            <div style={{ marginTop: 28, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                <style>{`
                  .il-float  { animation: floatY 3.5s ease-in-out infinite; }
                  .il-float2 { animation: floatY 3.5s ease-in-out infinite 0.6s; }
                  .il-float3 { animation: floatY 3.5s ease-in-out infinite 1.2s; }
                  .il-pulse  { animation: ilPulse 2.4s ease-in-out infinite; }
                  .il-spin   { animation: ilSpin 8s linear infinite; transform-origin: 170px 30px; }
                  @keyframes ilPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
                  @keyframes ilSpin  { to{transform:rotate(360deg)} }
                `}</style>

                {/* Background circle glow */}
                <circle cx="100" cy="95" r="72" fill="rgba(255,255,255,0.05)"/>
                <circle cx="100" cy="95" r="52" fill="rgba(255,255,255,0.05)"/>

                {/* ── Main monitor (floats) ── */}
                <g className="il-float">
                  <rect x="42" y="38" width="116" height="82" rx="8" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"/>
                  <rect x="48" y="44" width="104" height="68" rx="4" fill="rgba(255,255,255,0.07)"/>
                  {/* Screen header bar */}
                  <rect x="48" y="44" width="104" height="12" rx="4" fill="rgba(255,255,255,0.12)"/>
                  <circle cx="56" cy="50" r="2.5" fill="rgba(248,113,113,0.8)"/>
                  <circle cx="63" cy="50" r="2.5" fill="rgba(245,158,11,0.8)"/>
                  <circle cx="70" cy="50" r="2.5" fill="rgba(16,185,129,0.8)"/>
                  {/* Candidate rows */}
                  {[0,1,2].map(i => (
                    <g key={i}>
                      <circle cx="60" cy={66 + i*16} r="5.5" fill="rgba(255,255,255,0.4)"/>
                      <rect x="70" y={63 + i*16} width={30 - i*3} height="3" rx="1.5" fill="rgba(255,255,255,0.55)"/>
                      <rect x="70" y={68 + i*16} width={20 - i*2} height="2" rx="1"   fill="rgba(255,255,255,0.28)"/>
                      <rect x="118" y={64 + i*16} width="22" height="7" rx="3.5"
                        fill={['rgba(99,102,241,0.85)','rgba(16,185,129,0.85)','rgba(245,158,11,0.85)'][i]}/>
                      <rect x="120" y={66.5 + i*16} width={['Selected','Hired','Pending'][i].length * 2.2} height="2" rx="1" fill="rgba(255,255,255,0.7)"/>
                    </g>
                  ))}
                  {/* Monitor stand */}
                  <rect x="92" y="120" width="16" height="9" rx="2" fill="rgba(255,255,255,0.18)"/>
                  <rect x="80" y="129" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.15)"/>
                </g>

                {/* ── Floating badge top-right (floats offset) ── */}
                <g className="il-float2">
                  <rect x="148" y="18" width="44" height="26" rx="8" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <circle cx="160" cy="31" r="6" fill="rgba(99,102,241,0.9)"/>
                  <rect x="170" y="27" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                  <rect x="170" y="32" width="11" height="2" rx="1"   fill="rgba(255,255,255,0.4)"/>
                </g>

                {/* ── Floating check badge bottom-left ── */}
                <g className="il-float3">
                  <rect x="8" y="118" width="44" height="26" rx="8" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                  <circle cx="20" cy="131" r="6" fill="rgba(16,185,129,0.9)"/>
                  {/* checkmark */}
                  <polyline points="17,131 19.5,133.5 24,128.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="30" y="127" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                  <rect x="30" y="132" width="11" height="2" rx="1"   fill="rgba(255,255,255,0.4)"/>
                </g>

                {/* ── Spinning orbit ring ── */}
                <g className="il-spin">
                  <circle cx="170" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 3"/>
                  <circle cx="170" cy="20" r="3" fill="rgba(255,255,255,0.5)"/>
                </g>

                {/* ── Pulsing dot bottom-right ── */}
                <circle className="il-pulse" cx="178" cy="148" r="5" fill="rgba(99,102,241,0.7)"/>
                <circle cx="178" cy="148" r="2.5" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
