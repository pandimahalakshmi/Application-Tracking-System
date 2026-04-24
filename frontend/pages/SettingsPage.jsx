import { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import {
  Box, Card, Typography, Switch, Button, TextField,
  Chip, Divider, CircularProgress, Select, MenuItem, FormControl, Avatar,
} from "@mui/material";
import {
  Shield, Bell, Palette, FileText, Eye, Building2,
  AlertTriangle, Save, Upload, Users, Wrench, Moon, Sun, Layout,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const THEMES = [
  { name: 'Indigo',  color: '#6366F1' },
  { name: 'Blue',    color: '#3B82F6' },
  { name: 'Green',   color: '#10B981' },
  { name: 'Rose',    color: '#F43F5E' },
  { name: 'Orange',  color: '#F97316' },
  { name: 'Violet',  color: '#7C3AED' },
];

const ROLES = ['admin', 'recruiter', 'viewer', 'user'];

export default function SettingsPage() {
  const role    = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  const { darkMode, setDarkMode, compact, setCompact, themeColor, setThemeColor } = useTheme();

  // derive colors reactively from theme
  const P = themeColor;
  const isDark = darkMode;

  const C = {
    bg:      isDark ? '#0F172A' : '#F8FAFF',
    surface: isDark ? '#1E293B' : '#FFFFFF',
    surface2:isDark ? '#263348' : '#F1F5FF',
    border:  isDark ? '#334155' : '#E2E8F0',
    text:    isDark ? '#F1F5F9' : '#1E293B',
    muted:   isDark ? '#94A3B8' : '#64748B',
    primary: P,
    secondary:'#8B5CF6',
    success: '#10B981',
    warning: '#F59E0B',
    danger:  '#EF4444',
  };

  const fSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2, background: C.surface, color: C.text, fontSize: '0.85rem',
      '& fieldset': { borderColor: C.border },
      '&:hover fieldset': { borderColor: C.primary },
      '&.Mui-focused fieldset': { borderColor: C.primary },
    },
    '& .MuiInputLabel-root': { color: C.muted, fontSize: '0.82rem' },
    '& .MuiInputLabel-root.Mui-focused': { color: C.primary },
    '& .MuiSelect-select': { fontSize: '0.85rem', color: C.text },
  };

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const logoRef = useRef(null);

  const [pw,      setPw]      = useState({ current: '', next: '', confirm: '' });
  const [twoFA,   setTwoFA]   = useState(false);
  const [notif,   setNotif]   = useState({ email: true, appStatus: true, interview: true, alerts: false });
  const [prefs,   setPrefs]   = useState({ sort: 'newest', quickApply: true, autosave: true });
  const [privacy, setPrivacy] = useState({ resumeDownload: true, profileVisible: true, dataConsent: true });
  const [admin,   setAdmin]   = useState({
    companyName: '', website: '', logoPreview: null,
    aiFilter: true, maintenance: false, defaultJobType: 'full-time',
  });
  const [roleUsers] = useState([
    { name: 'Alice Johnson', email: 'alice@company.com' },
    { name: 'Bob Smith',     email: 'bob@company.com'   },
    { name: 'Carol White',   email: 'carol@company.com' },
  ]);
  const [userRoles, setUserRoles] = useState({ 'alice@company.com': 'recruiter', 'bob@company.com': 'viewer', 'carol@company.com': 'user' });

  const handleLogoChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAdmin(a => ({ ...a, logoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 900);
  };

  // ── sub-components scoped inside so they inherit C & fSx ──

  function SettingRow({ label, desc, checked, onChange }) {
    return (
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        py: 1.5, borderBottom: `1px solid ${C.border}`, '&:last-child': { borderBottom: 'none' },
      }}>
        <Box sx={{ flex: 1, pr: 2 }}>
          <Typography sx={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>{label}</Typography>
          {desc && <Typography sx={{ color: C.muted, fontSize: '0.73rem', mt: 0.3 }}>{desc}</Typography>}
        </Box>
        <Switch checked={checked} onChange={e => onChange(e.target.checked)} size="small"
          sx={{ flexShrink: 0,
            '& .MuiSwitch-switchBase.Mui-checked': { color: C.primary },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: C.primary },
          }} />
      </Box>
    );
  }

  function SectionCard({ icon: Icon, title, color, children }) {
    return (
      <Card sx={{
        borderRadius: 3, border: `1px solid ${C.border}`, background: C.surface,
        boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
        overflow: 'hidden', mb: 2.5,
      }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          p: '14px 20px', background: C.surface2, borderBottom: `1px solid ${C.border}`,
        }}>
          <Box sx={{ width: 34, height: 34, borderRadius: 2, background: `${color}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={17} color={color} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: C.text, fontSize: '0.92rem' }}>{title}</Typography>
        </Box>
        <Box sx={{ p: '8px 20px 18px' }}>{children}</Box>
      </Card>
    );
  }

  return (
    <Box sx={{ display: 'flex', background: C.bg, minHeight: '100vh', transition: 'background 0.3s' }}>
      <Sidebar />
      <Box sx={{
        marginLeft: { xs: 0, lg: '240px' },
        width: { xs: '100%', lg: 'calc(100% - 240px)' },
        minWidth: 0, p: { xs: '12px', sm: '24px', lg: '32px' },
        pt: { xs: '64px', lg: '32px' }, overflowX: 'hidden',
      }}>

        {/* ── Header ── */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3.5, gap: 1.5 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: C.text, fontSize: { xs: '1rem', sm: '1.5rem' }, whiteSpace: 'nowrap' }}>
              Settings
            </Typography>
            <Typography sx={{ color: C.muted, fontSize: { xs: '0.7rem', sm: '0.8rem' }, mt: 0.3,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Manage system configuration and preferences
            </Typography>
          </Box>
          <Button onClick={handleSave} disabled={saving}
            startIcon={saving ? <CircularProgress size={12} color="inherit" /> : <Save size={12} />}
            sx={{
              background: `linear-gradient(135deg,${C.primary},${C.secondary})`,
              color: '#fff', borderRadius: 2, textTransform: 'none',
              fontWeight: 600,
              fontSize: { xs: '0.72rem', sm: '0.82rem' },
              minHeight: { xs: 32, sm: 38 },
              px: { xs: 1.5, sm: 2.5 },
              py: { xs: 0.5, sm: 1 },
              flexShrink: 0,
              whiteSpace: 'nowrap',
              boxShadow: `0 4px 14px ${C.primary}44`,
              '&:hover': { opacity: 0.9 },
              '&:disabled': { opacity: 0.6 },
            }}>
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
          </Button>
        </Box>

        {/* ── Two-column grid on lg, single on mobile ── */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: { xs: 0, lg: '0 24px' } }}>

          {/* ════ LEFT ════ */}
          <Box>

            {/* Security */}
            <SectionCard icon={Shield} title="Security Settings" color={C.primary}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: 1.5 }}>
                <TextField fullWidth label="Current Password" type="password" size="small"
                  value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} sx={fSx} />
                <TextField fullWidth label="New Password" type="password" size="small"
                  value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} sx={fSx} />
                <TextField fullWidth label="Confirm New Password" type="password" size="small"
                  value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} sx={fSx} />
                <Button size="small" sx={{
                  alignSelf: 'flex-start', background: `${C.primary}15`, color: C.primary,
                  borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', px: 2,
                  '&:hover': { background: `${C.primary}28` },
                }}>Update Password</Button>
              </Box>
              <Divider sx={{ my: 2, borderColor: C.border }} />
              <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account"
                checked={twoFA} onChange={setTwoFA} />
            </SectionCard>

            {/* Notifications */}
            <SectionCard icon={Bell} title="Notification Settings" color={C.warning}>
              <SettingRow label="Email Notifications" desc="Receive updates via email"
                checked={notif.email} onChange={v => setNotif(n => ({ ...n, email: v }))} />
              <SettingRow label="Application Status Updates" desc="Notify when application status changes"
                checked={notif.appStatus} onChange={v => setNotif(n => ({ ...n, appStatus: v }))} />
              <SettingRow label="Interview Schedule Alerts" desc="Reminders for upcoming interviews"
                checked={notif.interview} onChange={v => setNotif(n => ({ ...n, interview: v }))} />
              <SettingRow label="System Alerts" desc="Critical system notifications"
                checked={notif.alerts} onChange={v => setNotif(n => ({ ...n, alerts: v }))} />
            </SectionCard>

            {/* Privacy */}
            <SectionCard icon={Eye} title="Privacy Settings" color={C.success}>
              <SettingRow label="Allow Resume Downloads" desc="Recruiters can download your resume"
                checked={privacy.resumeDownload} onChange={v => setPrivacy(p => ({ ...p, resumeDownload: v }))} />
              <SettingRow label="Profile Visibility" desc="Allow companies to view your profile"
                checked={privacy.profileVisible} onChange={v => setPrivacy(p => ({ ...p, profileVisible: v }))} />
              <SettingRow label="Data Privacy Consent" desc="Allow data processing for recruitment"
                checked={privacy.dataConsent} onChange={v => setPrivacy(p => ({ ...p, dataConsent: v }))} />
            </SectionCard>

            {/* User Role Management — admin only, left column */}
            {isAdmin && (
              <SectionCard icon={Users} title="User Role Management" color={C.secondary}>
                <Box sx={{ pt: 0.5 }}>
                  {roleUsers.map((u, i) => (
                    <Box key={u.email} sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5,
                      py: 1.5, borderBottom: i < roleUsers.length - 1 ? `1px solid ${C.border}` : 'none',
                    }}>
                      <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                        background: `linear-gradient(135deg,${C.primary},${C.secondary})` }}>
                        {u.name.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ color: C.text, fontSize: '0.83rem', fontWeight: 600,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</Typography>
                        <Typography sx={{ color: C.muted, fontSize: '0.7rem',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</Typography>
                      </Box>
                      <FormControl size="small" sx={{ minWidth: 115, flexShrink: 0, ...fSx }}>
                        <Select value={userRoles[u.email]}
                          onChange={e => setUserRoles(r => ({ ...r, [u.email]: e.target.value }))}
                          sx={{ borderRadius: 2, fontSize: '0.8rem', background: C.surface, color: C.text }}>
                          {ROLES.map(r => (
                            <MenuItem key={r} value={r} sx={{ fontSize: '0.8rem' }}>
                              {r.charAt(0).toUpperCase() + r.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Box>
              </SectionCard>
            )}

          </Box>

          {/* ════ RIGHT ════ */}
          <Box>

            {/* Appearance — FULLY FUNCTIONAL */}
            <SectionCard icon={Palette} title="Appearance Settings" color={C.secondary}>

              {/* Dark / Light toggle — visual card style */}
              <Box sx={{ pt: 1.5, mb: 1 }}>
                <Typography sx={{ color: C.muted, fontSize: '0.72rem', fontWeight: 600, mb: 1.25,
                  textTransform: 'uppercase', letterSpacing: 0.6 }}>Color Mode</Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  {[
                    { label: 'Light', icon: Sun,  value: false },
                    { label: 'Dark',  icon: Moon, value: true  },
                  ].map(({ label, icon: Icon, value }) => {
                    const active = darkMode === value;
                    return (
                      <Box key={label} onClick={() => setDarkMode(value)}
                        sx={{
                          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                          gap: 0.75, p: '12px 8px', borderRadius: 2.5, cursor: 'pointer',
                          border: `2px solid ${active ? C.primary : C.border}`,
                          background: active ? `${C.primary}12` : C.surface2,
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: C.primary, background: `${C.primary}08` },
                        }}>
                        <Icon size={20} color={active ? C.primary : C.muted} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700,
                          color: active ? C.primary : C.muted }}>{label}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Divider sx={{ my: 1.75, borderColor: C.border }} />

              {/* Theme color */}
              <Box sx={{ mb: 1.75 }}>
                <Typography sx={{ color: C.muted, fontSize: '0.72rem', fontWeight: 600, mb: 1.25,
                  textTransform: 'uppercase', letterSpacing: 0.6 }}>Theme Color</Typography>
                <Box sx={{ display: 'flex', gap: 1.25, flexWrap: 'wrap' }}>
                  {THEMES.map(t => (
                    <Box key={t.name} title={t.name} onClick={() => setThemeColor(t.color)}
                      sx={{
                        width: 32, height: 32, borderRadius: '50%', background: t.color,
                        cursor: 'pointer', transition: 'all 0.2s',
                        border: themeColor === t.color ? '3px solid #fff' : '3px solid transparent',
                        boxShadow: themeColor === t.color ? `0 0 0 2.5px ${t.color}, 0 4px 12px ${t.color}55` : 'none',
                        '&:hover': { transform: 'scale(1.18)' },
                      }} />
                  ))}
                </Box>
                <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 14, height: 14, borderRadius: '50%', background: themeColor, flexShrink: 0 }} />
                  <Typography sx={{ color: C.muted, fontSize: '0.72rem' }}>
                    Active: {THEMES.find(t => t.color === themeColor)?.name || 'Custom'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 1.75, borderColor: C.border }} />

              {/* Compact mode */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 34, height: 34, borderRadius: 2, background: `${C.secondary}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layout size={16} color={C.secondary} />
                  </Box>
                  <Box>
                    <Typography sx={{ color: C.text, fontSize: '0.85rem', fontWeight: 600 }}>Compact View</Typography>
                    <Typography sx={{ color: C.muted, fontSize: '0.73rem' }}>Reduce spacing for more content</Typography>
                  </Box>
                </Box>
                <Switch checked={compact} onChange={e => setCompact(e.target.checked)} size="small"
                  sx={{
                    flexShrink: 0,
                    '& .MuiSwitch-switchBase.Mui-checked': { color: C.primary },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: C.primary },
                  }} />
              </Box>
            </SectionCard>

            {/* Application Preferences */}
            <SectionCard icon={FileText} title="Application Preferences" color={C.primary}>
              <Box sx={{ pt: 1.5, mb: 1.75 }}>
                <Typography sx={{ color: C.muted, fontSize: '0.72rem', fontWeight: 600, mb: 1.25,
                  textTransform: 'uppercase', letterSpacing: 0.6 }}>Default Sort Order</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['newest', 'oldest'].map(s => (
                    <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)}
                      onClick={() => setPrefs(p => ({ ...p, sort: s }))}
                      sx={{
                        background: prefs.sort === s ? C.primary : C.surface2,
                        color: prefs.sort === s ? '#fff' : C.muted,
                        fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                        border: `1px solid ${prefs.sort === s ? C.primary : C.border}`,
                        '&:hover': { background: prefs.sort === s ? C.primary : `${C.primary}15` },
                      }} />
                  ))}
                </Box>
              </Box>
              <SettingRow label="Enable Quick Apply" desc="Apply to jobs with one click"
                checked={prefs.quickApply} onChange={v => setPrefs(p => ({ ...p, quickApply: v }))} />
              <SettingRow label="Auto-save Drafts" desc="Automatically save application drafts"
                checked={prefs.autosave} onChange={v => setPrefs(p => ({ ...p, autosave: v }))} />
            </SectionCard>

            {/* ── Admin Only ── */}
            {isAdmin && (
              <>
                {/* Company Settings */}
                <SectionCard icon={Building2} title="Company Settings" color={C.danger}>
                  <Box sx={{ pt: 1.5, mb: 2 }}>
                    <Typography sx={{ color: C.muted, fontSize: '0.72rem', fontWeight: 600, mb: 1.25,
                      textTransform: 'uppercase', letterSpacing: 0.6 }}>Company Logo</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{
                        width: 68, height: 68, borderRadius: 2.5, border: `2px dashed ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: C.surface2, overflow: 'hidden', flexShrink: 0,
                      }}>
                        {admin.logoPreview
                          ? <img src={admin.logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Building2 size={26} color={C.muted} />}
                      </Box>
                      <Box>
                        <input ref={logoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                        <Button size="small" startIcon={<Upload size={13} />} onClick={() => logoRef.current?.click()}
                          sx={{ background: `${C.danger}15`, color: C.danger, borderRadius: 2,
                            textTransform: 'none', fontWeight: 600, fontSize: '0.78rem', px: 1.75,
                            '&:hover': { background: `${C.danger}28` } }}>
                          Upload Logo
                        </Button>
                        <Typography sx={{ color: C.muted, fontSize: '0.67rem', mt: 0.6 }}>PNG, JPG up to 2MB</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 1.75 }}>
                    <TextField fullWidth label="Company Name" size="small"
                      value={admin.companyName} onChange={e => setAdmin(a => ({ ...a, companyName: e.target.value }))} sx={fSx} />
                    <TextField fullWidth label="Company Website" size="small"
                      value={admin.website} onChange={e => setAdmin(a => ({ ...a, website: e.target.value }))}
                      placeholder="https://yourcompany.com" sx={fSx} />
                  </Box>
                  <Divider sx={{ my: 1.75, borderColor: C.border }} />
                  <Box sx={{ mb: 1.75 }}>
                    <Typography sx={{ color: C.muted, fontSize: '0.72rem', fontWeight: 600, mb: 1.25,
                      textTransform: 'uppercase', letterSpacing: 0.6 }}>Default Job Posting Type</Typography>
                    <FormControl size="small" fullWidth sx={fSx}>
                      <Select value={admin.defaultJobType}
                        onChange={e => setAdmin(a => ({ ...a, defaultJobType: e.target.value }))}
                        sx={{ borderRadius: 2, fontSize: '0.85rem', background: C.surface, color: C.text }}>
                        {['full-time', 'part-time', 'contract', 'internship', 'remote'].map(t => (
                          <MenuItem key={t} value={t} sx={{ fontSize: '0.82rem' }}>
                            {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <SettingRow label="AI Resume Filtering" desc="Auto-rank candidates using AI scoring"
                    checked={admin.aiFilter} onChange={v => setAdmin(a => ({ ...a, aiFilter: v }))} />
                </SectionCard>

                {/* System Maintenance — right column, under Company Settings */}
                <SectionCard icon={Wrench} title="System Maintenance" color={C.warning}>
                  <SettingRow label="Maintenance Mode" desc="Disable user access temporarily for system updates"
                    checked={admin.maintenance} onChange={v => setAdmin(a => ({ ...a, maintenance: v }))} />
                  {admin.maintenance && (
                    <Box sx={{ mt: 1.5, p: '10px 14px', borderRadius: 2,
                      background: '#FEF3C7', border: '1px solid #FDE68A',
                      display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AlertTriangle size={14} color="#D97706" />
                      <Typography sx={{ color: '#92400E', fontSize: '0.73rem' }}>
                        Maintenance mode will log out all active users.
                      </Typography>
                    </Box>
                  )}
                </SectionCard>
              </>
            )}

          </Box>
        </Box>
      </Box>
    </Box>
  );
}
