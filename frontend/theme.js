// ── Light theme palette ───────────────────────────────────────────────────
export const C = {
  bg:       '#F0F4FF',
  surface:  '#FFFFFF',
  surface2: '#E8EEFF',
  border:   '#D1D9F0',
  primary:  '#5B5BD6',
  secondary:'#7C3AED',
  accent:   '#0891B2',
  warning:  '#D97706',
  success:  '#059669',
  danger:   '#DC2626',
  text:     '#111827',
  muted:    '#4B5563',
};

export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2, background: '#FFFFFF', color: '#111827',
    '& fieldset': { borderColor: '#D1D9F0' },
    '&:hover fieldset': { borderColor: '#5B5BD6' },
    '&.Mui-focused fieldset': { borderColor: '#5B5BD6', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': { color: '#4B5563' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#5B5BD6' },
  '& .MuiSelect-icon': { color: '#4B5563' },
};

export const cardSx = {
  background: '#FFFFFF',
  border: '1px solid #D1D9F0',
  borderRadius: 3,
  transition: 'all 0.2s',
  boxShadow: '0 2px 8px rgba(91,91,214,0.08)',
};

export const menuPropsSx = {
  PaperProps: {
    sx: {
      background: '#FFFFFF',
      border: '1px solid #D1D9F0',
      boxShadow: '0 8px 24px rgba(91,91,214,0.12)',
      '& .MuiMenuItem-root': {
        color: '#111827',
        '&:hover': { background: 'rgba(91,91,214,0.08)' },
      },
    },
  },
};
