import { useState, useEffect, useRef } from 'react';
import { Badge, Box, Typography, IconButton, Paper, Divider, Button, Popper, ClickAwayListener } from '@mui/material';
import { Bell, CheckCheck } from 'lucide-react';
import { notificationService } from '../services/api';

const C = {
  bg:'#0F172A', surface:'#1E293B', border:'#334155',
  primary:'#6366F1', text:'#F1F5F9', muted:'#94A3B8',
  success:'#10B981', warning:'#F59E0B',
};

const typeColor = (type) => ({
  application:   C.primary,
  status_update: C.success,
  job_posted:    C.warning,
}[type] || C.primary);

export default function NotificationBell({ userId }) {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen]     = useState(false);
  const anchorRef           = useRef(null);

  const load = async () => {
    if (!userId) return;
    const data = await notificationService.getAll(userId);
    if (data.success) { setNotifs(data.notifications); setUnread(data.unread); }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleMarkAll = async () => {
    await notificationService.markAllRead(userId);
    setUnread(0);
    setNotifs(n => n.map(x => ({ ...x, read: true })));
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date);
    const m = Math.floor(diff / 60000);
    if (m < 1)  return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box>
        <IconButton
          ref={anchorRef}
          onClick={() => setOpen(o => !o)}
          size="small"
          sx={{ background: open ? `${C.primary}22` : 'transparent', '&:hover': { background: `${C.primary}22` } }}
        >
          <Badge badgeContent={unread} color="error" max={9}>
            <Bell size={20} color={unread > 0 ? C.primary : C.muted} />
          </Badge>
        </IconButton>

        {/* Popper renders outside sidebar DOM — no clipping */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-end"
          style={{ zIndex: 9999 }}
          modifiers={[{ name: 'offset', options: { offset: [0, 8] } }]}
        >
          <Paper sx={{
            width: 340,
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 2,
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', p:2, pb:1.5 }}>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:15 }}>
                Notifications{unread > 0 && <span style={{ color: C.primary }}> ({unread})</span>}
              </Typography>
              {unread > 0 && (
                <Button size="small" startIcon={<CheckCheck size={14}/>} onClick={handleMarkAll}
                  sx={{ color: C.muted, textTransform:'none', fontSize:12, '&:hover':{ color: C.text } }}>
                  Mark all read
                </Button>
              )}
            </Box>

            <Divider sx={{ borderColor: C.border }} />

            {/* List */}
            <Box sx={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifs.length === 0 ? (
                <Box sx={{ p:4, textAlign:'center' }}>
                  <Bell size={32} color={C.border} style={{ marginBottom:8 }} />
                  <Typography sx={{ color: C.muted, fontSize:13 }}>No notifications yet</Typography>
                </Box>
              ) : notifs.map(n => (
                <Box key={n._id} sx={{
                  p:2, borderBottom:`1px solid ${C.border}`,
                  background: n.read ? 'transparent' : `${C.primary}08`,
                  transition:'all 0.2s', '&:hover':{ background:`${C.primary}11` },
                }}>
                  <Box sx={{ display:'flex', gap:1.5, alignItems:'flex-start' }}>
                    <Box sx={{ width:8, height:8, borderRadius:'50%', mt:0.7, flexShrink:0,
                      background: n.read ? C.border : typeColor(n.type) }} />
                    <Box sx={{ flex:1 }}>
                      <Typography sx={{ color: C.text, fontSize:13, lineHeight:1.5 }}>{n.message}</Typography>
                      <Typography sx={{ color: C.muted, fontSize:11, mt:0.5 }}>{timeAgo(n.createdAt)}</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
