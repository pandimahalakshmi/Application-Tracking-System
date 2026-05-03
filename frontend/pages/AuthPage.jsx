import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { auth, provider, signInWithPopup } from "../config/firebase";

const FONT = "'Poppins', sans-serif";
const P    = '#5B5BD6';
const S    = '#7C3AED';
const CARD = '#FFFFFF';
const BR   = '#D1D9F0';
const TX   = '#111827';
const MU   = '#4B5563';
const ER   = '#DC2626';
const GRAD = `linear-gradient(135deg, ${P} 0%, ${S} 100%)`;
const PANEL= `linear-gradient(160deg, #5B5BD6 0%, #7C3AED 55%, #9333EA 100%)`;

const inp = (focus) => ({
  width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8,
  border: `1.5px solid ${focus ? P : BR}`, background: focus ? '#F5F7FF' : '#F8FAFF',
  color: TX, fontSize: 13, outline: 'none', boxSizing: 'border-box',
  transition: 'all 0.2s', fontFamily: FONT, boxShadow: focus ? `0 0 0 3px ${P}18` : 'none',
});

function Field({ icon: Icon, type = 'text', placeholder, value, onChange, right }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: focus ? P : '#9CA3AF', display: 'flex', pointerEvents: 'none', zIndex: 1 }}>
        <Icon size={13} />
      </div>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={inp(focus)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} />
      {right && <div style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>{right}</div>}
    </div>
  );
}

function GoogleBtn({ onClick, loading }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} disabled={loading} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '9px 14px', borderRadius: 8, border: `1.5px solid ${h ? P : BR}`,
        background: h ? '#F5F6FF' : '#fff', cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', fontFamily: FONT, color: TX, fontWeight: 600, fontSize: 13,
        boxShadow: h ? `0 3px 12px ${P}20` : '0 1px 3px rgba(0,0,0,0.06)', opacity: loading ? 0.7 : 1 }}>
      {loading
        ? <span style={{ width: 15, height: 15, border: `2px solid ${BR}`, borderTopColor: P, borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
        : <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>}
      <span>{loading ? 'Connecting...' : 'Continue with Google'}</span>
    </button>
  );
}

const OR = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
    <div style={{ flex: 1, height: 1, background: BR }} />
    <span style={{ color: MU, fontSize: 11, fontWeight: 500, fontFamily: FONT }}>or continue with</span>
    <div style={{ flex: 1, height: 1, background: BR }} />
  </div>
);

const Lbl = ({ c }) => (
  <label style={{ display: 'block', color: '#4B5563', fontSize: 11.5, fontWeight: 600, marginBottom: 4, fontFamily: FONT }}>{c}</label>
);

const ErrBox = ({ msg }) => msg
  ? <div style={{ margin: '6px 0', padding: '7px 11px', borderRadius: 7, background: '#FEF2F2', border: `1px solid ${ER}28`, color: ER, fontSize: 11.5, fontFamily: FONT }}>{msg}</div>
  : null;

function GhostBtn({ onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding: '9px 30px', borderRadius: 50, border: '2px solid rgba(255,255,255,0.85)',
        background: h ? 'rgba(255,255,255,0.18)' : 'transparent', color: '#fff',
        fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.2s', fontFamily: FONT }}>
      {children}
    </button>
  );
}

const Illus = () => (
  <svg viewBox="0 0 220 160" fill="none" style={{ width: '100%', maxWidth: 185, height: 'auto' }}>
    <rect x="58" y="36" width="106" height="80" rx="7" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
    <rect x="66" y="44" width="90" height="60" rx="4" fill="rgba(255,255,255,0.08)"/>
    <rect x="104" y="116" width="18" height="9" rx="2" fill="rgba(255,255,255,0.25)"/>
    <rect x="95" y="124" width="36" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>
    <circle cx="111" cy="67" r="8.5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
    <circle cx="111" cy="64" r="4" fill="rgba(255,255,255,0.7)"/>
    <path d="M103 77c0-4.5 3.5-8 8-8s8 3.5 8 8" fill="rgba(255,255,255,0.4)"/>
    <circle cx="99" cy="102" r="3.8" fill="rgba(255,255,255,0.22)"/>
    <circle cx="111" cy="102" r="3.8" fill="rgba(255,255,255,0.22)"/>
    <circle cx="123" cy="102" r="3.8" fill="#FF6B6B" opacity="0.9"/>
    <rect x="2" y="32" width="44" height="58" rx="5" fill="rgba(255,255,255,0.88)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <circle cx="15" cy="47" r="6.5" fill="#8B5CF6" opacity="0.38)"/>
    <rect x="8" y="58" width="30" height="2.5" rx="1.2" fill="#8B5CF6" opacity="0.32"/>
    <rect x="8" y="64" width="22" height="2.5" rx="1.2" fill="#8B5CF6" opacity="0.22"/>
    <rect x="8" y="70" width="26" height="2.5" rx="1.2" fill="#8B5CF6" opacity="0.22"/>
    <circle cx="38" cy="62" r="7.5" stroke="rgba(255,255,255,0.85)" strokeWidth="2" fill="rgba(255,255,255,0.1)"/>
    <line x1="43.5" y1="67.5" x2="49" y2="73" stroke="rgba(255,255,255,0.85)" strokeWidth="2" strokeLinecap="round"/>
    <rect x="140" y="22" width="78" height="22" rx="5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <rect x="145" y="27" width="13" height="13" rx="3" fill="rgba(255,255,255,0.28)"/>
    <circle cx="151" cy="32" r="3" fill="rgba(255,255,255,0.7)"/>
    <rect x="163" y="29" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.65)"/>
    <rect x="163" y="35" width="30" height="2.5" rx="1.2" fill="rgba(255,255,255,0.35)"/>
    <circle cx="212" cy="32" r="2.2" fill="#4ADE80"/>
    <rect x="145" y="56" width="78" height="22" rx="5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <rect x="150" y="61" width="13" height="13" rx="3" fill="rgba(255,255,255,0.28)"/>
    <circle cx="156" cy="66" r="3" fill="rgba(255,255,255,0.7)"/>
    <rect x="168" y="63" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.65)"/>
    <rect x="168" y="69" width="26" height="2.5" rx="1.2" fill="rgba(255,255,255,0.35)"/>
    <circle cx="217" cy="66" r="2.2" fill="#4ADE80"/>
    <rect x="140" y="90" width="78" height="22" rx="5" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)" strokeWidth="1"/>
    <rect x="145" y="95" width="13" height="13" rx="3" fill="rgba(255,255,255,0.28)"/>
    <circle cx="151" cy="100" r="3" fill="rgba(255,255,255,0.7)"/>
    <rect x="163" y="97" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.65)"/>
    <rect x="163" y="103" width="34" height="2.5" rx="1.2" fill="rgba(255,255,255,0.35)"/>
    <circle cx="212" cy="100" r="2.2" fill="#4ADE80"/>
  </svg>
);

export default function AuthPage({ mode: modeProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode     = modeProp || (location.pathname === '/signup' ? 'signup' : 'signin');
  const isSignup = mode === 'signup';
  const goSignin = () => navigate('/login');
  const goSignup = () => navigate('/signup');

  const [siEmail, setSiEmail] = useState('');
  const [siPass,  setSiPass]  = useState('');
  const [siShowPw,setSiShowPw]= useState(false);
  const [siErr,   setSiErr]   = useState('');
  const [siLoad,  setSiLoad]  = useState(false);
  const [gLoad,   setGLoad]   = useState(false);

  const [su, setSu]             = useState({ name:'', email:'', password:'', confirmPassword:'', phoneNumber:'', gender:'' });
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowCp, setSuShowCp] = useState(false);
  const [suErr,    setSuErr]    = useState('');
  const [suLoad,   setSuLoad]   = useState(false);
  const set = (k, v) => setSu(p => ({ ...p, [k]: v }));

  const handleGoogle = async () => {
    setGLoad(true); setSiErr(''); setSuErr('');
    try {
      const res = await signInWithPopup(auth, provider);
      const gu  = res.user;
      const r   = await authService.googleLogin({ name: gu.displayName, email: gu.email, googleId: gu.uid, photoURL: gu.photoURL });
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else { setSiErr(r.error || 'Google login failed'); setSuErr(r.error || 'Google login failed'); }
    } catch (e) {
      const msg = e.code === 'auth/popup-closed-by-user' ? 'Popup closed. Try again.' : e.message || 'Google login failed';
      setSiErr(msg); setSuErr(msg);
    } finally { setGLoad(false); }
  };

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
    } catch { setSiErr('Connection error'); } finally { setSiLoad(false); }
  };

  const signup = async () => {
    const { name, email, password, confirmPassword } = su;
    if (!name || !email || !password || !confirmPassword) { setSuErr('Please fill all fields'); return; }
    if (password !== confirmPassword) { setSuErr('Passwords do not match'); return; }
    setSuLoad(true); setSuErr('');
    try {
      const r = await authService.signup({ ...su, phoneNumber: su.phoneNumber || 'N/A', gender: su.gender || 'other' });
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else setSuErr(r.error || 'Signup failed');
    } catch { setSuErr('Connection error'); } finally { setSuLoad(false); }
  };

  const btnStyle = (loading) => ({
    width: '100%', padding: '10px', borderRadius: 50, border: 'none', fontWeight: 700,
    fontSize: 13.5, background: GRAD, color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1, transition: 'all 0.2s', fontFamily: FONT,
    boxShadow: `0 4px 16px ${P}40`, letterSpacing: 0.3,
  });

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;}body{margin:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:0.25;transform:scale(1)}50%{opacity:0.45;transform:scale(1.05)}}
        .ac{animation:fadeUp 0.4s ease;}
        .overlay-panel{position:absolute;top:0;height:100%;width:50%;z-index:10;background:${PANEL};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:22px 20px;transition:left 0.6s cubic-bezier(0.4,0,0.2,1),border-radius 0.6s cubic-bezier(0.4,0,0.2,1);}
        .overlay-panel.si{left:50%;border-radius:20px 0 0 20px;}
        .overlay-panel.su{left:0%;border-radius:0 20px 20px 0;}
        .fp{position:absolute;top:0;height:100%;width:50%;display:flex;flex-direction:column;justify-content:center;padding:20px 36px;overflow:hidden;transition:opacity 0.4s ease,transform 0.4s ease;}
        .fp.si-f{left:0;opacity:${isSignup?0:1};transform:${isSignup?'translateX(-18px)':'none'};pointer-events:${isSignup?'none':'auto'};}
        .fp.su-f{right:0;opacity:${isSignup?1:0};transform:${isSignup?'none':'translateX(18px)'};pointer-events:${isSignup?'auto':'none'};}
        .pb:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 7px 22px ${P}50!important;}
        .pb:active{transform:scale(0.98);}
        input::placeholder{color:#9CA3AF;font-family:${FONT};}
        select{appearance:none;}
        select option{background:#fff;color:${TX};font-family:${FONT};}
        @media(max-width:599px){
          .overlay-panel{display:none!important;}
          .fp{position:static!important;width:100%!important;padding:20px 18px!important;opacity:1!important;transform:none!important;pointer-events:auto!important;display:none!important;height:auto!important;}
          .fp.am{display:flex!important;flex-direction:column!important;}
          .mt{display:flex!important;}
          .ac{height:auto!important;min-height:unset!important;flex-direction:column!important;}
          .pw-grid{grid-template-columns:1fr!important;}
        }
        @media(min-width:600px){.mt{display:none!important;}.fp .logo-mob{display:none!important;}}
      `}</style>

      <div style={{ minHeight:'100vh', background:`radial-gradient(ellipse at 20% 30%,${P}12 0%,transparent 55%),radial-gradient(ellipse at 80% 70%,${S}0D 0%,transparent 55%),#E8EEFF`, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'16px', paddingTop:'24px', paddingBottom:'24px', fontFamily:FONT, position:'relative', overflow:'auto' }}>
        <div style={{ position:'fixed', top:'-8%', left:'-4%', width:280, height:280, borderRadius:'50%', background:`radial-gradient(circle,${P}18 0%,transparent 70%)`, animation:'pulse 6s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'fixed', bottom:'-8%', right:'-4%', width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle,${S}12 0%,transparent 70%)`, animation:'pulse 7s ease-in-out infinite 2s', pointerEvents:'none' }}/>

        <div className="ac" style={{ display:'flex', width:'100%', maxWidth:800, minHeight:500, background:CARD, borderRadius:20, overflow:'hidden', boxShadow:'0 16px 48px rgba(91,91,214,0.16),0 3px 12px rgba(0,0,0,0.06)', border:`1px solid ${BR}`, position:'relative', alignSelf:'flex-start' }}>

          {/* Mobile tabs */}
          <div className="mt" style={{ position:'sticky', top:0, zIndex:20, display:'none', background:CARD, borderBottom:`1px solid ${BR}`, width:'100%', flexShrink:0 }}>
            {[{k:'signin',l:'Sign In'},{k:'signup',l:'Sign Up'}].map(({k,l})=>(
              <button key={k} onClick={k==='signin'?goSignin:goSignup}
                style={{ flex:1, padding:'13px', border:'none', background:'transparent', color:mode===k?P:MU, fontWeight:mode===k?700:500, fontSize:14, cursor:'pointer', borderBottom:mode===k?`2px solid ${P}`:'2px solid transparent', transition:'all 0.2s', fontFamily:FONT }}>
                {l}
              </button>
            ))}
          </div>

          {/* ── SIGN IN ── */}
          <div className={`fp si-f${!isSignup?' am':''}`}>
            {/* Mobile logo */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:GRAD, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8, boxShadow:`0 6px 18px ${P}35` }}>
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/><circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/><circle cx="16" cy="16" r="3.5" fill="white"/><line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/></svg>
              </div>
              <span style={{ color:TX, fontWeight:800, fontSize:13, letterSpacing:0.5, fontFamily:FONT }}>RecruitHub</span>
            </div>
            <h2 style={{ color:TX, fontWeight:700, fontSize:20, margin:'0 0 2px', textAlign:'center', fontFamily:FONT }}>Welcome back</h2>
            <p style={{ color:MU, fontSize:12, textAlign:'center', margin:'0 0 16px', fontFamily:FONT }}>Sign in to continue to your account</p>

            <div style={{ marginBottom:10 }}>
              <Lbl c="Email address"/>
              <Field icon={Mail} type="email" placeholder="you@example.com" value={siEmail} onChange={e=>setSiEmail(e.target.value)}/>
            </div>
            <div style={{ marginBottom:4 }}>
              <Lbl c="Password"/>
              <Field icon={Lock} type={siShowPw?'text':'password'} placeholder="Enter your password" value={siPass} onChange={e=>setSiPass(e.target.value)}
                right={<button onClick={()=>setSiShowPw(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{siShowPw?<EyeOff size={13}/>:<Eye size={13}/>}</button>}/>
            </div>
            <div style={{ textAlign:'right', marginBottom:14 }}>
              <span onClick={()=>navigate('/forgot-password')} style={{ color:P, fontSize:11.5, fontWeight:600, cursor:'pointer', fontFamily:FONT }}>Forgot password?</span>
            </div>

            <ErrBox msg={siErr}/>

            <button className="pb" onClick={login} disabled={siLoad} style={btnStyle(siLoad)}>
              {siLoad ? 'Signing in...' : 'Sign In'}
            </button>
            <OR/>
            <GoogleBtn onClick={handleGoogle} loading={gLoad}/>
            <p style={{ color:MU, fontSize:12, textAlign:'center', marginTop:12, fontFamily:FONT }}>
              No account?{' '}<span onClick={goSignup} style={{ color:P, fontWeight:700, cursor:'pointer' }}>Create one free</span>
            </p>
          </div>

          {/* ── SIGN UP ── */}
          <div className={`fp su-f${isSignup?' am':''}`}>
            {/* Mobile logo */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:GRAD, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:8, boxShadow:`0 6px 18px ${P}35` }}>
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/><circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/><circle cx="16" cy="16" r="3.5" fill="white"/><line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/><line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/></svg>
              </div>
              <span style={{ color:TX, fontWeight:800, fontSize:13, letterSpacing:0.5, fontFamily:FONT }}>RecruitHub</span>
            </div>
            <h2 style={{ color:TX, fontWeight:700, fontSize:20, margin:'0 0 2px', textAlign:'center', fontFamily:FONT }}>Create account</h2>
            <p style={{ color:MU, fontSize:12, textAlign:'center', margin:'0 0 12px', fontFamily:FONT }}>Join RecruitHub and find your next opportunity</p>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div><Lbl c="Full Name"/><Field icon={User} placeholder="Your full name" value={su.name} onChange={e=>set('name',e.target.value)}/></div>
              <div><Lbl c="Email address"/><Field icon={Mail} type="email" placeholder="you@example.com" value={su.email} onChange={e=>set('email',e.target.value)}/></div>
              {/* Password row — stacks on mobile */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }} className="pw-grid">
                <div><Lbl c="Password"/>
                  <Field icon={Lock} type={suShowPw?'text':'password'} placeholder="Password" value={su.password} onChange={e=>set('password',e.target.value)}
                    right={<button onClick={()=>setSuShowPw(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{suShowPw?<EyeOff size={13}/>:<Eye size={13}/>}</button>}/>
                </div>
                <div><Lbl c="Confirm"/>
                  <Field icon={Lock} type={suShowCp?'text':'password'} placeholder="Confirm" value={su.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)}
                    right={<button onClick={()=>setSuShowCp(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{suShowCp?<EyeOff size={13}/>:<Eye size={13}/>}</button>}/>
                </div>
              </div>
            </div>

            <ErrBox msg={suErr}/>

            <button className="pb" onClick={signup} disabled={suLoad} style={{ ...btnStyle(suLoad), marginTop:10 }}>
              {suLoad ? 'Creating account...' : 'Create Account'}
            </button>
            <OR/>
            <GoogleBtn onClick={handleGoogle} loading={gLoad}/>
            <p style={{ color:MU, fontSize:12, textAlign:'center', marginTop:10, fontFamily:FONT }}>
              Have an account?{' '}<span onClick={goSignin} style={{ color:P, fontWeight:700, cursor:'pointer' }}>Sign in</span>
            </p>
          </div>

          {/* ── OVERLAY PANEL ── */}
          <div className={`overlay-panel ${isSignup?'su':'si'}`}>
            <div style={{ animation:'floatY 3.5s ease-in-out infinite', marginBottom:12 }}>
              <div style={{ width:54, height:54, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 20px rgba(0,0,0,0.16)', backdropFilter:'blur(8px)' }}>
                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="3.5" fill="white"/>
                  <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <h2 style={{ color:'#fff', fontWeight:700, fontSize:20, textAlign:'center', margin:'0 0 5px', fontFamily:FONT }}>
              {isSignup ? 'Welcome Back!' : 'Hello, Friend!'}
            </h2>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:9, textAlign:'center', letterSpacing:2.5, margin:'0 0 8px', fontWeight:600, fontFamily:FONT }}>
              CONNECT · HIRE · GROW
            </p>
            <p style={{ color:'rgba(255,255,255,0.8)', textAlign:'center', fontSize:12, lineHeight:1.65, marginBottom:16, maxWidth:190, fontFamily:FONT }}>
              {isSignup ? 'Already have an account? Sign in to continue.' : 'New here? Register to track applications and land your dream job.'}
            </p>
            <GhostBtn onClick={isSignup ? goSignin : goSignup}>
              {isSignup ? 'Sign In' : 'Sign Up'}
            </GhostBtn>
            <div style={{ marginTop:14, width:'100%', maxWidth:185, animation:'floatY 4s ease-in-out infinite 0.6s' }}>
              <Illus/>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
