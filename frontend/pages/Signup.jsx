import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "../services/api";

const C = {
  bg:      '#0A0F1E',
  surface: '#111827',
  card:    '#1A2235',
  border:  '#2D3748',
  primary: '#6C63FF',
  grad:    'linear-gradient(135deg, #6C63FF 0%, #3ECFCF 100%)',
  text:    '#F0F4FF',
  muted:   '#8892A4',
  danger:  '#FF6B6B',
};

const inputStyle = (focus) => ({
  width:'100%', padding:'12px 14px 12px 40px', borderRadius:12,
  border:`1.5px solid ${focus ? C.primary : C.border}`,
  background: C.surface, color: C.text, fontSize:14, outline:'none',
  boxSizing:'border-box', transition:'border-color 0.2s', fontFamily:'inherit',
});

const labelStyle = { display:'block', color: C.muted, fontSize:12, fontWeight:600, marginBottom:6, letterSpacing:0.3 };

function InputField({ label, type='text', placeholder, value, onChange, icon, right, onFocusChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:0.5, display:'flex' }}>
          {icon(focus)}
        </div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => { setFocus(true); onFocusChange?.(true); }}
          onBlur={() => { setFocus(false); onFocusChange?.(false); }}
          style={inputStyle(focus)}/>
        {right && <div style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)' }}>{right(focus)}</div>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position:'relative' }}>
        <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', opacity:0.5, display:'flex' }}>
          {icon(focus)}
        </div>
        <select value={value} onChange={onChange}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...inputStyle(focus), paddingLeft:40, appearance:'none', color: value ? C.text : C.muted }}>
          <option value="" disabled style={{ background: C.card }}>Select Gender</option>
          {options.map(o => <option key={o.value} value={o.value} style={{ background: C.card, color: C.text }}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

const mailIcon = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? '#6C63FF' : '#8892A4'} strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const lockIcon = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? '#6C63FF' : '#8892A4'} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const userIcon = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? '#6C63FF' : '#8892A4'} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const phoneIcon = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? '#6C63FF' : '#8892A4'} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'', confirmPassword:'', phoneNumber:'', gender:'' });
  const [showPw, setShowPw] = useState(false);
  const [showCp, setShowCp] = useState(false);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const signup = async () => {
    const { name, email, password, confirmPassword, phoneNumber, gender } = form;
    if (!name || !email || !password || !confirmPassword || !phoneNumber || !gender) { setError('Please fill in all fields'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      const r = await authService.signup(form);
      if (r.success) {
        localStorage.setItem('user', JSON.stringify(r.user));
        localStorage.setItem('role', r.user.role);
        navigate(r.user.role === 'admin' ? '/dashboard' : '/userdashboard');
      } else { setError(r.error || 'Signup failed'); }
    } catch { setError('Connection error.'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight:'100vh', background: C.bg, display:'flex', alignItems:'center', justifyContent:'center', p:'20px', fontFamily:'Inter,-apple-system,sans-serif', position:'relative', overflow:'hidden' }}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:0.4;transform:scale(1)}50%{opacity:0.7;transform:scale(1.05)}}
        .su-card{animation:fadeSlide 0.5s ease;}
        input::placeholder,select::placeholder{color:#8892A4;}
        select option{background:#1A2235;color:#F0F4FF;}
        .social-btn:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,0,0,0.4)!important;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(108,99,255,0.5)!important;}
      `}</style>

      {/* Blobs */}
      <div style={{ position:'fixed', top:'-10%', right:'-5%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(62,207,207,0.2) 0%,transparent 70%)', animation:'pulse 5s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', left:'-5%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(108,99,255,0.25) 0%,transparent 70%)', animation:'pulse 6s ease-in-out infinite 1s', pointerEvents:'none' }}/>

      {/* Card */}
      <div className="su-card" style={{ width:'100%', maxWidth:420, background: C.card, borderRadius:24, padding:'32px 28px', border:`1px solid ${C.border}`, boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>

        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
          <div style={{ width:56, height:56, borderRadius:16, background: C.grad, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10, boxShadow:'0 8px 24px rgba(108,99,255,0.45)', animation:'floatUp 4s ease-in-out infinite' }}>
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
          <span style={{ color: C.text, fontWeight:800, fontSize:17, letterSpacing:0.5 }}>RecruitHub</span>
          <span style={{ color:'#3ECFCF', fontWeight:600, fontSize:10, letterSpacing:2, marginTop:2 }}>CONNECT · HIRE · GROW</span>
        </div>

        <h2 style={{ color: C.text, fontWeight:800, fontSize:22, margin:'0 0 4px', textAlign:'center' }}>Create Account</h2>
        <p style={{ color: C.muted, fontSize:13, textAlign:'center', margin:'0 0 22px' }}>Create your account for daily updates.</p>

        {/* Social */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:18 }}>
          {[
            { name:'Google', icon:<svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
            { name:'Apple', icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
          ].map(({ name, icon }) => (
            <button key={name} className="social-btn"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:12, border:`1px solid ${C.border}`, background: C.surface, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit', color: C.text, fontWeight:600, fontSize:13 }}>
              {icon} {name}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
          <div style={{ flex:1, height:1, background: C.border }}/>
          <span style={{ color: C.muted, fontSize:12 }}>Or</span>
          <div style={{ flex:1, height:1, background: C.border }}/>
        </div>

        {/* Fields */}
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          <InputField label="Full Name" placeholder="Enter your full name" value={form.name} onChange={e => set('name', e.target.value)} icon={userIcon}/>
          <InputField label="Email" type="email" placeholder="Enter your email" value={form.email} onChange={e => set('email', e.target.value)} icon={mailIcon}/>
          <InputField label="Password" type={showPw ? 'text' : 'password'} placeholder="Enter your Password" value={form.password} onChange={e => set('password', e.target.value)} icon={lockIcon}
            right={() => <button onClick={() => setShowPw(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color: C.muted, display:'flex', padding:0 }}>{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>}/>
          <InputField label="Confirm Password" type={showCp ? 'text' : 'password'} placeholder="Confirm your Password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} icon={lockIcon}
            right={() => <button onClick={() => setShowCp(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color: C.muted, display:'flex', padding:0 }}>{showCp ? <EyeOff size={15}/> : <Eye size={15}/>}</button>}/>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <InputField label="Phone Number" placeholder="Phone number" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} icon={phoneIcon}/>
            <SelectField label="Gender" value={form.gender} onChange={e => set('gender', e.target.value)} icon={userIcon}
              options={[{ value:'male', label:'Male' },{ value:'female', label:'Female' },{ value:'other', label:'Other' }]}/>
          </div>
        </div>

        {/* Error */}
        {error && <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:'rgba(255,107,107,0.12)', border:'1px solid rgba(255,107,107,0.3)', color: C.danger, fontSize:13 }}>{error}</div>}

        {/* Submit */}
        <button className="submit-btn" onClick={signup} disabled={loading}
          style={{ width:'100%', marginTop:20, padding:'14px', borderRadius:50, border:'none', fontWeight:700, fontSize:15, background: C.grad, color:'#fff', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition:'all 0.2s', fontFamily:'inherit', letterSpacing:0.3, boxShadow:'0 6px 20px rgba(108,99,255,0.4)' }}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p style={{ color: C.muted, fontSize:13, textAlign:'center', marginTop:18 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={{ color:'#3ECFCF', fontWeight:700, cursor:'pointer' }}>Sign In</span>
        </p>
      </div>
    </Box>
  );
}
