export const C = {
  bg:       '#0F172A',
  surface:  '#1E293B',
  surface2: '#263348',
  border:   '#334155',
  primary:  '#6366F1',
  secondary:'#8B5CF6',
  accent:   '#06B6D4',
  warning:  '#F59E0B',
  success:  '#10B981',
  danger:   '#F87171',
  text:     '#F1F5F9',
  muted:    '#94A3B8',
};

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#0F172A', color: '#F1F5F9',
    '& fieldset': { borderColor: '#334155' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#94A3B8' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
  '& .MuiSelect-icon': { color: '#94A3B8' },
};

export const cardSx = {
  background: '#1E293B',
  border: '1px solid #334155',
  borderRadius: 3,
  transition: 'all 0.2s',
};

export const menuPropsSx = {
  PaperProps: {
    sx: {
      background: '#1E293B',
      border: '1px solid #334155',
      '& .MuiMenuItem-root': {
        color: '#F1F5F9',
        '&:hover': { background: 'rgba(99,102,241,0.15)' },
      },
    },
  },
};
