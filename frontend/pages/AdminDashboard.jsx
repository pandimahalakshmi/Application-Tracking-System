import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, Typography, Button, Chip } from "@mui/material";
import { Users, Briefcase, CheckCircle, TrendingUp, PlusCircle, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService, applicationService } from "../services/api";
import NotificationBell from "../components/NotificationBell";
import AnalyticsCharts, { ApplicationStatusPie } from "../components/AnalyticsCharts";

const C = {
  bg:      '#0F172A',
  surface: '#1E293B',
  border:  '#334155',
  primary: '#6366F1',
  secondary:'#8B5CF6',
  accent:  '#06B6D4',
  warning: '#F59E0B',
  success: '#10B981',
  danger:  '#F87171',
  text:    '#F1F5F9',
  muted:   '#94A3B8',
};

export default function AdminDashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [jobs, setJobs]         = useState([]);
  const [stats, setStats]       = useState({ totalJobs:0, totalUsers:0, totalApplications:0, activeJobs:0 });
  const [allApps, setAllApps]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const adminUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    Promise.all([
      jobService.getAll('').then(r => { if (r.success) setJobs(r.jobs); }),
      applicationService.getStats().then(r => { if (r.success) setStats(r.stats); }),
      applicationService.getAll().then(r => { if (r.success) setAllApps(r.applications); }),
    ]).finally(() => setLoading(false));
  }, []);

  // Not logged in at all
  if (!role) {
    navigate('/');
    return null;
  }

  if (role !== 'admin') return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: C.bg }}>
      <Card sx={{ p:4, textAlign:'center', background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Typography sx={{ color: C.muted, mt:1 }}>You don't have permission to view this page.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt:2, background: C.primary, color:'#fff', borderRadius:2, textTransform:'none' }}>Go to Login</Button>
      </Card>
    </Box>
  );

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <Box sx={{ textAlign:'center' }}>
        <Box sx={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${C.primary}`, borderTopColor:'transparent',
          animation:'spin 0.8s linear infinite', mx:'auto', mb:2 }}/>
        <Typography sx={{ color: C.muted }}>Loading dashboard...</Typography>
      </Box>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Box>
  );

  const cards = [
    { title:'Total Jobs',         value: stats.totalJobs,         change:'+3',   icon: Briefcase,  gradient:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` },
    { title:'Jobs Applied',       value: stats.activeJobs,        change:'jobs', icon: TrendingUp, gradient:`linear-gradient(135deg, ${C.accent}, #0EA5E9)` },
    { title:'Total Applications', value: stats.totalApplications, change:'+18%', icon: CheckCircle,gradient:`linear-gradient(135deg, ${C.success}, #059669)` },
    { title:'Total Users',        value: stats.totalUsers,        change:'+12%', icon: Users,      gradient:`linear-gradient(135deg, ${C.warning}, #D97706)` },
  ];

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{
        marginLeft:{ xs:0, lg:'240px' },
        width:{ xs:'100%', lg:'calc(100% - 240px)' },
        minWidth: 0,
        p:{ xs:'12px', sm:'24px', lg:'32px' },
        pt:{ xs:'64px', lg:'32px' },
        overflowX: 'hidden',
      }}>

        {/* Header */}
        <Box sx={{ mb:3 }}>
          {/* Mobile: centered layout */}
          <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', alignItems:'center', textAlign:'center', gap:1.5, position:'relative' }}>
            {/* Notification bell — absolute top-left */}
            <Box sx={{ position:'absolute', top:0, left:0 }}>
              <NotificationBell userId={adminUser?.id || adminUser?._id} />
            </Box>
            {/* Title centered */}
            <Box>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:'1.3rem' }}>Admin Dashboard</Typography>
              <Typography sx={{ color: C.muted, mt:0.25, fontSize:'0.75rem' }}>Welcome back, Administrator</Typography>
            </Box>
            {/* Button centered */}
            <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={16}/>}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, px:3, fontSize:'0.75rem', minHeight:40, boxShadow:`0 4px 16px ${C.primary}44` }}>
              New Job
            </Button>
          </Box>

          {/* Tablet/Desktop: horizontal layout */}
          <Box sx={{ display:{ xs:'none', sm:'flex' }, justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:2 }}>
            <Box>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ sm:'1.75rem', lg:'2.125rem' } }}>Admin Dashboard</Typography>
              <Typography sx={{ color: C.muted, mt:0.5, fontSize:'0.875rem' }}>Welcome back, Administrator</Typography>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
              <NotificationBell userId={adminUser?.id || adminUser?._id} />
              <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={16}/>}
                sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, px:3, fontSize:'0.875rem', minHeight:40, boxShadow:`0 4px 16px ${C.primary}44` }}>
                Post New Job
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(2,1fr)', sm:'repeat(2,1fr)', lg:'repeat(4,1fr)' }, gap:{ xs:1.5, sm:2, lg:3 }, mb:3 }}>
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Card key={i} sx={{
                background: C.surface, border:`1px solid ${C.border}`,
                borderRadius:3, cursor:'pointer', transition:'all 0.3s',
                '&:hover':{ transform:'translateY(-4px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)`, borderColor: C.primary },
              }}>
                {/* Mobile + Tablet: vertical centered like quick actions */}
                <Box sx={{
                  display:{ xs:'flex', lg:'none' },
                  flexDirection:'column', alignItems:'center', justifyContent:'center',
                  textAlign:'center', gap:1, p:'16px 10px', minHeight:110,
                }}>
                  <Box sx={{ width:44, height:44, borderRadius:2, background: c.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px rgba(0,0,0,0.25)` }}>
                    <Icon size={20} color="#fff" />
                  </Box>
                  <Typography sx={{ color: C.text, fontWeight:700, fontSize:'0.72rem', lineHeight:1.3 }}>{c.title}</Typography>
                  <Typography sx={{ fontWeight:800, color: C.text, fontSize:'1.5rem', lineHeight:1 }}>{c.value}</Typography>
                  <Chip label={c.change} size="small" sx={{ background:`${C.success}22`, color: C.success, fontWeight:700, fontSize:'0.55rem', height:18 }} />
                </Box>
                {/* Desktop: horizontal */}
                <Box sx={{ display:{ xs:'none', lg:'flex' }, justifyContent:'space-between', alignItems:'flex-start', gap:1, p:3 }}>
                  <Box sx={{ flex:1, minWidth:0 }}>
                    <Typography sx={{ color: C.muted, fontSize:'0.8rem', mb:0.25 }}>{c.title}</Typography>
                    <Typography sx={{ fontWeight:700, color: C.text, lineHeight:1, fontSize:'1.75rem' }}>{c.value}</Typography>
                    <Chip label={c.change} size="small" sx={{ mt:0.75, background:`${C.success}22`, color: C.success, fontWeight:600, fontSize:'0.65rem', height:22 }} />
                  </Box>
                  <Box sx={{ p:'10px', borderRadius:2, background: c.gradient, flexShrink:0 }}>
                    <Icon size={20} color="#fff" />
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>

        {/* Quick Actions + Pie */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'2fr 1fr' }, gap:{ xs:1.5, sm:3 }, mb:3 }}>
          <Card sx={{ p:{ xs:'14px', sm:3 }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 } }}>
            <Typography sx={{ fontWeight:700, color: C.text, mb:{ xs:1.5, sm:2 }, fontSize:{ xs:'0.875rem', sm:'1.1rem' } }}>Quick Actions</Typography>
            <Box sx={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:{ xs:1.5, sm:2 } }}>
              {[
                { label:'Candidates',   icon: Users,       route:'/candidates',         gradient:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` },
                { label:'Applications', icon: CheckCircle, route:'/admin/applications', gradient:`linear-gradient(135deg, ${C.success}, #059669)` },
                { label:'Post Job',     icon: PlusCircle,  route:'/jobform',            gradient:`linear-gradient(135deg, ${C.accent}, #0EA5E9)` },
                { label:'Interviews',   icon: Calendar,    route:'/schedule-interview', gradient:`linear-gradient(135deg, ${C.warning}, #D97706)` },
              ].map(({ label, icon: Icon, route, gradient }) => (
                <Box key={label} onClick={() => navigate(route)}
                  sx={{
                    borderRadius:3, cursor:'pointer',
                    background: C.bg, border:`1px solid ${C.border}`,
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                    gap:1, textAlign:'center',
                    minHeight:110,
                    p:'16px 10px',
                    transition:'all 0.25s',
                    '&:hover':{ background: gradient, border:'1px solid transparent', transform:'translateY(-3px)',
                      boxShadow:`0 12px 32px rgba(0,0,0,0.4)`,
                      '& .qa-lbl':{ color:'#fff' } },
                  }}>
                  <Box sx={{
                    width:44, height:44, borderRadius:2,
                    background: gradient, display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:`0 4px 12px rgba(0,0,0,0.25)`,
                  }}>
                    <Icon size={20} color="#fff"/>
                  </Box>
                  <Typography className="qa-lbl" sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'0.72rem', sm:'0.8rem' }, lineHeight:1.3, transition:'color 0.25s' }}>
                    {label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Card>

          <Card sx={{ p:{ xs:'14px', sm:3 }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 }, display:'flex', flexDirection:'column' }}>
            <Typography sx={{ fontWeight:700, color: C.text, mb:0.5, fontSize:{ xs:'0.875rem', sm:'1.1rem' } }}>Application Status</Typography>
            <Typography sx={{ color: C.muted, fontSize:{ xs:'0.7rem', sm:'0.75rem' }, mb:1.5 }}>Tap a status to filter</Typography>
            <Box sx={{ flex:1, display:'flex', alignItems:'center' }}>
              <ApplicationStatusPie applications={allApps}/>
            </Box>
          </Card>
        </Box>

        <AnalyticsCharts stats={stats} jobs={jobs} applications={allApps} />

      </Box>
    </Box>
  );
}
