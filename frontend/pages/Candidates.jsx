import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Box, Card, TextField, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Download, Search } from "lucide-react";
import { candidateService } from "../services/api";
import { C, fieldSx, cardSx, menuPropsSx } from "../theme";

const statusColors = {
  Applied:     { bg:`rgba(99,102,241,0.15)`,  color:'#6366F1' },
  Shortlisted: { bg:`rgba(245,158,11,0.15)`,  color:'#F59E0B' },
  Interview:   { bg:`rgba(6,182,212,0.15)`,   color:'#06B6D4' },
  Selected:    { bg:`rgba(16,185,129,0.15)`,  color:'#10B981' },
  Rejected:    { bg:`rgba(248,113,113,0.15)`, color:'#F87171' },
};

export default function Candidates() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [openStatus, setOpenStatus] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    candidateService.getAllCandidates("All","")
      .then(r => r.success ? setCandidates(r.candidates) : setError(r.error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    const r = await candidateService.deleteCandidate(id);
    if (r.success) setCandidates(c => c.filter(x => x.id !== id));
  };

  const handleDownload = (c) => {
    const csv = `Name,Email,Position,Status\n"${c.name}","${c.email}","${c.position}","${c.status}"`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type:"text/csv" }));
    a.download = `${c.name.replace(/\s+/g,"_")}.csv`;
    a.click();
  };

  const confirmStatus = async () => {
    const r = await candidateService.updateCandidateStatus(selected.id, newStatus);
    if (r.success) { setCandidates(c => c.map(x => x.id === selected.id ? {...x, status: newStatus} : x)); setOpenStatus(false); }
  };

  if (role !== "admin") return (
    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: C.bg }}>
      <Card sx={{ p:4, textAlign:"center", ...cardSx }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Typography sx={{ color: C.muted, mt:1 }}>Only admins can view candidates</Typography>
      </Card>
    </Box>
  );

  const filtered = candidates.filter(c => {
    const s = (c.name+c.email).toLowerCase().includes(searchTerm.toLowerCase());
    const f = statusFilter === "All" || c.status === statusFilter;
    return s && f;
  });

  return (
    <Box sx={{ display:"flex", background: C.bg, minHeight:"100vh" }}>
      <Sidebar />
      <Box sx={{ marginLeft:"240px", width:"100%", p:"32px" }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Candidates</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} candidates found</Typography>
        </Box>

        {error && <Box sx={{ mb:3, p:2, borderRadius:2, background:"rgba(248,113,113,0.1)", border:"1px solid rgba(248,113,113,0.3)", color: C.danger }}>{error}</Box>}

        {/* Filters */}
        <Card sx={{ ...cardSx, p:2, mb:3, display:"flex", gap:2, flexWrap:"wrap" }}>
          <TextField placeholder="Search by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            size="small" sx={{ ...fieldSx, minWidth:260 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color={C.muted}/></InputAdornment> }} />
          <FormControl size="small" sx={{ minWidth:150 }}>
            <InputLabel sx={{ color: C.muted }}>Status</InputLabel>
            <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              sx={{ ...fieldSx['& .MuiOutlinedInput-root'], color: C.text }} MenuProps={menuPropsSx}>
              {["All","Applied","Shortlisted","Interview","Selected","Rejected"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Card>

        {/* Table */}
        <Card sx={cardSx}>
          {loading ? (
            <Box sx={{ display:"flex", justifyContent:"center", p:6 }}><CircularProgress sx={{ color: C.primary }}/></Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& th':{ background: C.surface2, color: C.muted, fontWeight:600, fontSize:13, borderBottom:`1px solid ${C.border}` } }}>
                    <TableCell>Candidate</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id} sx={{ '& td':{ borderBottom:`1px solid ${C.border}`, color: C.text },
                      '&:hover':{ background:`${C.primary}08` } }}>
                      <TableCell>
                        <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                          <Avatar sx={{ width:36, height:36, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, fontSize:14, fontWeight:700 }}>
                            {c.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight:600, fontSize:14, color: C.text }}>{c.name}</Typography>
                            <Typography sx={{ fontSize:12, color: C.muted }}>{c.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: C.muted, fontSize:13 }}>{c.position}</TableCell>
                      <TableCell>
                        <Chip label={c.status} size="small" sx={{ background: statusColors[c.status]?.bg, color: statusColors[c.status]?.color, fontWeight:600, fontSize:11 }} />
                      </TableCell>
                      <TableCell sx={{ color: C.muted, fontSize:13 }}>{c.experience}</TableCell>
                      <TableCell sx={{ color: C.warning, fontSize:13 }}>⭐ {c.rating}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display:"flex", justifyContent:"center", gap:0.5 }}>
                          <IconButton size="small" onClick={() => navigate(`/candidates/${c.id}`)} sx={{ color: C.primary, '&:hover':{ background:`${C.primary}22` } }}><Eye size={16}/></IconButton>
                          <IconButton size="small" onClick={() => { setSelected(c); setNewStatus(c.status); setOpenStatus(true); }} sx={{ color: C.warning, '&:hover':{ background:`${C.warning}22` } }}><Edit size={16}/></IconButton>
                          <IconButton size="small" onClick={() => handleDownload(c)} sx={{ color: C.success, '&:hover':{ background:`${C.success}22` } }}><Download size={16}/></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(c.id)} sx={{ color: C.danger, '&:hover':{ background:`${C.danger}22` } }}><Trash2 size={16}/></IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        {/* Status Dialog */}
        <Dialog open={openStatus} onClose={() => setOpenStatus(false)} PaperProps={{ sx:{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 } }}>
          <DialogTitle sx={{ color: C.text, fontWeight:700 }}>Update Status — {selected?.name}</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt:1 }}>
              <InputLabel sx={{ color: C.muted }}>Status</InputLabel>
              <Select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                sx={{ color: C.text, '& fieldset':{ borderColor: C.border } }} MenuProps={menuPropsSx}>
                {["Applied","Shortlisted","Interview","Selected","Rejected"].map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px:3, pb:2 }}>
            <Button onClick={() => setOpenStatus(false)} sx={{ color: C.muted, textTransform:"none" }}>Cancel</Button>
            <Button onClick={confirmStatus} variant="contained"
              sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, textTransform:"none", borderRadius:2, boxShadow:"none" }}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
