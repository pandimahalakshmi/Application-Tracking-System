import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Briefcase, PlusCircle, Users,
  User, LogOut, ChevronRight, Menu, X,
} from "lucide-react";

const C = {
  bg:      '#0F172A',
  surface: '#1E293B',
  border:  '#334155',
  primary: '#6366F1',
  accent:  '#06B6D4',
  text:    '#F1F5F9',
  muted:   '#94A3B8',
};

const adminMenu = [
  { label: 'Dashboard',   route: '/dashboard',   icon: LayoutDashboard },
  { label: 'Jobs',        route: '/jobs',         icon: Briefcase },
  { label: 'Create Job',  route: '/jobform',      icon: PlusCircle },
  { label: 'Candidates',  route: '/candidates',   icon: Users },
];

const userMenu = [
  { label: 'Dashboard',   route: '/userdashboard', icon: LayoutDashboard },
  { label: 'View Jobs',   route: '/jobs',           icon: Briefcase },
  { label: 'My Profile',  route: '/user-profile',   icon: User },
];

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const role      = localStorage.getItem('role');
  const userName  = JSON.parse(localStorage.getItem('user') || '{}')?.name || 'User';
  const [open, setOpen] = useState(false);

  const menu = role === 'admin' ? adminMenu : userMenu;

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const Item = ({ label, route, icon: Icon }) => {
    const active = location.pathname === route;
    return (
      <div
        onClick={() => { navigate(route); setOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '11px 14px', borderRadius: 10, marginBottom: 4,
          cursor: 'pointer', transition: 'all 0.2s',
          background: active ? `linear-gradient(90deg, ${C.primary}22, ${C.primary}11)` : 'transparent',
          borderLeft: active ? `3px solid ${C.primary}` : '3px solid transparent',
          color: active ? C.text : C.muted,
        }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = `${C.surface}`; e.currentTarget.style.color = C.text; }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted; } }}
      >
        <Icon size={18} />
        <span style={{ fontSize: 14, fontWeight: active ? 600 : 400 }}>{label}</span>
        {active && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
      </div>
    );
  };

  const sidebarContent = (
    <div style={{
      width: 240, minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${C.border}`, padding: '24px 16px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, paddingLeft: 4 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.primary}, #8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Briefcase size={18} color="#fff" />
        </div>
        <span style={{ color: C.text, fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}>ATS System</span>
      </div>

      {/* Role badge */}
      <div style={{ marginBottom: 20, paddingLeft: 4 }}>
        <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
          {role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </span>
      </div>

      {/* Menu */}
      <div style={{ flex: 1 }}>
        {menu.map(item => <Item key={item.route} {...item} />)}
      </div>

      {/* User + Logout */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, paddingLeft: 4 }}>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, #8B5CF6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{userName}</div>
            <div style={{ color: C.muted, fontSize: 11, textTransform: 'capitalize' }}>{role}</div>
          </div>
        </div>
        <div
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', color: '#F87171', transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={16} />
          <span style={{ fontSize: 14 }}>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setOpen(o => !o)} style={{ display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 1100, background: C.primary, border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', '@media(maxWidth:900px)': { display: 'block' } }}>
        {open ? <X size={20} color="#fff" /> : <Menu size={20} color="#fff" />}
      </button>

      {/* Desktop */}
      <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}>
        {sidebarContent}
      </div>
    </>
  );
}
