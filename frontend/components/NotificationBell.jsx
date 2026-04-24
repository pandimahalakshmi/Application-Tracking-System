import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, Typography, IconButton, Paper, Divider, Button, Popper, ClickAwayListener, Tooltip } from '@mui/material';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { notificationService } from '../services/api';

const C = {
  bg:'#0F172A', surface:'#1E293B', border:'#334155',
  primary:'#6366F1', text:'#F1F5F9', muted:'#94A3B8',
  success:'#10B981', warning:'#F59E0B', danger:'#F87171',
};

const typeColor = (type) => ({
  application:   C.primary,
  status_update: C.success,
  job_posted:    C.warning,
}[type] || C.primary);

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date);
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m} minute${m !== 1 ? 's' : ''} ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hour${h !== 1 ? 's' : ''} ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export default function NotificationBell({ userId }) {
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen]     = useState(false);
  const deletedIdsRef = useRef(new Set());
  const anchorRef     = useRef(null);
  const navigate            = useNavigate();
  const role                = localStorage.getItem('role');

  const load = async () => {
    if (!userId) return;
    const data = await notificationService.getAll(userId);
    if (data.success) {
      const visible = data.notifications.filter(n => !deletedIdsRef.current.has(n._id));
      const unreadCount = visible.filter(n => !n.read).length;
      setNotifs(visible);
      setUnread(unreadCount);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  // Click notification — mark read in DB + navigate based on role
  const handleClick = async (n) => {
    // Mark as read
    if (!n.read) {
      await notificationService.markOneRead(n._id);
      setNotifs(prev => prev.map(x => x._id === n._id ? { ...x, read: true } : x));
      setUnread(prev => Math.max(0, prev - 1));
    }
    setOpen(false);

    // Admin → navigate to specific application using applicationId or relatedId
    if (role === 'admin') {
      const appId = n.applicationId || n.relatedId;
      if (appId) {
        navigate(`/admin/applications/${appId}`);
      } else {
        navigate('/admin/applications');
      }
      return;
    }

    // User → navigate to my-applications, highlight specific app
    if (role === 'user') {
      const appId = n.applicationId || n.relatedId;
      if (appId) {
        navigate(`/my-applications/${appId}`);
      } else {
        navigate('/my-applications');
      }
    }
  };

  // UI-only delete — no API call, track in deletedIds so reload doesn't restore it
  const handleDelete = (e, id) => {
    e.stopPropagation();
    const target = notifs.find(n => n._id === id);
    deletedIdsRef.current.add(id);
    setNotifs(prev => prev.filter(n => n._id !== id));
    if (target && !target.read) setUnread(prev => Math.max(0, prev - 1));
  };

  // Mark all read
  const handleMarkAll = async () => {
    await notificationService.markAllRead(userId);
    setUnread(0);
    setNotifs(prev => prev.map(x => ({ ...x, read: true })));
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box>
        <IconButton ref={anchorRef} onClick={() => setOpen(o => !o)} size="small"
          sx={{ p:0, background:'transparent', '&:hover':{ background:'transparent' } }}>
          <Badge badgeContent={unread} color="error" max={9}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.6rem', minWidth: 16, height: 16,
                top: 2, right: 2, border: '2px solid transparent',
              }
            }}>
            <Bell size={20} color="#ffffff"/>
          </Badge>
        </IconButton>

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end"
          style={{ zIndex:9999 }}
          modifiers={[{ name:'offset', options:{ offset:[0, 8] } }]}>
          <Paper sx={{ width:360, background: C.surface, border:`1px solid ${C.border}`,
            borderRadius:2, boxShadow:'0 16px 48px rgba(0,0,0,0.6)', overflow:'hidden' }}>

            {/* Header */}
            <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', p:2, pb:1.5 }}>
              <Typography sx={{ fontWeight:700, color: C.text, fontSize:15 }}>
                Notifications
                {unread > 0 && <span style={{ color: C.primary }}> ({unread})</span>}
              </Typography>
              {unread > 0 && (
                <Button size="small" startIcon={<CheckCheck size={14}/>} onClick={handleMarkAll}
                  sx={{ color: C.muted, textTransform:'none', fontSize:12, '&:hover':{ color: C.text } }}>
                  Mark all read
                </Button>
              )}
            </Box>

            <Divider sx={{ borderColor: C.border }}/>

            {/* List */}
            <Box sx={{ maxHeight:400, overflowY:'auto',
              '&::-webkit-scrollbar':{ width:4 },
              '&::-webkit-scrollbar-track':{ background:'transparent' },
              '&::-webkit-scrollbar-thumb':{ background: C.border, borderRadius:2 } }}>
              {notifs.length === 0 ? (
                <Box sx={{ p:4, textAlign:'center' }}>
                  <Bell size={32} color={C.border} style={{ marginBottom:8 }}/>
                  <Typography sx={{ color: C.muted, fontSize:13 }}>No notifications yet</Typography>
                </Box>
              ) : notifs.map(n => {
                const isClickable = (role === 'admin' && (n.applicationId || n.relatedId)) ||
                                    (role === 'user'  && (n.applicationId || n.relatedId));
                return (
                  <Box key={n._id} onClick={() => handleClick(n)}
                    sx={{
                      p:2, borderBottom:`1px solid ${C.border}`,
                      cursor: isClickable ? 'pointer' : (n.read ? 'default' : 'pointer'),
                      background: n.read ? C.surface : '#1e3a5f',
                      transition:'background 0.25s',
                      '&:hover':{ background: n.read ? '#263348' : '#1a3356' },
                    }}>
                    <Box sx={{ display:'flex', gap:1.5, alignItems:'flex-start' }}>

                      {/* Dot */}
                      <Box sx={{ width:8, height:8, borderRadius:'50%', mt:0.8, flexShrink:0,
                        background: n.read ? C.border : typeColor(n.type) }}/>

                      {/* Content */}
                      <Box sx={{ flex:1, minWidth:0 }}>
                        <Typography sx={{ color: n.read ? C.muted : C.text, fontSize:13, lineHeight:1.5,
                          fontWeight: n.read ? 400 : 600 }}>
                          {n.message}
                        </Typography>
                        <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mt:0.5 }}>
                          <Typography sx={{ color: C.muted, fontSize:11 }}>{timeAgo(n.createdAt)}</Typography>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                            {!n.read && (
                              <Typography sx={{ color: C.primary, fontSize:10, fontWeight:700, letterSpacing:0.5 }}>
                                UNREAD
                              </Typography>
                            )}
                            {isClickable && (
                              <Typography sx={{ color: C.success, fontSize:10, fontWeight:600 }}>
                                View →
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      {/* Delete — UI only */}
                      <Tooltip title="Dismiss">
                        <IconButton size="small" onClick={e => handleDelete(e, n._id)}
                          sx={{ color: C.muted, flexShrink:0, p:0.5,
                            '&:hover':{ color: C.danger, background:`${C.danger}22` } }}>
                          <Trash2 size={14}/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  );
}
