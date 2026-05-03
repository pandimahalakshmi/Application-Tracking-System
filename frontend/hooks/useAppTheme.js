import { useTheme } from "../context/ThemeContext";

export function useAppTheme() {
  const { darkMode, themeColor } = useTheme();

  const C = {
    bg:       darkMode ? '#0F172A' : '#F0F4FF',
    surface:  darkMode ? '#1E293B' : '#FFFFFF',
    surface2: darkMode ? '#263348' : '#E8EEFF',
    border:   darkMode ? '#334155' : '#D1D9F0',
    primary:  themeColor,
    secondary:'#7C3AED',
    accent:   '#0891B2',
    warning:  '#D97706',
    success:  '#059669',
    danger:   '#DC2626',
    text:     darkMode ? '#F1F5F9' : '#111827',
    muted:    darkMode ? '#94A3B8' : '#4B5563',
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2, background: C.surface, color: C.text,
      '& fieldset': { borderColor: C.border },
      '&:hover fieldset': { borderColor: C.primary },
      '&.Mui-focused fieldset': { borderColor: C.primary, borderWidth: 2 },
    },
    '& .MuiInputLabel-root': { color: C.muted },
    '& .MuiInputLabel-root.Mui-focused': { color: C.primary },
    '& .MuiSelect-icon': { color: C.muted },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 100px ${C.surface} inset`,
      WebkitTextFillColor: C.text,
    },
  };

  const cardSx = {
    background: C.surface,
    border: `1px solid ${C.border}`,
    borderRadius: 3,
    transition: 'all 0.2s',
    boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(91,91,214,0.08)',
  };

  const menuPropsSx = {
    PaperProps: {
      sx: {
        background: C.surface,
        border: `1px solid ${C.border}`,
        boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(91,91,214,0.12)',
        '& .MuiMenuItem-root': {
          color: C.text,
          '&:hover': { background: `${C.primary}18` },
          '&.Mui-selected': { background: `${C.primary}28` },
        },
      },
    },
  };

  return { C, fieldSx, cardSx, menuPropsSx, darkMode, themeColor };
}
