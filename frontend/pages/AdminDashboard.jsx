import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Box, Card, Typography, Button, Chip, CircularProgress } from "@mui/material";
import { Users, Briefcase, CheckCircle, PlusCircle, Calendar, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { applicationService } from "../services/api";
import NotificationBell from "../components/NotificationBell";
import { ApplicationStatusPie } from "../components/AnalyticsCharts";
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useAppTheme } from "../hooks/useAppTheme";

const statusConfig = {
  Pending:              { color:'#64748B', bg:'#F1F5F9' },
  Shortlisted:          { color:'#D97706', bg:'#FEF3C7' },
  'Interview Scheduled':{ color:'#0891B2', bg:'#CFFAFE' },
  Selected:             { color:'#059669', bg:'#D1FAE5' },
  Rejected:             { color:'#DC2626', bg:'#FEE2E2' },
};

export default function AdminDashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const { C } = useAppTheme();
  const [stats, setStats] = useState({ totalJobs:0, totalUsers:0, totalApplications:0 });
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([
      applicationService.getStats().then(r => { if (r.success) setStats(r.stats); }),
      applicationService.getAll().then(r => { if (r.success) setAllApps(r.applications); }),
    ]).finally(() => setLoading(false));
  }, []);

  if (!role) { navigate('/'); return null; }
  if (role !== 'admin') return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: C.bg }}>
      <Card sx={{ p:4, textAlign:'center', borderRadius:3 }}>
        <Typography sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt:2, background: C.primary, color:'#fff', borderRadius:2, textTransform:'none' }}>Go to Login</Button>
      </Card>
    </Box>
  );

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <CircularProgress sx={{ color: C.primary }}/>
    </Box>
  );

  const selected    = allApps.filter(a => a.status === 'Selected').length;
  const rejected    = allApps.filter(a => a.status === 'Rejected').length;
  const interviews  = allApps.filter(a => a.status === 'Interview Scheduled').length;
  const shortlisted = allApps.filter(a => a.status === 'Shortlisted').length;
  const pending     = allApps.filter(a => a.status === 'Pending').length;

  const recentActivity = [...allApps]
    .sort((a,b) => new Date(b.updatedAt||b.createdAt) - new Date(a.updatedAt||a.createdAt))
    .slice(0, 5);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now = new Date();
  const areaData = Array.from({ length:7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (6-i), 1);
    const count = allApps.filter(a => {
      const cd = new Date(a.createdAt);
      return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
    }).length;
    return { month: months[d.getMonth()], Applications: count };
  });

  const barStages = [
    { label:'Applied',    value: allApps.length, color:'#6366F1' },
    { label:'Shortlisted',value: shortlisted,     color:'#F59E0B' },
    { label:'Interview',  value: interviews,      color:'#06B6D4' },
    { label:'Selected',   value: selected,        color:'#10B981' },
    { label:'Rejected',   value: rejected,        color:'#EF4444' },
  ];

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .dash-in{animation:fadeIn 0.35s ease;}
        .qa-box:hover .qa-lbl{color:#fff!important;}
      `}</style>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, minWidth:0, p:{ xs:'12px', sm:'20px', lg:'24px' }, pt:{ xs:'64px', lg:'24px' }, overflowX:'hidden' }}>

        {/* ── Welcome Banner ── */}
        <Box className="dash-in" sx={{ borderRadius:3, background:`linear-gradient(135deg,${C.primary} 0%,${C.secondary} 60%,#A78BFA 100%)`, p:{ xs:'18px 16px', sm:'24px 28px' }, mb:2.5, position:'relative', overflow:'hidden' }}>
          <Box sx={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.07)' }}/>
          <Box sx={{ position:'absolute', bottom:-20, right:100, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }}/>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:2, flexWrap:'wrap', gap:1 }}>
            <Box>
              <Typography sx={{ color:'rgba(255,255,255,0.75)', fontSize:'0.68rem', fontWeight:600, textTransform:'uppercase', letterSpacing:1, mb:0.5 }}>OVERVIEW</Typography>
              <Typography sx={{ color:'#fff', fontWeight:800, fontSize:{ xs:'1.1rem', sm:'1.4rem' }, mb:0.25 }}>
                Good morning, Admin 👋
              </Typography>
              <Typography sx={{ color:'rgba(255,255,255,0.7)', fontSize:'0.75rem' }}>
                Here's what's happening with your recruitment today.
              </Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
              {/* Notification bell — styled for banner */}
              <Box sx={{ background:'rgba(255,255,255,0.2)', borderRadius:'50%', width:36, height:36, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.3)' }}>
                <NotificationBell userId={adminUser?.id || adminUser?._id}/>
              </Box>
              <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={13}/>}
                sx={{ background:'rgba(255,255,255,0.2)', color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, fontSize:'0.75rem', minHeight:34, px:2, border:'1px solid rgba(255,255,255,0.3)', '&:hover':{ background:'rgba(255,255,255,0.3)' }, display:{ xs:'none', sm:'flex' } }}>
                Post New Job
              </Button>
            </Box>
          </Box>
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(4,1fr)' }, gap:{ xs:1, sm:1.25 } }}>
            {[
              { label:'Total Jobs',   value: stats.totalJobs,         icon:'💼', sub:'+3 this week' },
              { label:'Active Users', value: stats.totalUsers,        icon:'👥', sub:'Registered' },
              { label:'Applications', value: stats.totalApplications, icon:'📋', sub:`${pending} pending` },
              { label:'Hired',        value: selected,                icon:'✅', sub:`${allApps.length ? Math.round(selected/allApps.length*100) : 0}% rate` },
            ].map(({ label, value, icon, sub }) => (
              <Box key={label} sx={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', borderRadius:2, p:{ xs:'10px 8px', sm:'12px 14px' }, border:'1px solid rgba(255,255,255,0.2)', cursor:'pointer', transition:'all 0.2s', '&:hover':{ background:'rgba(255,255,255,0.25)', transform:'translateY(-2px)' } }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.5, mb:0.5 }}>
                  <span style={{ fontSize:12 }}>{icon}</span>
                  <Typography sx={{ color:'rgba(255,255,255,0.75)', fontSize:'0.58rem', fontWeight:600, textTransform:'uppercase', letterSpacing:0.4 }}>{label}</Typography>
                </Box>
                <Typography sx={{ color:'#fff', fontWeight:800, fontSize:{ xs:'1.2rem', sm:'1.5rem' }, lineHeight:1, mb:0.2 }}>{value}</Typography>
                <Typography sx={{ color:'rgba(255,255,255,0.55)', fontSize:'0.58rem' }}>{sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Quick Actions ── */}
        <Box className="dash-in" sx={{ mb:2.5 }}>
          <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem', mb:1.25 }}>Quick Actions</Typography>
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(4,1fr)' }, gap:{ xs:1, sm:1.5 } }}>
            {[
              { label:'Candidates',   icon: Users,       route:'/candidates',         grad:`linear-gradient(135deg,${C.primary},${C.secondary})`, light:'#EEF0FF', tc:C.primary },
              { label:'Applications', icon: CheckCircle, route:'/admin/applications', grad:`linear-gradient(135deg,${C.success},#059669)`,          light:'#E0FFF4', tc:C.success },
              { label:'Post Job',     icon: PlusCircle,  route:'/jobform',            grad:`linear-gradient(135deg,${C.accent},#0EA5E9)`,           light:'#E0F9FF', tc:C.accent  },
              { label:'Interviews',   icon: Calendar,    route:'/schedule-interview', grad:`linear-gradient(135deg,${C.warning},#F97316)`,          light:'#FFF7E0', tc:C.warning },
            ].map(({ label, icon: Icon, route, grad, light, tc }) => (
              <Box key={label} className="qa-box" onClick={() => navigate(route)}
                sx={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:0.875, p:{ xs:'12px 8px', sm:'14px 10px' }, borderRadius:2.5, background: light, border:`1px solid ${tc}22`, cursor:'pointer', transition:'all 0.25s', textAlign:'center', minHeight:{ xs:82, sm:100 },
                  '&:hover':{ background: grad, transform:'translateY(-3px)', boxShadow:`0 10px 28px rgba(0,0,0,0.12)` } }}>
                <Box sx={{ width:{ xs:34, sm:40 }, height:{ xs:34, sm:40 }, borderRadius:2, background: grad, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={17} color="#fff"/>
                </Box>
                <Typography className="qa-lbl" sx={{ fontWeight:700, color: tc, fontSize:{ xs:'0.68rem', sm:'0.75rem' }, lineHeight:1.3, transition:'color 0.2s' }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Charts row ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', lg:'1.5fr 1fr' }, gap:{ xs:2, sm:2 }, mb:2 }}>

          {/* Area chart */}
          <Card className="dash-in" sx={{ borderRadius:3, border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', p:{ xs:'14px', sm:'18px 22px' } }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1.5 }}>
              <Box>
                <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Application Growth</Typography>
                <Typography sx={{ color: C.muted, fontSize:'0.68rem' }}>Monthly trend</Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/admin/applications')} endIcon={<ArrowRight size={11}/>}
                sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.68rem', minHeight:'unset', background:`${C.primary}10`, borderRadius:2, px:1.25 }}>
                View All
              </Button>
            </Box>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={areaData} margin={{ top:4, right:4, left:-22, bottom:0 }}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.18}/>
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize:10 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill: C.muted, fontSize:9 }} axisLine={false} tickLine={false} allowDecimals={false}/>
                <RechartsTooltip contentStyle={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:8, fontSize:11 }}/>
                <Area type="monotone" dataKey="Applications" stroke={C.primary} strokeWidth={2} fill="url(#ag)" dot={{ fill: C.primary, r:2.5 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Pie chart */}
          <Card className="dash-in" sx={{ borderRadius:3, border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', p:{ xs:'14px', sm:'18px 22px' }, display:'flex', flexDirection:'column' }}>
            <Box sx={{ mb:1 }}>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Application Status</Typography>
              <Typography sx={{ color: C.muted, fontSize:'0.68rem' }}>Tap to filter candidates</Typography>
            </Box>
            <Box sx={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', minHeight:170 }}>
              <ApplicationStatusPie applications={allApps}/>
            </Box>
          </Card>
        </Box>

        {/* ── Bottom row: Stage Cards + Timeline ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', lg:'1.5fr 1fr' }, gap:{ xs:2, sm:2 } }}>

          {/* Applications by Stage — stat card grid */}
          <Card className="dash-in" sx={{ borderRadius:3, border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', p:{ xs:'14px', sm:'18px 22px' } }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
              <Box>
                <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Applications by Stage</Typography>
                <Typography sx={{ color: C.muted, fontSize:'0.68rem' }}>{allApps.length} total applications</Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/admin/applications')} endIcon={<ArrowRight size={11}/>}
                sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.68rem', minHeight:'unset', background:`${C.primary}10`, borderRadius:2, px:1.25 }}>
                View All
              </Button>
            </Box>
            <Box sx={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1.25, mb:1.5 }}>
              {barStages.map(({ label, value, color }) => {
                const pct = allApps.length > 0 ? Math.round((value / allApps.length) * 100) : 0;
                const r = 22, circ = 2 * Math.PI * r;
                const dash = (pct / 100) * circ;
                return (
                  <Box key={label} onClick={() => navigate('/admin/applications')}
                    sx={{ p:'14px 10px', borderRadius:2.5, background: C.surface2, border:`1.5px solid ${color}22`,
                      display:'flex', flexDirection:'column', alignItems:'center', gap:0.75,
                      cursor:'pointer', transition:'all 0.22s',
                      '&:hover':{ borderColor: color, background:`${color}0d`, transform:'translateY(-2px)', boxShadow:`0 6px 20px ${color}22` } }}>
                    {/* SVG ring */}
                    <Box sx={{ position:'relative', width:54, height:54, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="54" height="54" style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
                        <circle cx="27" cy="27" r={r} fill="none" stroke={`${color}20`} strokeWidth="4"/>
                        <circle cx="27" cy="27" r={r} fill="none" stroke={color} strokeWidth="4"
                          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                          style={{ transition:'stroke-dasharray 0.8s ease' }}/>
                      </svg>
                      <Typography sx={{ color, fontWeight:800, fontSize:'0.95rem', lineHeight:1, zIndex:1 }}>{value}</Typography>
                    </Box>
                    <Typography sx={{ color: C.text, fontSize:'0.7rem', fontWeight:700, textAlign:'center', lineHeight:1.2 }}>{label}</Typography>
                    <Box sx={{ px:1, py:0.2, borderRadius:8, background:`${color}18` }}>
                      <Typography sx={{ color, fontSize:'0.62rem', fontWeight:700 }}>{pct}%</Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
            {/* Mini legend bar */}
            <Box sx={{ display:'flex', height:6, borderRadius:8, overflow:'hidden', gap:'2px' }}>
              {barStages.filter(s => s.value > 0).map(({ label, value, color }) => (
                <Box key={label} sx={{ flex: value, background: color, transition:'flex 0.8s ease', minWidth: 4 }}/>
              ))}
            </Box>
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:1.5, mt:1 }}>
              {barStages.map(({ label, color }) => (
                <Box key={label} sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                  <Box sx={{ width:7, height:7, borderRadius:'50%', background: color }}/>
                  <Typography sx={{ color: C.muted, fontSize:'0.62rem' }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Card>

          {/* Team Activity — timeline feed */}
          <Card className="dash-in" sx={{ borderRadius:3, border:`1px solid ${C.border}`, boxShadow:'0 2px 8px rgba(0,0,0,0.05)', p:{ xs:'14px', sm:'18px 22px' }, display:'flex', flexDirection:'column' }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
              <Box>
                <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Recent Activity</Typography>
                <Typography sx={{ color: C.muted, fontSize:'0.68rem' }}>Latest application updates</Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/admin/applications')}
                sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.65rem', minHeight:'unset', background:`${C.primary}10`, borderRadius:2, px:1.25 }}>
                View all
              </Button>
            </Box>

            {recentActivity.length === 0 ? (
              <Box sx={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', py:4, gap:1 }}>
                <Box sx={{ width:40, height:40, borderRadius:'50%', background: C.surface2, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Briefcase size={18} color={C.muted}/>
                </Box>
                <Typography sx={{ color: C.muted, fontSize:'0.72rem' }}>No activity yet</Typography>
              </Box>
            ) : (
              <Box sx={{ position:'relative' }}>
                {/* vertical timeline line */}
                <Box sx={{ position:'absolute', left:14, top:8, bottom:8, width:2, background:`linear-gradient(180deg,${C.primary}44,${C.border})`, borderRadius:2 }}/>
                <Box sx={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {recentActivity.map((app, i) => {
                    const sc = statusConfig[app.status] || statusConfig.Pending;
                    return (
                      <Box key={i} onClick={() => navigate('/admin/applications')}
                        sx={{ display:'flex', gap:2, pl:0.5, pb: i < recentActivity.length-1 ? 2 : 0,
                          cursor:'pointer', position:'relative',
                          '&:hover .tl-card':{ borderColor: sc.color, background:`${sc.color}06` } }}>
                        {/* dot */}
                        <Box sx={{ width:28, height:28, borderRadius:'50%', background:`${sc.color}18`,
                          border:`2px solid ${sc.color}`, display:'flex', alignItems:'center',
                          justifyContent:'center', flexShrink:0, zIndex:1, mt:0.25 }}>
                          <Typography sx={{ color: sc.color, fontSize:'0.6rem', fontWeight:800 }}>
                            {(app.userName||'?').charAt(0).toUpperCase()}
                          </Typography>
                        </Box>
                        {/* card */}
                        <Box className="tl-card" sx={{ flex:1, p:'8px 12px', borderRadius:2,
                          background: C.surface2, border:`1px solid ${C.border}`, transition:'all 0.2s' }}>
                          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:1 }}>
                            <Typography sx={{ color: C.text, fontSize:'0.75rem', fontWeight:700, lineHeight:1.3,
                              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                              {app.userName}
                            </Typography>
                            <Chip label={app.status} size="small"
                              sx={{ background: sc.bg, color: sc.color, fontWeight:700,
                                fontSize:'0.5rem', height:16, borderRadius:4, flexShrink:0 }}/>
                          </Box>
                          <Typography sx={{ color: C.muted, fontSize:'0.65rem', mt:0.25,
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {app.jobTitle}
                          </Typography>
                          <Typography sx={{ color: C.muted, fontSize:'0.58rem', mt:0.5, opacity:0.7 }}>
                            {new Date(app.updatedAt||app.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
