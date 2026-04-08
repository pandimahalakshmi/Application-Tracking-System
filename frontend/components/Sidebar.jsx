import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Briefcase, PlusCircle, Users,
  User, LogOut, ChevronRight, ClipboardList, Star, Calendar, Menu, X,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

const C = {
  bg:'#0F172A', surface:'#1E293B', border:'#334155',
  primary:'#6366F1', text:'#F1F5F9', muted:'#94A3B8',
};

const adminMenu = [
  { label:'Dashboard',          route:'/dashboard',           icon:LayoutDashboard },
  { label:'Jobs',               route:'/jobs',                icon:Briefcase },
  { label:'Create Job',         route:'/jobform',             icon:PlusCircle },
  { label:'Candidates',         route:'/candidates',          icon:Users },
  { label:'Schedule Interview', route:'/schedule-interview',  icon:Calendar },
];

const userMenu = [
  { label:'Dashboard',       route:'/userdashboard',   icon:LayoutDashboard },
  { label:'View Jobs',       route:'/jobs',            icon:Briefcase },
  { label:'Saved Jobs',      route:'/saved-jobs',      icon:Star },
  { label:'My Applications', route:'/my-applications', icon:ClipboardList },
  { label:'My Profile',      route:'/user-profile',    icon:User },
];

export default function Sidebar() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const role        = localStorage.getItem('role');
  const storedUser  = JSON.parse(localStorage.getItem('user') || '{}');
  const userName    = storedUser?.name || 'User';
  const [mobileOpen, setMobileOpen] = useState(false);

  const menu = role === 'admin' ? adminMenu : userMenu;

  const logout = () => { localStorage.clear(); navigate('/'); };

  const Item = ({ label, route, icon: Icon }) => {
    const active = location.pathname === route;
    return (
      <div onClick={() => { navigate(route); setMobileOpen(false); }}
        style={{
          display:'flex', alignItems:'center', gap:12,
          padding:'11px 14px', borderRadius:10, marginBottom:4,
          cursor:'pointer', transition:'all 0.2s',
          background: active ? `linear-gradient(90deg,${C.primary}22,${C.primary}11)` : 'transparent',
          borderLeft: active ? `3px solid ${C.primary}` : '3px solid transparent',
          color: active ? C.text : C.muted,
        }}
        onMouseEnter={e => { if (!active) { e.currentTarget.style.background=C.surface; e.currentTarget.style.color=C.text; } }}
        onMouseLeave={e => { if (!active) { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.muted; } }}>
        <Icon size={18}/>
        <span style={{ fontSize:14, fontWeight: active?600:400 }}>{label}</span>
        {active && <ChevronRight size={14} style={{ marginLeft:'auto' }}/>}
      </div>
    );
  };

  const sidebarContent = (
    <div style={{
      width:240, height:'100%', background:C.bg,
      display:'flex', flexDirection:'column',
      borderRight:`1px solid ${C.border}`, padding:'24px 16px',
      overflowY:'auto',
    }}>
      {/* Logo + close on mobile */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32, paddingLeft:4 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:`linear-gradient(135deg,${C.primary},#8B5CF6)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Briefcase size={18} color="#fff"/>
          </div>
          <span style={{ color:C.text, fontWeight:700, fontSize:18, letterSpacing:0.5 }}>ATS System</span>
        </div>
        {/* Close button — mobile only */}
        <button onClick={() => setMobileOpen(false)}
          style={{ display:'none', background:'none', border:'none', cursor:'pointer', color:C.muted, padding:4 }}
          className="sidebar-close-btn">
          <X size={20}/>
        </button>
      </div>

      <div style={{ marginBottom:20, paddingLeft:4 }}>
        <span style={{ fontSize:11, color:C.muted, textTransform:'uppercase', letterSpacing:1 }}>
          {role==='admin' ? 'Admin Panel' : 'User Panel'}
        </span>
      </div>

      <div style={{ flex:1 }}>
        {menu.map(item => <Item key={item.route} {...item}/>)}
      </div>

      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, marginTop:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, paddingLeft:4 }}>
          <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${C.primary},#8B5CF6)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:14, flexShrink:0 }}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ color:C.text, fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{userName}</div>
            <div style={{ color:C.muted, fontSize:11, textTransform:'capitalize' }}>{role}</div>
          </div>
          <NotificationBell userId={storedUser?.id || storedUser?._id}/>
        </div>
        <div onClick={logout}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderRadius:10, cursor:'pointer', color:'#F87171', transition:'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(248,113,113,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <LogOut size={16}/>
          <span style={{ fontSize:14 }}>Logout</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .sidebar-close-btn { display: none !important; }
        @media (max-width: 1024px) {
          .sidebar-close-btn { display: flex !important; }
        }
        .mobile-hamburger {
          display: none;
          position: fixed;
          top: 12px;
          left: 12px;
          z-index: 1100;
          background: linear-gradient(135deg, #6366F1, #8B5CF6);
          border: none;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(99,102,241,0.4);
        }
        @media (max-width: 1024px) {
          .mobile-hamburger { display: flex; }
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 999;
          backdrop-filter: blur(2px);
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
            transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
          }
          .sidebar-desktop.open {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Hamburger button */}
      <button className="mobile-hamburger" onClick={() => setMobileOpen(true)}>
        <Menu size={20} color="#fff"/>
      </button>

      {/* Overlay */}
      <div className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} onClick={() => setMobileOpen(false)}/>

      {/* Sidebar */}
      <div className={`sidebar-desktop ${mobileOpen ? 'open' : ''}`}>
        {sidebarContent}
      </div>
    </>
  );
}
