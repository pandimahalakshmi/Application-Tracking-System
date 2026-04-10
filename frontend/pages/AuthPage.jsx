import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase } from "lucide-react";

const P = '#6366F1';
const S = '#8B5CF6';
const BG = '#0F172A';
const SURF = '#1E293B';
const BORDER = '#334155';
const TEXT = '#F1F5F9';
const MUTED = '#94A3B8';
const DANGER = '#F87171';

const inp = (focus) => ({
  width: '100%', padding: '12px 14px 12px 40px', borderRadius: 10,
  background: BG, border: `1.5px solid ${focus ? P : BORDER}`,
  color: TEXT, fontSize: 14, outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s', fontFamily: 'inherit',
});

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 10 }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focus ? P : MUTED, display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
        <Icon size={15} />
      </div>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={inp(focus)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      {right && <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>{right}</div>}
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', marginBottom: 10 }}>
      <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: focus ? P : MUTED, display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
        <User size={15} />
      </div>
      <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...inp(focus), paddingLeft: 40, appearance: 'none', color: value ? TEXT : MUTED }}>
        <option value="" disabled style={{ background: SURF }}>Gender</option>
        {['Male', 'Female', 'Other'].map(g => <option key={g} value={g.toLowerCase()} style={{ background: SURF, color: TEXT }}>{g}</option>)}
      </select>
    </div>
  );
}

function SocialRow() {
  const socials = [
    { title: 'Google', path: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09zM12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23zM5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62zM12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' },
    { title: 'Facebook', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
    { title: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
  ];
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 18, justifyContent: 'center' }}>
      {socials.map(s => (
        <button key={s.title} title={s.title}
          style={{ width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${BORDER}`, background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = P; e.currentTarget.style.background = `${P}18`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.background = 'transparent'; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill={MUTED}><path d={s.path} /></svg>
        </button>
      ))}
    </div>
  );
}

function PrimaryBtn({ onClick, disabled, loading, children }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 15,
        background: `linear-gradient(135deg, ${P}, ${S})`, color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1, transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: 0.3 }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
      {loading ? 'Please wait…' : children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ padding: '10px 28px', borderRadius: 24, border: '2px solid rgba(255,255,255,0.8)', background: 'transparent',
        color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </button>
  );
}

function ErrBox({ msg }) {
  if (!msg) return null;
  return <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 8, background: 'rgba(248,113,113,0.12)', border: `1px solid ${DANGER}55`, color: DANGER, fontSize: 13 }}>{msg}</div>;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'signin');

  const [siEmail, setSiEmail] = useState('');
  const [siPass, setSiPass] = useState('');
  const [siShowPw, setSiShowPw] = useState(false);
  const [siErr, setSiErr] = useState('');
  const [siLoad, setSiLoad] = useState(false);

  const [su, setSu] = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', gender: '' });
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowCp, setSuShowCp] = useState(false);
  const [suErr, setSuErr] = useState('');
  const [suLoad, setSuLoad] = useState(false);

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

  const isSignup = mode === 'signup';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .auth-wrap { animation: fadeUp 0.4s ease; }
        input::placeholder, select::placeholder { color: #94A3B8; }
        .overlay-panel { transition: transform 0.55s cubic-bezier(0.4,0,0.2,1); }
        .form-box { transition: opacity 0.4s ease, transform 0.4s ease; }
        @media (max-width: 700px) {
          .desktop-overlay { display: none !important; }
          .auth-container { flex-direction: column !important; width: 100% !important; max-width: 420px !important; border-radius: 16px !important; }
          .form-box { position: static !important; opacity: 1 !important; transform: none !important; width: 100% !important; display: none; }
          .form-box.active { display: flex !important; }
          .mobile-tabs { display: flex !important; }
        }
        @media (min-width: 701px) {
          .mobile-tabs { display: none !important; }
        }
      `}</style>

      {/* Page background */}
      <div style={{ minHeight: '100vh', background: `linear-gradient(135deg, #0F172A 0%, #1a1040 50%, #0F172A 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter,-apple-system,sans-serif' }}>

        {/* Decorative blobs */}
        <div style={{ position: 'fixed', top: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: `${P}18`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', bottom: '10%', right: '5%', width: 250, height: 250, borderRadius: '50%', background: `${S}18`, filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div className="auth-wrap auth-container"
          style={{ display: 'flex', width: '100%', maxWidth: 860, minHeight: 560, background: SURF, borderRadius: 20, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', border: `1px solid ${BORDER}`, position: 'relative' }}>

          {/* Mobile tabs */}
          <div className="mobile-tabs" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, display: 'none', background: SURF, borderBottom: `1px solid ${BORDER}` }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: '14px', border: 'none', background: 'transparent', color: mode === m ? P : MUTED, fontWeight: mode === m ? 700 : 400, fontSize: 14, cursor: 'pointer', borderBottom: mode === m ? `2px solid ${P}` : '2px solid transparent', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* ── SIGN IN FORM ── */}
          <div className={`form-box ${!isSignup ? 'active' : ''}`}
            style={{ flex: 1, padding: '48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', opacity: isSignup ? 0 : 1, transform: isSignup ? 'translateX(-20px)' : 'none', pointerEvents: isSignup ? 'none' : 'auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 26, margin: '0 0 6px' }}>Sign In</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Use your account credentials</p>
            </div>
            <SocialRow />
            <p style={{ color: MUTED, fontSize: 12, textAlign: 'center', marginBottom: 14 }}>or use your email</p>
            <Field icon={Mail} type="email" placeholder="Email address" value={siEmail} onChange={e => setSiEmail(e.target.value)} />
            <Field icon={Lock} type={siShowPw ? 'text' : 'password'} placeholder="Password" value={siPass} onChange={e => setSiPass(e.target.value)}
              right={<button onClick={() => setSiShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', padding: 0 }}>{siShowPw ? <EyeOff size={15} /> : <Eye size={15} />}</button>} />
            <div style={{ textAlign: 'right', marginBottom: 16 }}>
              <span onClick={() => navigate('/forgot-password')} style={{ color: MUTED, fontSize: 13, cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = P} onMouseLeave={e => e.target.style.color = MUTED}>
                Forgot password?
              </span>
            </div>
            <ErrBox msg={siErr} />
            <PrimaryBtn onClick={login} loading={siLoad} disabled={siLoad}>Sign In</PrimaryBtn>
            <p style={{ color: MUTED, fontSize: 13, textAlign: 'center', marginTop: 18 }}>
              No account?{' '}
              <span onClick={() => setMode('signup')} style={{ color: P, fontWeight: 700, cursor: 'pointer' }}>Sign Up</span>
            </p>
          </div>

          {/* ── SIGN UP FORM ── */}
          <div className={`form-box ${isSignup ? 'active' : ''}`}
            style={{ flex: 1, padding: '32px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto', opacity: isSignup ? 1 : 0, transform: isSignup ? 'none' : 'translateX(20px)', pointerEvents: isSignup ? 'auto' : 'none' }}>
            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <h2 style={{ color: TEXT, fontWeight: 800, fontSize: 26, margin: '0 0 6px' }}>Create Account</h2>
              <p style={{ color: MUTED, fontSize: 14, margin: 0 }}>Use your email for registration</p>
            </div>
            <SocialRow />
            <p style={{ color: MUTED, fontSize: 12, textAlign: 'center', marginBottom: 12 }}>or use your email</p>
            <Field icon={User} placeholder="Full Name" value={su.name} onChange={e => set('name', e.target.value)} />
            <Field icon={Mail} type="email" placeholder="Email address" value={su.email} onChange={e => set('email', e.target.value)} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field icon={Lock} type={suShowPw ? 'text' : 'password'} placeholder="Password" value={su.password} onChange={e => set('password', e.target.value)}
                right={<button onClick={() => setSuShowPw(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', padding: 0 }}>{suShowPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
              <Field icon={Lock} type={suShowCp ? 'text' : 'password'} placeholder="Confirm" value={su.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                right={<button onClick={() => setSuShowCp(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, display: 'flex', padding: 0 }}>{suShowCp ? <EyeOff size={14} /> : <Eye size={14} />}</button>} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Field icon={Phone} placeholder="Phone Number" value={su.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} />
              <GenderSelect value={su.gender} onChange={e => set('gender', e.target.value)} />
            </div>
            <ErrBox msg={suErr} />
            <PrimaryBtn onClick={signup} loading={suLoad} disabled={suLoad}>Sign Up</PrimaryBtn>
            <p style={{ color: MUTED, fontSize: 13, textAlign: 'center', marginTop: 14 }}>
              Have an account?{' '}
              <span onClick={() => setMode('signin')} style={{ color: P, fontWeight: 700, cursor: 'pointer' }}>Sign In</span>
            </p>
          </div>

          {/* ── OVERLAY PANEL (desktop only) ── */}
          <div className="desktop-overlay"
            style={{ position: 'absolute', top: 0, width: '50%', height: '100%', zIndex: 10,
              left: isSignup ? '0%' : '50%', transition: 'left 0.55s cubic-bezier(0.4,0,0.2,1)',
              background: `linear-gradient(135deg, ${P}, ${S})`,
              borderRadius: isSignup ? '0 20px 20px 0' : '20px 0 0 20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 28px' }}>

            {/* Icon */}
            <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <Briefcase size={26} color="#fff" />
            </div>

            {/* Heading */}
            <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 22, textAlign: 'center', margin: '0 0 10px' }}>
              {isSignup ? 'Welcome Back!' : 'Hello, Friend!'}
            </h2>

            {/* Description */}
            <p style={{ color: 'rgba(255,255,255,0.82)', textAlign: 'center', fontSize: 13, lineHeight: 1.7, marginBottom: 20, maxWidth: 220 }}>
              {isSignup
                ? 'Login with your personal information to continue using the ATS platform.'
                : 'Create an account to start using the ATS platform and track your applications.'}
            </p>

            {/* CTA Button */}
            <GhostBtn onClick={() => setMode(isSignup ? 'signin' : 'signup')}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </GhostBtn>

            {/* ATS Illustration — inline SVG, always works, matches theme */}
            <div style={{ marginTop: 20, width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ animation: 'floatImg 3.5s ease-in-out infinite', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.3))' }}>
                <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Monitor */}
                  <rect x="40" y="20" width="100" height="75" rx="6" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
                  <rect x="46" y="26" width="88" height="60" rx="3" fill="rgba(255,255,255,0.1)"/>
                  {/* Screen content - candidate list */}
                  <rect x="52" y="32" width="30" height="4" rx="2" fill="rgba(255,255,255,0.7)"/>
                  {/* Candidate row 1 */}
                  <circle cx="58" cy="46" r="5" fill="rgba(255,255,255,0.5)"/>
                  <rect x="66" y="43" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.6)"/>
                  <rect x="66" y="48" width="28" height="2" rx="1" fill="rgba(255,255,255,0.35)"/>
                  <rect x="112" y="44" width="16" height="6" rx="3" fill="rgba(99,102,241,0.7)"/>
                  {/* Candidate row 2 */}
                  <circle cx="58" cy="62" r="5" fill="rgba(255,255,255,0.5)"/>
                  <rect x="66" y="59" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.6)"/>
                  <rect x="66" y="64" width="24" height="2" rx="1" fill="rgba(255,255,255,0.35)"/>
                  <rect x="112" y="60" width="16" height="6" rx="3" fill="rgba(16,185,129,0.7)"/>
                  {/* Candidate row 3 */}
                  <circle cx="58" cy="78" r="5" fill="rgba(255,255,255,0.5)"/>
                  <rect x="66" y="75" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.6)"/>
                  <rect x="66" y="80" width="20" height="2" rx="1" fill="rgba(255,255,255,0.35)"/>
                  <rect x="112" y="76" width="16" height="6" rx="3" fill="rgba(245,158,11,0.7)"/>
                  {/* Monitor stand */}
                  <rect x="82" y="95" width="16" height="8" rx="2" fill="rgba(255,255,255,0.2)"/>
                  <rect x="72" y="103" width="36" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>
                  {/* Recruiter figure */}
                  <circle cx="28" cy="55" r="8" fill="rgba(255,255,255,0.3)"/>
                  <rect x="22" y="64" width="12" height="20" rx="4" fill="rgba(255,255,255,0.25)"/>
                  {/* Pointing arm */}
                  <line x1="34" y1="72" x2="46" y2="62" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"/>
                  {/* Floating badges */}
                  <rect x="130" y="15" width="36" height="18" rx="9" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <circle cx="140" cy="24" r="4" fill="rgba(99,102,241,0.8)"/>
                  <rect x="147" y="21" width="14" height="2.5" rx="1.25" fill="rgba(255,255,255,0.7)"/>
                  <rect x="147" y="25" width="10" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
                  {/* Target icon top right */}
                  <circle cx="158" cy="30" r="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
                  <circle cx="158" cy="30" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                  <circle cx="158" cy="30" r="2" fill="rgba(255,255,255,0.6)"/>
                  {/* Folder bottom right */}
                  <rect x="148" y="100" width="24" height="18" rx="3" fill="rgba(255,255,255,0.2)"/>
                  <rect x="148" y="96" width="12" height="6" rx="2" fill="rgba(255,255,255,0.3)"/>
                </svg>
              </div>
            </div>

            <style>{`
              @keyframes floatImg {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-10px); }
              }
            `}</style>
          </div>

        </div>
      </div>
    </>
  );
}
