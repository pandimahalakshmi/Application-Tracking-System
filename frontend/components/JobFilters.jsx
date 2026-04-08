import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, InputAdornment } from '@mui/material';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', secondary:'#8B5CF6', text:'#F1F5F9', muted:'#94A3B8' };

const fSx = {
  '& .MuiOutlinedInput-root':{ borderRadius:2, background: C.bg, color: C.text, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary } },
  '& .MuiInputLabel-root':{ color: C.muted },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
  '& .MuiSelect-icon':{ color: C.muted },
  '& .MuiInputBase-input[type="date"]::-webkit-calendar-picker-indicator':{ filter:'invert(0.6)' },
};

const menuProps = { PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } };

const empty = { search:'', type:'', location:'', salary:'', dateFrom:'', dateTo:'' };

export default function JobFilters({ onApply, onClear }) {
  const [local, setLocal] = useState(empty);

  const set = (k, v) => setLocal(p => ({ ...p, [k]: v }));

  const handleApply = () => onApply(local);

  const handleClear = () => {
    setLocal(empty);
    onClear();
  };

  const hasFilters = Object.values(local).some(v => v !== '');

  return (
    <Box sx={{ mb:3, p:2.5, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>
      <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', alignItems:'flex-end' }}>

        {/* Search */}
        <TextField size="small" placeholder="Search title or company..." value={local.search}
          onChange={e => set('search', e.target.value)} sx={{ ...fSx, minWidth:220 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} color={C.muted}/></InputAdornment> }} />

        {/* Job Type */}
        <FormControl size="small" sx={{ ...fSx, minWidth:140 }}>
          <InputLabel>Job Type</InputLabel>
          <Select value={local.type} onChange={e => set('type', e.target.value)} MenuProps={menuProps}>
            <MenuItem value="">All Types</MenuItem>
            {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </Select>
        </FormControl>

        {/* Location */}
        <TextField size="small" placeholder="Location..." value={local.location}
          onChange={e => set('location', e.target.value)} sx={{ ...fSx, minWidth:150 }} />

        {/* Salary */}
        <FormControl size="small" sx={{ ...fSx, minWidth:150 }}>
          <InputLabel>Salary Range</InputLabel>
          <Select value={local.salary} onChange={e => set('salary', e.target.value)} MenuProps={menuProps}>
            <MenuItem value="">Any Salary</MenuItem>
            <MenuItem value="0-5">0 - 5 LPA</MenuItem>
            <MenuItem value="5-10">5 - 10 LPA</MenuItem>
            <MenuItem value="10-20">10 - 20 LPA</MenuItem>
            <MenuItem value="20+">20+ LPA</MenuItem>
          </Select>
        </FormControl>

        {/* Date From */}
        <TextField size="small" label="Posted From" type="date" value={local.dateFrom}
          onChange={e => set('dateFrom', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ ...fSx, minWidth:160 }} />

        {/* Date To */}
        <TextField size="small" label="Posted To" type="date" value={local.dateTo}
          onChange={e => set('dateTo', e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ ...fSx, minWidth:160 }} />

        {/* Apply Button */}
        <Button onClick={handleApply} startIcon={<SlidersHorizontal size={15}/>}
          sx={{ background:`linear-gradient(135deg, ${C.primary}, ${C.secondary})`, color:'#fff',
            borderRadius:2, textTransform:'none', fontWeight:600, px:3, height:40,
            boxShadow:`0 4px 12px ${C.primary}44`, '&:hover':{ opacity:0.9 } }}>
          Apply Filters
        </Button>

        {/* Clear Button */}
        {hasFilters && (
          <Button size="small" startIcon={<X size={14}/>} onClick={handleClear}
            sx={{ color: C.muted, textTransform:'none', borderRadius:2, height:40,
              border:`1px solid ${C.border}`, '&:hover':{ borderColor: C.primary, color: C.text } }}>
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
}
