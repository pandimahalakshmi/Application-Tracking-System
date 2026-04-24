import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, InputAdornment } from '@mui/material';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const C = { bg:'#F8FAFF', surface:'#FFFFFF', border:'#E2E8F0', primary:'#6366F1', secondary:'#8B5CF6', text:'#1E293B', muted:'#64748B' };

const fSx = {
  '& .MuiOutlinedInput-root':{ borderRadius:1.5, background: '#FFFFFF', color: '#1E293B', '& fieldset':{ borderColor: '#E2E8F0' }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary } },
  '& .MuiInputLabel-root':{ color: C.muted, fontSize:'0.75rem' },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
  '& .MuiSelect-icon':{ color: C.muted },
  '& .MuiInputBase-input':{ fontSize:'0.78rem', padding:'8px 12px' },
  '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator':{ filter:'none' },
};

const menuProps = { PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, fontSize:'0.78rem', '&:hover':{ background:`${C.primary}22` } } } } };
const empty = { search:'', type:'', location:'', salary:'', dateFrom:'', dateTo:'' };

export default function JobFilters({ onApply, onClear }) {
  const [local, setLocal] = useState(empty);
  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));
  const handleApply = () => onApply(local);
  const handleClear = () => { setLocal(empty); onClear(); };
  const hasFilters = Object.values(local).some(v => v !== '');

  return (
    <Box sx={{ mb:{ xs:2, sm:2 }, p:{ xs:'10px', sm:'12px 14px' }, background: C.surface, border:`1px solid ${C.border}`, borderRadius:2 }}>

      {/* Desktop: compact single-area layout */}
      <Box sx={{ display:{ xs:'none', sm:'flex' }, flexDirection:'column', gap:1 }}>
        {/* Row 1: Search + Type + Location + Salary */}
        <Box sx={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:1 }}>
          <TextField size="small" placeholder="Search title or company..." value={local.search}
            onChange={e => set('search', e.target.value)} sx={fSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search size={13} color={C.muted}/></InputAdornment> }} />
          <FormControl size="small" sx={fSx}>
            <InputLabel sx={{ fontSize:'0.72rem' }}>Job Type</InputLabel>
            <Select value={local.type} onChange={e => set('type', e.target.value)} MenuProps={menuProps}>
              <MenuItem value="">All Types</MenuItem>
              {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" placeholder="Location..." value={local.location}
            onChange={e => set('location', e.target.value)} sx={fSx} />
          <FormControl size="small" sx={fSx}>
            <InputLabel sx={{ fontSize:'0.72rem' }}>Salary</InputLabel>
            <Select value={local.salary} onChange={e => set('salary', e.target.value)} MenuProps={menuProps}>
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="0-5">0–5 LPA</MenuItem>
              <MenuItem value="5-10">5–10 LPA</MenuItem>
              <MenuItem value="10-20">10–20 LPA</MenuItem>
              <MenuItem value="20+">20+ LPA</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* Row 2: From + To + Buttons */}
        <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
          <TextField size="small" label="From" type="date" value={local.dateFrom}
            onChange={e => set('dateFrom', e.target.value)} InputLabelProps={{ shrink:true }} sx={{ ...fSx, flex:1 }} />
          <TextField size="small" label="To" type="date" value={local.dateTo}
            onChange={e => set('dateTo', e.target.value)} InputLabelProps={{ shrink:true }} sx={{ ...fSx, flex:1 }} />
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
        <TextField fullWidth size="small" placeholder="Search title or company..." value={local.search}
          onChange={e => set('search', e.target.value)} sx={fSx}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={13} color={C.muted}/></InputAdornment> }} />
        <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
          <FormControl size="small" sx={fSx}>
            <InputLabel sx={{ fontSize:'0.72rem' }}>Job Type</InputLabel>
            <Select value={local.type} onChange={e => set('type', e.target.value)} MenuProps={menuProps}>
              <MenuItem value="">All</MenuItem>
              {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
            </Select>
          </FormControl>
          <TextField size="small" placeholder="Location..." value={local.location} onChange={e => set('location', e.target.value)} sx={fSx} />
        </Box>
        <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:1 }}>
          <FormControl size="small" sx={fSx}>
            <InputLabel sx={{ fontSize:'0.72rem' }}>Salary</InputLabel>
            <Select value={local.salary} onChange={e => set('salary', e.target.value)} MenuProps={menuProps}>
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="0-5">0–5 LPA</MenuItem>
              <MenuItem value="5-10">5–10 LPA</MenuItem>
              <MenuItem value="10-20">10–20 LPA</MenuItem>
              <MenuItem value="20+">20+ LPA</MenuItem>
            </Select>
          </FormControl>
          <TextField size="small" label="From" type="date" value={local.dateFrom} onChange={e => set('dateFrom', e.target.value)} InputLabelProps={{ shrink:true }} sx={fSx} />
          <TextField size="small" label="To" type="date" value={local.dateTo} onChange={e => set('dateTo', e.target.value)} InputLabelProps={{ shrink:true }} sx={fSx} />
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
  );
}
