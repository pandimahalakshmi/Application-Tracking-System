import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Card, Typography, Button, Chip, Avatar, LinearProgress } from "@mui/material";
import { Users, Briefcase, CheckCircle, Clock, TrendingUp, PlusCircle, Eye, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { jobService } from "../services/api";

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

const statCards = (jobs) => [
  { title: 'Total Candidates', value: '248', change: '+12%', icon: Users,       gradient: `linear-gradient(135deg, ${C.primary}, ${C.secondary})` },
  { title: 'Active Jobs',      value: jobs.length, change: '+3',   icon: Briefcase,  gradient: `linear-gradient(135deg, ${C.accent}, #0EA5E9)` },
  { title: 'Applications',     value: jobs.reduce((s,j)=>s+j.applications,0), change: '+18%', icon: CheckCircle, gradient: `linear-gradient(135deg, ${C.success}, #059669)` },
  { title: 'Interviews Today', value: '7',  change: '+2',   icon: Calendar,   gradient: `linear-gradient(135deg, ${C.warning}, #D97706)` },
];

export default function AdminDashboard() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    jobService.getAllJobs('').then(r => r.success && setJobs(r.jobs));
  }, []);

  if (role !== 'admin') return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: C.bg }}>
      <Card sx={{ p:4, textAlign:'center', background: C.surface, border:`1px solid ${C.border}` }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Typography sx={{ color: C.muted, mt:1 }}>You don't have permission to view this page.</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt:2, background: C.primary, color:'#fff', borderRadius:2, textTransform:'none' }}>Go to Login</Button>
      </Card>
    </Box>
  );

  const cards = statCards(jobs);

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>

        {/* Header */}
        <Box sx={{ mb:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Admin Dashboard</Typography>
            <Typography sx={{ color: C.muted, mt:0.5 }}>Welcome back, Administrator</Typography>
          </Box>
          <Button onClick={() => navigate('/jobform')} startIcon={<PlusCircle size={16}/>}
            sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, px:3, boxShadow:`0 4px 16px ${C.primary}44` }}>
            Post New Job
          </Button>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb:4 }}>
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
                  transition:'all 0.3s', cursor:'pointer',
                  '&:hover':{ transform:'translateY(-4px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)`, borderColor: C.primary } }}>
                  <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <Box>
                      <Typography sx={{ color: C.muted, fontSize:13, mb:1 }}>{c.title}</Typography>
                      <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>{c.value}</Typography>
                      <Chip label={c.change} size="small" sx={{ mt:1, background:`${C.success}22`, color: C.success, fontWeight:600, fontSize:11 }} />
                    </Box>
                    <Box sx={{ p:1.5, borderRadius:2, background: c.gradient }}>
                      <Icon size={22} color="#fff" />
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={3}>
          {/* Job Listings */}
          <Grid item xs={12} md={8}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
                <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Active Job Listings</Typography>
                <Button onClick={() => navigate('/jobs')} size="small" endIcon={<Eye size={14}/>}
                  sx={{ color: C.accent, textTransform:'none', fontWeight:600 }}>View All</Button>
              </Box>
              {jobs.slice(0,5).map((job, i) => (
                <Box key={i} sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', p:2, mb:1.5,
                  borderRadius:2, background:`${C.bg}`, border:`1px solid ${C.border}`,
                  transition:'all 0.2s', '&:hover':{ borderColor: C.primary, background:`${C.primary}08` } }}>
                  <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                    <Box sx={{ width:40, height:40, borderRadius:2, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Briefcase size={18} color="#fff" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight:600, color: C.text, fontSize:14 }}>{job.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:12 }}>{job.company} · {job.location}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign:'right' }}>
                    <Chip label={`${job.applications} apps`} size="small"
                      sx={{ background:`${C.accent}22`, color: C.accent, fontWeight:600, fontSize:11 }} />
                    <Typography sx={{ color: C.muted, fontSize:11, mt:0.5 }}>{job.type}</Typography>
                  </Box>
                </Box>
              ))}
              {jobs.length === 0 && <Typography sx={{ color: C.muted, textAlign:'center', py:4 }}>No jobs posted yet.</Typography>}
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={4}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, mb:3 }}>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:3 }}>Quick Actions</Typography>
              {[
                { label:'View Candidates', icon: Users,    route:'/candidates', gradient:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` },
                { label:'Post New Job',    icon: PlusCircle, route:'/jobform',   gradient:`linear-gradient(135deg, ${C.accent}, #0EA5E9)` },
                { label:'Schedule Interview', icon: Calendar, route:'/schedule-interview', gradient:`linear-gradient(135deg, ${C.warning}, #D97706)` },
              ].map(({ label, icon: Icon, route, gradient }) => (
                <Button key={label} fullWidth onClick={() => navigate(route)}
                  startIcon={<Icon size={16}/>}
                  sx={{ mb:1.5, p:1.5, justifyContent:'flex-start', background: gradient, color:'#fff',
                    borderRadius:2, textTransform:'none', fontWeight:600,
                    transition:'all 0.2s', '&:hover':{ opacity:0.9, transform:'translateX(4px)' } }}>
                  {label}
                </Button>
              ))}
            </Card>

            {/* Pipeline */}
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text, mb:3 }}>Hiring Pipeline</Typography>
              {[
                { label:'Applied',   value:65, color: C.primary },
                { label:'Screening', value:40, color: C.accent },
                { label:'Interview', value:25, color: C.warning },
                { label:'Offered',   value:10, color: C.success },
              ].map(({ label, value, color }) => (
                <Box key={label} sx={{ mb:2 }}>
                  <Box sx={{ display:'flex', justifyContent:'space-between', mb:0.5 }}>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>{label}</Typography>
                    <Typography sx={{ color: C.text, fontSize:13, fontWeight:600 }}>{value}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={value}
                    sx={{ height:6, borderRadius:3, background:`${C.border}`,
                      '& .MuiLinearProgress-bar':{ background: color, borderRadius:3 } }} />
                </Box>
              ))}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
