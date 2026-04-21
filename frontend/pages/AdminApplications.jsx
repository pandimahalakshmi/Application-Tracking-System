import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, Typography, Chip, CircularProgress, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Select, MenuItem,
  FormControl, TextField, InputAdornment, Drawer, Divider, Button,
  IconButton, Tooltip,
} from '@mui/material';
import { Search, Users, X, Download, FileText, Phone, Mail, ExternalLink } from 'lucide-react';
import { applicationService } from '../services/api';
import { API_ORIGIN } from '../config/api';

const C = { bg:'#0F172A', surface:'#1E293B', surface2:'#263348', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', success:'#10B981', warning:'#F59E0B', danger:'#F87171', text:'#F1F5F9', muted:'#94A3B8' };
const statuses = ['Pending','Shortlisted','Interview Scheduled','Selected','Rejected'];
const statusColor = { Pending: C.muted, Shortlisted: C.warning, 'Interview Scheduled': C.accent, Selected: C.success, Rejected: C.danger };

const BASE = API_ORIGIN;

export default function AdminApplications() {
  const { applicationId } = useParams();

  const [apps, setApps]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filter, setFilter]       = useState('All');
  const [updating, setUpdating]   = useState(null);
  const [selected, setSelected]   = useState(null); // application in drawer
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = async () => {
    const d = await applicationService.getAll();
    if (d.success) {
      setApps(d.applications);
      // If navigated from notification, auto-open that application
      if (applicationId) {
        const target = d.applications.find(a => a._id === applicationId);
        if (target) { setSelected(target); setDrawerOpen(true); }
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // When applicationId param changes (e.g. second notification click), re-open
  useEffect(() => {
    if (applicationId && apps.length > 0) {
      const target = apps.find(a => a._id === applicationId);
      if (target) { setSelected(target); setDrawerOpen(true); }
    }
  }, [applicationId, apps]);

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    const d = await applicationService.updateStatus(appId, status);
    if (d.success) {
      setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
      if (selected?._id === appId) setSelected(prev => ({ ...prev, status }));
    }
    setUpdating(null);
  };

  const openDrawer = (app) => { setSelected(app); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setSelected(null); };

  const filtered = apps.filter(a => {
    const s = search.toLowerCase();
    const matchSearch = !s || a.userName?.toLowerCase().includes(s) || a.jobTitle?.toLowerCase().includes(s) || a.company?.toLowerCase().includes(s);
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const resumeUrl = selected?.resumeFile ? `${BASE}/uploads/resumes/${selected.resumeFile}` : null;

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, p:{ xs:'16px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' } }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>All Applications</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} applications</Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:2, mb:3, display:'flex', gap:2, flexWrap:'wrap' }}>
          <TextField placeholder="Search by name, job, company..." value={search} onChange={e => setSearch(e.target.value)}
            size="small" sx={{ flex:1, minWidth:240,
              '& .MuiOutlinedInput-root':{ background: C.bg, color: C.text, borderRadius:2, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary } } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color={C.muted}/></InputAdornment> }}/>
          <FormControl size="small" sx={{ minWidth:160 }}>
            <Select value={filter} onChange={e => setFilter(e.target.value)}
              sx={{ background: C.bg, color: C.text, borderRadius:2, '& fieldset':{ borderColor: C.border } }}
              MenuProps={{ PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } }}>
              <MenuItem value="All">All Status</MenuItem>
              {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Card>

        {/* Table */}
        <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
          {loading ? (
            <Box sx={{ display:'flex', justifyContent:'center', p:6 }}><CircularProgress sx={{ color: C.primary }}/></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th':{ background: C.surface2, color: C.muted, fontWeight:600, fontSize:13, borderBottom:`1px solid ${C.border}` } }}>
                    <TableCell>Applicant</TableCell>
                    <TableCell>Job</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Applied</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(app => (
                    <TableRow key={app._id} onClick={() => openDrawer(app)}
                      sx={{ cursor:'pointer', '& td':{ borderBottom:`1px solid ${C.border}`, color: C.text },
                        '&:hover':{ background:`${C.primary}08` },
                        ...(selected?._id === app._id && { background:`${C.primary}12` }) }}>
                      <TableCell>
                        <Box sx={{ display:'flex', alignItems:'center', gap:1.5 }}>
                          <Avatar sx={{ width:34, height:34, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:13, fontWeight:700 }}>
                            {(app.userName || '?').charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight:600, fontSize:13, color: C.text }}>{app.userName}</Typography>
                            <Typography sx={{ fontSize:11, color: C.muted }}>{app.userEmail}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontWeight:600, fontSize:13 }}>{app.jobTitle}</TableCell>
                      <TableCell sx={{ color: C.muted, fontSize:13 }}>{app.company}</TableCell>
                      <TableCell sx={{ color: C.muted, fontSize:12 }}>
                        {new Date(app.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Chip label={app.status} size="small"
                          sx={{ background:`${statusColor[app.status]}22`, color: statusColor[app.status], fontWeight:700, fontSize:11 }}/>
                      </TableCell>
                      <TableCell onClick={e => e.stopPropagation()}>
                        <Select size="small" value={app.status} disabled={updating === app._id}
                          onChange={e => handleStatus(app._id, e.target.value)}
                          sx={{ fontSize:12, color: C.text, background: C.bg, borderRadius:2, minWidth:160,
                            '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary } }}
                          MenuProps={{ PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } }}>
                          {statuses.map(s => <MenuItem key={s} value={s} sx={{ fontSize:13 }}>{s}</MenuItem>)}
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ textAlign:'center', py:6, color: C.muted, borderBottom:'none' }}>
                        <Users size={32} color={C.border} style={{ marginBottom:8, display:'block', margin:'0 auto 8px' }}/>
                        No applications found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>
      </Box>

      {/* Application Detail Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}
        PaperProps={{ sx:{ width:440, background: C.surface, borderLeft:`1px solid ${C.border}`, p:0 } }}>
        {selected && (
          <Box sx={{ height:'100%', display:'flex', flexDirection:'column' }}>

            {/* Drawer Header */}
            <Box sx={{ p:3, pb:2, background:`linear-gradient(135deg, ${C.primary}22, ${C.secondary}11)`,
              borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <Box sx={{ display:'flex', gap:2, alignItems:'center' }}>
                <Avatar sx={{ width:48, height:48, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:20, fontWeight:700 }}>
                  {(selected.userName || '?').charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight:700, color: C.text, fontSize:16 }}>{selected.userName}</Typography>
                  <Typography sx={{ color: C.muted, fontSize:12 }}>{selected.jobTitle} · {selected.company}</Typography>
                </Box>
              </Box>
              <IconButton size="small" onClick={closeDrawer} sx={{ color: C.muted, '&:hover':{ color: C.text } }}>
                <X size={18}/>
              </IconButton>
            </Box>

            {/* Drawer Body */}
            <Box sx={{ flex:1, overflowY:'auto', p:3,
              '&::-webkit-scrollbar':{ width:4 },
              '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>

              {/* Status */}
              <Box sx={{ mb:3, p:2, borderRadius:2, background:`${statusColor[selected.status]}18`,
                border:`1px solid ${statusColor[selected.status]}44`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Typography sx={{ color: C.muted, fontSize:13 }}>Application Status</Typography>
                <Chip label={selected.status} size="small"
                  sx={{ background:`${statusColor[selected.status]}33`, color: statusColor[selected.status], fontWeight:700 }}/>
              </Box>

              {/* Update Status */}
              <Box sx={{ mb:3 }}>
                <Typography sx={{ color: C.muted, fontSize:12, mb:1, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Update Status</Typography>
                <Select fullWidth size="small" value={selected.status} disabled={updating === selected._id}
                  onChange={e => handleStatus(selected._id, e.target.value)}
                  sx={{ background: C.bg, color: C.text, borderRadius:2, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary } }}
                  MenuProps={{ PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } }}>
                  {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                </Select>
              </Box>

              <Divider sx={{ borderColor: C.border, mb:3 }}/>

              {/* Contact Info */}
              <Typography sx={{ color: C.muted, fontSize:12, mb:1.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Contact</Typography>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.5, mb:3 }}>
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, color: C.text, fontSize:13 }}>
                  <Mail size={14} color={C.accent}/>{selected.userEmail}
                </Box>
                {selected.userPhone && (
                  <Box sx={{ display:'flex', alignItems:'center', gap:1.5, color: C.text, fontSize:13 }}>
                    <Phone size={14} color={C.accent}/>{selected.userPhone}
                  </Box>
                )}
              </Box>

              <Divider sx={{ borderColor: C.border, mb:3 }}/>

              {/* Cover Letter */}
              {selected.coverLetter && (
                <>
                  <Typography sx={{ color: C.muted, fontSize:12, mb:1.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Cover Letter</Typography>
                  <Box sx={{ p:2, borderRadius:2, background: C.bg, border:`1px solid ${C.border}`, mb:3 }}>
                    <Typography sx={{ color: C.text, fontSize:13, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.coverLetter}</Typography>
                  </Box>
                </>
              )}

              {/* Portfolio */}
              {selected.portfolioLink && (
                <>
                  <Typography sx={{ color: C.muted, fontSize:12, mb:1.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Portfolio</Typography>
                  <Box sx={{ mb:3 }}>
                    <Button size="small" startIcon={<ExternalLink size={13}/>}
                      onClick={() => window.open(selected.portfolioLink, '_blank')}
                      sx={{ color: C.accent, textTransform:'none', fontSize:13, p:0, '&:hover':{ color: C.primary } }}>
                      {selected.portfolioLink}
                    </Button>
                  </Box>
                </>
              )}

              <Divider sx={{ borderColor: C.border, mb:3 }}/>

              {/* Resume */}
              <Typography sx={{ color: C.muted, fontSize:12, mb:1.5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.5 }}>Resume</Typography>
              {resumeUrl ? (
                <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {/* Preview */}
                  <Box sx={{ borderRadius:2, overflow:'hidden', border:`1px solid ${C.border}`, height:400 }}>
                    <iframe src={resumeUrl} width="100%" height="100%" style={{ border:'none' }} title="Resume Preview"/>
                  </Box>
                  {/* Download */}
                  <Button fullWidth variant="outlined" startIcon={<Download size={15}/>}
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

              {/* Applied date */}
              <Box sx={{ mt:3, pt:2, borderTop:`1px solid ${C.border}` }}>
                <Typography sx={{ color: C.muted, fontSize:12 }}>
                  Applied on {new Date(selected.createdAt).toLocaleDateString('en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

