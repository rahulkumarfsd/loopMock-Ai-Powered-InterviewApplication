import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const NAV = [
  { to: '/dashboard', label: 'Dashboard',    emoji: '🏠', section: 'main'     },
  { to: '/interview', label: 'AI Interview', emoji: '🧠', section: 'main'     },
  { to: '/coding',    label: 'Coding',       emoji: '💻', section: 'main'     },
  { to: '/analytics', label: 'Analytics',    emoji: '📊', section: 'practice' },
  { to: '/companies', label: 'Company Prep', emoji: '🏢', section: 'practice' },
  { to: '/resume',    label: 'Resume AI',    emoji: '📄', section: 'practice', badge: 'AI' },
  { to: '/peer',      label: 'Peer Mock',    emoji: '👥', section: 'practice' },
];

export default function Sidebar() {
  const navigate       = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: '#111116',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      fontFamily: "'Inter', Arial, sans-serif",
    }}>

      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: '-0.4px', color: '#fff' }}>
          Inter<span style={{ color: '#6c63ff' }}>AI</span>
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
        {['main', 'practice'].map((section) => (
          <div key={section} style={{ marginBottom: 8 }}>
            <p style={{
              fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)',
              padding: '6px 10px 4px', margin: 0,
            }}>
              {section === 'main' ? 'Main' : 'Practice'}
            </p>
            {NAV.filter((n) => n.section === section).map((item) => (
              <NavLink key={item.to} to={item.to}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 10px', borderRadius: 8, marginBottom: 2,
                  textDecoration: 'none', fontSize: 14, fontWeight: 500,
                  transition: 'all 0.15s',
                  background:   isActive ? 'rgba(108,99,255,0.15)' : 'transparent',
                  color:        isActive ? '#a78bfa' : 'rgba(255,255,255,0.6)',
                  borderLeft:   isActive ? '2px solid #6c63ff' : '2px solid transparent',
                })}>
                <span style={{ fontSize: 16 }}>{item.emoji}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, background: '#6c63ff',
                    color: '#fff', padding: '2px 6px', borderRadius: 20,
                  }}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(255,255,255,0.04)', borderRadius: 10,
          padding: '10px 12px', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Avatar */}
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: 'linear-gradient(135deg, #6c63ff, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email || ''}
            </p>
          </div>

          {/* Logout */}
          <button onClick={handleLogout} title="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16, padding: 4, flexShrink: 0, lineHeight: 1, transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}>
            ⏻
          </button>
        </div>
      </div>
    </aside>
  );
}