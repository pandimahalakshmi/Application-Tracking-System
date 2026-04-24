export const C = {
  bg:       '#F8FAFF',
  surface:  '#FFFFFF',
  surface2: '#F1F5FF',
  border:   '#E2E8F0',
  primary:  '#6366F1',
  secondary:'#8B5CF6',
  accent:   '#06B6D4',
  warning:  '#F59E0B',
  success:  '#10B981',
  danger:   '#EF4444',
  text:     '#1E293B',
  muted:    '#64748B',
};

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#FFFFFF', color: '#1E293B',
    '& fieldset': { borderColor: '#E2E8F0' },
    '&:hover fieldset': { borderColor: '#6366F1' },
    '&.Mui-focused fieldset': { borderColor: '#6366F1', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#64748B' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#6366F1' },
  '& .MuiSelect-icon': { color: '#64748B' },
};

export const cardSx = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: 3,
  transition: 'all 0.2s',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export const menuPropsSx = {
  PaperProps: {
    sx: {
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      '& .MuiMenuItem-root': {
        color: '#1E293B',
        '&:hover': { background: 'rgba(99,102,241,0.08)' },
      },
    },
  },
};
