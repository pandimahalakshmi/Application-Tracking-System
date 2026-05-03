import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  Box, Card, Typography, Grid, Avatar, Button, TextField,
  Chip, Paper, Tabs, Tab, List, ListItem, ListItemText,
  ListItemIcon, Divider, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, CircularProgress, Alert, Snackbar,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  User, Briefcase, GraduationCap, Code, FileText,
  CheckCircle, Settings, Edit, Upload, Save, X,
} from 'lucide-react';
import { authService, applicationService } from '../services/api';

// ── Light palette ─────────────────────────────────────────────────────────
const D = {
  bg:      '#F0F4FF',
  surface: '#FFFFFF',
  surface2:'#E8EEFF',
  border:  '#D1D9F0',
  primary: '#5B5BD6',
  secondary:'#7C3AED',
  accent:  '#0891B2',
  success: '#059669',
  warning: '#D97706',
  danger:  '#DC2626',
  text:    '#111827',
  muted:   '#4B5563',
};

const tabConfig = [
  { label: 'Personal',     icon: <User size={16} /> },
  { label: 'Professional', icon: <Briefcase size={16} /> },
  { label: 'Education',    icon: <GraduationCap size={16} /> },
  { label: 'Skills',       icon: <Code size={16} /> },
  { label: 'Resume',       icon: <FileText size={16} /> },
  { label: 'Applied Jobs', icon: <CheckCircle size={16} /> },
  { label: 'Settings',     icon: <Settings size={16} /> },
];

const emptyProfile = {
  name: '', email: '', phoneNumber: '', dateOfBirth: '', gender: '',
  address: { city: '', state: '', country: '' },
  professional: {
    currentJobTitle: '', currentCompany: '', totalExperience: '',
    expectedSalary: '', currentSalary: '', preferredLocation: '', noticePeriod: '',
  },
  education: [],
  skills: { programmingLanguages: [], frameworks: [], databases: [], tools: [] },
  resume: { resumeFile: null, coverLetter: null, portfolioLink: '', githubProfile: '', linkedinProfile: '' },
  applications: [],
};

// ── Shared field style ────────────────────────────────────────────────────
const fSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#FFFFFF', color: '#111827',
    '& fieldset': { borderColor: '#D1D9F0' },
    '&:hover fieldset': { borderColor: D.primary },
    '&.Mui-focused fieldset': { borderColor: D.primary, borderWidth: 2 },
    '&.Mui-disabled': { background: '#E8EEFF' },
    '&.Mui-disabled fieldset': { borderColor: '#D1D9F0' },
  },
  '& .MuiInputLabel-root': { color: '#4B5563' },
  '& .MuiInputLabel-root.Mui-focused': { color: D.primary },
  '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#4B5563' },
  '& input:-webkit-autofill': {
    WebkitBoxShadow: `0 0 0 100px #FFFFFF inset`,
    WebkitTextFillColor: '#111827',
  },
};

const cardSx = {
  background: '#FFFFFF', border: `1px solid #D1D9F0`, borderRadius: 3,
  p: 3, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(91,91,214,0.08)',
  '&:hover': { boxShadow: `0 8px 24px rgba(91,91,214,0.12)` },
};

const paperSx = {
  background: '#F0F4FF', border: `1px solid #D1D9F0`, borderRadius: 2, p: 2.5,
};

// ── Field — defined OUTSIDE component to prevent remount on every render ──
const Field = ({ label, value, onChange, type = 'text', disabled }) => (
  <TextField fullWidth label={label} value={value || ''} type={type}
    disabled={disabled} size="small" onChange={e => onChange(e.target.value)}
    slotProps={type === 'date' ? { inputLabel: { shrink: true } } : {}}
    sx={fSx} />
);

// ── ActionBar — defined OUTSIDE component, receives props ─────────────────
const ActionBar = ({ editMode, saving, onEdit, onCancel, onSave }) => (
  <Box sx={{ display:'flex', gap:1 }}>
    {editMode ? (
      <>
        <Button size="small" startIcon={<X size={14}/>} onClick={onCancel}
          sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.border}`, color: D.muted,
            '&:hover':{ borderColor: D.primary, color: D.text } }}>
          Cancel
        </Button>
        <Button size="small" variant="contained" onClick={onSave} disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit"/> : <Save size={14}/>}
          sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, boxShadow:'none' }}>
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </>
    ) : (
      <IconButton size="small" onClick={onEdit}
        sx={{ background: D.surface2, '&:hover':{ background: D.border } }}>
        <Edit size={18} color={D.primary}/>
      </IconButton>
    )}
  </Box>
);

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState(0);
  const [editMode, setEditMode]   = useState(false);
  const [profile, setProfile]     = useState(emptyProfile);
  const [backup, setBackup]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [snack, setSnack]         = useState({ open: false, msg: '', severity: 'success' });
  const [pwDialog, setPwDialog]   = useState(false);
  const [pwFields, setPwFields]   = useState({ current: '', next: '', confirm: '' });
  const [myApps, setMyApps]       = useState([]);

  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = storedUser?.id || storedUser?._id;

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    authService.getProfile(userId)
      .then(data => {
        if (data.success) setProfile({ ...emptyProfile, ...data.user });
        else setSnack({ open: true, msg: 'Failed to load profile', severity: 'error' });
      })
      .catch(() => setSnack({ open: true, msg: 'Failed to load profile', severity: 'error' }))
      .finally(() => setLoading(false));
    // Fetch real applications from Application collection
    applicationService.getMyApps(userId).then(d => { if (d.success) setMyApps(d.applications); });
  }, [userId]);

  const startEdit  = () => { setBackup(profile); setEditMode(true); setSkillText({}); };
  const cancelEdit = () => { setProfile(backup); setEditMode(false); setSkillText({}); };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const data = await authService.updateProfile(userId, profile);
      if (data.success) {
        setSnack({ open: true, msg: 'Profile updated!', severity: 'success' });
        setEditMode(false);
        setSkillText({});
      } else {
        setSnack({ open: true, msg: data.error || 'Update failed', severity: 'error' });
      }
    } catch {
      setSnack({ open: true, msg: 'Network error', severity: 'error' });
    } finally { setSaving(false); }
  };

  const set = (section, field, value) => {
    if (section) setProfile(p => ({ ...p, [section]: { ...p[section], [field]: value } }));
    else         setProfile(p => ({ ...p, [field]: value }));
  };

  // Raw skill text state for editing (prevents comma-split while typing)
  const [skillText, setSkillText] = useState({});

  const handleSkillTextChange = (field, value) => {
    setSkillText(p => ({ ...p, [field]: value }));
  };

  const setSkill = (field, value) =>
    setProfile(p => ({ ...p, skills: { ...p.skills, [field]: value.split(',').map(s => s.trim()).filter(Boolean) } }));

  const setEdu = (i, field, value) =>
    setProfile(p => { const e = [...p.education]; e[i] = { ...e[i], [field]: value }; return { ...p, education: e }; });

  const addEdu = () => {
    if (!editMode) startEdit();
    setProfile(p => ({ ...p, education: [...p.education, { degree:'', college:'', specialization:'', yearOfPassing:'', percentage:'' }] }));
  };

  // ── Renders ───────────────────────────────────────────────────────────────
  const renderPersonal = () => (
    <Card sx={cardSx}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:{ xs:2, sm:3 } }}>
        <Typography sx={{ fontWeight:700, color: D.text, fontSize:{ xs:'0.9rem', sm:'1.1rem' } }}>Personal Information</Typography>
        <ActionBar editMode={editMode} saving={saving} onEdit={startEdit} onCancel={cancelEdit} onSave={saveProfile} />
      </Box>
      {/* Mobile: avatar centered top, fields below */}
      <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', alignItems:'center', mb:2, gap:1 }}>
        <Avatar sx={{ width:64, height:64, background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, fontSize:24, fontWeight:700 }}>
          {profile.profilePhoto ? <img src={profile.profilePhoto} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }}/> : profile.name ? profile.name.charAt(0).toUpperCase() : <User size={28} color="#fff"/>}
        </Avatar>
        <Button size="small" component="label" startIcon={<Upload size={12}/>}
          sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.primary}`, color: D.primary, fontSize:'0.68rem', minHeight:28 }}>
          Change Photo
          <input type="file" hidden accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { const r = new FileReader(); r.onload = ev => set(null,'profilePhoto',ev.target.result); r.readAsDataURL(file); }}}/>
        </Button>
      </Box>
      <Box sx={{ display:'flex', gap:4 }}>
        {/* Desktop avatar panel */}
        <Box sx={{ display:{ xs:'none', sm:'flex' }, flexDirection:'column', alignItems:'center', justifyContent:'center', minWidth:160, pr:4, borderRight:`1px solid ${D.border}` }}>
          <Avatar sx={{ width:100, height:100, mb:2, background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, fontSize:36, fontWeight:700, boxShadow:`0 8px 24px ${D.primary}44` }}>
            {profile.profilePhoto ? <img src={profile.profilePhoto} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }}/> : profile.name ? profile.name.charAt(0).toUpperCase() : <User size={40} color="#fff"/>}
          </Avatar>
          <Button size="small" component="label" startIcon={<Upload size={14}/>}
            sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.primary}`, color: D.primary, fontSize:12, '&:hover':{ background: D.primary, color:'#fff' } }}>
            Change Photo
            <input type="file" hidden accept="image/*" onChange={e => { const file = e.target.files[0]; if (file) { const r = new FileReader(); r.onload = ev => set(null,'profilePhoto',ev.target.result); r.readAsDataURL(file); }}}/>
          </Button>
        </Box>
        <Box sx={{ flex:1 }}>
          <Field label="Full Name"     value={profile.name}             onChange={v => set(null,'name',v)}             disabled={!editMode} />
          <Field label="Email"         value={profile.email}            onChange={v => set(null,'email',v)}            disabled={!editMode} />
          <Field label="Phone"         value={profile.phoneNumber}      onChange={v => set(null,'phoneNumber',v)}      disabled={!editMode} />
          <Field label="Date of Birth" value={profile.dateOfBirth}      onChange={v => set(null,'dateOfBirth',v)}      disabled={!editMode} type="date" />
          <Field label="Gender"        value={profile.gender}           onChange={v => set(null,'gender',v)}           disabled={!editMode} />
          <Field label="City"          value={profile.address?.city}    onChange={v => set('address','city',v)}        disabled={!editMode} />
          <Field label="State"         value={profile.address?.state}   onChange={v => set('address','state',v)}       disabled={!editMode} />
          <Field label="Country"       value={profile.address?.country} onChange={v => set('address','country',v)}     disabled={!editMode} />
        </Box>
      </Box>
    </Card>
  );

  const renderProfessional = () => (
    <Card sx={cardSx}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:{ xs:2, sm:3 } }}>
        <Typography sx={{ fontWeight:700, color: D.text, fontSize:{ xs:'0.9rem', sm:'1.1rem' } }}>Professional Details</Typography>
        <ActionBar editMode={editMode} saving={saving} onEdit={startEdit} onCancel={cancelEdit} onSave={saveProfile} />
      </Box>
      {/* Desktop: side panel + fields */}
      <Box sx={{ display:{ xs:'none', sm:'flex' }, gap:4 }}>
        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minWidth:160, pr:4, borderRight:`1px solid ${D.border}` }}>
          <Avatar sx={{ width:90, height:90, mb:2, background:`linear-gradient(135deg, ${D.accent}, #0EA5E9)`, boxShadow:`0 8px 24px ${D.accent}44` }}>
            <Briefcase size={36} color="#fff"/>
          </Avatar>
          <Typography sx={{ fontWeight:700, textAlign:'center', color: D.text, fontSize:13 }}>{profile.professional?.currentJobTitle || ''}</Typography>
          <Typography sx={{ color: D.muted, textAlign:'center', fontSize:12 }}>{profile.professional?.currentCompany || ''}</Typography>
        </Box>
        <Box sx={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center' }}>
          {[['Current Job Title','currentJobTitle'],['Current Company','currentCompany'],['Total Experience','totalExperience'],['Expected Salary','expectedSalary'],['Current Salary','currentSalary'],['Preferred Location','preferredLocation']].map(([label, field]) => (
            <TextField key={field} label={label} value={profile.professional?.[field] || ''} disabled={!editMode} size="small" onChange={e => set('professional', field, e.target.value)} sx={{ ...fSx, width:'75%' }} />
          ))}
          <FormControl size="small" disabled={!editMode} sx={{ width:'75%', mb:2, '& .MuiOutlinedInput-root':{ borderRadius:2, background: D.bg, color: D.text, '& fieldset':{ borderColor: D.border }, '&:hover fieldset':{ borderColor: D.primary }, '&.Mui-focused fieldset':{ borderColor: D.primary, borderWidth:2 }, '&.Mui-disabled':{ background: D.surface2 }, '&.Mui-disabled fieldset':{ borderColor: D.border } }, '& .MuiInputLabel-root':{ color: D.muted }, '& .MuiInputLabel-root.Mui-focused':{ color: D.primary }, '& .MuiSelect-icon':{ color: D.muted } }}>
            <InputLabel>Notice Period</InputLabel>
            <Select value={profile.professional?.noticePeriod || ''} label="Notice Period" onChange={e => set('professional', 'noticePeriod', e.target.value)} MenuProps={{ PaperProps:{ sx:{ background: D.surface, border:`1px solid ${D.border}`, '& .MuiMenuItem-root':{ color: D.text, '&:hover':{ background:`${D.primary}22` } } } } }}>
              <MenuItem value="">Select Notice Period</MenuItem>
              {['Immediate','10 Days','1 Month','3 Months'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* Mobile: full-width fields */}
      <Box sx={{ display:{ xs:'block', sm:'none' } }}>
        {[['Current Job Title','currentJobTitle'],['Current Company','currentCompany'],['Total Experience','totalExperience'],['Expected Salary','expectedSalary'],['Current Salary','currentSalary'],['Preferred Location','preferredLocation']].map(([label, field]) => (
          <TextField key={field} fullWidth label={label} value={profile.professional?.[field] || ''} disabled={!editMode} size="small" onChange={e => set('professional', field, e.target.value)} sx={{ ...fSx, mb:1.25 }} />
        ))}
        <FormControl fullWidth size="small" disabled={!editMode} sx={{ mb:1.25, '& .MuiOutlinedInput-root':{ borderRadius:2, background: D.bg, color: D.text, '& fieldset':{ borderColor: D.border } }, '& .MuiInputLabel-root':{ color: D.muted }, '& .MuiSelect-icon':{ color: D.muted } }}>
          <InputLabel>Notice Period</InputLabel>
          <Select value={profile.professional?.noticePeriod || ''} label="Notice Period" onChange={e => set('professional', 'noticePeriod', e.target.value)} MenuProps={{ PaperProps:{ sx:{ background: D.surface, border:`1px solid ${D.border}`, '& .MuiMenuItem-root':{ color: D.text } } } }}>
            <MenuItem value="">Select</MenuItem>
            {['Immediate','10 Days','1 Month','3 Months'].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
    </Card>
  );

  const renderEducation = () => (
    <Card sx={cardSx}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h6" sx={{ fontWeight:700, color: D.text }}>Education Details</Typography>
        <Box sx={{ display:'flex', gap:1 }}>
          <IconButton size="small" onClick={startEdit} sx={{ background: D.surface2, '&:hover':{ background: D.border } }}>
            <Edit size={18} color={D.primary}/>
          </IconButton>
          <Button size="small" variant="contained" onClick={addEdu}
            sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${D.success}, #059669)`, boxShadow:'none' }}>
            + Add
          </Button>
        </Box>
      </Box>

      {profile.education.length === 0 && (
        <Typography sx={{ color: D.muted, textAlign:'center', py:4 }}>
          No education added yet. Click "+ Add" to get started.
        </Typography>
      )}

      {profile.education.map((edu, i) => (
        <Paper key={i} sx={{ ...paperSx, mb:2 }}>
          <Typography sx={{ fontWeight:600, mb:1.5, color: D.accent, fontSize:13 }}>
            Education #{i + 1}
          </Typography>
          {[['Degree','degree'],['College/University','college'],['Specialization','specialization'],
            ['Year of Passing','yearOfPassing'],['Percentage/CGPA','percentage']].map(([label, field]) => (
            <TextField key={field} fullWidth label={label} value={edu[field] || ''}
              disabled={!editMode} size="small" onChange={e => setEdu(i, field, e.target.value)}
              sx={{ ...fSx, mb:1.5 }} />
          ))}
        </Paper>
      ))}

      {editMode && (
        <Box sx={{ display:'flex', gap:1, justifyContent:'flex-end', mt:1 }}>
          <Button size="small" onClick={cancelEdit}
            sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.border}`, color: D.muted }}>Cancel</Button>
          <Button size="small" variant="contained" onClick={saveProfile} disabled={saving}
            sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, boxShadow:'none' }}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </Box>
      )}
    </Card>
  );

  const renderSkills = () => (
    <Card sx={cardSx}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:{ xs:2, sm:3 } }}>
        <Typography sx={{ fontWeight:700, color: D.text, fontSize:{ xs:'0.9rem', sm:'1.1rem' } }}>Skills</Typography>
        <ActionBar editMode={editMode} saving={saving} onEdit={startEdit} onCancel={cancelEdit} onSave={saveProfile} />
      </Box>
      {/* Skills fields — full width on mobile, no side panel */}
      <Box sx={{ display:{ xs:'none', sm:'flex' }, gap:4 }}>
        <Box sx={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minWidth:160, pr:4, borderRight:`1px solid ${D.border}` }}>
          <Avatar sx={{ width:90, height:90, mb:2, background:`linear-gradient(135deg, ${D.warning}, #D97706)`, boxShadow:`0 8px 24px ${D.warning}44` }}>
            <Code size={36} color="#fff"/>
          </Avatar>
          <Typography sx={{ fontWeight:700, color: D.text, fontSize:13, textAlign:'center' }}>Technical Skills</Typography>
          <Typography sx={{ color: D.muted, fontSize:12 }}>{(profile.skills?.programmingLanguages?.length || 0) + (profile.skills?.frameworks?.length || 0)} skills</Typography>
        </Box>
        <Box sx={{ flex:1 }}>
          {[['Programming Languages','programmingLanguages'],['Frameworks','frameworks'],['Databases','databases'],['Tools','tools']].map(([label, field]) => {
            const rawVal = editMode ? (skillText[field] !== undefined ? skillText[field] : (profile.skills?.[field] || []).join(', ')) : (profile.skills?.[field] || []).join(', ');
            return (
              <Box key={field} sx={{ mb:2 }}>
                <TextField fullWidth label={`${label} (comma-separated)`} value={rawVal} disabled={!editMode} size="small"
                  onChange={e => handleSkillTextChange(field, e.target.value)}
                  onBlur={e => { setSkill(field, e.target.value); setSkillText(p => ({ ...p, [field]: undefined })); }}
                  placeholder="e.g. React, Node.js" sx={fSx} />
                {(profile.skills?.[field] || []).length > 0 && (
                  <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                    {profile.skills[field].map(s => <Chip key={s} label={s} size="small" sx={{ background:`${D.warning}22`, color: D.warning, fontWeight:600, fontSize:11 }} />)}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      {/* Mobile: full width */}
      <Box sx={{ display:{ xs:'block', sm:'none' } }}>
        {[['Programming Languages','programmingLanguages'],['Frameworks','frameworks'],['Databases','databases'],['Tools','tools']].map(([label, field]) => {
          const rawVal = editMode ? (skillText[field] !== undefined ? skillText[field] : (profile.skills?.[field] || []).join(', ')) : (profile.skills?.[field] || []).join(', ');
          return (
            <Box key={field} sx={{ mb:1.5 }}>
              <TextField fullWidth label={label} value={rawVal} disabled={!editMode} size="small"
                onChange={e => handleSkillTextChange(field, e.target.value)}
                onBlur={e => { setSkill(field, e.target.value); setSkillText(p => ({ ...p, [field]: undefined })); }}
                placeholder="e.g. React, Node.js" sx={fSx} />
              {(profile.skills?.[field] || []).length > 0 && (
                <Box sx={{ display:'flex', flexWrap:'wrap', gap:0.5, mt:0.5 }}>
                  {profile.skills[field].map(s => <Chip key={s} label={s} size="small" sx={{ background:`${D.warning}22`, color: D.warning, fontWeight:600, fontSize:'0.6rem', height:18 }} />)}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Card>
  );

  const renderResume = () => (
    <Card sx={cardSx}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:3 }}>
        <Typography variant="h6" sx={{ fontWeight:700, color: D.text }}>Resume & Documents</Typography>
        <ActionBar editMode={editMode} saving={saving} onEdit={startEdit} onCancel={cancelEdit} onSave={saveProfile} />
      </Box>
      <Grid container spacing={3}>
        {[{ key:'resumeFile', label:'Resume' }, { key:'coverLetter', label:'Cover Letter' }].map(({ key, label }) => (
          <Grid item xs={12} sm={6} key={key}>
            <Paper sx={{ ...paperSx, textAlign:'center', border:`2px dashed ${D.border}`,
              transition:'all 0.2s', '&:hover':{ borderColor: D.primary } }}>
              <FileText size={32} style={{ color: D.primary, marginBottom:8 }}/>
              <Typography sx={{ mb:1, color: D.muted, fontSize:13 }}>
                {profile.resume?.[key] || `No ${label.toLowerCase()} uploaded`}
              </Typography>
              <Button size="small" component="label" startIcon={<Upload size={14}/>}
                sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.primary}`, color: D.primary,
                  '&:hover':{ background: D.primary, color:'#fff' } }}>
                Upload {label}
                <input type="file" hidden accept=".pdf,.doc,.docx"
                  onChange={e => { const f = e.target.files[0]; if (f) set('resume', key, f.name); }}/>
              </Button>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Typography sx={{ fontWeight:700, mb:2, color: D.text, fontSize:14 }}>Profile Links</Typography>
          <Grid container spacing={2}>
            {[['Portfolio Link','portfolioLink'],['GitHub Profile','githubProfile'],['LinkedIn Profile','linkedinProfile']].map(([label, field]) => (
              <Grid item xs={12} sm={6} key={field}>
                <TextField fullWidth label={label} value={profile.resume?.[field] || ''}
                  disabled={!editMode} size="small"
                  onChange={e => set('resume', field, e.target.value)} sx={fSx} />
              </Grid>
            ))}
          </Grid>
        </Grid>
        {editMode && (
          <Grid item xs={12}>
            <Box sx={{ display:'flex', gap:1, justifyContent:'flex-end' }}>
              <Button size="small" onClick={cancelEdit}
                sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.border}`, color: D.muted }}>Cancel</Button>
              <Button size="small" variant="contained" onClick={saveProfile} disabled={saving}
                sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, boxShadow:'none' }}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Card>
  );

  const renderApplications = () => {
    const statusColor = {
      Pending:              D.muted,
      Shortlisted:          D.warning,
      'Interview Scheduled':D.accent,
      Selected:             D.success,
      Rejected:             D.danger,
      Applied:              D.primary,
    };
    return (
      <Card sx={cardSx}>
        <Typography sx={{ fontWeight:700, mb:{ xs:1.5, sm:3 }, color: D.text, fontSize:{ xs:'0.9rem', sm:'1.1rem' } }}>Applied Jobs</Typography>
        {myApps.length === 0 ? (
          <Box sx={{ textAlign:'center', py:{ xs:3, sm:4 } }}>
            <Briefcase size={32} color={D.border} style={{ marginBottom:8 }}/>
            <Typography sx={{ color: D.muted, fontSize:{ xs:'0.78rem', sm:'0.875rem' } }}>No applications yet.</Typography>
            <Typography sx={{ color: D.muted, fontSize:{ xs:'0.68rem', sm:'0.75rem' }, mt:0.5 }}>Browse jobs and click Apply Now to get started.</Typography>
          </Box>
        ) : (
          <>
            {/* Mobile: compact card rows */}
            <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', gap:1 }}>
              {myApps.map((app, i) => {
                const job = app.jobId;
                const sc  = statusColor[app.status] || D.primary;
                return (
                  <Box key={app._id || i} sx={{
                    display:'flex', alignItems:'center', gap:1,
                    p:'10px 12px', borderRadius:1.5,
                    background: D.bg, border:`1px solid ${D.border}`,
                    '&:hover':{ borderColor: sc },
                  }}>
                    <Avatar sx={{ width:30, height:30, flexShrink:0, background:`linear-gradient(135deg, ${D.accent}, #0EA5E9)` }}>
                      <Briefcase size={13} color="#fff"/>
                    </Avatar>
                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:0.5, mb:0.2 }}>
                        <Typography sx={{ fontWeight:700, color: D.text, fontSize:'0.75rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {job?.title || app.jobTitle}
                        </Typography>
                        <Chip label={app.status} size="small" sx={{ background:`${sc}22`, color: sc, fontWeight:600, fontSize:'0.55rem', height:18, flexShrink:0 }} />
                      </Box>
                      <Typography sx={{ color: D.muted, fontSize:'0.65rem' }}>
                        {job?.company || app.company} · {new Date(app.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>

            {/* Desktop: original List layout */}
            <List sx={{ display:{ xs:'none', sm:'block' } }}>
              {myApps.map((app, i) => {
                const job = app.jobId;
                const sc  = statusColor[app.status] || D.primary;
                return (
                  <React.Fragment key={app._id || i}>
                    <ListItem sx={{ px:0, py:1.5 }}>
                      <ListItemIcon>
                        <Avatar sx={{ width:36, height:36, background:`linear-gradient(135deg, ${D.accent}, #0EA5E9)` }}>
                          <Briefcase size={18} color="#fff"/>
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <Typography sx={{ fontWeight:700, color: D.text, fontSize:14 }}>{job?.title || app.jobTitle}</Typography>
                            <Chip label={app.status} size="small" sx={{ background:`${sc}22`, color: sc, fontWeight:600, fontSize:11 }} />
                          </Box>
                        }
                        secondary={
                          <Typography sx={{ color: D.muted, fontSize:12 }}>
                            {job?.company || app.company}{' · Applied: '}{new Date(app.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {i < myApps.length - 1 && <Divider sx={{ borderColor: D.border }}/>}
                  </React.Fragment>
                );
              })}
            </List>
          </>
        )}
      </Card>
    );
  };

  const renderSettings = () => (
    <Card sx={cardSx}>
      <Typography sx={{ fontWeight:700, mb:{ xs:1.5, sm:3 }, color: D.text, fontSize:{ xs:'0.9rem', sm:'1.1rem' } }}>Account Settings</Typography>

      {/* Mobile: compact cards */}
      <Box sx={{ display:{ xs:'flex', sm:'none' }, flexDirection:'column', gap:1.25 }}>
        {[
          { title:'Change Password',       desc:'Update your login password', btn:'Update Password',      onClick: () => setPwDialog(true) },
          { title:'Notification Settings', desc:'Manage email & app alerts',  btn:'Manage Notifications', onClick: () => alert('Coming soon') },
        ].map(({ title, desc, btn, onClick }) => (
          <Box key={title} sx={{ p:'14px', borderRadius:2, background: D.bg, border:`1px solid ${D.border}`, '&:hover':{ borderColor: D.primary } }}>
            <Typography sx={{ fontWeight:700, color: D.text, fontSize:'0.78rem', mb:0.25 }}>{title}</Typography>
            <Typography sx={{ color: D.muted, fontSize:'0.65rem', mb:1.25 }}>{desc}</Typography>
            <Button fullWidth onClick={onClick}
              sx={{ borderRadius:2, textTransform:'none', border:`1px solid ${D.primary}`, color: D.primary, fontSize:'0.72rem', minHeight:34, py:0.75, '&:hover':{ background: D.primary, color:'#fff' } }}>
              {btn}
            </Button>
          </Box>
        ))}
      </Box>

      {/* Desktop: original Grid + Paper layout */}
      <Grid container spacing={2} sx={{ display:{ xs:'none', sm:'flex' } }}>
        {[
          { title:'Change Password',       btn:'Update Password',       onClick: () => setPwDialog(true) },
          { title:'Notification Settings', btn:'Manage Notifications',  onClick: () => alert('Coming soon') },
        ].map(({ title, btn, onClick }) => (
          <Grid item xs={12} sm={6} key={title}>
            <Paper sx={{ ...paperSx, transition:'all 0.2s', '&:hover':{ borderColor: D.primary } }}>
              <Typography sx={{ fontWeight:700, mb:1.5, color: D.text, fontSize:14 }}>{title}</Typography>
              <Button fullWidth variant="outlined" onClick={onClick}
                sx={{ borderRadius:2, textTransform:'none', borderColor: D.primary, color: D.primary, '&:hover':{ background: D.primary, color:'#fff' } }}>
                {btn}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Card>
  );

  const tabs = [renderPersonal, renderProfessional, renderEducation, renderSkills, renderResume, renderApplications, renderSettings];

  if (loading) return (
    <Box sx={{ display:'flex', height:'100vh', alignItems:'center', justifyContent:'center', background: D.bg }}>
      <CircularProgress sx={{ color: D.primary }}/>
    </Box>
  );

  return (
    <Box sx={{ display:'flex', background: D.bg, minHeight:'100vh' }}>
      <Sidebar />
      <Box sx={{ marginLeft:{ xs:0, lg:'240px' }, width:{ xs:'100%', lg:'calc(100% - 240px)' }, minWidth:0, p:{ xs:'12px', sm:'24px', lg:'32px' }, pt:{ xs:'64px', lg:'32px' }, overflowX:'hidden' }}>

        {/* Header banner — compact on mobile */}
        <Box sx={{ mb:{ xs:2, sm:3 }, p:{ xs:'14px 16px', sm:3 }, borderRadius:{ xs:2, sm:3 }, background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, boxShadow:`0 8px 32px ${D.primary}44` }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:{ xs:1.5, sm:2 } }}>
            <Avatar sx={{ width:{ xs:48, sm:72 }, height:{ xs:48, sm:72 }, background:'rgba(255,255,255,0.2)', fontSize:{ xs:20, sm:28 }, fontWeight:700, border:'2px solid rgba(255,255,255,0.4)', flexShrink:0 }}>
              {profile.profilePhoto
                ? <img src={profile.profilePhoto} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }}/>
                : profile.name ? profile.name.charAt(0).toUpperCase() : <User size={24} color="#fff"/>}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight:700, color:'#fff', fontSize:{ xs:'0.95rem', sm:'1.25rem' } }}>{profile.name || 'Your Profile'}</Typography>
              <Typography sx={{ opacity:0.85, color:'#fff', fontSize:{ xs:'0.72rem', sm:'0.875rem' } }}>
                {profile.professional?.currentJobTitle || 'Complete your profile to get started'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Tabs — compact on mobile */}
        <Card sx={{ mb:{ xs:1.5, sm:3 }, background: D.surface, border:`1px solid ${D.border}`, borderRadius:{ xs:2, sm:3 } }}>
          <Tabs value={activeTab} onChange={(_, v) => { setActiveTab(v); setEditMode(false); }}
            variant="scrollable" scrollButtons="auto"
            sx={{
              minHeight:{ xs:44, sm:56 },
              '& .MuiTab-root': { textTransform:'none', fontWeight:600, minHeight:{ xs:44, sm:56 }, color: D.muted, fontSize:{ xs:'0.68rem', sm:'0.875rem' }, px:{ xs:1, sm:2 },
                '&.Mui-selected':{ color: D.primary } },
              '& .MuiTabs-indicator':{ background:`linear-gradient(90deg, ${D.primary}, ${D.secondary})`, height:3, borderRadius:2 },
            }}>
            {tabConfig.map(({ label, icon }) => (
              <Tab key={label} icon={icon} label={label} iconPosition="start" />
            ))}
          </Tabs>
        </Card>

        {/* Content */}
        <Box sx={{ animation:'fadeIn 0.25s ease' }}>
          {tabs[activeTab]()}
        </Box>

        {/* Password dialog */}
        <Dialog open={pwDialog} onClose={() => setPwDialog(false)}
          slotProps={{ paper: { sx: { background: D.surface, border:`1px solid ${D.border}`, borderRadius:3 } } }}>
          <DialogTitle sx={{ fontWeight:700, color: D.text }}>Change Password</DialogTitle>
          <DialogContent>
            {['current','next','confirm'].map((k, i) => (
              <TextField key={k} fullWidth label={['Current Password','New Password','Confirm New Password'][i]}
                type="password" value={pwFields[k]}
                onChange={e => setPwFields(p => ({ ...p, [k]: e.target.value }))}
                sx={{ ...fSx, mt:2, mb:0 }} />
            ))}
          </DialogContent>
          <DialogActions sx={{ px:3, pb:2 }}>
            <Button onClick={() => setPwDialog(false)}
              sx={{ borderRadius:2, textTransform:'none', color: D.muted }}>Cancel</Button>
            <Button variant="contained"
              onClick={() => { setPwDialog(false); setSnack({ open:true, msg:'Password updated!', severity:'success' }); }}
              sx={{ borderRadius:2, textTransform:'none', background:`linear-gradient(135deg, ${D.primary}, ${D.secondary})`, boxShadow:'none' }}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snack.open} autoHideDuration={3500}
          onClose={() => setSnack(s => ({ ...s, open:false }))}
          anchorOrigin={{ vertical:'bottom', horizontal:'right' }}>
          <Alert severity={snack.severity} sx={{ borderRadius:2 }}
            onClose={() => setSnack(s => ({ ...s, open:false }))}>
            {snack.msg}
          </Alert>
        </Snackbar>

        <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }`}</style>
      </Box>
    </Box>
  );
}

