import Sidebar from "../components/Sidebar";
import { Box, Grid, Card, Typography, Button, Chip, Avatar, LinearProgress } from "@mui/material";
import { Briefcase, Clock, CheckCircle, Star, MapPin, DollarSign, TrendingUp, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  bg:      '#0F172A',
  surface: '#1E293B',
  border:  '#334155',
  primary: '#6366F1',
  secondary:'#8B5CF6',
  accent:  '#06B6D4',
  warning: '#F59E0B',
  success: '#10B981',
  text:    '#F1F5F9',
  muted:   '#94A3B8',
};

const applications = [
  { title:'Frontend Developer', company:'Tech Startup Co.', status:'Interview Scheduled', color: C.accent,   date:'2 days ago' },
  { title:'UI/UX Designer',     company:'Creative Agency',  status:'Under Review',        color: C.warning,  date:'1 week ago' },
  { title:'Backend Engineer',   company:'Enterprise Solutions', status:'Applied',         color: C.primary,  date:'3 days ago' },
];

const savedJobs = [
  { title:'React Developer', company:'Startup Hub',   location:'Remote',   salary:'$80k-$120k', type:'Full-time' },
  { title:'Senior Designer', company:'Design Studio', location:'New York',  salary:'$70k-$100k', type:'Full-time' },
  { title:'QA Engineer',     company:'Tech Corp',     location:'Remote',   salary:'$60k-$90k',  type:'Contract' },
];

export default function UserDashboard() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const userName  = user?.name || 'User';

  const stats = [
    { label:'Applications', value: applications.length, icon: Briefcase,    gradient:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` },
    { label:'Saved Jobs',   value: savedJobs.length,    icon: Star,          gradient:`linear-gradient(135deg, ${C.accent}, #0EA5E9)` },
    { label:'In Progress',  value: 1,                   icon: Clock,         gradient:`linear-gradient(135deg, ${C.warning}, #D97706)` },
    { label:'Offers',       value: 0,                   icon: CheckCircle,   gradient:`linear-gradient(135deg, ${C.success}, #059669)` },
  ];

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>

        {/* Header */}
        <Box sx={{ mb:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>
              Welcome back, {userName.split(' ')[0]} 👋
            </Typography>
            <Typography sx={{ color: C.muted, mt:0.5 }}>Here's your job search overview</Typography>
          </Box>
          <Button onClick={() => navigate('/jobs')} startIcon={<Briefcase size={16}/>}
            sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
              borderRadius:2, textTransform:'none', fontWeight:600, px:3,
              boxShadow:`0 4px 16px ${C.primary}44` }}>
            Browse Jobs
          </Button>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={3} sx={{ mb:4 }}>
          {stats.map(({ label, value, icon: Icon, gradient }, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
                transition:'all 0.3s', cursor:'pointer',
                '&:hover':{ transform:'translateY(-4px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)`, borderColor: C.primary } }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <Box>
                    <Typography sx={{ color: C.muted, fontSize:13, mb:1 }}>{label}</Typography>
                    <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>{value}</Typography>
                  </Box>
                  <Box sx={{ p:1.5, borderRadius:2, background: gradient }}>
                    <Icon size={22} color="#fff" />
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Applications */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
                <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>My Applications</Typography>
                <Chip label={`${applications.length} total`} size="small"
                  sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:600 }} />
              </Box>
              {applications.map((app, i) => (
                <Box key={i} sx={{ p:2, mb:1.5, borderRadius:2, background: C.bg,
                  border:`1px solid ${C.border}`, transition:'all 0.2s',
                  '&:hover':{ borderColor: app.color, background:`${app.color}08` } }}>
                  <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:0.5 }}>
                    <Box>
                      <Typography sx={{ fontWeight:600, color: C.text, fontSize:14 }}>{app.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:12 }}>{app.company}</Typography>
                    </Box>
                    <Chip label={app.status} size="small"
                      sx={{ background:`${app.color}22`, color: app.color, fontWeight:600, fontSize:11 }} />
                  </Box>
                  <Typography sx={{ color: C.muted, fontSize:11, mt:0.5 }}>Applied {app.date}</Typography>
                </Box>
              ))}
            </Card>
          </Grid>

          {/* Saved Jobs — full width grid */}
          <Grid item xs={12}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
                <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Saved Jobs</Typography>
                <Chip label={`${savedJobs.length} saved`} size="small"
                  sx={{ background:`${C.accent}22`, color: C.accent, fontWeight:600 }} />
              </Box>
              <Grid container spacing={2}>
                {savedJobs.map((job, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Box sx={{ p:2.5, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`,
                      height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between',
                      transition:'all 0.2s', '&:hover':{ borderColor: C.accent, background:`${C.accent}08` } }}>
                      <Box>
                        <Typography sx={{ fontWeight:700, color: C.text, fontSize:15, mb:0.5 }}>{job.title}</Typography>
                        <Typography sx={{ color: C.muted, fontSize:13, mb:1.5 }}>{job.company}</Typography>
                        <Box sx={{ display:'flex', gap:2, mb:1.5, flexWrap:'wrap' }}>
                          <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:12 }}>
                            <MapPin size={13} color={C.accent}/>{job.location}
                          </Box>
                          <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:12 }}>
                            <DollarSign size={13} color={C.accent}/>{job.salary}
                          </Box>
                        </Box>
                        <Chip label={job.type} size="small"
                          sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:600, fontSize:11, mb:1.5 }} />
                      </Box>
                      <Box sx={{ display:'flex', gap:1 }}>
                        <Button size="small" onClick={() => navigate('/jobs')} sx={{ flex:1,
                          background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                          borderRadius:1.5, textTransform:'none', fontWeight:600,
                          '&:hover':{ opacity:0.9 } }}>
                          Apply Now
                        </Button>
                        <Button size="small" variant="outlined"
                          sx={{ borderRadius:1.5, textTransform:'none', fontSize:12,
                            borderColor: C.border, color: C.muted,
                            '&:hover':{ borderColor: C.primary, color: C.primary } }}>
                          Details
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Profile Completion */}
          <Grid item xs={12}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
              background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)` }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Complete Your Profile</Typography>
                  <Typography sx={{ color: C.muted, fontSize:13, mt:0.5 }}>
                    A complete profile gets 3x more recruiter views
                  </Typography>
                  <Box sx={{ mt:2, display:'flex', alignItems:'center', gap:2 }}>
                    <LinearProgress variant="determinate" value={40}
                      sx={{ width:200, height:8, borderRadius:4, background:`${C.border}`,
                        '& .MuiLinearProgress-bar':{ background:`linear-gradient(90deg, ${C.primary}, ${C.secondary})`, borderRadius:4 } }} />
                    <Typography sx={{ color: C.primary, fontWeight:700, fontSize:14 }}>40%</Typography>
                  </Box>
                </Box>
                <Button onClick={() => navigate('/user-profile')}
                  sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                    borderRadius:2, textTransform:'none', fontWeight:600, px:3,
                    boxShadow:`0 4px 16px ${C.primary}44` }}>
                  Complete Profile
                </Button>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
