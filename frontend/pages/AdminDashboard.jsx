import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Box, Card, Typography, Button, Chip, Avatar, LinearProgress, CircularProgress } from "@mui/material";
import { Users, Briefcase, CheckCircle, TrendingUp, PlusCircle, Calendar, Clock, ArrowRight, Download, Star, Zap, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService, applicationService } from "../services/api";
import NotificationBell from "../components/NotificationBell";
import { ApplicationStatusPie } from "../components/AnalyticsCharts";

const C = {
  bg:'#0F172A', surface:'#1E293B', surface2:'#263348', border:'#334155',
  primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4',
  warning:'#F59E0B', success:'#10B981', danger:'#F87171',
  text:'#F1F5F9', muted:'#94A3B8',
};

const PIPELINE_STAGES = [
  { key:'Pending',              label:'Applied',    color:'#94A3B8', bg:'rgba(148,163,184,0.15)' },
  { key:'Shortlisted',          label:'Shortlisted',color:'#F59E0B', bg:'rgba(245,158,11,0.15)'  },
  { key:'Interview Scheduled',  label:'Interview',  color:'#6366F1', bg:'rgba(99,102,241,0.15)'  },
  { key:'Selected',             label:'Selected',   color:'#10B981', bg:'rgba(16,185,129,0.15)'  },
  { key:'Rejected',             label:'Rejected',   color:'#F87171', bg:'rgba(248,113,113,0.15)' },
];

export default function AdminDashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [jobs, setJobs]       = useState([]);
  const [stats, setStats]     = useState({ totalJobs:0, totalUsers:0, totalApplications:0, activeJobs:0 });
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([
      jobService.getAll('').then(r => { if (r.success) setJobs(r.jobs); }),
      applicationService.getStats().then(r => { if (r.success) setStats(r.stats); }),
      applicationService.getAll().then(r => { if (r.success) setAllApps(r.applications); }),
    ]).finally(() => setLoading(false));
  }, []);

  if (!role) { navigate('/'); return null; }

  if (role !== 'admin') return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: C.bg }}>
      <Card sx={{ p:4, textAlign:'center', background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt:2, background: C.primary, color:'#fff', borderRadius:2, textTransform:'none' }}>Go to Login</Button>
      </Card>
    </Box>
  );

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <Box sx={{ textAlign:'center' }}>
        <Box sx={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${C.primary}`, borderTopColor:'transparent', animation:'spin 0.8s linear infinite', mx:'auto', mb:2 }}/>
        <Typography sx={{ color: C.muted }}>Loading dashboard...</Typography>
      </Box>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </Box>
  );

  // Derived data
  const selected   = allApps.filter(a => a.status === 'Selected').length;
  const rejected   = allApps.filter(a => a.status === 'Rejected').length;
  const interviews = allApps.filter(a => a.status === 'Interview Scheduled').length;
  const convRate   = stats.totalApplications > 0 ? Math.round((selected / stats.totalApplications) * 100) : 0;
  const dropRate   = stats.totalApplications > 0 ? Math.round((rejected / stats.totalApplications) * 100) : 0;

  const pipelineData = PIPELINE_STAGES.map(s => ({
    ...s,
    apps: allApps.filter(a => a.status === s.key).slice(0, 3),
    count: allApps.filter(a => a.status === s.key).length,
  }));

  const recentActivity = allApps
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 6)
    .map(a => ({
      name: a.userName,
      action: a.status === 'Pending' ? 'applied for' : `moved to ${a.status}`,
      job: a.jobTitle,
      time: new Date(a.updatedAt || a.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric' }),
      color: PIPELINE_STAGES.find(s => s.key === a.status)?.color || C.muted,
    }));

  const upcomingInterviews = allApps
    .filter(a => a.status === 'Interview Scheduled')
    .slice(0, 4);

  const statCards = [
    { title:'Total Jobs',    value: stats.totalJobs,         icon: Briefcase,   gradient:`linear-gradient(135deg,${C.primary},${C.secondary})` },
    { title:'Applications',  value: stats.totalApplications, icon: TrendingUp,  gradient:`linear-gradient(135deg,${C.accent},#0EA5E9)` },
    { title:'Selected',      value: selected,                icon: CheckCircle, gradient:`linear-gradient(135deg,${C.success},#059669)` },
    { title:'Total Users',   value: stats.totalUsers,        icon: Users,       gradient:`linear-gradient(135deg,${C.warning},#D97706)` },
  ];

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .dash-section{animation:fadeIn 0.3s ease;}
        .pipeline-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.4)!important;}
        .action-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,0.4)!important;}
      `}</style>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, minWidth:0, p:{ xs:'12px', sm:'20px', lg:'24px' }, pt:{ xs:'64px', lg:'24px' }, overflowX:'hidden' }}>

        {/* ── Header ── */}
        <Box sx={{ mb:2.5 }}>
          <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', alignItems:'center', textAlign:'center', gap:1.5, position:'relative' }}>
            <Box sx={{ position:'absolute', top:0, left:0 }}><NotificationBell userId={adminUser?.id || adminUser?._id}/></Box>
            <Box>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:'1.2rem' }}>Admin Dashboard</Typography>
              <Typography sx={{ color: C.muted, fontSize:'0.72rem' }}>Welcome back, Administrator</Typography>
            </Box>
            <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={14}/>}
              sx={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, px:2.5, fontSize:'0.75rem', minHeight:36 }}>
              New Job
            </Button>
          </Box>
          <Box sx={{ display:{ xs:'none', sm:'flex' }, justifyContent:'space-between', alignItems:'center', gap:2 }}>
            <Box>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ sm:'1.5rem', lg:'1.875rem' } }}>Admin Dashboard</Typography>
              <Typography sx={{ color: C.muted, fontSize:'0.875rem' }}>Welcome back, Administrator</Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
              <NotificationBell userId={adminUser?.id || adminUser?._id}/>
              <Button onClick={() => navigate('/candidates')} startIcon={<Download size={14}/>} variant="outlined"
                sx={{ borderColor: C.border, color: C.muted, borderRadius:2, textTransform:'none', fontWeight:600, fontSize:'0.8rem', minHeight:36, '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                Export
              </Button>
              <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={14}/>}
                sx={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, px:2.5, fontSize:'0.875rem', minHeight:36, boxShadow:`0 4px 16px ${C.primary}44` }}>
                Post New Job
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ── Stat Cards ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(4,1fr)', sm:'repeat(2,1fr)', lg:'repeat(4,1fr)' }, gap:{ xs:1, sm:2 }, mb:2.5 }}>
          {statCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i} className="pipeline-card" sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:2.5 }, cursor:'pointer', transition:'all 0.25s' }}>
                <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', alignItems:'center', textAlign:'center', gap:0.5, p:'10px 4px', minHeight:88 }}>
                  <Box sx={{ width:30, height:30, borderRadius:1.5, background: c.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={14} color="#fff"/>
                  </Box>
                  <Typography sx={{ color: C.muted, fontSize:'0.52rem', fontWeight:600, lineHeight:1.2 }}>{c.title}</Typography>
                  <Typography sx={{ fontWeight:800, color: C.text, fontSize:'1.1rem', lineHeight:1 }}>{c.value}</Typography>
                </Box>
                <Box sx={{ display:{ xs:'none', sm:'flex' }, justifyContent:'space-between', alignItems:'center', p:'16px 20px' }}>
                  <Box>
                    <Typography sx={{ color: C.muted, fontSize:'0.75rem', mb:0.5 }}>{c.title}</Typography>
                    <Typography sx={{ fontWeight:800, color: C.text, fontSize:'1.75rem', lineHeight:1 }}>{c.value}</Typography>
                  </Box>
                  <Box sx={{ width:44, height:44, borderRadius:2, background: c.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 16px rgba(0,0,0,0.3)` }}>
                    <Icon size={20} color="#fff"/>
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* ── Quick Insights ── */}
        {/* ── Quick Actions (4-column square boxes) ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(4,1fr)' }, gap:{ xs:1.5, sm:2 }, mb:2.5 }}>
          {[
            { label:'Candidates',    icon: Users,       route:'/candidates',         gradient:`linear-gradient(135deg,${C.primary},${C.secondary})`,  desc:'Browse all candidates' },
            { label:'Applications',  icon: CheckCircle, route:'/admin/applications', gradient:`linear-gradient(135deg,${C.success},#059669)`,          desc:'Review submissions' },
            { label:'Post Job',      icon: PlusCircle,  route:'/jobform',            gradient:`linear-gradient(135deg,${C.accent},#0EA5E9)`,           desc:'Create a job listing' },
            { label:'Interviews',    icon: Calendar,    route:'/schedule-interview', gradient:`linear-gradient(135deg,${C.warning},#D97706)`,          desc:'Set up interviews' },
          ].map(({ label, icon: Icon, route, gradient, desc }) => (
            <Box key={label} onClick={() => navigate(route)}
              sx={{
                borderRadius:3, cursor:'pointer',
                background: C.bg, border:`1px solid ${C.border}`,
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                gap:1, textAlign:'center', minHeight:{ xs:100, sm:120 }, p:'16px 10px',
                transition:'all 0.25s',
                '&:hover':{ background: gradient, border:'1px solid transparent', transform:'translateY(-3px)',
                  boxShadow:`0 12px 32px rgba(0,0,0,0.4)`, '& .qa-lbl':{ color:'#fff' }, '& .qa-desc':{ color:'rgba(255,255,255,0.75)' } },
              }}>
              <Box sx={{ width:44, height:44, borderRadius:2, background: gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px rgba(0,0,0,0.25)` }}>
                <Icon size={20} color="#fff"/>
              </Box>
              <Typography className="qa-lbl" sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'0.72rem', sm:'0.8rem' }, lineHeight:1.3, transition:'color 0.25s' }}>
                {label}
              </Typography>
              <Typography className="qa-desc" sx={{ color: C.muted, fontSize:'0.68rem', lineHeight:1.3, transition:'color 0.25s', display:{ xs:'none', sm:'block' } }}>
                {desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* ── Bottom row: Activity + Interviews + Pie ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1fr 1fr', lg:'1.2fr 1fr 1fr' }, gap:{ xs:1.5, sm:2 } }}>

          {/* Activity Timeline */}
          <Card className="dash-section" sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:2.5, p:{ xs:'14px', sm:'18px' } }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
              <Box>
                <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.9rem' }}>Recent Activity</Typography>
                <Typography sx={{ color: C.muted, fontSize:'0.65rem', mt:0.25 }}>Latest candidate updates</Typography>
              </Box>
              <Button size="small" onClick={() => navigate('/admin/applications')}
                sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.65rem', minHeight:'unset', border:`1px solid ${C.primary}22`, borderRadius:1.5, px:1.25, '&:hover':{ background:`${C.primary}18` } }}>
                View All
              </Button>
            </Box>
            {recentActivity.length === 0 ? (
              <Box sx={{ textAlign:'center', py:4 }}>
                <Box sx={{ width:40, height:40, borderRadius:'50%', background:`${C.primary}18`, display:'flex', alignItems:'center', justifyContent:'center', mx:'auto', mb:1 }}>
                  <TrendingUp size={18} color={C.primary}/>
                </Box>
                <Typography sx={{ color: C.muted, fontSize:'0.72rem' }}>No activity yet</Typography>
              </Box>
            ) : recentActivity.map((a, i) => (
              <Box key={i} sx={{ display:'flex', alignItems:'flex-start', gap:1.25, mb:1, p:'10px 12px', borderRadius:2, background: C.bg, border:`1px solid ${C.border}`, transition:'all 0.2s', '&:hover':{ borderColor: a.color, background:`${a.color}06` } }}>
                {/* Avatar with status color ring */}
                <Box sx={{ position:'relative', flexShrink:0 }}>
                  <Avatar sx={{ width:32, height:32, fontSize:'0.7rem', fontWeight:700, background:`linear-gradient(135deg,${C.primary},${C.secondary})` }}>
                    {a.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderRadius:'50%', background: a.color, border:`2px solid ${C.bg}` }}/>
                </Box>
                {/* Content */}
                <Box sx={{ flex:1, minWidth:0 }}>
                  <Typography sx={{ color: C.text, fontSize:'0.72rem', fontWeight:600, lineHeight:1.3, mb:0.25 }}>
                    <span style={{ color: a.color }}>{a.name}</span>
                    <span style={{ color: C.muted, fontWeight:400 }}> {a.action}</span>
                  </Typography>
                  <Box sx={{ display:'flex', alignItems:'center', gap:0.5 }}>
                    <Briefcase size={9} color={C.muted}/>
                    <Typography sx={{ color: C.muted, fontSize:'0.6rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{a.job}</Typography>
                  </Box>
                </Box>
                {/* Time badge */}
                <Box sx={{ flexShrink:0, background:`${a.color}18`, borderRadius:1, px:0.75, py:0.25 }}>
                  <Typography sx={{ color: a.color, fontSize:'0.58rem', fontWeight:600, whiteSpace:'nowrap' }}>{a.time}</Typography>
                </Box>
              </Box>
            ))}
          </Card>

          {/* Upcoming Interviews */}
          <Card className="dash-section" sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:2.5, p:{ xs:'14px', sm:'18px' } }}>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1.5 }}>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Upcoming Interviews</Typography>
              <Chip label={`${interviews}`} size="small" sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:700, fontSize:'0.62rem', height:18 }}/>
            </Box>
            {upcomingInterviews.length === 0 ? (
              <Box sx={{ textAlign:'center', py:3 }}>
                <Calendar size={28} color={C.border} style={{ marginBottom:6 }}/>
                <Typography sx={{ color: C.muted, fontSize:'0.72rem' }}>No interviews scheduled</Typography>
              </Box>
            ) : upcomingInterviews.map((app, i) => (
              <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1.25, mb:1.25, p:'8px 10px', borderRadius:1.5, background: C.bg, border:`1px solid ${C.border}` }}>
                <Avatar sx={{ width:28, height:28, fontSize:'0.65rem', fontWeight:700, background:`linear-gradient(135deg,${C.primary},${C.secondary})`, flexShrink:0 }}>
                  {(app.userName||'?').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex:1, minWidth:0 }}>
                  <Typography sx={{ color: C.text, fontSize:'0.72rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.userName}</Typography>
                  <Typography sx={{ color: C.muted, fontSize:'0.62rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.jobTitle}</Typography>
                </Box>
                <Box sx={{ display:'flex', alignItems:'center', gap:0.4, flexShrink:0 }}>
                  <Clock size={10} color={C.accent}/>
                  <Typography sx={{ color: C.accent, fontSize:'0.6rem', fontWeight:600 }}>Scheduled</Typography>
                </Box>
              </Box>
            ))}
            <Button fullWidth size="small" onClick={() => navigate('/schedule-interview')}
              sx={{ mt:1, background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:1.5, textTransform:'none', fontWeight:600, fontSize:'0.72rem', minHeight:30 }}>
              + Schedule Interview
            </Button>
          </Card>

          {/* Application Status Pie */}
          <Card className="dash-section" sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:2.5, p:{ xs:'14px', sm:'18px' }, display:'flex', flexDirection:'column' }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem', mb:0.5 }}>Application Status</Typography>
            <Typography sx={{ color: C.muted, fontSize:'0.68rem', mb:1.5 }}>Tap a status to filter</Typography>
            <Box sx={{ flex:1, display:'flex', alignItems:'center' }}>
              <ApplicationStatusPie applications={allApps}/>
            </Box>
          </Card>

        </Box>
      </Box>
    </Box>
  );
}
