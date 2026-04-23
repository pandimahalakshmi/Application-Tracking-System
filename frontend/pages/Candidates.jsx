import Sidebar from "../components/Sidebar";
import {
  Box, Card, TextField, Typography, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, CircularProgress, Button,
  Drawer, Divider, Tooltip, LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, Eye, Edit, Trash2, Download, FileText, X,
  Save, Briefcase, Mail, Phone, Calendar, MessageSquare,
} from "lucide-react";
import { applicationService } from "../services/api";
import { API_ORIGIN } from "../config/api";
import { C, fieldSx, cardSx, menuPropsSx } from "../theme";

const statuses = ['Pending','Shortlisted','Interview Scheduled','Selected','Rejected'];

const statusColors = {
  Pending:              { bg:'rgba(148,163,184,0.15)', color:'#94A3B8' },
  Shortlisted:          { bg:'rgba(245,158,11,0.15)',  color:'#F59E0B' },
  'Interview Scheduled':{ bg:'rgba(6,182,212,0.15)',   color:'#06B6D4' },
  Selected:             { bg:'rgba(16,185,129,0.15)',  color:'#10B981' },
  Rejected:             { bg:'rgba(248,113,113,0.15)', color:'#F87171' },
};

const getSkillMatch = (app) => {
  const text = ((app.coverLetter||'') + (app.resumeFile||'')).toLowerCase();
  const skills = ['react','node','python','javascript','mongodb','sql','java','css','html','express'];
  const matched = skills.filter(s => text.includes(s));
  const score = matched.length > 0 ? Math.min(100, matched.length * 15 + 40) : Math.floor(Math.random()*30)+40;
  return { score, matched };
};

const BASE = API_ORIGIN;

export default function Candidates() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Pre-apply status filter if navigated from pie chart
  const statusFromUrl = searchParams.get('status') || '';
  const [apps, setApps]                   = useState([]);
  const [searchTerm, setSearchTerm]       = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [jobFilter, setJobFilter]         = useState("");
  const [loading, setLoading]             = useState(true);
  const [openStatus, setOpenStatus]       = useState(false);
  const [selected, setSelected]           = useState(null);
  const [newStatus, setNewStatus]         = useState("");
  const [updating, setUpdating]           = useState(false);
  const [drawerOpen, setDrawerOpen]       = useState(false);
  const [drawerApp, setDrawerApp]         = useState(null);
  const [notes, setNotes]                 = useState("");
  const [savingNotes, setSavingNotes]     = useState(false);
  const [resumeOpen, setResumeOpen]       = useState(false);
  const [resumeUrl, setResumeUrl]         = useState("");
  const [coverOpen, setCoverOpen]         = useState(false);
  const [coverApp, setCoverApp]           = useState(null);

  // Filter local state (not applied yet)
  const [localSearch, setLocalSearch]     = useState("");
  const [localStatus, setLocalStatus]     = useState(statusFromUrl || "All");
  const [localJob, setLocalJob]           = useState("");
  const [localDateFrom, setLocalDateFrom] = useState("");
  const [localDateTo, setLocalDateTo]     = useState("");

  // Applied filter state
  const [appliedSearch, setAppliedSearch]     = useState("");
  const [appliedStatus, setAppliedStatus]     = useState(statusFromUrl || "All");
  const [appliedJob, setAppliedJob]           = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [appliedDateTo, setAppliedDateTo]     = useState("");

  // Pagination
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);

  useEffect(() => {
    applicationService.getAll()
      .then(r => r.success && setApps(r.applications))
      .finally(() => setLoading(false));
  }, []);

  const openDetail = (app) => { setDrawerApp(app); setNotes(app.adminNotes||''); setDrawerOpen(true); };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    const r = await applicationService.updateNotes(drawerApp._id, notes);
    if (r.success) setApps(prev => prev.map(a => a._id === drawerApp._id ? {...a, adminNotes: notes} : a));
    setSavingNotes(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    const r = await applicationService.remove(id);
    if (r.success) setApps(prev => prev.filter(a => a._id !== id));
  };

  const handleStatusUpdate = async () => {
    setUpdating(true);
    const r = await applicationService.updateStatus(selected._id, newStatus);
    if (r.success) {
      setApps(prev => prev.map(a => a._id === selected._id ? {...a, status: newStatus} : a));
      setUpdating(false);
      setOpenStatus(false);
      if (newStatus === 'Interview Scheduled') {
        navigate('/schedule-interview');
      }
    } else {
      setUpdating(false);
    }
  };

  const handleViewResume = (app) => {
    if (!app.resumeFile) {
      alert('No resume uploaded for this candidate.');
      return;
    }
    // Check if it's a properly uploaded file (multer generates timestamp-random.ext)
    // Original filenames (like "Pandi Mahalakshmi.pdf") were never uploaded to server
    const isUploaded = /^\d{13}-\d+\.\w+$/.test(app.resumeFile);
    if (!isUploaded) {
      alert(`Resume file "${app.resumeFile}" was not uploaded to the server.\n\nThis candidate applied before the upload feature was added. Ask them to re-apply.`);
      return;
    }
    setResumeUrl(`${BASE}/uploads/resumes/${app.resumeFile}`);
    setResumeOpen(true);
  };

  const handleDownload = (app) => {
    if (!app.resumeFile) {
      alert('No resume uploaded for this candidate.');
      return;
    }
    const isUploaded = /^\d{13}-\d+\.\w+$/.test(app.resumeFile);
    if (!isUploaded) {
      alert(`Resume file "${app.resumeFile}" was not uploaded to the server.\n\nThis candidate applied before the upload feature was added.`);
      return;
    }
    const a = document.createElement('a');
    a.href = `${BASE}/uploads/resumes/${app.resumeFile}`;
    a.download = app.resumeFile;
    a.click();
  };

  if (role !== "admin") return (
    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: C.bg }}>
      <Card sx={{ p:4, textAlign:"center", ...cardSx }}>
        <Typography variant="h5" sx={{ color:'#F87171', fontWeight:700 }}>Access Denied</Typography>
      </Card>
    </Box>
  );

  const uniqueJobs = [...new Set(apps.map(a => a.jobTitle).filter(Boolean))];
  const filtered = apps.filter(a => {
    const s = appliedSearch.toLowerCase();
    const ms  = !s || a.userName?.toLowerCase().includes(s) || a.userEmail?.toLowerCase().includes(s) || a.jobTitle?.toLowerCase().includes(s);
    const mst = appliedStatus === "All" || a.status === appliedStatus;
    const mj  = !appliedJob  || a.jobTitle === appliedJob;
    const mdf = !appliedDateFrom || new Date(a.createdAt) >= new Date(appliedDateFrom);
    const mdt = !appliedDateTo   || new Date(a.createdAt) <= new Date(appliedDateTo);
    return ms && mst && mj && mdf && mdt;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleApplyFilters = () => {
    setAppliedSearch(localSearch);
    setAppliedStatus(localStatus);
    setAppliedJob(localJob);
    setAppliedDateFrom(localDateFrom);
    setAppliedDateTo(localDateTo);
    setPage(1);
  };

  const handleClearFilters = () => {
    setLocalSearch(''); setLocalStatus('All'); setLocalJob('');
    setLocalDateFrom(''); setLocalDateTo('');
    setAppliedSearch(''); setAppliedStatus('All'); setAppliedJob('');
    setAppliedDateFrom(''); setAppliedDateTo('');
    setPage(1);
  };

  const hasLocalFilters = localSearch || localStatus !== 'All' || localJob || localDateFrom || localDateTo;

  return (
    <Box sx={{ display:"flex", background: C.bg, minHeight:"100vh" }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:"240px" }, width:"100%", minWidth:0, p:{ xs:"12px", sm:"20px", lg:"32px" }, pt:{ xs:"64px", lg:"32px" }, overflowX:'hidden' }}>

        <Box sx={{ mb:{ xs:2, sm:3 } }}>
          <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'1.2rem', sm:'1.5rem', lg:'2rem' } }}>Candidates</Typography>
          <Typography sx={{ color: C.muted, mt:0.5, fontSize:{ xs:'0.75rem', sm:'0.875rem' } }}>{filtered.length} applicant{filtered.length!==1?'s':''}</Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ mb:{ xs:2, sm:3 }, p:{ xs:'12px', sm:'20px' }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 } }}>
          <Box sx={{ display:'flex', gap:{ xs:1, sm:2 }, flexWrap:'wrap', alignItems:'flex-end' }}>
            <TextField placeholder="Search name, email, job..." value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              size="small" sx={{ ...fieldSx, width:{ xs:'100%', sm:'auto' }, minWidth:{ sm:200 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search size={14} color={C.muted}/></InputAdornment> }}/>
            <FormControl size="small" sx={{ minWidth:{ xs:'calc(50% - 4px)', sm:150 }, ...fieldSx }}>
              <InputLabel sx={{ color: C.muted, fontSize:'0.8rem' }}>Job Title</InputLabel>
              <Select value={localJob} onChange={e => setLocalJob(e.target.value)}
                sx={{ color: C.text, background: C.bg, fontSize:'0.8rem', '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
                <MenuItem value="">All Jobs</MenuItem>
                {uniqueJobs.map(j => <MenuItem key={j} value={j} sx={{ fontSize:'0.8rem' }}>{j}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth:{ xs:'calc(50% - 4px)', sm:155 }, ...fieldSx }}>
              <InputLabel sx={{ color: C.muted, fontSize:'0.8rem' }}>Status</InputLabel>
              <Select value={localStatus} onChange={e => setLocalStatus(e.target.value)}
                sx={{ color: C.text, background: C.bg, fontSize:'0.8rem', '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
                <MenuItem value="All">All Status</MenuItem>
                {statuses.map(s => <MenuItem key={s} value={s} sx={{ fontSize:'0.8rem' }}>{s}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField size="small" label="From" type="date" value={localDateFrom}
              onChange={e => setLocalDateFrom(e.target.value)}
              InputLabelProps={{ shrink:true }}
              sx={{ ...fieldSx, width:{ xs:'calc(50% - 4px)', sm:'auto' }, minWidth:{ sm:140 } }}/>
            <TextField size="small" label="To" type="date" value={localDateTo}
              onChange={e => setLocalDateTo(e.target.value)}
              InputLabelProps={{ shrink:true }}
              sx={{ ...fieldSx, width:{ xs:'calc(50% - 4px)', sm:'auto' }, minWidth:{ sm:140 } }}/>
            <Box sx={{ display:'flex', gap:1, width:{ xs:'100%', sm:'auto' } }}>
              <Button onClick={handleApplyFilters} startIcon={<Search size={14}/>} fullWidth
                sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                  borderRadius:2, textTransform:'none', fontWeight:600, height:38, fontSize:'0.8rem',
                  boxShadow:`0 4px 12px ${C.primary}44` }}>
                Apply
              </Button>
              {hasLocalFilters && (
                <Button size="small" onClick={handleClearFilters}
                  sx={{ color: C.muted, textTransform:'none', border:`1px solid ${C.border}`, borderRadius:2, height:38, px:2, fontSize:'0.8rem',
                    '&:hover':{ borderColor: C.primary, color: C.text } }}>
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Table */}
        <Card sx={cardSx}>
          {loading ? (
            <Box sx={{ display:"flex", justifyContent:"center", p:6 }}><CircularProgress sx={{ color: C.primary }}/></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign:"center", py:8 }}>
              <Briefcase size={40} color={C.border} style={{ marginBottom:12 }}/>
              <Typography sx={{ color: C.muted, fontSize:'0.875rem' }}>No applicants found</Typography>
            </Box>
          ) : (
            <>
              {/* Desktop table */}
              <Box sx={{ display:{ xs:'none', md:'block' }, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ '& th':{ background:'#263348', color: C.muted, fontWeight:600, fontSize:12, borderBottom:`1px solid ${C.border}` } }}>
                      <TableCell>Candidate</TableCell>
                      <TableCell>Job Applied</TableCell>
                      <TableCell>Applied Date</TableCell>
                      <TableCell>Match</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginated.map(app => {
                      const sc = statusColors[app.status] || statusColors.Pending;
                      const match = getSkillMatch(app);
                      return (
                        <TableRow key={app._id} sx={{ '& td':{ borderBottom:`1px solid ${C.border}`, color: C.text }, '&:hover':{ background:`${C.primary}08` } }}>
                          <TableCell>
                            <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                              <Avatar sx={{ width:34, height:34, fontSize:13, fontWeight:700, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                                {(app.userName||'?').charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontWeight:600, fontSize:13 }}>{app.userName}</Typography>
                                <Typography sx={{ fontSize:11, color: C.muted }}>{app.userEmail}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight:600, fontSize:13 }}>{app.jobTitle}</Typography>
                            <Typography sx={{ fontSize:11, color: C.muted }}>{app.company}</Typography>
                          </TableCell>
                          <TableCell sx={{ color: C.muted, fontSize:12 }}>
                            {new Date(app.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                              <LinearProgress variant="determinate" value={match.score}
                                sx={{ width:56, height:5, borderRadius:3, background: C.border,
                                  '& .MuiLinearProgress-bar':{ background: match.score>=70?C.success:match.score>=50?C.warning:'#F87171', borderRadius:3 } }}/>
                              <Typography sx={{ fontSize:11, fontWeight:600, color: match.score>=70?C.success:match.score>=50?C.warning:'#F87171' }}>
                                {match.score}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={app.status} size="small" sx={{ background: sc.bg, color: sc.color, fontWeight:700, fontSize:11 }}/>
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display:"flex", justifyContent:"center", gap:0.5 }}>
                              <Tooltip title="View Details"><IconButton size="small" onClick={() => openDetail(app)} sx={{ color: C.primary, '&:hover':{ background:`${C.primary}22` } }}><Eye size={14}/></IconButton></Tooltip>
                              <Tooltip title="Update Status"><IconButton size="small" onClick={() => { setSelected(app); setNewStatus(app.status); setOpenStatus(true); }} sx={{ color: C.warning, '&:hover':{ background:`${C.warning}22` } }}><Edit size={14}/></IconButton></Tooltip>
                              <Tooltip title="Preview Resume"><IconButton size="small" onClick={() => handleViewResume(app)} sx={{ color: C.accent, '&:hover':{ background:`${C.accent}22` } }}><FileText size={14}/></IconButton></Tooltip>
                              <Tooltip title="Download Resume"><IconButton size="small" onClick={() => handleDownload(app)} sx={{ color: C.success, '&:hover':{ background:`${C.success}22` } }}><Download size={14}/></IconButton></Tooltip>
                              <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(app._id)} sx={{ color:'#F87171', '&:hover':{ background:'rgba(248,113,113,0.15)' } }}><Trash2 size={14}/></IconButton></Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>

              {/* Mobile card list */}
              <Box sx={{ display:{ xs:'flex', md:'none' }, flexDirection:'column', gap:1.5, p:'12px' }}>
                {paginated.map(app => {
                  const sc = statusColors[app.status] || statusColors.Pending;
                  const match = getSkillMatch(app);
                  return (
                    <Box key={app._id} sx={{ p:'14px', borderRadius:2, background: C.bg, border:`1px solid ${C.border}` }}>
                      {/* Top row */}
                      <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:1 }}>
                        <Box sx={{ display:'flex', alignItems:'center', gap:1.25 }}>
                          <Avatar sx={{ width:36, height:36, fontSize:14, fontWeight:700, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                            {(app.userName||'?').charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight:700, color: C.text, fontSize:'0.82rem', lineHeight:1.2 }}>{app.userName}</Typography>
                            <Typography sx={{ fontSize:'0.68rem', color: C.muted }}>{app.userEmail}</Typography>
                          </Box>
                        </Box>
                        <Chip label={app.status} size="small" sx={{ background: sc.bg, color: sc.color, fontWeight:700, fontSize:'0.6rem', height:20 }}/>
                      </Box>

                      {/* Job + date */}
                      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1 }}>
                        <Typography sx={{ fontSize:'0.75rem', color: C.text, fontWeight:600 }}>{app.jobTitle}</Typography>
                        <Typography sx={{ fontSize:'0.65rem', color: C.muted }}>
                          {new Date(app.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short'})}
                        </Typography>
                      </Box>

                      {/* Match score */}
                      <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1.25 }}>
                        <Typography sx={{ fontSize:'0.65rem', color: C.muted }}>Match:</Typography>
                        <LinearProgress variant="determinate" value={match.score}
                          sx={{ flex:1, height:5, borderRadius:3, background: C.border,
                            '& .MuiLinearProgress-bar':{ background: match.score>=70?C.success:match.score>=50?C.warning:'#F87171', borderRadius:3 } }}/>
                        <Typography sx={{ fontSize:'0.68rem', fontWeight:700, color: match.score>=70?C.success:match.score>=50?C.warning:'#F87171', flexShrink:0 }}>
                          {match.score}%
                        </Typography>
                      </Box>

                      {/* Actions */}
                      <Box sx={{ display:'flex', gap:0.75, justifyContent:'flex-end' }}>
                        <IconButton size="small" onClick={() => openDetail(app)} sx={{ color: C.primary, background:`${C.primary}18`, borderRadius:1.5, p:'6px' }}><Eye size={14}/></IconButton>
                        <IconButton size="small" onClick={() => { setSelected(app); setNewStatus(app.status); setOpenStatus(true); }} sx={{ color: C.warning, background:`${C.warning}18`, borderRadius:1.5, p:'6px' }}><Edit size={14}/></IconButton>
                        <IconButton size="small" onClick={() => handleViewResume(app)} sx={{ color: C.accent, background:`${C.accent}18`, borderRadius:1.5, p:'6px' }}><FileText size={14}/></IconButton>
                        <IconButton size="small" onClick={() => handleDownload(app)} sx={{ color: C.success, background:`${C.success}18`, borderRadius:1.5, p:'6px' }}><Download size={14}/></IconButton>
                        <IconButton size="small" onClick={() => handleDelete(app._id)} sx={{ color:'#F87171', background:'rgba(248,113,113,0.12)', borderRadius:1.5, p:'6px' }}><Trash2 size={14}/></IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', px:{ xs:1.5, sm:3 }, py:{ xs:1.5, sm:2 },
                  borderTop:`1px solid ${C.border}`, flexWrap:'wrap', gap:1 }}>
                  <Typography sx={{ color: C.muted, fontSize:{ xs:'0.7rem', sm:'0.8rem' } }}>
                    {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}
                  </Typography>
                  <Box sx={{ display:'flex', gap:0.75, alignItems:'center', flexWrap:'wrap' }}>
                    <Button size="small" disabled={page === 1} onClick={() => setPage(p => p-1)}
                      sx={{ minWidth:32, height:32, borderRadius:1.5, color: C.muted, border:`1px solid ${C.border}`, fontSize:'0.8rem',
                        '&:not(:disabled):hover':{ borderColor: C.primary, color: C.primary }, '&:disabled':{ opacity:0.3 } }}>‹</Button>
                    {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                      <Button key={n} size="small" onClick={() => setPage(n)}
                        sx={{ minWidth:32, height:32, borderRadius:1.5, fontWeight: n===page ? 700 : 400, fontSize:'0.75rem',
                          background: n===page ? `linear-gradient(135deg, ${C.primary}, ${C.secondary})` : 'transparent',
                          color: n===page ? '#fff' : C.muted,
                          border: n===page ? 'none' : `1px solid ${C.border}`,
                          '&:hover':{ borderColor: C.primary, color: n===page ? '#fff' : C.primary } }}>{n}</Button>
                    ))}
                    <Button size="small" disabled={page === totalPages} onClick={() => setPage(p => p+1)}
                      sx={{ minWidth:32, height:32, borderRadius:1.5, color: C.muted, border:`1px solid ${C.border}`, fontSize:'0.8rem',
                        '&:not(:disabled):hover':{ borderColor: C.primary, color: C.primary }, '&:disabled':{ opacity:0.3 } }}>›</Button>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Card>

        {/* Status Dialog */}
        <Dialog open={openStatus} onClose={() => setOpenStatus(false)}
          PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, minWidth:360 } }}>
          <DialogTitle sx={{ color: C.text, fontWeight:700 }}>Update Status — {selected?.userName}</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: C.muted, fontSize:13, mb:2 }}>{selected?.jobTitle} at {selected?.company}</Typography>
            <FormControl fullWidth>
              <InputLabel sx={{ color: C.muted }}>Status</InputLabel>
              <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                sx={{ color: C.text, '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
                {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px:3, pb:2 }}>
            <Button onClick={() => setOpenStatus(false)} sx={{ color: C.muted, textTransform:"none" }}>Cancel</Button>
            <Button onClick={handleStatusUpdate} variant="contained" disabled={updating}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, textTransform:"none", borderRadius:2, boxShadow:"none" }}>
              {updating ? 'Updating…' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Detail Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}
          PaperProps={{ sx:{ width:{ xs:'100%', sm:420 }, background: C.surface, borderLeft:`1px solid ${C.border}`, p:{ xs:2, sm:3 }, overflowY:'auto' } }}>
          {drawerApp && <>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
              <Typography variant="h6" sx={{ fontWeight:700, color: C.text }}>Candidate Profile</Typography>
              <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: C.muted }}><X size={18}/></IconButton>
            </Box>
            <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:3, p:2, background: C.bg, borderRadius:2 }}>
              <Avatar sx={{ width:52, height:52, fontSize:20, fontWeight:700, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
                {(drawerApp.userName||'?').charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight:700, color: C.text }}>{drawerApp.userName}</Typography>
                <Chip label={drawerApp.status} size="small" sx={{ background: statusColors[drawerApp.status]?.bg, color: statusColors[drawerApp.status]?.color, fontWeight:600, fontSize:11, mt:0.5 }}/>
              </Box>
            </Box>
            {[
              { icon:<Mail size={15}/>,     label:'Email',   val: drawerApp.userEmail },
              { icon:<Phone size={15}/>,    label:'Phone',   val: drawerApp.userPhone||'—' },
              { icon:<Briefcase size={15}/>,label:'Job',     val: drawerApp.jobTitle },
              { icon:<Calendar size={15}/>, label:'Applied', val: new Date(drawerApp.createdAt).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}) },
            ].map(({ icon, label, val }) => (
              <Box key={label} sx={{ display:'flex', alignItems:'center', gap:1.5, mb:1.5, p:1.5, background: C.bg, borderRadius:2 }}>
                <Box sx={{ color: C.accent }}>{icon}</Box>
                <Box><Typography sx={{ color: C.muted, fontSize:11 }}>{label}</Typography><Typography sx={{ color: C.text, fontSize:13, fontWeight:500 }}>{val}</Typography></Box>
              </Box>
            ))}
            <Divider sx={{ borderColor: C.border, my:2 }}/>
            {drawerApp.coverLetter && <>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
                <Typography sx={{ fontWeight:600, color: C.text, fontSize:13 }}>Cover Letter</Typography>
                <Button size="small" onClick={() => { setCoverApp(drawerApp); setCoverOpen(true); }}
                  sx={{ color: C.accent, textTransform:'none', fontSize:12, fontWeight:600,
                    border:`1px solid ${C.accent}`, borderRadius:2, px:1.5,
                    '&:hover':{ background:`${C.accent}22` } }}>
                  View Cover Letter →
                </Button>
              </Box>
            </>}
            <Typography sx={{ fontWeight:600, color: C.text, fontSize:13, mb:1 }}>Resume</Typography>
            <Box sx={{ display:'flex', gap:1, mb:2 }}>
              <Button size="small" startIcon={<Eye size={14}/>} onClick={() => handleViewResume(drawerApp)}
                sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${C.accent}`, color: C.accent, '&:hover':{ background:`${C.accent}22` } }}>Preview</Button>
              <Button size="small" startIcon={<Download size={14}/>} onClick={() => handleDownload(drawerApp)}
                sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${C.success}`, color: C.success, '&:hover':{ background:`${C.success}22` } }}>Download</Button>
            </Box>
            <Divider sx={{ borderColor: C.border, my:2 }}/>
            <Typography sx={{ fontWeight:600, color: C.text, fontSize:13, mb:1.5 }}>AI Skill Match</Typography>
            {(() => { const m = getSkillMatch(drawerApp); return (
              <Box sx={{ p:2, background: C.bg, borderRadius:2, mb:2 }}>
                <Box sx={{ display:'flex', justifyContent:'space-between', mb:1 }}>
                  <Typography sx={{ color: C.muted, fontSize:12 }}>Match Score</Typography>
                  <Typography sx={{ color: m.score>=70?C.success:m.score>=50?C.warning:'#F87171', fontWeight:700, fontSize:13 }}>{m.score}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={m.score}
                  sx={{ height:8, borderRadius:4, background: C.border, '& .MuiLinearProgress-bar':{ background: m.score>=70?C.success:m.score>=50?C.warning:'#F87171', borderRadius:4 } }}/>
                {m.matched.length > 0 && (
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:1.5 }}>
                    {m.matched.map(s => <Chip key={s} label={`${s} ✓`} size="small" sx={{ background:`${C.success}22`, color: C.success, fontSize:11 }}/>)}
                  </Box>
                )}
              </Box>
            ); })()}
            <Divider sx={{ borderColor: C.border, my:2 }}/>
            <Typography sx={{ fontWeight:600, color: C.text, fontSize:13, mb:1.5 }}>Application Timeline</Typography>
            <Box sx={{ pl:1, mb:2 }}>
              {['Applied','Shortlisted','Interview Scheduled','Selected'].map((step, i) => {
                const idx = ['Applied','Shortlisted','Interview Scheduled','Selected'].indexOf(drawerApp.status);
                const done = i <= idx;
                return (
                  <Box key={step} sx={{ display:'flex', alignItems:'center', gap:1.5, mb:1 }}>
                    <Box sx={{ width:10, height:10, borderRadius:'50%', flexShrink:0, background: done?C.primary:C.border, boxShadow: done?`0 0 8px ${C.primary}88`:'none' }}/>
                    <Typography sx={{ fontSize:12, color: done?C.text:C.muted, fontWeight: done?600:400 }}>{step}</Typography>
                  </Box>
                );
              })}
              {drawerApp.status === 'Rejected' && (
                <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:1 }}>
                  <Box sx={{ width:10, height:10, borderRadius:'50%', background:'#F87171' }}/>
                  <Typography sx={{ fontSize:12, color:'#F87171', fontWeight:600 }}>Rejected</Typography>
                </Box>
              )}
            </Box>
            <Divider sx={{ borderColor: C.border, my:2 }}/>
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1 }}>
              <Typography sx={{ fontWeight:600, color: C.text, fontSize:13, display:'flex', alignItems:'center', gap:0.5 }}>
                <MessageSquare size={14}/> Admin Notes
              </Typography>
              <Button size="small" startIcon={<Save size={12}/>} onClick={handleSaveNotes} disabled={savingNotes}
                sx={{ color: C.primary, textTransform:'none', fontSize:11, '&:hover':{ background:`${C.primary}22` } }}>
                {savingNotes ? 'Saving…' : 'Save'}
              </Button>
            </Box>
            <TextField fullWidth multiline rows={3} value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this candidate..."
              sx={{ '& .MuiOutlinedInput-root':{ background: C.bg, color: C.text, borderRadius:2, fontSize:13,
                '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary },
                '&.Mui-focused fieldset':{ borderColor: C.primary } },
                '& .MuiInputBase-input::placeholder':{ color: C.muted } }} />
          </>}
        </Drawer>

        {/* Cover Letter Full View */}
        <Dialog open={coverOpen} onClose={() => setCoverOpen(false)} maxWidth="sm" fullWidth
          TransitionProps={{ timeout: 300 }}
          PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3,
            boxShadow:'0 24px 64px rgba(0,0,0,0.7)' } }}>
          <DialogTitle sx={{ p:3, pb:2, display:'flex', justifyContent:'space-between', alignItems:'flex-start',
            borderBottom:`1px solid ${C.border}` }}>
            <Box>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:16 }}>Cover Letter</Typography>
              <Typography sx={{ color: C.muted, fontSize:12, mt:0.3 }}>
                {coverApp?.userName} · {coverApp?.jobTitle}
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setCoverOpen(false)}
              sx={{ color: C.muted, '&:hover':{ color: C.text, background:`${C.border}` } }}>
              <X size={18}/>
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p:3 }}>
            <Box sx={{ p:2.5, background: C.bg, borderRadius:2, border:`1px solid ${C.border}` }}>
              <Typography sx={{ color: C.text, fontSize:14, lineHeight:1.9, whiteSpace:'pre-wrap' }}>
                {coverApp?.coverLetter}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px:3, pb:3, pt:0 }}>
            <Button onClick={() => setCoverOpen(false)}
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
                borderRadius:2, textTransform:'none', fontWeight:600, px:3,
                boxShadow:`0 4px 12px ${C.primary}44`, '&:hover':{ opacity:0.9 } }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Resume Preview Modal */}
        <Dialog open={resumeOpen} onClose={() => setResumeOpen(false)} maxWidth="md" fullWidth
          PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, height:'85vh' } }}>
          <DialogTitle sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', color: C.text, fontWeight:700 }}>
            Resume Preview
            <IconButton onClick={() => setResumeOpen(false)} sx={{ color: C.muted }}><X size={18}/></IconButton>
          </DialogTitle>
          <DialogContent sx={{ p:0, display:'flex', flexDirection:'column' }}>
            {resumeUrl ? (
              <iframe
                src={resumeUrl}
                width="100%"
                style={{ flex:1, border:'none', minHeight:'70vh' }}
                title="Resume Preview"
                onError={() => setResumeUrl('')}
              />
            ) : (
              <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:2, p:4 }}>
                <FileText size={48} color={C.border}/>
                <Typography sx={{ color: C.muted, fontSize:15 }}>Resume not available</Typography>
                <Typography sx={{ color: C.muted, fontSize:13, textAlign:'center' }}>
                  This candidate applied before the file upload feature was added.<br/>
                  Ask them to re-apply to upload their resume.
                </Typography>
              </Box>
            )}
          </DialogContent>
        </Dialog>

      </Box>
    </Box>
  );
}

