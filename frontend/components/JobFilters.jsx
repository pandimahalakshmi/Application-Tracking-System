import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, InputAdornment } from '@mui/material';
import { Search, X } from 'lucide-react';

const C = { bg:'#0F172A', surface:'#1E293B', border:'#334155', primary:'#6366F1', text:'#F1F5F9', muted:'#94A3B8' };

const fSx = {
  '& .MuiOutlinedInput-root':{ borderRadius:2, background: C.bg, color: C.text, '& fieldset':{ borderColor: C.border }, '&:hover fieldset':{ borderColor: C.primary }, '&.Mui-focused fieldset':{ borderColor: C.primary } },
  '& .MuiInputLabel-root':{ color: C.muted },
  '& .MuiInputLabel-root.Mui-focused':{ color: C.primary },
  '& .MuiSelect-icon':{ color: C.muted },
};

const menuProps = { PaperProps:{ sx:{ background: C.surface, border:`1px solid ${C.border}`, '& .MuiMenuItem-root':{ color: C.text, '&:hover':{ background:`${C.primary}22` } } } } };

export default function JobFilters({ filters, onChange, onClear }) {
  const hasFilters = filters.search || filters.type || filters.location || filters.salary;

  return (
    <Box sx={{ display:'flex', gap:2, flexWrap:'wrap', alignItems:'center', mb:3,
      p:2, background: C.surface, border:`1px solid ${C.border}`, borderRadius:3 }}>

      <TextField size="small" placeholder="Search title or company..." value={filters.search}
        onChange={e => onChange('search', e.target.value)} sx={{ ...fSx, minWidth:220 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><Search size={15} color={C.muted}/></InputAdornment> }} />

      <FormControl size="small" sx={{ ...fSx, minWidth:140 }}>
        <InputLabel>Job Type</InputLabel>
        <Select value={filters.type} onChange={e => onChange('type', e.target.value)} MenuProps={menuProps}>
          <MenuItem value="">All Types</MenuItem>
          {['Full-time','Part-time','Contract','Internship'].map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </Select>
      </FormControl>

      <TextField size="small" placeholder="Location..." value={filters.location}
        onChange={e => onChange('location', e.target.value)} sx={{ ...fSx, minWidth:150 }} />

      <FormControl size="small" sx={{ ...fSx, minWidth:150 }}>
        <InputLabel>Salary Range</InputLabel>
        <Select value={filters.salary} onChange={e => onChange('salary', e.target.value)} MenuProps={menuProps}>
          <MenuItem value="">Any Salary</MenuItem>
          <MenuItem value="0-5">0 - 5 LPA</MenuItem>
          <MenuItem value="5-10">5 - 10 LPA</MenuItem>
          <MenuItem value="10-20">10 - 20 LPA</MenuItem>
          <MenuItem value="20+">20+ LPA</MenuItem>
        </Select>
      </FormControl>

      {hasFilters && (
        <Button size="small" startIcon={<X size={14}/>} onClick={onClear}
          sx={{ color: C.muted, textTransform:'none', borderRadius:2, border:`1px solid ${C.border}`,
            '&:hover':{ borderColor: C.primary, color: C.text } }}>
          Clear
        </Button>
      )}
    </Box>
  );
}
