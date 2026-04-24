import Sidebar from "../components/Sidebar";
import { Box, Card, Typography, Button, Chip, LinearProgress, CircularProgress, Avatar, TextField, InputAdornment, Collapse } from "@mui/material";
import { Briefcase, Clock, CheckCircle, Star, MapPin, TrendingUp, Eye, ArrowRight, Search, Settings2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { applicationService, savedJobService, authService } from "../services/api";
import NotificationBell from "../components/NotificationBell";

const THEMES = [
  { name:'Indigo', primary:'#6366F1', secondary:'#8B5CF6' },
  { name:'Blue',   primary:'#3B82F6', secondary:'#06B6D4' },
  { name:'Green',  primary:'#10B981', secondary:'#059669' },
  { name:'Rose',   primary:'#F43F5E', secondary:'#EC4899' },
  { name:'Orange', primary:'#F97316', secondary:'#F59E0B' },
  { name:'Violet', primary:'#7C3AED', secondary:'#A855F7' },
];

const calcCompletion = (profile) => {
  if (!profile) return 0;
  const checks = [
    !!profile.name, !!profile.email, !!profile.phoneNumber, !!profile.gender,
    !!profile.dateOfBirth, !!(profile.address?.city),
    !!(profile.professional?.currentJobTitle), !!(profile.professional?.currentCompany),
    !!(profile.professional?.totalExperience), !!(profile.skills?.programmingLanguages?.length),
    !!(profile.education?.length),
    !!(profile.resume?.portfolioLink || profile.resume?.githubProfile || profile.resume?.linkedinProfile),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [accentColor, setAccentColor] = useState('#6366F1');
  const [visibleSections, setVisibleSections] = useState({
    stats: true, recommended: true, activity: true, savedJobs: true,
  });

  // C is derived from accentColor — defined inside component
  const theme = THEMES.find(t => t.primary === accentColor) || THEMES[0];
  const C = {
    bg:       '#F8FAFF',
    surface:  '#FFFFFF',
    primary:  theme.primary,
    secondary:theme.secondary,
    accent:   '#06B6D4',
    success:  '#10B981',
    warning:  '#F59E0B',
    danger:   '#EF4444',
    text:     '#1E293B',
    muted:    '#64748B',
    border:   '#E2E8F0',
  };

  const statusColor = {
    Pending: C.warning, Shortlisted: C.accent,
    'Interview Scheduled': C.primary, Selected: C.success, Rejected: C.danger,
  };

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
    { label:'Applications Sent',    value: apps.length,  icon: Briefcase,   color: C.primary },
    { label:'Interviews Scheduled', value: inProgress,   icon: Clock,       color: C.secondary },
    { label:'Saved Jobs',           value: saved.length, icon: Star,        color: C.accent },
    { label:'Offers',               value: offers,       icon: CheckCircle, color: C.success },
  ];

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <CircularProgress sx={{ color: C.primary }}/>
    </Box>
  );

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{
        marginLeft:{ xs:0, lg:'240px' },
        width:{ xs:'100%', lg:'calc(100% - 240px)' },
        minWidth:0, overflowX:'hidden',
        p:{ xs:'12px', sm:'16px', lg:'24px' },
        pt:{ xs:'64px', lg:'24px' },
      }}>

        {/* ── Top bar ── */}
        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb: customizeOpen ? 1.5 : 0 }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:'1.1rem', flexShrink:0, display:{ xs:'none', sm:'block' } }}>
              Dashboard
            </Typography>
            <TextField size="small" placeholder="Search jobs, applications..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) navigate(`/jobs`); }}
              sx={{ flex:1,
                '& .MuiOutlinedInput-root':{ borderRadius:2, background: C.surface, color: C.text, fontSize:'0.8rem',
                  '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary } },
                '& .MuiInputBase-input::placeholder':{ color: C.muted, opacity:1 },
              }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={14} color={C.muted}/></InputAdornment> }}
            />
            <Button onClick={() => setCustomizeOpen(o => !o)} startIcon={<Settings2 size={14}/>}
              sx={{ background: customizeOpen ? C.primary : C.surface, color: customizeOpen ? '#fff' : C.muted,
                borderRadius:2, textTransform:'none', fontWeight:600, fontSize:'0.75rem', minHeight:36, px:1.75,
                border:`1px solid ${C.border}`, whiteSpace:'nowrap', flexShrink:0,
                '&:hover':{ background: C.primary, color:'#fff', borderColor: C.primary } }}>
              <Box component="span" sx={{ display:{ xs:'none', sm:'inline' } }}>Customize Dashboard</Box>
              <Box component="span" sx={{ display:{ xs:'inline', sm:'none' } }}>Customize</Box>
            </Button>
            <NotificationBell userId={userId} />
          </Box>

          {/* Customize panel */}
          <Collapse in={customizeOpen}>
            <Box sx={{ p:'14px 16px', borderRadius:2, background: C.surface, border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', gap:2 }}>
              {/* Theme color */}
              <Box>
                <Typography sx={{ color: C.muted, fontSize:'0.7rem', fontWeight:600, mb:1, textTransform:'uppercase', letterSpacing:0.5 }}>Theme Color</Typography>
                <Box sx={{ display:'flex', gap:1.5, flexWrap:'wrap' }}>
                  {THEMES.map(t => (
                    <Box key={t.name} onClick={() => setAccentColor(t.primary)}
                      sx={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0.5, cursor:'pointer' }}>
                      <Box sx={{
                        width:30, height:30, borderRadius:'50%',
                        background:`linear-gradient(135deg,${t.primary},${t.secondary})`,
                        border: accentColor === t.primary ? '3px solid #fff' : '3px solid transparent',
                        boxShadow: accentColor === t.primary ? `0 0 0 2px ${t.primary}` : 'none',
                        transition:'all 0.2s', '&:hover':{ transform:'scale(1.15)' },
                      }}/>
                      <Typography sx={{ color: accentColor === t.primary ? C.text : C.muted, fontSize:'0.58rem', fontWeight: accentColor === t.primary ? 700 : 400 }}>{t.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Section toggles */}
              <Box>
                <Typography sx={{ color: C.muted, fontSize:'0.7rem', fontWeight:600, mb:1, textTransform:'uppercase', letterSpacing:0.5 }}>Visible Sections</Typography>
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
                  {[
                    { key:'stats',       label:'Stat Cards',     icon:'📊' },
                    { key:'recommended', label:'Recommended',    icon:'⭐' },
                    { key:'activity',    label:'Recent Activity',icon:'🕐' },
                    { key:'savedJobs',   label:'Saved Jobs',     icon:'🔖' },
                  ].map(({ key, label, icon }) => (
                    <Button key={key} size="small" onClick={() => setVisibleSections(s => ({ ...s, [key]: !s[key] }))}
                      sx={{ borderRadius:2, textTransform:'none', fontSize:'0.72rem', minHeight:30, px:1.5,
                        background: visibleSections[key] ? `${C.primary}22` : C.bg,
                        color: visibleSections[key] ? C.primary : C.muted,
                        border:`1px solid ${visibleSections[key] ? C.primary : C.border}`,
                        '&:hover':{ background:`${C.primary}22`, color: C.primary, borderColor: C.primary } }}>
                      {icon} {label} {visibleSections[key] ? '✓' : ''}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </Box>

        {/* ── Welcome banner + Profile completion ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1fr 320px' }, gap:2, mb:2.5 }}>
          <Card sx={{ borderRadius:2.5, background:`linear-gradient(135deg,${C.primary},${C.secondary})`, boxShadow:`0 8px 24px ${C.primary}33`, p:{ xs:'20px', sm:'24px' }, position:'relative', overflow:'hidden' }}>
            <Box sx={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
            <Box sx={{ position:'absolute', bottom:-30, right:60, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
            <Typography sx={{ color:'rgba(255,255,255,0.8)', fontSize:'0.75rem', mb:0.5 }}>Welcome back</Typography>
            <Typography sx={{ color:'#fff', fontWeight:800, fontSize:{ xs:'1.3rem', sm:'1.5rem' }, mb:0.5 }}>
              Good morning, {userName.split(' ')[0]} 👋
            </Typography>
            <Typography sx={{ color:'rgba(255,255,255,0.75)', fontSize:'0.8rem', mb:2 }}>Ready to find your next opportunity?</Typography>
            <Button onClick={() => navigate('/jobs')} size="small"
              sx={{ background:'rgba(255,255,255,0.2)', color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, fontSize:'0.75rem', px:2, minHeight:32, border:'1px solid rgba(255,255,255,0.3)', '&:hover':{ background:'rgba(255,255,255,0.3)' } }}>
              View All Jobs →
            </Button>
          </Card>
          <Card sx={{ borderRadius:2.5, p:{ xs:'16px', sm:'20px' }, boxShadow:'0 2px 12px rgba(0,0,0,0.3)', border:`1px solid ${C.border}`, background: C.surface }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem', mb:2 }}>Profile Completion</Typography>
            <Box sx={{ display:'flex', alignItems:'center', gap:2.5 }}>
              {/* Circular progress */}
              <Box sx={{ position:'relative', flexShrink:0 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={72}
                  thickness={4}
                  sx={{ color: C.border, position:'absolute', top:0, left:0 }}
                />
                <CircularProgress
                  variant="determinate"
                  value={completion}
                  size={72}
                  thickness={4}
                  sx={{ color: C.primary, '& .MuiCircularProgress-circle':{ strokeLinecap:'round' } }}
                />
                <Box sx={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Typography sx={{ fontWeight:800, color: C.text, fontSize:'0.9rem', lineHeight:1 }}>{completion}%</Typography>
                </Box>
              </Box>
              {/* Text + button */}
              <Box sx={{ flex:1, minWidth:0 }}>
                <Typography sx={{ color: C.text, fontWeight:600, fontSize:'0.8rem', mb:0.5 }}>
                  {completion === 100 ? 'Profile Complete!' : `${100 - completion}% remaining`}
                </Typography>
                <Typography sx={{ color: C.muted, fontSize:'0.68rem', mb:1.5 }}>
                  Complete your profile to get more recruiter views
                </Typography>
                <Button fullWidth onClick={() => navigate('/user-profile')} size="small"
                  sx={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:2, textTransform:'none', fontWeight:600, fontSize:'0.72rem', minHeight:30 }}>
                  Complete Profile →
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* ── Stat cards ── */}
        {visibleSections.stats && (
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'repeat(2,1fr)', lg:'repeat(4,1fr)' }, gap:{ xs:1.5, sm:2 }, mb:2.5 }}>
            {stats.map(({ label, value, icon: Icon, color }, i) => (
              <Card key={i} sx={{ borderRadius:2, p:{ xs:'14px 12px', sm:'16px' }, boxShadow:'0 2px 8px rgba(0,0,0,0.2)', border:`1px solid ${C.border}`, background: C.surface, transition:'all 0.2s', cursor:'pointer', '&:hover':{ boxShadow:`0 6px 20px rgba(0,0,0,0.3)`, transform:'translateY(-2px)', borderColor: C.primary } }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:1 }}>
                  <Typography sx={{ color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.72rem' }, fontWeight:500, lineHeight:1.3 }}>{label}</Typography>
                  <Box sx={{ width:{ xs:28, sm:32 }, height:{ xs:28, sm:32 }, borderRadius:1.5, background:`${color}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Icon size={14} color={color}/>
                  </Box>
                </Box>
                <Typography sx={{ fontWeight:800, color: C.text, fontSize:{ xs:'1.5rem', sm:'1.75rem' }, lineHeight:1 }}>{value}</Typography>
              </Card>
            ))}
          </Box>
        )}

        {/* ── Recommended + Right column ── */}
        <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', lg:'1.6fr 1fr' }, gap:2 }}>

          {visibleSections.recommended && (
            <Card sx={{ borderRadius:2.5, p:{ xs:'12px', sm:'14px' }, boxShadow:'0 2px 12px rgba(0,0,0,0.3)', background: C.surface, border:`1px solid ${C.border}` }}>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:0.75 }}>
                <Box>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.875rem' }}>Recommended for You</Typography>
                  <Typography sx={{ color: C.muted, fontSize:'0.65rem' }}>AI-powered matches based on your profile</Typography>
                </Box>
                <Button size="small" onClick={() => navigate('/jobs')} sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.7rem', minHeight:'unset' }}>View All</Button>
              </Box>
              {apps.length === 0 ? (
                <Box sx={{ textAlign:'center', py:3 }}>
                  <Briefcase size={28} color={C.border} style={{ marginBottom:6 }}/>
                  <Typography sx={{ color: C.muted, fontSize:'0.75rem' }}>No recommendations yet</Typography>
                  <Button size="small" onClick={() => navigate('/jobs')} sx={{ mt:1, color: C.primary, textTransform:'none', fontSize:'0.7rem' }}>Browse Jobs</Button>
                </Box>
              ) : apps.slice(0,3).map((app, i) => {
                const sc  = statusColor[app.status] || C.muted;
                const job = app.jobId;
                return (
                  <Box key={i} sx={{ p:'10px 12px', mb:1, borderRadius:1.5, border:`1px solid ${C.border}`, background: C.bg, transition:'all 0.2s', '&:hover':{ borderColor: C.primary } }}>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1.25 }}>
                      <Avatar sx={{ width:32, height:32, borderRadius:1.5, background:`linear-gradient(135deg,${C.primary},${C.secondary})`, fontSize:13, fontWeight:700, flexShrink:0 }}>
                        {(job?.title || app.jobTitle || '?').charAt(0)}
                      </Avatar>
                      <Box sx={{ flex:1, minWidth:0 }}>
                        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.78rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job?.title || app.jobTitle}</Typography>
                          <Chip label={app.status} size="small" sx={{ background:`${sc}22`, color: sc, fontWeight:600, fontSize:'0.55rem', height:16, flexShrink:0, ml:0.5 }}/>
                        </Box>
                        <Typography sx={{ color: C.muted, fontSize:'0.63rem' }}>{job?.company || app.company}</Typography>
                        <Box sx={{ display:'flex', gap:1.5, mt:0.2 }}>
                          {job?.location && <Box sx={{ display:'flex', alignItems:'center', gap:0.4, color: C.muted, fontSize:'0.6rem' }}><MapPin size={9} color={C.muted}/>{job.location}</Box>}
                          {job?.type && <Box sx={{ display:'flex', alignItems:'center', gap:0.4, color: C.muted, fontSize:'0.6rem' }}><Briefcase size={9} color={C.muted}/>{job.type}</Box>}
                        </Box>
                      </Box>
                    </Box>
                    <Button fullWidth size="small" onClick={() => navigate('/my-applications')}
                      sx={{ mt:0.75, background: C.primary, color:'#fff', borderRadius:1.5, textTransform:'none', fontWeight:600, fontSize:'0.68rem', minHeight:26, py:0.3, '&:hover':{ background: C.secondary } }}>
                      View Application →
                    </Button>
                  </Box>
                );
              })}
            </Card>
          )}

          <Box sx={{ display:'flex', flexDirection:'column', gap:1.5 }}>
            {visibleSections.activity && (
              <Card sx={{ borderRadius:2.5, p:{ xs:'12px', sm:'14px' }, boxShadow:'0 2px 12px rgba(0,0,0,0.3)', background: C.surface, border:`1px solid ${C.border}` }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1 }}>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.85rem' }}>Recent Activity</Typography>
                  <Button size="small" onClick={() => navigate('/my-applications')} sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.65rem', minHeight:'unset' }}>View All</Button>
                </Box>
                {apps.length === 0 ? (
                  <Typography sx={{ color: C.muted, fontSize:'0.7rem', textAlign:'center', py:1.5 }}>No recent activity</Typography>
                ) : apps.slice(0,4).map((app, i) => {
                  const sc  = statusColor[app.status] || C.muted;
                  const job = app.jobId;
                  return (
                    <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
                      <Box sx={{ width:28, height:28, borderRadius:'50%', background:`${sc}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <TrendingUp size={12} color={sc}/>
                      </Box>
                      <Box sx={{ flex:1, minWidth:0 }}>
                        <Typography sx={{ fontWeight:600, color: C.text, fontSize:'0.7rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.status === 'Interview Scheduled' ? 'Interview scheduled' : `Applied to ${job?.title || app.jobTitle}`}
                        </Typography>
                        <Typography sx={{ color: C.muted, fontSize:'0.6rem' }}>{job?.company || app.company}</Typography>
                      </Box>
                      <Typography sx={{ color: C.muted, fontSize:'0.58rem', flexShrink:0 }}>
                        {new Date(app.createdAt).toLocaleDateString('en-US',{ month:'short', day:'numeric' })}
                      </Typography>
                    </Box>
                  );
                })}
              </Card>
            )}

            {visibleSections.savedJobs && (
              <Card sx={{ borderRadius:2.5, p:{ xs:'12px', sm:'14px' }, boxShadow:'0 2px 12px rgba(0,0,0,0.3)', background: C.surface, border:`1px solid ${C.border}` }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1 }}>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.85rem' }}>Saved Jobs</Typography>
                  <Button size="small" onClick={() => navigate('/saved-jobs')} sx={{ color: C.primary, textTransform:'none', fontWeight:600, fontSize:'0.65rem', minHeight:'unset' }}>View All</Button>
                </Box>
                {saved.length === 0 ? (
                  <Typography sx={{ color: C.muted, fontSize:'0.7rem', textAlign:'center', py:1.5 }}>No saved jobs yet</Typography>
                ) : saved.slice(0,3).map((job, i) => (
                  <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1, mb:0.875, p:'7px 10px', borderRadius:1.5, background: C.bg, border:`1px solid ${C.border}` }}>
                    <Box sx={{ width:26, height:26, borderRadius:1, background:`${C.warning}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Star size={11} color={C.warning} fill={C.warning}/>
                    </Box>
                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Typography sx={{ fontWeight:600, color: C.text, fontSize:'0.7rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:'0.6rem' }}>{job.company}</Typography>
                    </Box>
                    <Eye size={12} color={C.muted} style={{ cursor:'pointer', flexShrink:0 }} onClick={() => navigate('/saved-jobs')}/>
                  </Box>
                ))}
              </Card>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
