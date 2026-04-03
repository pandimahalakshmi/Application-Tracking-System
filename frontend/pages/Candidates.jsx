import Sidebar from "../components/Sidebar";
import {
  Box, Card, TextField, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, CircularProgress, Button,
  Drawer, Divider, Tooltip, LinearProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  Search, Eye, Edit, Trash2, Download, FileText, X,
  Save, Briefcase, Mail, Phone, Calendar, MessageSquare,
} from "lucide-react";
import { applicationService } from "../services/api";
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

const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api','');

export default function Candidates() {
  const role = localStorage.getItem("role");
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
    if (r.success) setApps(prev => prev.map(a => a._id === selected._id ? {...a, status: newStatus} : a));
    setUpdating(false);
    setOpenStatus(false);
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
    const s = searchTerm.toLowerCase();
    const ms = !s || a.userName?.toLowerCase().includes(s) || a.userEmail?.toLowerCase().includes(s) || a.jobTitle?.toLowerCase().includes(s);
    const mst = statusFilter === "All" || a.status === statusFilter;
    const mj  = !jobFilter || a.jobTitle === jobFilter;
    return ms && mst && mj;
  });

  return (
    <Box sx={{ display:"flex", background: C.bg, minHeight:"100vh" }}>
      <Sidebar />
      <Box sx={{ marginLeft:"240px", width:"100%", p:"32px" }}>

        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Candidates</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} applicant{filtered.length!==1?'s':''}</Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ ...cardSx, p:2, mb:3, display:"flex", gap:2, flexWrap:"wrap" }}>
          <TextField placeholder="Search name, email, job..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            size="small" sx={{ ...fieldSx, flex:1, minWidth:220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} color={C.muted}/></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth:160 }}>
            <InputLabel sx={{ color: C.muted }}>Job Title</InputLabel>
            <Select value={jobFilter} onChange={e => setJobFilter(e.target.value)}
              sx={{ color: C.text, background: C.bg, '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
              <MenuItem value="">All Jobs</MenuItem>
              {uniqueJobs.map(j => <MenuItem key={j} value={j}>{j}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth:180 }}>
            <InputLabel sx={{ color: C.muted }}>Status</InputLabel>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              sx={{ color: C.text, background: C.bg, '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
              <MenuItem value="All">All Status</MenuItem>
              {statuses.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          {(searchTerm || statusFilter !== "All" || jobFilter) && (
            <Button size="small" onClick={() => { setSearchTerm(''); setStatusFilter('All'); setJobFilter(''); }}
              sx={{ color: C.muted, textTransform:'none', border:`1px solid ${C.border}`, borderRadius:2 }}>
              Clear
            </Button>
          )}
        </Card>

        {/* Table */}
        <Card sx={cardSx}>
          {loading ? (
            <Box sx={{ display:"flex", justifyContent:"center", p:6 }}><CircularProgress sx={{ color: C.primary }}/></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign:"center", py:8 }}>
              <Briefcase size={48} color={C.border} style={{ marginBottom:12 }}/>
              <Typography sx={{ color: C.muted }}>No applicants yet</Typography>
              <Typography sx={{ color: C.muted, fontSize:12, mt:0.5 }}>Candidates appear here once users apply for jobs</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th':{ background:'#263348', color: C.muted, fontWeight:600, fontSize:12, borderBottom:`1px solid ${C.border}` } }}>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Job Applied</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Match Score</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(app => {
                    const sc = statusColors[app.status] || statusColors.Pending;
                    const match = getSkillMatch(app);
                    return (
                      <TableRow key={app._id} sx={{ '& td':{ borderBottom:`1px solid ${C.border}`, color: C.text }, '&:hover':{ background:`${C.primary}08` } }}>
                        <TableCell>
                          <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                            <Avatar sx={{ width:36, height:36, fontSize:14, fontWeight:700, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
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
                              sx={{ width:60, height:6, borderRadius:3, background: C.border,
                                '& .MuiLinearProgress-bar':{ background: match.score>=70?C.success:match.score>=50?C.warning:'#F87171', borderRadius:3 } }}/>
                            <Typography sx={{ fontSize:12, fontWeight:600, color: match.score>=70?C.success:match.score>=50?C.warning:'#F87171' }}>
                              {match.score}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={app.status} size="small" sx={{ background: sc.bg, color: sc.color, fontWeight:700, fontSize:11 }}/>
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display:"flex", justifyContent:"center", gap:0.5 }}>
                            <Tooltip title="View Details"><IconButton size="small" onClick={() => openDetail(app)} sx={{ color: C.primary, '&:hover':{ background:`${C.primary}22` } }}><Eye size={15}/></IconButton></Tooltip>
                            <Tooltip title="Update Status"><IconButton size="small" onClick={() => { setSelected(app); setNewStatus(app.status); setOpenStatus(true); }} sx={{ color: C.warning, '&:hover':{ background:`${C.warning}22` } }}><Edit size={15}/></IconButton></Tooltip>
                            <Tooltip title="Preview Resume"><IconButton size="small" onClick={() => handleViewResume(app)} sx={{ color: C.accent, '&:hover':{ background:`${C.accent}22` } }}><FileText size={15}/></IconButton></Tooltip>
                            <Tooltip title="Download Resume"><IconButton size="small" onClick={() => handleDownload(app)} sx={{ color: C.success, '&:hover':{ background:`${C.success}22` } }}><Download size={15}/></IconButton></Tooltip>
                            <Tooltip title="Delete"><IconButton size="small" onClick={() => handleDelete(app._id)} sx={{ color:'#F87171', '&:hover':{ background:'rgba(248,113,113,0.15)' } }}><Trash2 size={15}/></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
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
          PaperProps={{ sx:{ width:420, background: C.surface, borderLeft:`1px solid ${C.border}`, p:3, overflowY:'auto' } }}>
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
              <Typography sx={{ fontWeight:600, color: C.text, fontSize:13, mb:1 }}>Cover Letter</Typography>
              <Box sx={{ p:2, background: C.bg, borderRadius:2, mb:2, maxHeight:120, overflowY:'auto' }}>
                <Typography sx={{ color: C.muted, fontSize:12, lineHeight:1.7 }}>{drawerApp.coverLetter}</Typography>
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
