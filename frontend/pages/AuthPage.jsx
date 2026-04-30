import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/api";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { auth, provider, signInWithPopup } from "../config/firebase";

const P  = '#6C63FF';
const S  = '#3ECFCF';
const BG = '#0A0F1E';
const SF = '#111827';
const CARD = '#1A2235';
const BR = '#2D3748';
const TX = '#F0F4FF';
const MU = '#8892A4';
const ER = '#FF6B6B';
const GRAD = `linear-gradient(135deg,${P},${S})`;

const inp = (focus) => ({
  width:'100%', padding:'9px 12px 9px 36px', borderRadius:10,
  border:`1.5px solid ${focus ? P : BR}`,
  background: SF, color: TX, fontSize:13, outline:'none',
  boxSizing:'border-box', transition:'border-color 0.2s', fontFamily:'inherit',
});

function Field({ icon: Icon, type='text', placeholder, value, onChange, right }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position:'relative', marginBottom:14 }}>
      <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color: focus ? P : MU, display:'flex', pointerEvents:'none', zIndex:1 }}>
        <Icon size={15}/>
      </div>
      <input type={type} placeholder={placeholder} value={value} onChange={onChange}
        style={inp(focus)} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}/>
      {right && <div style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', zIndex:1 }}>{right}</div>}
    </div>
  );
}

function GenderSelect({ value, onChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position:'relative', marginBottom:14 }}>
      <div style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color: focus ? P : MU, display:'flex', pointerEvents:'none', zIndex:1 }}>
        <User size={15}/>
      </div>
      <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...inp(focus), paddingLeft:40, appearance:'none', color: value ? TX : MU }}>
        <option value="" disabled style={{ background: CARD }}>Gender</option>
        {['Male','Female','Other'].map(g => <option key={g} value={g.toLowerCase()} style={{ background: CARD, color: TX }}>{g}</option>)}
      </select>
    </div>
  );
}

const SocialRow = ({ onGoogle, googleLoading }) => (
  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
    <button
      onClick={onGoogle}
      disabled={googleLoading}
      className="social-btn"
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px',
        borderRadius:12, border:`1px solid ${BR}`, background: SF, cursor: googleLoading ? 'not-allowed' : 'pointer',
        transition:'all 0.2s', fontFamily:'inherit', color: TX, fontWeight:600, fontSize:13,
        opacity: googleLoading ? 0.7 : 1 }}>
      {googleLoading
        ? <span style={{ width:17, height:17, border:`2px solid ${MU}`, borderTopColor: TX,
            borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }}/>
        : <svg width="17" height="17" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
      }
      {googleLoading ? 'Signing in...' : 'Google'}
    </button>
    <button className="social-btn"
      style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px',
        borderRadius:12, border:`1px solid ${BR}`, background: SF, cursor:'pointer',
        transition:'all 0.2s', fontFamily:'inherit', color: TX, fontWeight:600, fontSize:13 }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
      Apple
    </button>
  </div>
);

const Divider = () => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
    <div style={{ flex:1, height:1, background: BR }}/>
    <span style={{ color: MU, fontSize:12 }}>Or</span>
    <div style={{ flex:1, height:1, background: BR }}/>
  </div>
);

const Label = ({ children }) => (
  <label style={{ display:'block', color: MU, fontSize:11, fontWeight:600, marginBottom:5, letterSpacing:0.4, textTransform:'uppercase' }}>{children}</label>
);

function ErrBox({ msg }) {
  if (!msg) return null;
  return <div style={{ marginBottom:12, padding:'10px 14px', borderRadius:10, background:'rgba(255,107,107,0.12)', border:`1px solid ${ER}55`, color: ER, fontSize:13 }}>{msg}</div>;
}

function GhostBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ padding:'11px 32px', borderRadius:24, border:'2px solid rgba(255,255,255,0.85)', background:'transparent', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' }}
      onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.18)'; }}
      onMouseLeave={e => { e.currentTarget.style.background='transparent'; }}>
      {children}
    </button>
  );
}

const Logo = ({ size=44 }) => (
  <div style={{ width:size, height:size, borderRadius:size*0.3, background: GRAD, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${P}55`, animation:'floatY 4s ease-in-out infinite' }}>
    <svg width={size*0.5} height={size*0.5} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
      <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
      <circle cx="16" cy="16" r="3.5" fill="white"/>
      <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
      <line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  </div>
);

export default function AuthPage({ mode: modeProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode     = modeProp || (location.pathname === '/signup' ? 'signup' : 'signin');
  const isSignup = mode === 'signup';
  const goSignin = () => navigate('/login');
  const goSignup = () => navigate('/signup');

  const [siEmail,  setSiEmail]  = useState('');
  const [siPass,   setSiPass]   = useState('');
  const [siShowPw, setSiShowPw] = useState(false);
  const [siErr,    setSiErr]    = useState('');
  const [siLoad,   setSiLoad]   = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  const handleGoogle = async () => {
    setGoogleLoad(true); setSiErr(''); setSuErr('');
    try {
      const result = await signInWithPopup(auth, provider);
      const gUser  = result.user;
      const r = await authService.googleLogin({
        name:     gUser.displayName,
        email:    gUser.email,
        googleId: gUser.uid,
        photoURL: gUser.photoURL,
      });
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else {
        setSiErr(r.error || 'Google login failed');
        setSuErr(r.error || 'Google login failed');
      }
    } catch (err) {
      const msg = err.code === 'auth/popup-closed-by-user'
        ? 'Popup closed. Please try again.'
        : err.message || 'Google login failed';
      setSiErr(msg); setSuErr(msg);
    } finally { setGoogleLoad(false); }
  };

  const [su, setSu] = useState({ name:'', email:'', password:'', confirmPassword:'', phoneNumber:'', gender:'' });
  const [suShowPw, setSuShowPw] = useState(false);
  const [suShowCp, setSuShowCp] = useState(false);
  const [suErr,    setSuErr]    = useState('');
  const [suLoad,   setSuLoad]   = useState(false);
  const set = (k,v) => setSu(p => ({ ...p, [k]:v }));

  const login = async () => {
    if (!siEmail || !siPass) { setSiErr('Please fill all fields'); return; }
    setSiLoad(true); setSiErr('');
    try {
      const r = await authService.login(siEmail, siPass);
      if (r.success) { localStorage.setItem('user', JSON.stringify(r.user)); localStorage.setItem('role', r.user.role); navigate(r.user.role==='admin'?'/dashboard':'/userdashboard'); }
      else setSiErr(r.error || 'Login failed');
    } catch { setSiErr('Connection error'); } finally { setSiLoad(false); }
  };

  const signup = async () => {
    const { name, email, password, confirmPassword } = su;
    if (!name||!email||!password||!confirmPassword) { setSuErr('Please fill all fields'); return; }
    if (password !== confirmPassword) { setSuErr('Passwords do not match'); return; }
    setSuLoad(true); setSuErr('');
    try {
      const r = await authService.signup(su);
      if (r.success) { localStorage.setItem('user', JSON.stringify(r.user)); localStorage.setItem('role', r.user.role); navigate(r.user.role==='admin'?'/dashboard':'/userdashboard'); }
      else setSuErr(r.error || 'Signup failed');
    } catch { setSuErr('Connection error'); } finally { setSuLoad(false); }
  };

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;} body{margin:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:0.35;transform:scale(1)}50%{opacity:0.65;transform:scale(1.06)}}
        .auth-card{animation:fadeUp 0.45s ease;}
        .overlay-panel{position:absolute;top:0;height:100%;width:42%;z-index:10;background:linear-gradient(135deg,${P},${S});display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 24px;transition:left 0.6s cubic-bezier(0.4,0,0.2,1),border-radius 0.6s cubic-bezier(0.4,0,0.2,1);}
        .overlay-panel.signin{left:58%;border-radius:20px 0 0 20px;}
        .overlay-panel.signup{left:0%;border-radius:0 20px 20px 0;}
        .form-panel{position:absolute;top:0;height:100%;width:58%;display:flex;flex-direction:column;justify-content:flex-start;align-items:stretch;padding:20px 36px;overflow-y:auto;transition:opacity 0.4s ease,transform 0.4s ease;scrollbar-width:none;}
        .form-panel::-webkit-scrollbar{display:none;}
        .form-panel .form-inner{margin:auto 0;padding:8px 0;}
        .form-panel.signin-form{left:0;opacity:${isSignup?0:1};transform:${isSignup?'translateX(-24px)':'none'};pointer-events:${isSignup?'none':'auto'};}
        .form-panel.signup-form{right:0;opacity:${isSignup?1:0};transform:${isSignup?'none':'translateX(24px)'};pointer-events:${isSignup?'auto':'none'};}
        @media(min-width:600px) and (max-width:959px){.overlay-panel{width:40%;padding:20px 16px;}.overlay-panel.signin{left:60%;}.form-panel{width:60%;padding:20px 22px;}.overlay-desc{display:none!important;}}
        @media(max-width:599px){
          .auth-wrapper{flex-direction:column!important;max-width:100%!important;min-height:100vh!important;border-radius:0!important;overflow-y:auto!important;background:${BG}!important;}
          .overlay-panel{display:none!important;}
          .form-panel{position:static!important;width:100%!important;padding:24px 20px 36px!important;padding-top:72px!important;opacity:1!important;transform:none!important;pointer-events:auto!important;display:none;}
          .form-panel.active-mobile{display:flex!important;}
          .mobile-tabs{display:flex!important;}
        }
        @media(min-width:600px){.mobile-tabs{display:none!important;}}
        .social-btn:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,0.4)!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        .pill-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px ${P}66!important;}
        .pill-btn:active{transform:scale(0.98);}
        input::placeholder,select::placeholder{color:${MU};}
        select option{background:${CARD};}
      `}</style>

      {/* Background */}
      <div style={{ minHeight:'100vh', background:`radial-gradient(ellipse at 20% 50%,${P}22 0%,transparent 60%),radial-gradient(ellipse at 80% 50%,${S}18 0%,transparent 60%),${BG}`, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px', fontFamily:'Inter,-apple-system,sans-serif', position:'relative', overflow:'hidden' }}>
        {/* Blobs */}
        <div style={{ position:'fixed', top:'-8%', left:'-4%', width:300, height:300, borderRadius:'50%', background:`radial-gradient(circle,${P}33 0%,transparent 70%)`, animation:'pulse 5s ease-in-out infinite', pointerEvents:'none' }}/>
        <div style={{ position:'fixed', bottom:'-8%', right:'-4%', width:260, height:260, borderRadius:'50%', background:`radial-gradient(circle,${S}28 0%,transparent 70%)`, animation:'pulse 6s ease-in-out infinite 1.5s', pointerEvents:'none' }}/>

        {/* Card */}
        <div className="auth-card auth-wrapper" style={{ display:'flex', width:'100%', maxWidth:780, minHeight:520, background: CARD, borderRadius:24, overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.65)', border:`1px solid ${BR}`, position:'relative' }}>

          {/* Mobile tabs */}
          <div className="mobile-tabs" style={{ position:'sticky', top:0, left:0, right:0, zIndex:20, display:'none', background: CARD, borderBottom:`1px solid ${BR}` }}>
            {[{key:'signin',label:'Sign In'},{key:'signup',label:'Sign Up'}].map(({key,label}) => (
              <button key={key} onClick={key==='signin'?goSignin:goSignup}
                style={{ flex:1, padding:'14px', border:'none', background:'transparent', color:mode===key?P:MU, fontWeight:mode===key?700:400, fontSize:14, cursor:'pointer', borderBottom:mode===key?`2px solid ${P}`:'2px solid transparent', transition:'all 0.2s', fontFamily:'inherit' }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── SIGN IN FORM ── */}
          <div className={`form-panel signin-form${!isSignup?' active-mobile':''}`}>
            <div className="form-inner">
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:16 }}>
              <Logo size={44}/>
              <span style={{ color:TX, fontWeight:800, fontSize:15, marginTop:8, letterSpacing:0.4 }}>RecruitHub</span>
              <span style={{ color:S, fontWeight:600, fontSize:9, letterSpacing:2, marginTop:2 }}>CONNECT · HIRE · GROW</span>
            </div>
            <h2 style={{ color:TX, fontWeight:800, fontSize:19, margin:'0 0 3px', textAlign:'center' }}>Welcome Back</h2>
            <p style={{ color:MU, fontSize:12, textAlign:'center', margin:'0 0 14px' }}>Login to view your recruitment updates.</p>

            <SocialRow onGoogle={handleGoogle} googleLoading={googleLoad}/>
            <Divider/>

            <div style={{ marginBottom:10 }}>
              <Label>Email</Label>
              <Field icon={Mail} type="email" placeholder="Enter your email" value={siEmail} onChange={e => setSiEmail(e.target.value)}/>
            </div>
            <div style={{ marginBottom:6 }}>
              <Label>Password</Label>
              <Field icon={Lock} type={siShowPw?'text':'password'} placeholder="Enter your Password" value={siPass} onChange={e => setSiPass(e.target.value)}
                right={<button onClick={() => setSiShowPw(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{siShowPw?<EyeOff size={15}/>:<Eye size={15}/>}</button>}/>
            </div>
            <div style={{ textAlign:'right', marginBottom:14 }}>
              <span onClick={() => navigate('/forgot-password')} style={{ color:P, fontSize:11, fontWeight:600, cursor:'pointer' }}>Forgot Password?</span>
            </div>
            <ErrBox msg={siErr}/>
            <button className="pill-btn" onClick={login} disabled={siLoad}
              style={{ width:'100%', padding:'13px', borderRadius:50, border:'none', fontWeight:700, fontSize:15, background:GRAD, color:'#fff', cursor:siLoad?'not-allowed':'pointer', opacity:siLoad?0.7:1, transition:'all 0.2s', fontFamily:'inherit', letterSpacing:0.3, boxShadow:`0 6px 20px ${P}44` }}>
              {siLoad?'Signing in…':'Log In'}
            </button>
            <p style={{ color:MU, fontSize:13, textAlign:'center', marginTop:18 }}>
              No account?{' '}<span onClick={goSignup} style={{ color:S, fontWeight:700, cursor:'pointer' }}>Create an account</span>
            </p>
            </div>{/* end form-inner */}
          </div>

          {/* ── SIGN UP FORM ── */}
          <div className={`form-panel signup-form${isSignup?' active-mobile':''}`}>
            <div className="form-inner">
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:16 }}>
              <Logo size={40}/>
              <span style={{ color:TX, fontWeight:800, fontSize:15, marginTop:8, letterSpacing:0.4 }}>RecruitHub</span>
              <span style={{ color:S, fontWeight:600, fontSize:9, letterSpacing:2, marginTop:2 }}>CONNECT · HIRE · GROW</span>
            </div>
            <h2 style={{ color:TX, fontWeight:800, fontSize:19, margin:'0 0 3px', textAlign:'center' }}>Create Account</h2>
            <p style={{ color:MU, fontSize:12, textAlign:'center', margin:'0 0 14px' }}>Create your account for daily updates.</p>

            <SocialRow onGoogle={handleGoogle} googleLoading={googleLoad}/>
            <Divider/>

            <div style={{ marginBottom:8 }}><Label>Full Name</Label><Field icon={User} placeholder="Enter your full name" value={su.name} onChange={e => set('name',e.target.value)}/></div>
            <div style={{ marginBottom:8 }}><Label>Email</Label><Field icon={Mail} type="email" placeholder="Enter your email" value={su.email} onChange={e => set('email',e.target.value)}/></div>
            <div className="grid-2col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:0 }}>
              <div><Label>Password</Label><Field icon={Lock} type={suShowPw?'text':'password'} placeholder="Password" value={su.password} onChange={e => set('password',e.target.value)} right={<button onClick={() => setSuShowPw(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{suShowPw?<EyeOff size={14}/>:<Eye size={14}/>}</button>}/></div>
              <div><Label>Confirm</Label><Field icon={Lock} type={suShowCp?'text':'password'} placeholder="Confirm" value={su.confirmPassword} onChange={e => set('confirmPassword',e.target.value)} right={<button onClick={() => setSuShowCp(p=>!p)} style={{ background:'none', border:'none', cursor:'pointer', color:MU, display:'flex', padding:0 }}>{suShowCp?<EyeOff size={14}/>:<Eye size={14}/>}</button>}/></div>
            </div>
            <ErrBox msg={suErr}/>
            <button className="pill-btn" onClick={signup} disabled={suLoad}
              style={{ width:'100%', padding:'13px', borderRadius:50, border:'none', fontWeight:700, fontSize:15, background:GRAD, color:'#fff', cursor:suLoad?'not-allowed':'pointer', opacity:suLoad?0.7:1, transition:'all 0.2s', fontFamily:'inherit', letterSpacing:0.3, boxShadow:`0 6px 20px ${P}44` }}>
              {suLoad?'Creating account…':'Create Account'}
            </button>
            <p style={{ color:MU, fontSize:13, textAlign:'center', marginTop:14 }}>
              Have an account?{' '}<span onClick={goSignin} style={{ color:S, fontWeight:700, cursor:'pointer' }}>Sign In</span>
            </p>
            </div>{/* end form-inner */}
          </div>

          {/* ── SLIDING OVERLAY PANEL ── */}
          <div className={`overlay-panel ${isSignup?'signup':'signin'}`}>
            <div style={{ animation:'floatY 3.5s ease-in-out infinite', marginBottom:20 }}>
              <div style={{ width:64, height:64, borderRadius:18, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.25)', backdropFilter:'blur(8px)' }}>
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.65)" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="3.5" fill="white"/>
                  <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                </svg>
              </div>
            </div>
            <h2 style={{ color:'#fff', fontWeight:800, fontSize:22, textAlign:'center', margin:'0 0 4px' }}>{isSignup?'Welcome Back!':'Hello, Friend!'}</h2>
            <p style={{ color:'rgba(255,255,255,0.6)', fontSize:11, textAlign:'center', letterSpacing:2, margin:'0 0 10px', fontWeight:600 }}>CONNECT · HIRE · GROW</p>
            <p className="overlay-desc" style={{ color:'rgba(255,255,255,0.82)', textAlign:'center', fontSize:13, lineHeight:1.75, marginBottom:22, maxWidth:220 }}>
              {isSignup?'Sign in with your credentials to continue managing your recruitment pipeline.':'Register now to track applications, schedule interviews, and land your dream job.'}
            </p>
            <GhostBtn onClick={isSignup?goSignin:goSignup}>{isSignup?'Sign In':'Sign Up'}</GhostBtn>

            {/* Animated SVG illustration */}
            <div style={{ marginTop:24, width:'100%', display:'flex', justifyContent:'center' }}>
              <svg width="190" height="170" viewBox="0 0 200 180" fill="none">
                <style>{`
                  .ilf{animation:floatY 3.5s ease-in-out infinite;}
                  .ilf2{animation:floatY 3.5s ease-in-out infinite 0.6s;}
                  .ilf3{animation:floatY 3.5s ease-in-out infinite 1.2s;}
                  .ilp{animation:ilPulse 2.4s ease-in-out infinite;}
                  .ils{animation:ilSpin 8s linear infinite;transform-origin:170px 30px;}
                  @keyframes ilPulse{0%,100%{opacity:0.5}50%{opacity:1}}
                  @keyframes ilSpin{to{transform:rotate(360deg)}}
                `}</style>
                <circle cx="100" cy="95" r="72" fill="rgba(255,255,255,0.04)"/>
                <g className="ilf">
                  <rect x="42" y="38" width="116" height="82" rx="8" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5"/>
                  <rect x="48" y="44" width="104" height="12" rx="4" fill="rgba(255,255,255,0.1)"/>
                  <circle cx="56" cy="50" r="2.5" fill="rgba(255,107,107,0.8)"/>
                  <circle cx="63" cy="50" r="2.5" fill="rgba(245,158,11,0.8)"/>
                  <circle cx="70" cy="50" r="2.5" fill="rgba(16,185,129,0.8)"/>
                  {[0,1,2].map(i => (
                    <g key={i}>
                      <circle cx="60" cy={66+i*16} r="5.5" fill="rgba(255,255,255,0.38)"/>
                      <rect x="70" y={63+i*16} width={30-i*3} height="3" rx="1.5" fill="rgba(255,255,255,0.52)"/>
                      <rect x="70" y={68+i*16} width={20-i*2} height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
                      <rect x="118" y={64+i*16} width="22" height="7" rx="3.5" fill={['rgba(108,99,255,0.85)','rgba(16,185,129,0.85)','rgba(62,207,207,0.85)'][i]}/>
                    </g>
                  ))}
                  <rect x="92" y="120" width="16" height="9" rx="2" fill="rgba(255,255,255,0.16)"/>
                  <rect x="80" y="129" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.13)"/>
                </g>
                <g className="ilf2">
                  <rect x="148" y="18" width="44" height="26" rx="8" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                  <circle cx="160" cy="31" r="6" fill="rgba(108,99,255,0.9)"/>
                  <rect x="170" y="27" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                  <rect x="170" y="32" width="11" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
                </g>
                <g className="ilf3">
                  <rect x="8" y="118" width="44" height="26" rx="8" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.22)" strokeWidth="1"/>
                  <circle cx="20" cy="131" r="6" fill="rgba(16,185,129,0.9)"/>
                  <polyline points="17,131 19.5,133.5 24,128.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <rect x="30" y="127" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.7)"/>
                  <rect x="30" y="132" width="11" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
                </g>
                <g className="ils">
                  <circle cx="170" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1" strokeDasharray="4 3"/>
                  <circle cx="170" cy="20" r="3" fill="rgba(255,255,255,0.5)"/>
                </g>
                <circle className="ilp" cx="178" cy="148" r="5" fill="rgba(108,99,255,0.7)"/>
                <circle cx="178" cy="148" r="2.5" fill="rgba(255,255,255,0.9)"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
