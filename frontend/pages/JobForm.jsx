import Sidebar from "../components/Sidebar";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box, Card, TextField, Button, Typography, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, Divider, CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import { jobService } from "../services/api";
import { C, menuPropsSx } from "../theme";

const fSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#0F172A', color: '#F1F5F9',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#94A3B8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
};

const emptyForm = {
  title: '', company: '', location: '',
  type: 'Full-time', salary: '', description: '', requirements: '',
};

export default function JobForm() {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id'); // present when editing

  const [form, setForm]           = useState(emptyForm);
  const [tags, setTags]           = useState([]);
  const [tagInput, setTagInput]   = useState('');
  const [skills, setSkills]       = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [fetching, setFetching]   = useState(!!editId);
  const [error, setError]         = useState('');

  // Load existing job when editing
  useEffect(() => {
    if (!editId) return;
    jobService.getById(editId).then(r => {
      if (r.success && r.job) {
        const j = r.job;
        setForm({
          title:        j.title        || '',
          company:      j.company      || '',
          location:     j.location     || '',
          type:         j.type         || 'Full-time',
          salary:       j.salary       || '',
          description:  j.description  || '',
          requirements: j.requirements || '',
        });
        setTags(j.tags   || []);
        setSkills(j.skills || []);
      }
    }).finally(() => setFetching(false));
  }, [editId]);

  if (role !== 'admin') return (
    <Box sx={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background: C.bg }}>
      <Card sx={{ p:4, textAlign:'center', background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Typography sx={{ color: C.muted, mt:1 }}>Only admins can manage job postings</Typography>
      </Card>
    </Box>
  );

  if (fetching) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: C.bg }}>
      <CircularProgress sx={{ color: C.primary }}/>
    </Box>
  );

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const addTag   = () => { if (tagInput.trim())   { setTags(t   => [...t,   tagInput.trim()]);   setTagInput('');   } };
  const addSkill = () => { if (skillInput.trim()) { setSkills(s => [...s, skillInput.trim()]); setSkillInput(''); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) { setError('Please fill required fields'); return; }
    setLoading(true); setError('');

    const payload = { ...form, tags, skills };
    const r = editId
      ? await jobService.update(editId, payload)
      : await jobService.create(payload);

    if (r.success) {
      setSubmitted(true);
      if (!editId) {
        setForm(emptyForm);
        setTags([]); setSkills([]);
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        setTimeout(() => navigate('/jobs'), 1200);
      }
    } else {
      setError(r.error || (editId ? 'Failed to update job' : 'Failed to create job'));
    }
    setLoading(false);
  };

  return (
    <Box sx={{ display:'flex', background: C.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:'100%', minWidth:0, p:{ xs:'16px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' }, overflowX:'hidden' }}>

        {/* Header */}
        <Box sx={{ mb:{ xs:2, sm:3 } }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1.25, mb:0.5 }}>
            <Box sx={{ p:{ xs:'6px', sm:'8px' }, borderRadius:2, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
              <Briefcase size={16} color="#fff"/>
            </Box>
            <Typography sx={{ fontWeight:700, color: C.text, fontSize:{ xs:'1.1rem', sm:'1.5rem', lg:'1.875rem' } }}>
              {editId ? 'Edit Job Posting' : 'Create Job Posting'}
            </Typography>
          </Box>
          <Typography sx={{ color: C.muted, ml:{ xs:4.5, sm:5 }, fontSize:{ xs:'0.72rem', sm:'0.875rem' } }}>
            {editId ? 'Update the job details below' : 'Fill in the details to post a new position'}
          </Typography>
        </Box>

        <Grid container spacing={{ xs:1.5, sm:3 }}>
          <Grid item xs={12}>
            <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:{ xs:2, sm:3 }, p:{ xs:'14px', sm:3, lg:4 } }}>

              {submitted && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.success}22`, border:`1px solid ${C.success}55`, color: C.success, fontWeight:600 }}>
                  ✓ {editId ? 'Job updated successfully! Redirecting…' : 'Job posted successfully!'}
                </Box>
              )}
              {error && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.danger}22`, border:`1px solid ${C.danger}55`, color: C.danger }}>
                  {error}
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                {/* Basic Info */}
                <Typography sx={{ color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.72rem' }, fontWeight:600, textTransform:'uppercase', letterSpacing:1, mb:{ xs:1.5, sm:2 } }}>
                  Basic Information
                </Typography>
                <Grid container spacing={{ xs:1.25, sm:2 }} sx={{ mb:{ xs:2, sm:3 } }}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Job Title *" name="title" value={form.title} onChange={handle} sx={fSx}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Company *" name="company" value={form.company} onChange={handle} sx={fSx}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Location" name="location" value={form.location} onChange={handle} sx={fSx}/>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={fSx}>
                      <InputLabel sx={{ color: C.muted }}>Job Type</InputLabel>
                      <Select name="type" value={form.type} onChange={handle} sx={{ color: C.text }} MenuProps={menuPropsSx}>
                        {['Full-time','Part-time','Contract','Internship'].map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Salary Range" name="salary" value={form.salary} onChange={handle} sx={fSx}
                      placeholder="e.g. ₹5 LPA - ₹10 LPA"/>
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: C.border, mb:3 }}/>

                {/* Job Details */}
                <Typography sx={{ color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.72rem' }, fontWeight:600, textTransform:'uppercase', letterSpacing:1, mb:{ xs:1.5, sm:2 } }}>
                  Job Details
                </Typography>
                <TextField fullWidth label="Job Description *" name="description" value={form.description}
                  onChange={handle} multiline rows={{ xs:3, sm:5 }} sx={{ ...fSx, mb:{ xs:1.5, sm:2 } }}/>
                <TextField fullWidth label="Requirements" name="requirements" value={form.requirements}
                  onChange={handle} multiline rows={{ xs:3, sm:4 }} sx={{ ...fSx, mb:{ xs:2, sm:3 } }}/>

                <Divider sx={{ borderColor: C.border, mb:3 }}/>

                {/* Tags & Skills */}
                <Typography sx={{ color: C.muted, fontSize:{ xs:'0.65rem', sm:'0.72rem' }, fontWeight:600, textTransform:'uppercase', letterSpacing:1, mb:{ xs:1.5, sm:2 } }}>
                  Tags & Skills
                </Typography>
                {[
                  { label:'Tags',            items: tags,   setItems: setTags,   input: tagInput,   setInput: setTagInput,   add: addTag },
                  { label:'Required Skills', items: skills, setItems: setSkills, input: skillInput, setInput: setSkillInput, add: addSkill },
                ].map(({ label, items, setItems, input, setInput, add }) => (
                  <Box key={label} sx={{ mb:3 }}>
                    <Typography sx={{ color: C.text, fontWeight:600, fontSize:14, mb:1.5 }}>{label}</Typography>
                    <Box sx={{ display:'flex', gap:1, mb:1.5 }}>
                      <TextField size="small" placeholder={`Add ${label.toLowerCase()}...`} value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
                        sx={{ ...fSx, flex:1 }}/>
                      <Button onClick={add} variant="contained"
                        sx={{ minWidth:44, height:40, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow:'none', borderRadius:2 }}>
                        <Plus size={18}/>
                      </Button>
                    </Box>
                    {items.length > 0 && (
                      <Box sx={{ display:'flex', gap:1, flexWrap:'wrap' }}>
                        {items.map((item, i) => (
                          <Chip key={i} label={item} size="small"
                            onDelete={() => setItems(x => x.filter((_,j) => j !== i))}
                            sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:600, fontSize:12 }}/>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}

                <Divider sx={{ borderColor: C.border, mb:3 }}/>

                {/* Actions */}
                <Box sx={{ display:'flex', gap:{ xs:1, sm:2 }, flexWrap:'wrap' }}>
                  <Button type="submit" variant="contained" disabled={loading}
                    sx={{ flex:{ xs:1, sm:'none' }, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                      px:{ xs:2, sm:4 }, py:{ xs:1.25, sm:1.5 }, borderRadius:2, textTransform:'none', fontWeight:700,
                      fontSize:{ xs:'0.8rem', sm:'0.875rem' }, minHeight:44,
                      boxShadow:`0 4px 16px ${C.primary}44`, transition:'all 0.2s' }}>
                    {loading ? (editId ? 'Updating…' : 'Posting…') : (editId ? 'Update Job' : 'Post Job')}
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/jobs')}
                    sx={{ borderColor: C.border, color: C.muted, px:{ xs:2, sm:3 }, py:{ xs:1.25, sm:1.5 }, borderRadius:2,
                      textTransform:'none', fontSize:{ xs:'0.8rem', sm:'0.875rem' }, minHeight:44,
                      '&:hover':{ borderColor: C.muted } }}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
