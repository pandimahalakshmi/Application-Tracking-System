import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, TextField, Button, Typography, Grid,
  Select, MenuItem, FormControl, InputLabel, Chip, Divider,
} from "@mui/material";
import { useState } from "react";
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

export default function JobForm() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", company: "", location: "",
    type: "Full-time", salary: "", description: "", requirements: "",
  });
  const [tags, setTags]       = useState([]); const [tagInput, setTagInput]     = useState("");
  const [skills, setSkills]   = useState([]); const [skillInput, setSkillInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  if (role !== "admin") return (
    <Box sx={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background: C.bg }}>
      <Card sx={{ p:4, textAlign:"center", background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
        <Typography variant="h5" sx={{ color: C.danger, fontWeight:700 }}>Access Denied</Typography>
        <Typography sx={{ color: C.muted, mt:1 }}>Only admins can create job postings</Typography>
      </Card>
    </Box>
  );

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const addTag   = () => { if (tagInput.trim())   { setTags(t   => [...t,   tagInput]);   setTagInput("");   } };
  const addSkill = () => { if (skillInput.trim()) { setSkills(s => [...s, skillInput]); setSkillInput(""); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) { setError("Please fill required fields"); return; }
    setLoading(true); setError("");
    const r = await jobService.createJob({ ...form, tags, skills });
    if (r.success) {
      setSubmitted(true);
      setForm({ title:"", company:"", location:"", type:"Full-time", salary:"", description:"", requirements:"" });
      setTags([]); setSkills([]);
      setTimeout(() => setSubmitted(false), 3000);
    } else { setError(r.error || "Failed to create job"); }
    setLoading(false);
  };

  return (
    <Box sx={{ display:"flex", background: C.bg, minHeight:"100vh" }}>
      <Sidebar />
      <Box sx={{ marginLeft:"240px", width:"100%", p:"32px", maxWidth:"calc(100% - 240px)" }}>

        {/* Page Header */}
        <Box sx={{ mb:4 }}>
          <Box sx={{ display:"flex", alignItems:"center", gap:1.5, mb:1 }}>
            <Box sx={{ p:1, borderRadius:2, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})` }}>
              <Briefcase size={20} color="#fff" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight:700, color: C.text }}>Create Job Posting</Typography>
          </Box>
          <Typography sx={{ color: C.muted, ml:5.5 }}>Fill in the details to post a new position</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12}>
            <Card sx={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius:3, p:4 }}>

              {submitted && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.success}22`, border:`1px solid ${C.success}55`, color: C.success, fontWeight:600 }}>
                  ✓ Job posted successfully!
                </Box>
              )}
              {error && (
                <Box sx={{ mb:3, p:2, borderRadius:2, background:`${C.danger}22`, border:`1px solid ${C.danger}55`, color: C.danger }}>
                  {error}
                </Box>
              )}

              <form onSubmit={handleSubmit}>
                {/* Section: Basic Info */}
                <Typography sx={{ color: C.muted, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, mb:2 }}>
                  Basic Information
                </Typography>

                <Grid container spacing={2} sx={{ mb:3 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Job Title *" name="title" value={form.title} onChange={handle} sx={fSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Company *" name="company" value={form.company} onChange={handle} sx={fSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Location" name="location" value={form.location} onChange={handle} sx={fSx} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={fSx}>
                      <InputLabel sx={{ color: C.muted }}>Job Type</InputLabel>
                      <Select name="type" value={form.type} onChange={handle} sx={{ color: C.text }} MenuProps={menuPropsSx}>
                        {["Full-time","Part-time","Contract","Internship"].map(t => (
                          <MenuItem key={t} value={t}>{t}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Salary Range" name="salary" value={form.salary} onChange={handle} sx={fSx}
                      placeholder="e.g. $50,000 - $80,000" />
                  </Grid>
                </Grid>

                <Divider sx={{ borderColor: C.border, mb:3 }} />

                {/* Section: Description */}
                <Typography sx={{ color: C.muted, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, mb:2 }}>
                  Job Details
                </Typography>

                <TextField fullWidth label="Job Description *" name="description" value={form.description}
                  onChange={handle} multiline rows={5} sx={{ ...fSx, mb:2 }} />

                <TextField fullWidth label="Requirements" name="requirements" value={form.requirements}
                  onChange={handle} multiline rows={4} sx={{ ...fSx, mb:3 }} />

                <Divider sx={{ borderColor: C.border, mb:3 }} />

                {/* Section: Tags & Skills */}
                <Typography sx={{ color: C.muted, fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:1, mb:2 }}>
                  Tags & Skills
                </Typography>

                {[
                  { label:"Tags", items: tags, setItems: setTags, input: tagInput, setInput: setTagInput, add: addTag },
                  { label:"Required Skills", items: skills, setItems: setSkills, input: skillInput, setInput: setSkillInput, add: addSkill },
                ].map(({ label, items, setItems, input, setInput, add }) => (
                  <Box key={label} sx={{ mb:3 }}>
                    <Typography sx={{ color: C.text, fontWeight:600, fontSize:14, mb:1.5 }}>{label}</Typography>
                    <Box sx={{ display:"flex", gap:1, mb:1.5 }}>
                      <TextField size="small" placeholder={`Add ${label.toLowerCase()}...`} value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
                        sx={{ ...fSx, flex:1 }} />
                      <Button onClick={add} variant="contained"
                        sx={{ minWidth:44, height:40, background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, boxShadow:"none", borderRadius:2 }}>
                        <Plus size={18} />
                      </Button>
                    </Box>
                    {items.length > 0 && (
                      <Box sx={{ display:"flex", gap:1, flexWrap:"wrap" }}>
                        {items.map((item, i) => (
                          <Chip key={i} label={item} size="small"
                            onDelete={() => setItems(x => x.filter((_,j) => j !== i))}
                            sx={{ background:`${C.primary}22`, color: C.primary, fontWeight:600, fontSize:12 }} />
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}

                <Divider sx={{ borderColor: C.border, mb:3 }} />

                {/* Actions */}
                <Box sx={{ display:"flex", gap:2, flexWrap:"wrap" }}>
                  <Button type="submit" variant="contained" disabled={loading}
                    sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`,
                      px:4, py:1.5, borderRadius:2, textTransform:"none", fontWeight:700,
                      boxShadow:`0 4px 16px ${C.primary}44`,
                      '&:hover':{ transform:"translateY(-1px)", boxShadow:`0 8px 24px ${C.primary}66` },
                      transition:"all 0.2s" }}>
                    {loading ? "Posting…" : "Post Job"}
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/schedule-interview')}
                    sx={{ borderColor: C.accent, color: C.accent, px:3, py:1.5, borderRadius:2,
                      textTransform:"none", '&:hover':{ background:`${C.accent}11` } }}>
                    Schedule Interview
                  </Button>
                  <Button variant="outlined" onClick={() => navigate('/dashboard')}
                    sx={{ borderColor: C.border, color: C.muted, px:3, py:1.5, borderRadius:2,
                      textTransform:"none", '&:hover':{ borderColor: C.muted } }}>
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
