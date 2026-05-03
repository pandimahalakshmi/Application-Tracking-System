import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, PlusCircle, Users,
  User, LogOut, ChevronRight, ClipboardList, Star, Calendar, Menu, X, Settings,
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const role       = localStorage.getItem('role');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userName   = storedUser?.name || 'User';
  const [mobileOpen, setMobileOpen] = useState(false);

  const { darkMode, themeColor } = useTheme();

  const C = {
    bg:      darkMode ? '#1E293B' : '#FFFFFF',
    surface: darkMode ? '#263348' : '#F0F4FF',
    border:  darkMode ? '#334155' : '#D1D9F0',
    primary: themeColor,
    text:    darkMode ? '#F1F5F9' : '#111827',
    muted:   darkMode ? '#94A3B8' : '#4B5563',
  };

  const adminMenu = [
    { label: 'Dashboard',          route: '/dashboard',           icon: LayoutDashboard },
    { label: 'Jobs',               route: '/jobs',                icon: Briefcase },
    { label: 'Create Job',         route: '/jobform',             icon: PlusCircle },
    { label: 'Candidates',         route: '/candidates',          icon: Users },
    { label: 'Schedule Interview', route: '/schedule-interview',  icon: Calendar },
    { label: 'Settings',           route: '/settings',            icon: Settings },
  ];

  const userMenu = [
    { label: 'Dashboard',       route: '/userdashboard',   icon: LayoutDashboard },
    { label: 'View Jobs',       route: '/jobs',            icon: Briefcase },
    { label: 'Saved Jobs',      route: '/saved-jobs',      icon: Star },
    { label: 'My Applications', route: '/my-applications', icon: ClipboardList },
    { label: 'My Profile',      route: '/user-profile',    icon: User },
    { label: 'Settings',        route: '/settings',        icon: Settings },
  ];

  const menu = role === 'admin' ? adminMenu : userMenu;
  const logout = () => { localStorage.clear(); navigate('/'); };

  const Item = ({ label, route, icon: Icon }) => {
    const active = location.pathname === route;
    return (
      <div
        onClick={() => { navigate(route); setMobileOpen(false); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 14px', borderRadius: 10, marginBottom: 4,
          cursor: 'pointer', transition: 'all 0.2s',
          background: active ? `linear-gradient(90deg,${C.primary}22,${C.primary}11)` : 'transparent',
          borderLeft: active ? `3px solid ${C.primary}` : '3px solid transparent',
          color: active ? C.text : C.muted,
          minHeight: 44,
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.text; } }}
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
      width: 240, height: '100%', background: C.bg,
      display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${C.border}`, padding: '20px 14px',
      overflowY: 'auto',
    }}>
      {/* Logo + close button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, paddingLeft: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: `linear-gradient(135deg,${C.primary},#8B5CF6)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* RecruitHub logo — person + checkmark */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="7" r="4" fill="#fff" opacity="0.9"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
              <circle cx="19" cy="5" r="4" fill="#10B981"/>
              <path d="M17 5l1.5 1.5L21 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ color: C.text, fontWeight: 700, fontSize: 17, letterSpacing: 0.3 }}>RecruitHub</span>
        </div>
        <button
          onClick={() => setMobileOpen(false)}
          className="sidebar-close-btn"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 6, borderRadius: 8, display: 'none' }}
        >
          <X size={20} />
        </button>
      </div>

      <div style={{ marginBottom: 16, paddingLeft: 4 }}>
        <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
          {role === 'admin' ? 'Admin Panel' : 'User Panel'}
        </span>
      </div>

      <div style={{ flex: 1 }}>
        {menu.map(item => <Item key={item.route} {...item} />)}
      </div>

      {/* User info + logout */}
      <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, paddingLeft: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: `linear-gradient(135deg,${C.primary},#8B5CF6)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
          }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: C.text, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName}</div>
            <div style={{ color: C.muted, fontSize: 11, textTransform: 'capitalize' }}>{role}</div>
          </div>
        </div>
        <div
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, cursor: 'pointer', color: '#F87171', transition: 'all 0.2s', minHeight: 44 }}
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
      <style>{`
        .sidebar-close-btn { display: none !important; }
        @media (max-width: 1024px) {
          .sidebar-close-btn { display: flex !important; align-items: center; justify-content: center; }
        }
        .mobile-hamburger {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 1100;
          background: linear-gradient(135deg, ${themeColor}, #8B5CF6);
          border: none;
          border-radius: 10px;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px ${themeColor}70;
          transition: transform 0.15s;
        }
        .mobile-hamburger:active { transform: scale(0.93); }
        @media (max-width: 1024px) {
          .mobile-hamburger { display: flex; }
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.65);
          z-index: 999;
          backdrop-filter: blur(3px);
          -webkit-backdrop-filter: blur(3px);
        }
        @media (max-width: 1024px) {
          .sidebar-overlay.open { display: block; }
        }
        .sidebar-desktop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
        }
        @media (max-width: 1024px) {
          .sidebar-desktop {
            transform: translateX(-100%);
            transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
            box-shadow: none;
          }
          .sidebar-desktop.open {
            transform: translateX(0);
            box-shadow: 8px 0 32px rgba(0,0,0,0.5);
          }
        }
      `}</style>

      {/* Hamburger button */}
      <button className="mobile-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
        <Menu size={20} color="#fff" />
      </button>

      {/* Overlay */}
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)} />

      {/* Sidebar */}
      <div className={`sidebar-desktop ${mobileOpen ? 'open' : ''}`}>
        {sidebarContent}
      </div>
    </>
  );
}
