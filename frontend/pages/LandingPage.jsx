import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const C = {
  bg:'#FFFFFF', bg2:'#F8FAFF', bg3:'#EEF2FF',
  primary:'#4F46E5', pLight:'#6366F1', pDark:'#3730A3',
  accent:'#06B6D4', success:'#10B981', warning:'#F59E0B',
  text:'#111827', text2:'#374151', muted:'#6B7280', border:'#E5E7EB',
};

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity:v?1:0, transform:v?'none':'translateY(24px)', transition:`opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

/* Testimonials carousel */
function TestimonialCarousel({ items }) {
  const ref = useRef(null);
  return (
    <div ref={ref} style={{ display:'flex', gap:16, overflowX:'auto', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', paddingBottom:8, scrollbarWidth:'none' }}>
      <style>{`.tcard::-webkit-scrollbar{display:none}`}</style>
      {items.map((t, i) => (
        <div key={i} style={{ minWidth:'82vw', maxWidth:320, scrollSnapAlign:'start', background:'#fff', borderRadius:16, padding:'24px 20px', boxShadow:'0 4px 20px rgba(79,70,229,0.1)', border:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', gap:2, marginBottom:12 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color:'#FBBF24', fontSize:14 }}>★</span>)}
          </div>
          <p style={{ color:C.text2, fontSize:14, lineHeight:1.75, marginBottom:16, fontStyle:'italic' }}>"{t.quote}"</p>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15, flexShrink:0 }}>{t.avatar}</div>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:C.text }}>{t.name}</div>
              <div style={{ fontSize:11, color:C.muted }}>{t.role} · {t.company}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const testimonials = [
    { quote:'RecruitHub cut our time-to-hire from 45 days to 15. The AI matching is incredibly accurate.', name:'Priya Sharma', role:'HR Director', company:'TechCorp', avatar:'P' },
    { quote:'Finally one tool that does everything. No more switching between 5 different apps.', name:'Rahul Mehta', role:'Talent Lead', company:'StartupHub', avatar:'R' },
    { quote:'The analytics dashboard gives us insights we never had before. Highly recommended.', name:'Ananya Iyer', role:'Recruitment Manager', company:'GlobalSoft', avatar:'A' },
  ];

  return (
    <div style={{ fontFamily:'Inter,-apple-system,sans-serif', background:C.bg, color:C.text, overflowX:'hidden' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        html{scroll-behavior:smooth;}
        body{-webkit-font-smoothing:antialiased;}

        /* ── Buttons ── */
        .btn-p{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;background:linear-gradient(135deg,${C.primary},${C.pLight});color:#fff;border:none;border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;transition:all 0.2s;font-family:inherit;width:100%;text-align:center;}
        .btn-p:active{transform:scale(0.97);}
        .btn-o{display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;background:transparent;color:${C.primary};border:2px solid ${C.primary};border-radius:12px;font-weight:700;font-size:15px;cursor:pointer;transition:all 0.2s;font-family:inherit;width:100%;text-align:center;}
        .btn-o:active{background:${C.primary};color:#fff;transform:scale(0.97);}

        /* ── Cards ── */
        .card{background:#fff;border:1px solid ${C.border};border-radius:16px;padding:20px;box-shadow:0 2px 12px rgba(0,0,0,0.06);}

        /* ── Nav link ── */
        .nav-item{display:block;padding:16px 0;font-size:18px;font-weight:600;color:${C.text};text-decoration:none;border-bottom:1px solid ${C.border};cursor:pointer;}

        /* ── Desktop overrides ── */
        @media(min-width:769px){
          .btn-p,.btn-o{width:auto;}
          .hero-btns{flex-direction:row!important;}
          .metrics-grid{grid-template-columns:repeat(4,1fr)!important;}
          .features-grid{grid-template-columns:repeat(3,1fr)!important;}
          .problems-grid{grid-template-columns:repeat(3,1fr)!important;}
          .footer-grid{grid-template-columns:2fr 1fr 1fr 1fr!important;}
          .hero-inner{grid-template-columns:1fr 1fr!important;gap:60px!important;}
          .hide-desktop{display:none!important;}
          .show-desktop{display:flex!important;}
          .testimonials-wrap{display:grid!important;grid-template-columns:repeat(3,1fr)!important;gap:20px!important;}
          .testimonials-wrap>div{min-width:unset!important;max-width:unset!important;}
        }
        @media(max-width:768px){
          .show-desktop{display:none!important;}
        }
      `}</style>

      {/* ── Full-screen mobile menu overlay ── */}
      {menuOpen && (
        <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:200, padding:'0 24px', display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', height:64, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><circle cx="16" cy="16" r="3.5" fill="white"/></svg>
              </div>
              <span style={{ fontWeight:800, fontSize:17, color:C.text }}>RecruitHub</span>
            </div>
            <button onClick={() => setMenuOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', padding:8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <nav style={{ flex:1, paddingTop:8 }}>
            {['Home','Features','Solutions','Pricing','About'].map(l => (
              <a key={l} className="nav-item" href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a>
            ))}
          </nav>
          <div style={{ paddingBottom:32, display:'flex', flexDirection:'column', gap:12 }}>
            <button className="btn-o" onClick={() => { setMenuOpen(false); navigate('/login'); }}>Sign In</button>
            <button className="btn-p" onClick={() => { setMenuOpen(false); navigate('/signup'); }}>Get Started Free</button>
          </div>
        </div>
      )}

      {/* ── Sticky Navbar ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background: scrolled?'rgba(255,255,255,0.96)':'transparent', backdropFilter: scrolled?'blur(12px)':'none', borderBottom: scrolled?`1px solid ${C.border}`:'none', transition:'all 0.3s', padding:'0 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:60 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/><circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><circle cx="16" cy="16" r="3.5" fill="white"/></svg>
            </div>
            <span style={{ fontWeight:800, fontSize:17, color:C.text }}>RecruitHub</span>
          </div>
          {/* Desktop nav */}
          <div className="show-desktop" style={{ alignItems:'center', gap:28 }}>
            {['Features','Solutions','Pricing','About'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ color:C.text2, textDecoration:'none', fontWeight:500, fontSize:14, transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color=C.primary} onMouseLeave={e => e.target.style.color=C.text2}>{l}</a>
            ))}
          </div>
          <div className="show-desktop" style={{ alignItems:'center', gap:10 }}>
            <button style={{ padding:'8px 18px', background:'transparent', color:C.primary, border:`2px solid ${C.primary}`, borderRadius:9, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background=C.primary; e.target.style.color='#fff'; }}
              onMouseLeave={e => { e.target.style.background='transparent'; e.target.style.color=C.primary; }}
              onClick={() => navigate('/login')}>Sign In</button>
            <button style={{ padding:'8px 18px', background:`linear-gradient(135deg,${C.primary},${C.pLight})`, color:'#fff', border:'none', borderRadius:9, fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}
              onClick={() => navigate('/signup')}>Get Started</button>
          </div>
          {/* Hamburger */}
          <button className="hide-desktop" onClick={() => setMenuOpen(true)} style={{ background:'none', border:'none', cursor:'pointer', padding:6, display:'flex', flexDirection:'column', gap:5 }}>
            <div style={{ width:22, height:2, background:C.text, borderRadius:2 }}/>
            <div style={{ width:22, height:2, background:C.text, borderRadius:2 }}/>
            <div style={{ width:16, height:2, background:C.text, borderRadius:2 }}/>
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" style={{ minHeight:'100vh', background:`linear-gradient(160deg,#EEF2FF 0%,#F0FDFF 60%,#F8FAFF 100%)`, paddingTop:60, display:'flex', alignItems:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'48px 20px 60px', width:'100%' }}>
          <div className="hero-inner" style={{ display:'grid', gridTemplateColumns:'1fr', gap:36, alignItems:'center' }}>
            <FadeIn>
              <div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${C.primary}12`, border:`1px solid ${C.primary}28`, borderRadius:50, padding:'6px 14px', marginBottom:20 }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:C.primary }}/>
                  <span style={{ color:C.primary, fontSize:12, fontWeight:700 }}>AI-Powered Recruitment Platform</span>
                </div>
                <h1 style={{ fontSize:'clamp(2rem,6vw,3.25rem)', fontWeight:900, lineHeight:1.15, color:C.text, marginBottom:16 }}>
                  Smarter ATS for<br/>
                  <span style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Faster Hiring</span>
                </h1>
                <p style={{ fontSize:16, color:C.muted, lineHeight:1.75, marginBottom:28, maxWidth:480 }}>
                  AI-powered recruitment, workflow automation, and real-time analytics — hire the right talent 3× faster.
                </p>
                <div className="hero-btns" style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:400 }}>
                  <button className="btn-p" onClick={() => navigate('/signup')}>Get Started Free →</button>
                  <button className="btn-o" onClick={() => navigate('/login')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Watch Demo
                  </button>
                </div>
                <div style={{ display:'flex', gap:24, marginTop:28, flexWrap:'wrap' }}>
                  {[['1000+','Companies'],['3×','Faster Hiring'],['98%','Satisfaction']].map(([v,l]) => (
                    <div key={l}>
                      <div style={{ fontSize:20, fontWeight:800, color:C.primary }}>{v}</div>
                      <div style={{ fontSize:11, color:C.muted, fontWeight:500 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            {/* Mini dashboard card — desktop only */}
            <FadeIn delay={150}>
              <div className="show-desktop" style={{ position:'relative' }}>
                <div style={{ background:'#fff', borderRadius:20, padding:24, boxShadow:'0 24px 64px rgba(79,70,229,0.15)', border:`1px solid ${C.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
                    {['#F87171','#FBBF24','#34D399'].map(c => <div key={c} style={{ width:10, height:10, borderRadius:'50%', background:c }}/>)}
                    <span style={{ marginLeft:6, fontSize:12, color:C.muted, fontWeight:600 }}>RecruitHub Dashboard</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                    {[{l:'Active Jobs',v:'24',c:C.primary},{l:'Candidates',v:'186',c:C.accent},{l:'Interviews',v:'12',c:C.success},{l:'Hired',v:'8',c:C.warning}].map(({l,v,c}) => (
                      <div key={l} style={{ background:`${c}12`, borderRadius:10, padding:'12px 14px' }}>
                        <div style={{ fontSize:20, fontWeight:800, color:c }}>{v}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:C.bg2, borderRadius:10, padding:'10px 12px' }}>
                    <div style={{ fontSize:11, color:C.muted, fontWeight:600, marginBottom:6 }}>Hiring Pipeline</div>
                    <div style={{ display:'flex', gap:3, height:7, borderRadius:4, overflow:'hidden' }}>
                      {[['#6366F1',45],['#F59E0B',25],['#06B6D4',15],['#10B981',10],['#F87171',5]].map(([c,w],i) => (
                        <div key={i} style={{ width:`${w}%`, background:c, borderRadius:4 }}/>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ position:'absolute', top:-14, right:-14, background:'#fff', borderRadius:12, padding:'10px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.12)', border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:`${C.success}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.success} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div><div style={{ fontSize:11, fontWeight:700, color:C.text }}>Candidate Hired!</div><div style={{ fontSize:10, color:C.muted }}>2 mins ago</div></div>
                </div>
                <div style={{ position:'absolute', bottom:-14, left:-14, background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:12, padding:'10px 14px', color:'#fff' }}>
                  <div style={{ fontSize:10, fontWeight:700 }}>⚡ AI Match Score</div>
                  <div style={{ fontSize:18, fontWeight:900 }}>94%</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Metrics ── */}
      <section style={{ background:'#fff', padding:'48px 20px', borderTop:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <FadeIn>
            <div className="metrics-grid" style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
              {[{v:'1,000+',l:'Companies',i:'🏢',c:C.primary},{v:'3×',l:'Faster Hiring',i:'⚡',c:C.accent},{v:'40%',l:'Productivity',i:'📈',c:C.success},{v:'50+',l:'Integrations',i:'🔗',c:C.warning}].map(({v,l,i,c}) => (
                <div key={l} style={{ padding:'20px 16px', borderRadius:14, background:C.bg2, border:`1px solid ${C.border}`, textAlign:'center' }}>
                  <div style={{ fontSize:26, marginBottom:6 }}>{i}</div>
                  <div style={{ fontSize:24, fontWeight:900, color:c, marginBottom:2 }}>{v}</div>
                  <div style={{ fontSize:12, color:C.muted, fontWeight:500 }}>{l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Problem → Solution ── */}
      <section id="solutions" style={{ background:C.bg2, padding:'56px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <span style={{ color:C.primary, fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:1.5 }}>Why RecruitHub</span>
              <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.25rem)', fontWeight:800, color:C.text, marginTop:8, marginBottom:10 }}>We Solve Real Hiring Problems</h2>
              <p style={{ color:C.muted, fontSize:14, maxWidth:400, margin:'0 auto', lineHeight:1.7 }}>Most teams struggle with the same issues. Here's how we fix them.</p>
            </div>
          </FadeIn>
          <div className="problems-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:16 }}>
            {[
              {p:'Slow Hiring Process',s:'Automate screening, scheduling, and follow-ups. Cut time-to-hire by 60%.',i:'⏱️',c:'#EF4444',sc:C.success},
              {p:'Too Many Disconnected Tools',s:'One platform for sourcing, tracking, interviewing, and analytics.',i:'🔧',c:'#F59E0B',sc:C.primary},
              {p:'High Candidate Drop-offs',s:'Automated engagement keeps candidates warm throughout the pipeline.',i:'📉',c:'#8B5CF6',sc:C.accent},
            ].map(({p,s,i,c,sc},idx) => (
              <FadeIn key={p} delay={idx*80}>
                <div className="card" style={{ borderTop:`3px solid ${sc}` }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{i}</div>
                  <span style={{ display:'inline-block', background:`${c}12`, color:c, borderRadius:6, padding:'2px 10px', fontSize:11, fontWeight:700, marginBottom:10 }}>Problem</span>
                  <h3 style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:8 }}>{p}</h3>
                  <div style={{ width:28, height:2, background:sc, borderRadius:2, marginBottom:10 }}/>
                  <span style={{ display:'inline-block', background:`${sc}12`, color:sc, borderRadius:6, padding:'2px 10px', fontSize:11, fontWeight:700, marginBottom:8 }}>Solution</span>
                  <p style={{ color:C.muted, fontSize:13, lineHeight:1.7 }}>{s}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{ background:'#fff', padding:'56px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <span style={{ color:C.primary, fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:1.5 }}>Features</span>
              <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.25rem)', fontWeight:800, color:C.text, marginTop:8, marginBottom:10 }}>Everything You Need to Hire Better</h2>
            </div>
          </FadeIn>
          <div className="features-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:14 }}>
            {[
              {i:'🤖',t:'AI Candidate Matching',d:'Automatically rank and match candidates to job requirements using AI scoring.',c:C.primary},
              {i:'⚙️',t:'Workflow Automation',d:'Automate repetitive tasks — emails, status updates, interview scheduling.',c:C.accent},
              {i:'📋',t:'Job & Candidate Management',d:'Centralized hub for all jobs, applications, and candidate profiles.',c:C.success},
              {i:'📅',t:'Interview Scheduling',d:'One-click scheduling with calendar sync and automated reminders.',c:C.warning},
              {i:'📊',t:'Analytics Dashboard',d:'Real-time hiring metrics, pipeline health, and team performance reports.',c:'#8B5CF6'},
              {i:'🔔',t:'Smart Notifications',d:'Real-time alerts for applications, status changes, and interview reminders.',c:'#EC4899'},
            ].map(({i,t,d,c},idx) => (
              <FadeIn key={t} delay={idx*50}>
                <div className="card" style={{ display:'flex', gap:16, alignItems:'flex-start', borderLeft:`3px solid ${c}` }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:`${c}12`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{i}</div>
                  <div>
                    <h3 style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>{t}</h3>
                    <p style={{ color:C.muted, fontSize:13, lineHeight:1.65 }}>{d}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ background:C.bg2, padding:'56px 0 56px 20px', overflow:'hidden' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <FadeIn>
            <div style={{ textAlign:'center', marginBottom:28, paddingRight:20 }}>
              <span style={{ color:C.primary, fontWeight:700, fontSize:12, textTransform:'uppercase', letterSpacing:1.5 }}>Testimonials</span>
              <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.25rem)', fontWeight:800, color:C.text, marginTop:8 }}>Loved by Recruiting Teams</h2>
            </div>
          </FadeIn>
          <div className="testimonials-wrap">
            <TestimonialCarousel items={testimonials}/>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:`linear-gradient(135deg,${C.primary},${C.pDark})`, padding:'56px 20px', textAlign:'center' }}>
        <FadeIn>
          <div style={{ maxWidth:560, margin:'0 auto' }}>
            <h2 style={{ fontSize:'clamp(1.5rem,4vw,2.25rem)', fontWeight:900, color:'#fff', marginBottom:12 }}>See It in Action</h2>
            <p style={{ color:'rgba(255,255,255,0.8)', fontSize:15, marginBottom:28, lineHeight:1.7 }}>
              Join 1,000+ companies using RecruitHub to hire smarter and faster.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:360, margin:'0 auto' }}>
              <button onClick={() => navigate('/signup')}
                style={{ padding:'15px', background:'#fff', color:C.primary, border:'none', borderRadius:12, fontWeight:800, fontSize:16, cursor:'pointer', fontFamily:'inherit', transition:'all 0.2s' }}
                onMouseEnter={e => e.target.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.target.style.transform='none'}>
                Request Demo
              </button>
              <button onClick={() => navigate('/login')}
                style={{ padding:'15px', background:'transparent', color:'#fff', border:'2px solid rgba(255,255,255,0.5)', borderRadius:12, fontWeight:700, fontSize:15, cursor:'pointer', fontFamily:'inherit' }}>
                Sign In →
              </button>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background:'#111827', padding:'40px 20px 24px', color:'#9CA3AF' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'1fr', gap:28, marginBottom:32 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:`linear-gradient(135deg,${C.primary},${C.accent})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="13" height="13" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="8" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/><circle cx="16" cy="16" r="3.5" fill="white"/></svg>
                </div>
                <span style={{ fontWeight:800, fontSize:16, color:'#fff' }}>RecruitHub</span>
              </div>
              <p style={{ fontSize:13, lineHeight:1.7, maxWidth:260 }}>AI-powered ATS for modern recruiting teams. Connect. Hire. Grow.</p>
            </div>
            <div style={{ display:'flex', gap:32, flexWrap:'wrap' }}>
              {[['Product',['Features','Pricing','Integrations']],['Company',['About','Blog','Contact']],['Legal',['Privacy','Terms','Security']]].map(([title,links]) => (
                <div key={title}>
                  <div style={{ fontWeight:700, color:'#fff', fontSize:13, marginBottom:12 }}>{title}</div>
                  {links.map(l => <div key={l} style={{ fontSize:13, marginBottom:8, cursor:'pointer' }}>{l}</div>)}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid #374151', paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:8 }}>
            <span style={{ fontSize:12 }}>© 2025 RecruitHub. All rights reserved.</span>
            <span style={{ fontSize:12 }}>Connect. Hire. Grow.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
