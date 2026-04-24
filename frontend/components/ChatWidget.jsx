import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const P = '#4F46E5';
const GRAD = `linear-gradient(135deg,#4F46E5,#6366F1)`;

const BOT_RESPONSES = {
  'about my ats': 'RecruitHub is an AI-powered Applicant Tracking System that helps companies hire smarter and faster. We serve 1,000+ companies worldwide. 🚀',
  'features': 'RecruitHub offers:\n• 🤖 AI Candidate Matching\n• ⚙️ Workflow Automation\n• 📅 Interview Scheduling\n• 📊 Real-time Analytics\n• 🔔 Smart Notifications',
  'pricing': 'We have 3 plans:\n• 🆓 Starter — Free\n• 💼 Growth — ₹2,999/mo\n• 🏢 Enterprise — Custom\n\nWould you like to see a demo?',
  'schedule a demo': '__DEMO__',
};

const QUICK_REPLIES = ['About My ATS', 'Features', 'Pricing', 'Schedule a Demo'];

function TypingIndicator() {
  return (
    <div style={{ display:'flex', gap:4, alignItems:'center', padding:'10px 14px', background:'#F3F4F6', borderRadius:'16px 16px 16px 4px', width:'fit-content' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#9CA3AF', animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.from === 'bot';
  if (msg.type === 'demo') {
    return (
      <div style={{ display:'flex', justifyContent:'flex-start', marginBottom:12, animation:'fadeMsg 0.3s ease' }}>
        <div style={{ maxWidth:'80%' }}>
          <div style={{ background:'#F3F4F6', borderRadius:'16px 16px 16px 4px', padding:'12px 14px', fontSize:13, color:'#374151', lineHeight:1.6, marginBottom:8 }}>
            Great! Let's get you started with a personalized demo. 🎯
          </div>
          <a href="/signup" style={{ display:'inline-block', padding:'10px 20px', background:GRAD, color:'#fff', borderRadius:10, fontWeight:700, fontSize:13, textDecoration:'none', transition:'all 0.2s' }}
            onMouseEnter={e => e.target.style.transform='translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform='none'}>
            Request Demo →
          </a>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display:'flex', justifyContent: isBot ? 'flex-start' : 'flex-end', marginBottom:12, animation:'fadeMsg 0.3s ease' }}>
      {isBot && (
        <div style={{ width:28, height:28, borderRadius:'50%', background:GRAD, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginRight:8, alignSelf:'flex-end' }}>
          <span style={{ fontSize:13 }}>🤖</span>
        </div>
      )}
      <div style={{
        maxWidth:'75%', padding:'10px 14px', borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
        background: isBot ? '#F3F4F6' : GRAD,
        color: isBot ? '#374151' : '#fff',
        fontSize:13, lineHeight:1.65, whiteSpace:'pre-line',
        boxShadow: isBot ? 'none' : `0 4px 12px ${P}33`,
      }}>
        {msg.text}
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id:1, from:'bot', text:'Hi 👋\nHow can I help you today?', type:'text' }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showQuick, setShowQuick] = useState(true);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const addBotReply = (text, type = 'text') => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => [...m, { id: Date.now(), from:'bot', text, type }]);
    }, 900);
  };

  const handleSend = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;
    setInput('');
    setShowQuick(false);
    setMessages(m => [...m, { id: Date.now(), from:'user', text: trimmed, type:'text' }]);

    const key = trimmed.toLowerCase();
    const matched = Object.keys(BOT_RESPONSES).find(k => key.includes(k));
    if (matched) {
      const resp = BOT_RESPONSES[matched];
      if (resp === '__DEMO__') addBotReply('', 'demo');
      else addBotReply(resp);
    } else {
      addBotReply("Thanks for your message! Our team will get back to you shortly. Meanwhile, feel free to explore our features or schedule a demo. 😊");
    }
  };

  const handleQuick = (label) => {
    handleSend(label);
  };

  return (
    <>
      <style>{`
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes fadeMsg { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .chat-btn:hover { transform:scale(1.08) !important; box-shadow:0 8px 28px ${P}55 !important; }
        .chat-btn:active { transform:scale(0.96) !important; }
        .quick-btn:hover { background:${P} !important; color:#fff !important; border-color:${P} !important; }
        .send-btn:hover { background:${P} !important; }
        @media(max-width:480px){
          .chat-window { width:calc(100vw - 24px) !important; right:12px !important; bottom:80px !important; }
        }
      `}</style>

      {/* ── Chat window ── */}
      {open && (
        <div className="chat-window" style={{
          position:'fixed', bottom:88, right:24, width:360, height:520,
          background:'#fff', borderRadius:20, boxShadow:'0 20px 60px rgba(0,0,0,0.18)',
          display:'flex', flexDirection:'column', zIndex:9999,
          animation:'slideUp 0.3s cubic-bezier(0.4,0,0.2,1)',
          border:'1px solid #E5E7EB', overflow:'hidden',
        }}>

          {/* Header */}
          <div style={{ background:GRAD, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🤖</div>
              <div>
                <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>RecruitHub AI</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <div style={{ width:7, height:7, borderRadius:'50%', background:'#34D399' }}/>
                  <span style={{ color:'rgba(255,255,255,0.8)', fontSize:11 }}>Online · Typically replies instantly</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'50%', width:30, height:30, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.35)'}
              onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', background:'#FAFAFA', scrollbarWidth:'thin', scrollbarColor:'#E5E7EB transparent' }}>
            {messages.map(msg => <Message key={msg.id} msg={msg}/>)}
            {typing && (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8, marginBottom:12, animation:'fadeMsg 0.3s ease' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:GRAD, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontSize:13 }}>🤖</span>
                </div>
                <TypingIndicator/>
              </div>
            )}
            {/* Quick replies */}
            {showQuick && !typing && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:4, animation:'fadeMsg 0.4s ease' }}>
                {QUICK_REPLIES.map(q => (
                  <button key={q} className="quick-btn" onClick={() => handleQuick(q)}
                    style={{ padding:'7px 14px', borderRadius:20, border:`1.5px solid ${P}`, background:'#fff', color:P, fontSize:12, fontWeight:600, cursor:'pointer', transition:'all 0.2s', fontFamily:'inherit' }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding:'10px 12px', borderTop:'1px solid #E5E7EB', background:'#fff', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{ flex:1, border:'1.5px solid #E5E7EB', borderRadius:12, padding:'9px 12px', fontSize:13, outline:'none', fontFamily:'inherit', color:'#374151', background:'#F9FAFB', transition:'border-color 0.2s' }}
              onFocus={e => e.target.style.borderColor=P}
              onBlur={e => e.target.style.borderColor='#E5E7EB'}
            />
            <button className="send-btn" onClick={() => handleSend()}
              style={{ width:36, height:36, borderRadius:'50%', background:GRAD, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating button ── */}
      <button className="chat-btn" onClick={() => setOpen(o => !o)}
        style={{
          position:'fixed', bottom:24, right:24, width:56, height:56,
          borderRadius:'50%', background:GRAD, border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:`0 6px 20px ${P}44`, zIndex:9999, transition:'all 0.25s',
          animation: !open ? 'pulse 3s ease-in-out infinite' : 'none',
        }}>
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        {/* Unread badge */}
        {unread > 0 && !open && (
          <div style={{ position:'absolute', top:-2, right:-2, width:18, height:18, borderRadius:'50%', background:'#EF4444', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'#fff', fontSize:10, fontWeight:700 }}>{unread}</span>
          </div>
        )}
      </button>
    </>
  );
}
