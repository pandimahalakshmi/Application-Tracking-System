import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, Typography, Chip, CircularProgress, Avatar, Grid,
  TextField, Select, MenuItem, FormControl, InputLabel, Button,
  InputAdornment, Drawer, Divider, IconButton,
} from '@mui/material';
import { Briefcase, Calendar, MapPin, Search, X, SlidersHorizontal, FileText, ExternalLink } from 'lucide-react';
import { applicationService } from '../services/api';
import { API_ORIGIN } from '../config/api';

const C = { bg:'#F0F4FF', surface:'#FFFFFF', border:'#D1D9F0', primary:'#5B5BD6', secondary:'#7C3AED', accent:'#0891B2', success:'#059669', warning:'#D97706', danger:'#DC2626', text:'#111827', muted:'#4B5563' };

const statusConfig = {
  Pending:              { color: '#4B5563',  bg:'rgba(75,85,99,0.12)' },
  Shortlisted:          { color: '#D97706',  bg:'rgba(217,119,6,0.12)' },
  'Interview Scheduled':{ color: '#0891B2',  bg:'rgba(8,145,178,0.12)' },
  Selected:             { color: '#059669',  bg:'rgba(5,150,105,0.12)' },
  Rejected:             { color: '#DC2626',  bg:'rgba(220,38,38,0.12)' },
};

const fSx = {
  '& .MuiOutlinedInput-root':{ borderRadius:1.5, background: '#FFFFFF', color: '#111827', '& fieldset':{ borderColor: '#D1D9F0' }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary } },
  '& .MuiInputLabel-root':{ color: C.muted, fontSize:'0.75rem' },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
  '& .MuiSelect-icon':{ color: C.muted },
  '& .MuiInputBase-input':{ fontSize:'0.78rem', padding:'8px 12px' },
};

const menuProps = { PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } };
const emptyFilters = { search:'', status:'', type:'', dateFrom:'', dateTo:'' };
const BASE = API_ORIGIN;

export default function MyApplications() {
  const { applicationId } = useParams();
  const cardRefs          = useRef({});

  const [apps, setApps]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [local, setLocal]     = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [selected, setSelected]   = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const id = user?.id || user?._id;
    if (!id) { setLoading(false); return; }
    applicationService.getMyApps(id).then(d => {
      if (d.success) {
        setApps(d.applications);
        // Auto-open drawer if navigated from notification
        if (applicationId) {
          const target = d.applications.find(a => a._id === applicationId);
          if (target) { setSelected(target); setDrawerOpen(true); }
        }
      }
    }).finally(() => setLoading(false));
  }, []);

  // If applicationId changes after load (e.g. second notification click)
  useEffect(() => {
    if (applicationId && apps.length > 0) {
      const target = apps.find(a => a._id === applicationId);
      if (target) {
        setSelected(target);
        setDrawerOpen(true);
        // Scroll the card into view
        setTimeout(() => {
          cardRefs.current[applicationId]?.scrollIntoView({ behavior:'smooth', block:'center' });
        }, 100);
      }
    }
  }, [applicationId, apps]);

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const handleApply = () => setApplied({ ...local });
  const handleClear = () => { setLocal(emptyFilters); setApplied(emptyFilters); };
  const hasFilters = Object.values(local).some(v => v !== '');

  const filtered = apps.filter(app => {
    const job = app.jobId;
    const title   = (job?.title   || app.jobTitle || '').toLowerCase();
    const company = (job?.company || app.company  || '').toLowerCase();
    const s = applied.search.toLowerCase();
    const matchSearch = !s || title.includes(s) || company.includes(s);
    const matchStatus = !applied.status || app.status === applied.status;
    const matchType   = !applied.type   || job?.type === applied.type;
    const matchFrom   = !applied.dateFrom || new Date(app.createdAt) >= new Date(applied.dateFrom);
    const matchTo     = !applied.dateTo   || new Date(app.createdAt) <= new Date(applied.dateTo);
    return matchSearch && matchStatus && matchType && matchFrom && matchTo;
  });

  const resumeUrl = selected?.resumeFile ? `${BASE}/uploads/resumes/${selected.resumeFile}` : null;

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, minWidth:0, p:{ xs:'12px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' }, overflowX:'hidden' }}>

        {/* Header */}
        <Box sx={{ mb:{ xs:2, sm:3 } }}>
          <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', alignItems:'center', textAlign:'center', gap:0.5 }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:'1.2rem' }}>My Applications</Typography>
            <Typography sx={{ color: C.muted, fontSize:'0.75rem' }}>{filtered.length} of {apps.length} application{apps.length !== 1 ? 's' : ''}</Typography>
          </Box>
          <Box sx={{ display:{ xs:'none', sm:'block' } }}>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ sm:'1.5rem', lg:'2rem' } }}>My Applications</Typography>
            <Typography sx={{ color: C.muted, mt:0.5, fontSize:'0.875rem' }}>{filtered.length} of {apps.length} application{apps.length !== 1 ? 's' : ''}</Typography>
          </Box>
        </Box>

        {/* Filter Bar */}
        <Box sx={{ mb:{ xs:2, sm:2 }, p:{ xs:'10px', sm:'12px 14px' }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:2 } }}>

          {/* Desktop: compact 2-row layout */}
          <Box sx={{ display:{ xs:'none', sm:'flex' }, flexDirection:'column', gap:1 }}>
            <Box sx={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:1 }}>
              <TextField size="small" placeholder="Search job title or company..." value={local.search}
                onChange={e => set('search', e.target.value)} sx={fSx}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search size={13} color={C.muted}/></InputAdornment> }}/>
              <FormControl size="small" sx={fSx}>
                <InputLabel sx={{ fontSize:'0.72rem' }}>Status</InputLabel>
                <Select value={local.status} onChange={e => set('status', e.target.value)} MenuProps={menuProps}>
                  <MenuItem value="">All</MenuItem>
                  {Object.keys(statusConfig).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={fSx}>
                <InputLabel sx={{ fontSize:'0.72rem' }}>Job Type</InputLabel>
                <Select value={local.type} onChange={e => set('type', e.target.value)} MenuProps={menuProps}>
                  <MenuItem value="">All</MenuItem>
                  {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
              <TextField size="small" label="From" type="date" value={local.dateFrom}
                onChange={e => set('dateFrom', e.target.value)} InputLabelProps={{ shrink:true }} sx={{ ...fSx, flex:1 }}/>
              <TextField size="small" label="To" type="date" value={local.dateTo}
                onChange={e => set('dateTo', e.target.value)} InputLabelProps={{ shrink:true }} sx={{ ...fSx, flex:1 }}/>
              <Button onClick={handleApply} startIcon={<SlidersHorizontal size={13}/>}
                sx={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:1.5, textTransform:'none', fontWeight:600, fontSize:'0.75rem', height:36, px:2, whiteSpace:'nowrap', boxShadow:`0 3px 10px ${C.primary}44` }}>
                Apply
              </Button>
              {hasFilters && (
                <Button size="small" startIcon={<X size={12}/>} onClick={handleClear}
                  sx={{ color: C.muted, textTransform:'none', borderRadius:1.5, height:36, px:1.5, fontSize:'0.72rem', border:`1px solid ${C.border}`, whiteSpace:'nowrap', '&:hover':{ borderColor: C.primary, color: C.text } }}>
                  Clear
                </Button>
              )}
            </Box>
          </Box>

          {/* Mobile layout */}
          <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', gap:1 }}>
            <TextField fullWidth size="small" placeholder="Search job title or company..." value={local.search}
              onChange={e => set('search', e.target.value)} sx={fSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={13} color={C.muted}/></InputAdornment> }}/>
            <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
              <FormControl size="small" sx={fSx}>
                <InputLabel sx={{ fontSize:'0.72rem' }}>Status</InputLabel>
                <Select value={local.status} onChange={e => set('status', e.target.value)} MenuProps={menuProps}>
                  <MenuItem value="">All</MenuItem>
                  {Object.keys(statusConfig).map(s => <MenuItem key={s} value={s} sx={{ fontSize:'0.78rem' }}>{s}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl size="small" sx={fSx}>
                <InputLabel sx={{ fontSize:'0.72rem' }}>Job Type</InputLabel>
                <Select value={local.type} onChange={e => set('type', e.target.value)} MenuProps={menuProps}>
                  <MenuItem value="">All</MenuItem>
                  {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t} sx={{ fontSize:'0.78rem' }}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
              <TextField size="small" label="From" type="date" value={local.dateFrom}
                onChange={e => set('dateFrom', e.target.value)} InputLabelProps={{ shrink:true }} sx={fSx}/>
              <TextField size="small" label="To" type="date" value={local.dateTo}
                onChange={e => set('dateTo', e.target.value)} InputLabelProps={{ shrink:true }} sx={fSx}/>
            </Box>
            <Box sx={{ display:'flex', gap:1 }}>
              <Button onClick={handleApply} startIcon={<SlidersHorizontal size={13}/>} fullWidth
                sx={{ background:`linear-gradient(135deg,${C.primary},${C.secondary})`, color:'#fff', borderRadius:1.5, textTransform:'none', fontWeight:600, fontSize:'0.72rem', height:34 }}>
                Apply Filters
              </Button>
              {hasFilters && (
                <Button size="small" startIcon={<X size={12}/>} onClick={handleClear}
                  sx={{ color: C.muted, textTransform:'none', borderRadius:1.5, height:34, px:1.5, fontSize:'0.72rem', border:`1px solid ${C.border}`, flexShrink:0 }}>
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display:'flex', justifyContent:'center', pt:8 }}>
            <CircularProgress sx={{ color: C.primary }}/>
          </Box>
        ) : apps.length === 0 ? (
          <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:6, textAlign:'center' }}>
            <Briefcase size={48} color={C.border} style={{ marginBottom:16 }}/>
            <Typography variant="h6" sx={{ color: C.text, mb:1 }}>No applications yet</Typography>
            <Typography sx={{ color: C.muted }}>Browse jobs and click "Apply Now" to get started</Typography>
          </Card>
        ) : filtered.length === 0 ? (
          <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:6, textAlign:'center' }}>
            <Search size={48} color={C.border} style={{ marginBottom:16 }}/>
            <Typography variant="h6" sx={{ color: C.text, mb:1 }}>No results found</Typography>
            <Typography sx={{ color: C.muted }}>Try adjusting your filters</Typography>
          </Card>
        ) : (
          <Grid container spacing={{ xs:1.5, sm:2.5, lg:3 }}>
            {filtered.map(app => {
              const sc  = statusConfig[app.status] || statusConfig.Pending;
              const job = app.jobId;
              const isHighlighted = app._id === applicationId;
              return (
                <Grid item xs={12} sm={6} lg={4} key={app._id}
                  ref={el => cardRefs.current[app._id] = el}>
                  <Card onClick={() => { setSelected(app); setDrawerOpen(true); }}
                    sx={{ background: C.surface, border:`1px solid ${isHighlighted ? C.primary : C.border}`,
                      borderRadius:{ xs:2, sm:3 }, p:{ xs:'12px', sm:3 }, height:'100%', cursor:'pointer',
                      boxShadow: isHighlighted ? `0 0 0 2px ${C.primary}` : 'none',
                      transition:'all 0.2s',
                      '&:hover':{ borderColor: C.primary, transform:'translateY(-3px)', boxShadow:`0 12px 32px rgba(0,0,0,0.3)` } }}>

                    <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', mb:{ xs:1.25, sm:2 } }}>
                      <Box sx={{ display:'flex', alignItems:'center', gap:{ xs:1, sm:1.5 } }}>
                        <Avatar sx={{ width:{ xs:32, sm:40 }, height:{ xs:32, sm:40 }, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:{ xs:13, sm:16 }, fontWeight:700 }}>
                          {(job?.title || app.jobTitle || '?').charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'0.78rem', sm:'0.875rem' } }}>{job?.title || app.jobTitle}</Typography>
                          <Typography sx={{ color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.75rem' } }}>{job?.company || app.company}</Typography>
                        </Box>
                      </Box>
                      <Chip label={app.status} size="small" sx={{ background: sc.bg, color: sc.color, fontWeight:700, fontSize:{ xs:'0.58rem', sm:'0.68rem' }, height:{ xs:18, sm:22 }, flexShrink:0 }}/>
                    </Box>

                    <Box sx={{ display:'flex', flexDirection:'column', gap:{ xs:0.5, sm:1 }, mb:{ xs:1.25, sm:2 } }}>
                      {job?.location && (
                        <Box sx={{ display:'flex', alignItems:'center', gap:0.75, color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.75rem' } }}>
                          <MapPin size={11} color={C.accent}/>{job.location}
                        </Box>
                      )}
                      {job?.type && (
                        <Box sx={{ display:'flex', alignItems:'center', gap:0.75, color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.75rem' } }}>
                          <Briefcase size={11} color={C.accent}/>{job.type}
                        </Box>
                      )}
                      <Box sx={{ display:'flex', alignItems:'center', gap:0.75, color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.75rem' } }}>
                        <Calendar size={11} color={C.accent}/>
                        Applied {new Date(app.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                      </Box>
                    </Box>

                    <Box sx={{ p:{ xs:'8px 10px', sm:1.5 }, borderRadius:{ xs:1.5, sm:2 }, background: sc.bg, border:`1px solid ${sc.color}33`, textAlign:'center' }}>
                      <Typography sx={{ color: sc.color, fontWeight:600, fontSize:{ xs:'0.68rem', sm:'0.75rem' } }}>Status: {app.status}</Typography>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Application Detail Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => { setDrawerOpen(false); setSelected(null); }}
        PaperProps={{ sx:{ width:420, background: C.surface, borderLeft:`1px solid ${C.border}` } }}>
        {selected && (() => {
          const sc  = statusConfig[selected.status] || statusConfig.Pending;
          const job = selected.jobId;
          return (
            <Box sx={{ height:'100%', display:'flex', flexDirection:'column' }}>

              {/* Header */}
              <Box sx={{ p:3, pb:2, background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)`,
                borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <Box sx={{ display:'flex', gap:2, alignItems:'center' }}>
                  <Avatar sx={{ width:46, height:46, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:18, fontWeight:700 }}>
                    {(job?.title || selected.jobTitle || '?').charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight:700, color: C.text, fontSize:15 }}>{job?.title || selected.jobTitle}</Typography>
                    <Typography sx={{ color: C.muted, fontSize:12 }}>{job?.company || selected.company}</Typography>
                  </Box>
                </Box>
                <IconButton size="small" onClick={() => { setDrawerOpen(false); setSelected(null); }}
                  sx={{ color: C.muted, '&:hover':{ color: C.text } }}>
                  <X size={18}/>
                </IconButton>
              </Box>

              {/* Body */}
              <Box sx={{ flex:1, overflowY:'auto', p:3,
                '&::-webkit-scrollbar':{ width:4 },
                '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>

                {/* Status banner */}
                <Box sx={{ mb:3, p:2, borderRadius:2, background: sc.bg,
                  border:`1px solid ${sc.color}44`, textAlign:'center' }}>
                  <Typography sx={{ color: sc.color, fontWeight:700, fontSize:14 }}>
                    Status: {selected.status}
                  </Typography>
                </Box>

                {/* Job details */}
                <Typography sx={{ color: C.muted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, mb:1.5 }}>Job Details</Typography>
                <Box sx={{ display:'flex', flexDirection:'column', gap:1, mb:3 }}>
                  {job?.location && (
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.text, fontSize:13 }}>
                      <MapPin size={13} color={C.accent}/>{job.location}
                    </Box>
                  )}
                  {job?.type && (
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.text, fontSize:13 }}>
                      <Briefcase size={13} color={C.accent}/>{job.type}
                    </Box>
                  )}
                  {job?.salary && (
                    <Box sx={{ color: C.text, fontSize:13, pl:0.3 }}>{job.salary}</Box>
                  )}
                  <Box sx={{ display:'flex', alignItems:'center', gap:1, color: C.muted, fontSize:12 }}>
                    <Calendar size={13} color={C.accent}/>
                    Applied {new Date(selected.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })}
                  </Box>
                </Box>

                <Divider sx={{ borderColor: C.border, mb:3 }}/>

                {/* Cover Letter */}
                {selected.coverLetter && (
                  <>
                    <Typography sx={{ color: C.muted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, mb:1.5 }}>Cover Letter</Typography>
                    <Box sx={{ p:2, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`, mb:3 }}>
                      <Typography sx={{ color: C.text, fontSize:13, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.coverLetter}</Typography>
                    </Box>
                  </>
                )}

                {/* Portfolio */}
                {selected.portfolioLink && (
                  <>
                    <Typography sx={{ color: C.muted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, mb:1 }}>Portfolio</Typography>
                    <Button size="small" startIcon={<ExternalLink size={13}/>}
                      onClick={() => window.open(selected.portfolioLink, '_blank')}
                      sx={{ color: C.accent, textTransform:'none', fontSize:13, mb:3, p:0, '&:hover':{ color: C.primary } }}>
                      {selected.portfolioLink}
                    </Button>
                  </>
                )}

                {/* Resume */}
                <Typography sx={{ color: C.muted, fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5, mb:1.5 }}>Resume</Typography>
                {resumeUrl ? (
                  <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
                    <Box sx={{ borderRadius:2, overflow:'hidden', border:`1px solid ${C.border}`, height:360 }}>
                      <iframe src={resumeUrl} width="100%" height="100%" style={{ border:'none' }} title="Resume"/>
                    </Box>
                    <Button fullWidth variant="outlined" startIcon={<FileText size={15}/>}
                      onClick={() => { const a = document.createElement('a'); a.href = resumeUrl; a.download = selected.resumeFile; a.click(); }}
                      sx={{ borderColor: C.primary, color: C.primary, borderRadius:2, textTransform:'none', fontWeight:600,
                        '&:hover':{ background: C.primary, color:'#fff' } }}>
                      Download Resume
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ p:3, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`, textAlign:'center' }}>
                    <FileText size={28} color={C.border} style={{ marginBottom:8 }}/>
                    <Typography sx={{ color: C.muted, fontSize:13 }}>No resume uploaded</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })()}
      </Drawer>
    </Box>
  );
}

