import { useTheme } from "../context/ThemeContext";

export function useAppTheme() {
  const { darkMode, themeColor } = useTheme();

  const C = {
    bg:       darkMode ? '#0F172A' : '#F8FAFF',
    surface:  darkMode ? '#1E293B' : '#FFFFFF',
    surface2: darkMode ? '#263348' : '#F1F5FF',
    border:   darkMode ? '#334155' : '#E2E8F0',
    primary:  themeColor,
    secondary:'#8B5CF6',
    accent:   '#06B6D4',
    warning:  '#F59E0B',
    success:  '#10B981',
    danger:   '#EF4444',
    text:     darkMode ? '#F1F5F9' : '#1E293B',
    muted:    darkMode ? '#94A3B8' : '#64748B',
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
    boxShadow: darkMode ? '0 2px 12px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.06)',
  };

  const menuPropsSx = {
    PaperProps: {
      sx: {
        background: C.surface,
        border: `1px solid ${C.border}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
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
