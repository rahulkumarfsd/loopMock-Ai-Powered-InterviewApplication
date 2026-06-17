import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import {
  LayoutDashboard,
  Brain,
  Terminal,
  BarChart3,
  Building2,
  FileCheck2,
  Users2,
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard, section: 'main' },
  { to: '/interview', label: 'AI Interview', icon: Brain,           section: 'main' },
  { to: '/coding',    label: 'Coding',       icon: Terminal,        section: 'main' },
  { to: '/analytics', label: 'Analytics',    icon: BarChart3,       section: 'practice' },
  { to: '/companies', label: 'Company Prep', icon: Building2,       section: 'practice' },
  // { to: '/resume',    label: 'Resume AI',    icon: FileCheck2,      section: 'practice', badge: 'AI' },
  { to: '/peer',      label: 'Peer Mock',    icon: Users2,          section: 'practice' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Reusable Nav item renderer block
  const renderNavLinks = (sectionType) => (
    NAV.filter((n) => n.section === sectionType).map((item) => {
      const Icon = item.icon;
      return (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border-l-2
            ${isActive 
              ? 'bg-[#6c63ff]/10 text-[#a78bfa] border-l-[#6c63ff]' 
              : 'text-[#ffffff]/60 border-l-transparent hover:bg-[#ffffff]/5 hover:text-[#ffffff]'
            }
          `}
        >
          <Icon size={16} className="shrink-0" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="text-[9px] font-bold bg-[#6c63ff] text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              {item.badge}
            </span>
          )}
        </NavLink>
      );
    })
  );

  return (
    <>
      
      <header className="md:hidden fixed top-0 inset-x-0 h-14 bg-[#111116] border-b border-[#ffffff]/10 px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#ec4899]">
            <Sparkles size={14} className="text-white" />
          </span>
          <span className="font-bold text-base tracking-tight text-white">
            Loop<span className="text-[#6c63ff]">Mock</span>
          </span>
        </div>
        <button onClick={toggleMenu} className="p-1 text-[#ffffff]/60 hover:text-white transition-colors focus:outline-none">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <aside className={`
        fixed inset-y-0 left-0 w-[240px] md:w-[220px] bg-[#111116] border-r border-[#ffffff]/10 
        flex flex-col h-screen md:sticky md:top-0 z-40 transition-transform duration-300 ease-in-out font-sans
        ${isOpen ? 'translate-x-0 pt-14' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="hidden md:flex items-center gap-2.5 p-5 border-b border-[#ffffff]/10">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#6c63ff] to-[#ec4899] shadow-[0_0_20px_rgba(108,99,255,0.3)]">
            <Sparkles size={14} className="text-white" />
          </span>
          <span className="font-bold text-lg tracking-tight text-white">
            Loop<span className="text-[#6c63ff]">Mock</span>
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {['main', 'practice'].map((section) => (
            <div key={section} className="space-y-1">
              <p className="text-[10px] font-bold tracking-widest text-[#ffffff]/30 uppercase px-3 mb-1.5 select-none">
                {section === 'main' ? 'Main Setup' : 'Practice Labs'}
              </p>
              {renderNavLinks(section)}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-[#ffffff]/10 bg-[#0d0d0f]/40">
          <div className="flex items-center gap-3 bg-[#ffffff]/5 rounded-xl p-3 border border-[#ffffff]/5 group">
            <div className="w-8 h-8 rounded-lg shrink-0 bg-gradient-to-br from-[#6c63ff] to-[#ec4899] flex items-center justify-center text-xs font-bold text-white shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate leading-tight">
                {user?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-[#ffffff]/40 truncate mt-0.5 font-mono">
                {user?.email || 'dev@loopmock.app'}
              </p>
            </div>

            <button 
              onClick={handleLogout} 
              title="Sign out session"
              className="text-[#ffffff]/40 hover:text-danger-400 p-1 rounded-lg hover:bg-white/5 shrink-0 transition-colors duration-150 focus:outline-none"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30 animate-fade-in"
        />
      )}
    </>
  );
}