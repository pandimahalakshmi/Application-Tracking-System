import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, Typography, Chip, CircularProgress, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Select, MenuItem,
  FormControl, TextField, InputAdornment, Grid,
} from '@mui/material';
import { Search, Users } from 'lucide-react';
import { applicationService } from '../services/api';

const C = { bg:'#0F172A', surface:'#1E293B', surface2:'#263348', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', accent:'#06B6D4', success:'#10B981', warning:'#F59E0B', danger:'#F87171', text:'#F1F5F9', muted:'#94A3B8' };

const statuses = ['Pending','Shortlisted','Interview Scheduled','Selected','Rejected'];
const statusColor = { Pending: C.muted, Shortlisted: C.warning, 'Interview Scheduled': C.accent, Selected: C.success, Rejected: C.danger };

export default function AdminApplications() {
  const [apps, setApps]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('All');
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    const d = await applicationService.getAll();
    if (d.success) setApps(d.applications);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (appId, status) => {
    setUpdating(appId);
    const d = await applicationService.updateStatus(appId, status);
    if (d.success) setApps(prev => prev.map(a => a._id === appId ? { ...a, status } : a));
    setUpdating(null);
  };

  const filtered = apps.filter(a => {
    const s = search.toLowerCase();
    const matchSearch = !s || a.userName?.toLowerCase().includes(s) || a.jobTitle?.toLowerCase().includes(s) || a.company?.toLowerCase().includes(s);
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:'240px', width:'100%', p:'32px' }}>
        <Box sx={{ mb:4 }}>
          <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>All Applications</Typography>
          <Typography sx={{ color: C.muted, mt:0.5 }}>{filtered.length} applications</Typography>
        </Box>

        {/* Filters */}
        <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:2, mb:3, display:'flex', gap:2, flexWrap:'wrap' }}>
          <TextField placeholder="Search by name, job, company..." value={search} onChange={e => setSearch(e.target.value)}
            size="small" sx={{ flex:1, minWidth:240,
              '& .MuiOutlinedInput-root':{ background: C.bg, color: C.text, borderRadius:2, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary } },
              '& .MuiInputLabel-root':{ color: C.muted } }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={16} color={C.muted}/></InputAdornment> }} />
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
                    <TableRow key={app._id} sx={{ '& td':{ borderBottom:`1px solid ${C.border}`, color: C.text }, '&:hover':{ background:`${C.primary}08` } }}>
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
                      <TableCell>
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
    </Box>
  );
}
