import Sidebar from "../components/Sidebar";
import { Box, Grid, Card, Typography, Button, Chip, LinearProgress, CircularProgress } from "@mui/material";
import { Briefcase, Clock, CheckCircle, Star, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService, savedJobService, authService } from "../services/api";
import NotificationBell from "../components/NotificationBell";

const C = {
  bg:'#0F172A', surface:'#1E293B', border:'#334155',
  primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4',
  warning:'#F59E0B', success:'#10B981', text:'#F1F5F9', muted:'#94A3B8',
};

const statusColor = {
  Pending:              C.muted,
  Shortlisted:          C.warning,
  'Interview Scheduled':C.accent,
  Selected:             C.success,
  Rejected:             '#F87171',
};

// Calculate profile completion percentage based on filled fields
const calcCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    !!profile.name,
    !!profile.email,
    !!profile.phoneNumber,
    !!profile.gender,
    !!profile.dateOfBirth,
    !!(profile.address?.city),
    !!(profile.professional?.currentJobTitle),
    !!(profile.professional?.currentCompany),
    !!(profile.professional?.totalExperience),
    !!(profile.skills?.programmingLanguages?.length),
    !!(profile.education?.length),
    !!(profile.resume?.portfolioLink || profile.resume?.githubProfile || profile.resume?.linkedinProfile),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const userId   = user?.id || user?._id;
  const userName = user?.name || 'User';

  const [apps, setApps]               = useState([]);
  const [saved, setSaved]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    Promise.all([
      applicationService.getMyApps(userId).then(d => d.success && setApps(d.applications)),
      savedJobService.getAll(userId).then(d => d.success && setSaved(d.jobs)),
      authService.getProfile(userId).then(d => d.success && setProfileData(d.user)),
    ]).finally(() => setLoading(false));
  }, [userId]);

  const completion = calcCompletion(profileData);

  const inProgress = apps.filter(a => a.status === 'Interview Scheduled').length;
  const offers     = apps.filter(a => a.status === 'Selected').length;

  const stats = [
    { label:'Applications', value: apps.length,   icon: Briefcase, gradient:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, route:'/my-applications' },
    { label:'Saved Jobs',   value: saved.length,  icon: Star,      gradient:`linear-gradient(135deg, ${C.accent}, #0EA5E9)`,         route:'/saved-jobs' },
    { label:'Interviews',   value: inProgress,    icon: Clock,     gradient:`linear-gradient(135deg, ${C.warning}, #D97706)`,        route:'/my-applications' },
    { label:'Offers',       value: offers,        icon: CheckCircle,gradient:`linear-gradient(135deg, ${C.success}, #059669)`,       route:'/my-applications' },
  ];

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <CircularProgress sx={{ color: C.primary }}/>
    </Box>
  );

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:'100%', p:{ xs:'12px', sm:'24px', lg:'32px' }, pt:{ xs:'60px', lg:'32px' } }}>

        {/* Header */}
        <Box sx={{ mb:3, display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:1 }}>
          <Box sx={{ flex:1, minWidth:0 }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'1.1rem', sm:'1.5rem', lg:'2rem' }, lineHeight:1.3 }}>
              Welcome back, {userName.split(' ')[0]} 👋
            </Typography>
            <Typography sx={{ color: C.muted, mt:0.5, fontSize:{ xs:'0.75rem', sm:'0.875rem' } }}>Here's your job search overview</Typography>
          </Box>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, flexShrink:0 }}>
            <NotificationBell userId={userId} />
            <Button onClick={() => navigate('/jobs')} startIcon={<Briefcase size={14}/>}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                borderRadius:2, textTransform:'none', fontWeight:600,
                px:{ xs:1.5, sm:3 }, fontSize:{ xs:'0.72rem', sm:'0.875rem' },
                boxShadow:`0 4px 16px ${C.primary}44`, whiteSpace:'nowrap' }}>
              <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>Browse Jobs</Box>
              <Box component="span" sx={{ display:{ xs:'inline', sm:'none' } }}>Jobs</Box>
            </Button>
          </Box>
        </Box>

        {/* Stat Cards */}
        <Grid container spacing={{ xs:1.5, sm:2, lg:3 }} sx={{ mb:3 }}>
          {stats.map(({ label, value, icon: Icon, gradient, route }, i) => (
            <Grid item xs={6} sm={6} lg={3} key={i}>
              <Card onClick={() => navigate(route)} sx={{ p:{ xs:1.5, sm:2.5, lg:3 }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
                cursor:'pointer', transition:'all 0.3s', minHeight:{ xs:80, sm:110 },
                '&:hover':{ transform:'translateY(-4px)', boxShadow:`0 12px 32px rgba(0,0,0,0.4)`, borderColor: C.primary } }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:1 }}>
                  <Box sx={{ flex:1, minWidth:0 }}>
                    <Typography sx={{ color: C.muted, fontSize:{ xs:10, sm:13 }, mb:0.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</Typography>
                    <Typography sx={{ fontWeight:700, color: C.text, lineHeight:1, fontSize:{ xs:'1.4rem', sm:'1.8rem', lg:'2rem' } }}>{value}</Typography>
                  </Box>
                  <Box sx={{ p:{ xs:1, sm:1.5 }, borderRadius:2, background: gradient, flexShrink:0 }}>
                    <Icon size={20} color="#fff"/>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} alignItems="stretch">
          {/* Recent Applications */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
              height:420, maxHeight:420, display:'flex', flexDirection:'column' }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3, flexShrink:0 }}>
                <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Recent Applications</Typography>
                <Button size="small" onClick={() => navigate('/my-applications')}
                  sx={{ color: C.accent, textTransform:'none', fontWeight:600 }}>View All</Button>
              </Box>
              <Box sx={{ flex:1, overflowY:'auto', pr:0.5,
                '&::-webkit-scrollbar':{ width:4 },
                '&::-webkit-scrollbar-track':{ background:'transparent' },
                '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>
                {apps.length === 0 ? (
                  <Box sx={{ textAlign:'center', py:6 }}>
                    <Briefcase size={36} color={C.border} style={{ marginBottom:8 }}/>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>No applications yet</Typography>
                    <Button size="small" onClick={() => navigate('/jobs')} sx={{ mt:1, color: C.primary, textTransform:'none' }}>Browse Jobs</Button>
                  </Box>
                ) : apps.slice(0,4).map((app, i) => {
                  const sc = statusColor[app.status] || C.muted;
                  const job = app.jobId;
                  return (
                    <Box key={i} sx={{ p:2, mb:1.5, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`,
                      transition:'all 0.2s', '&:hover':{ borderColor: sc, background:`${sc}08` } }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:0.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight:600, color: C.text, fontSize:14 }}>{job?.title || app.jobTitle}</Typography>
                          <Typography sx={{ color: C.muted, fontSize:12 }}>{job?.company || app.company}</Typography>
                        </Box>
                        <Chip label={app.status} size="small" sx={{ background:`${sc}22`, color: sc, fontWeight:600, fontSize:11 }}/>
                      </Box>
                      <Typography sx={{ color: C.muted, fontSize:11, mt:0.5 }}>
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Card>
          </Grid>

          {/* Saved Jobs preview */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p:3, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
              height:420, maxHeight:420, display:'flex', flexDirection:'column' }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3, flexShrink:0 }}>
                <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Saved Jobs</Typography>
                <Button size="small" onClick={() => navigate('/saved-jobs')}
                  sx={{ color: C.accent, textTransform:'none', fontWeight:600 }}>View All</Button>
              </Box>
              <Box sx={{ flex:1, overflowY:'auto', pr:0.5,
                '&::-webkit-scrollbar':{ width:4 },
                '&::-webkit-scrollbar-track':{ background:'transparent' },
                '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>
                {saved.length === 0 ? (
                  <Box sx={{ textAlign:'center', py:6 }}>
                    <Star size={36} color={C.border} style={{ marginBottom:8 }}/>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>No saved jobs yet</Typography>
                    <Typography sx={{ color: C.muted, fontSize:12, mt:0.5 }}>Click ★ on any job to save it here</Typography>
                  </Box>
                ) : saved.slice(0,3).map((job, i) => (
                  <Box key={i} sx={{ p:2, mb:1.5, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`,
                    transition:'all 0.2s', '&:hover':{ borderColor: C.warning, background:`${C.warning}08` } }}>
                    <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:0.5 }}>
                      <Box>
                        <Typography sx={{ fontWeight:600, color: C.text, fontSize:14 }}>{job.title}</Typography>
                        <Typography sx={{ color: C.muted, fontSize:12 }}>{job.company}</Typography>
                      </Box>
                      <Star size={14} fill={C.warning} color={C.warning}/>
                    </Box>
                    <Box sx={{ display:'flex', gap:2, mt:0.5 }}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:11 }}>
                        <MapPin size={11} color={C.accent}/>{job.location}
                      </Box>
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.5, color: C.muted, fontSize:11 }}>
                        {job.salary}
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Profile Completion */}
          <Grid item xs={12}>
            <Card sx={{ p:{ xs:2.5, sm:3, lg:4 }, border:`1px solid ${C.border}`, borderRadius:3,
              display:'flex', alignItems:'center',
              background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)` }}>
              <Box sx={{ display:'flex', flexDirection:{ xs:'column', sm:'row' }, justifyContent:'space-between',
                alignItems:{ xs:'flex-start', sm:'center' }, width:'100%', gap:2 }}>
                <Box sx={{ flex:1, minWidth:0 }}>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'1rem', sm:'1.25rem' } }}>Complete Your Profile</Typography>
                  <Typography sx={{ color: C.muted, fontSize:{ xs:12, sm:13 }, mt:0.5 }}>A complete profile gets 3x more recruiter views</Typography>
                  <Box sx={{ mt:1.5, display:'flex', alignItems:'center', gap:2 }}>
                    <LinearProgress variant="determinate" value={completion}
                      sx={{ flex:1, maxWidth:{ xs:'100%', sm:200 }, height:8, borderRadius:4, background:`${C.border}`,
                        '& .MuiLinearProgress-bar':{ background:`linear-gradient(90deg, ${C.primary}, ${C.secondary})`, borderRadius:4 } }}/>
                    <Typography sx={{ color: C.primary, fontWeight:700, fontSize:14, flexShrink:0 }}>{completion}%</Typography>
                  </Box>
                </Box>
                <Button onClick={() => navigate('/user-profile')} fullWidth={false}
                  sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                    borderRadius:2, textTransform:'none', fontWeight:600, px:3,
                    width:{ xs:'100%', sm:'auto' },
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
