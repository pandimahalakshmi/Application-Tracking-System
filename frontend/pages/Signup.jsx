import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box } from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { authService } from "../services/api";

const C = {
  bg:      '#F0F4FF',
  surface: '#F0F4FF',
  card:    '#FFFFFF',
  border:  '#D1D9F0',
  primary: '#5B5BD6',
  grad:    'linear-gradient(135deg, #5B5BD6 0%, #7C3AED 100%)',
  text:    '#111827',
  muted:   '#4B5563',
  danger:  '#DC2626',
};

const inputStyle = (focus) => ({
  width: '100%', padding: '11px 14px 11px 40px', borderRadius: 10,
  border: `1.5px solid ${focus ? C.primary : C.border}`,
  background: focus ? '#F5F7FF' : C.surface,
  color: C.text, fontSize: 14, outline: 'none',
  boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: 'inherit',
  boxShadow: focus ? `0 0 0 3px ${C.primary}18` : 'none',
});

const labelStyle = { display: 'block', color: C.muted, fontSize: 12, fontWeight: 600, marginBottom: 6, letterSpacing: 0.3 };

function InputField({ label, type = 'text', placeholder, value, onChange, icon, right, onFocusChange }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex' }}>
          {icon(focus)}
        </div>
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => { setFocus(true); onFocusChange?.(true); }}
          onBlur={() => { setFocus(false); onFocusChange?.(false); }}
          style={inputStyle(focus)} />
        {right && <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>{right(focus)}</div>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, icon }) {
  const [focus, setFocus] = useState(false);
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, display: 'flex' }}>
          {icon(focus)}
        </div>
        <select value={value} onChange={onChange}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ ...inputStyle(focus), paddingLeft: 40, appearance: 'none', color: value ? C.text : C.muted }}>
          <option value="" disabled style={{ background: C.card, color: C.muted }}>Select Gender</option>
          {options.map(o => <option key={o.value} value={o.value} style={{ background: C.card, color: C.text }}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

const mailIcon  = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const lockIcon  = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const userIcon  = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const phoneIcon = (f) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={f ? C.primary : C.muted} strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '', gender: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCp, setShowCp]   = useState(false);
  const [error, setError]     = useState('');
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
    <Box sx={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 20% 30%, ${C.primary}14 0%, transparent 55%),
                   radial-gradient(ellipse at 80% 70%, #7C3AED10 0%, transparent 55%),
                   ${C.bg}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      p: '20px', fontFamily: 'Inter,-apple-system,sans-serif',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes pulse{0%,100%{opacity:0.3;transform:scale(1)}50%{opacity:0.5;transform:scale(1.05)}}
        .su-card{animation:fadeSlide 0.4s ease;}
        input::placeholder{color:#9CA3AF;}
        select option{background:#FFFFFF;color:#111827;}
        .submit-btn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 28px rgba(91,91,214,0.45)!important;}
        .submit-btn:active{transform:scale(0.98);}
      `}</style>

      {/* Blobs */}
      <div style={{ position:'fixed', top:'-10%', right:'-5%', width:280, height:280, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.12) 0%,transparent 70%)', animation:'pulse 5s ease-in-out infinite', pointerEvents:'none' }}/>
      <div style={{ position:'fixed', bottom:'-10%', left:'-5%', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle,rgba(91,91,214,0.15) 0%,transparent 70%)', animation:'pulse 6s ease-in-out infinite 1s', pointerEvents:'none' }}/>

      {/* Card */}
      <div className="su-card" style={{
        width: '100%', maxWidth: 420,
        background: C.card, borderRadius: 24, padding: '32px 28px',
        border: `1px solid ${C.border}`,
        boxShadow: '0 16px 48px rgba(91,91,214,0.14), 0 3px 12px rgba(0,0,0,0.06)',
      }}>

        {/* Logo */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:24 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 15,
            background: C.grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
            boxShadow: '0 8px 24px rgba(91,91,214,0.35)',
            animation: 'floatUp 4s ease-in-out infinite',
          }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.35)" strokeWidth="2"/>
              <circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.6)" strokeWidth="2"/>
              <circle cx="16" cy="16" r="3.5" fill="white"/>
              <line x1="16" y1="3" x2="16" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="16" y1="24" x2="16" y2="29" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="3" y1="16" x2="8" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
              <line x1="24" y1="16" x2="29" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span style={{ color: C.text, fontWeight: 800, fontSize: 17, letterSpacing: 0.5 }}>RecruitHub</span>
          <span style={{ color: C.primary, fontWeight: 600, fontSize: 10, letterSpacing: 2, marginTop: 2 }}>CONNECT · HIRE · GROW</span>
        </div>

        <h2 style={{ color: C.text, fontWeight: 800, fontSize: 21, margin: '0 0 4px', textAlign: 'center' }}>Create Account</h2>
        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', margin: '0 0 20px' }}>Join RecruitHub and find your next opportunity</p>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <InputField label="Full Name" placeholder="Enter your full name" value={form.name} onChange={e => set('name', e.target.value)} icon={userIcon}/>
          <InputField label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} icon={mailIcon}/>
          <InputField label="Password" type={showPw ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={e => set('password', e.target.value)} icon={lockIcon}
            right={() => <button onClick={() => setShowPw(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color: C.muted, display:'flex', padding:0 }}>{showPw ? <EyeOff size={15}/> : <Eye size={15}/>}</button>}/>
          <InputField label="Confirm Password" type={showCp ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} icon={lockIcon}
            right={() => <button onClick={() => setShowCp(p => !p)} style={{ background:'none', border:'none', cursor:'pointer', color: C.muted, display:'flex', padding:0 }}>{showCp ? <EyeOff size={15}/> : <Eye size={15}/>}</button>}/>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <InputField label="Phone Number" placeholder="Phone number" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)} icon={phoneIcon}/>
            <SelectField label="Gender" value={form.gender} onChange={e => set('gender', e.target.value)} icon={userIcon}
              options={[{ value:'male', label:'Male' },{ value:'female', label:'Female' },{ value:'other', label:'Other' }]}/>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: C.danger, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Submit */}
        <button className="submit-btn" onClick={signup} disabled={loading}
          style={{
            width: '100%', marginTop: 18, padding: '13px', borderRadius: 50, border: 'none',
            fontWeight: 700, fontSize: 14, background: C.grad, color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: 0.3,
            boxShadow: '0 6px 20px rgba(91,91,214,0.35)',
          }}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>

        <p style={{ color: C.muted, fontSize: 13, textAlign: 'center', marginTop: 16 }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/')} style={{ color: C.primary, fontWeight: 700, cursor: 'pointer' }}>
            Sign in
          </span>
        </p>
      </div>
    </Box>
  );
}
