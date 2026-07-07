import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '@/store/authStore';
import { useSidebar } from './sidebar-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  LayoutDashboard, Brain, Terminal, BarChart3, Building2,
  Users2, LogOut, PanelLeftClose, PanelLeft, Sparkles,
  Settings, User, ChevronsUpDown,
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', label: 'Dashboard',   icon: LayoutDashboard, section: 'main' },
  { to: '/interview', label: 'AI Interview', icon: Brain,           section: 'main' },
  { to: '/coding',    label: 'Coding',       icon: Terminal,        section: 'main' },
  { to: '/analytics', label: 'Analytics',    icon: BarChart3,       section: 'practice' },
  { to: '/companies', label: 'Company Prep', icon: Building2,       section: 'practice' },
  { to: '/peer',      label: 'Peer Mock',    icon: Users2,          section: 'practice' },
];

const SECTIONS = { main: 'Main', practice: 'Practice' };

function NavItems({ collapsed, onNavigate }) {
  return Object.entries(SECTIONS).map(([key, label]) => (
    <div key={key} className="mb-2">
      {!collapsed && (
        <p className="text-[10px] font-semibold tracking-widest text-muted-foreground/60 uppercase px-3 mb-1.5 select-none">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {NAV.filter((n) => n.section === key).map((item) => {
          const Icon = item.icon;
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 group relative',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Icon size={18} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.to}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }
          return link;
        })}
      </div>
    </div>
  ));
}

function UserSection({ collapsed }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const initials = user?.name?.[0]?.toUpperCase() || 'U';

  const trigger = (
    <Button variant="ghost" className={cn(
      "w-full justify-start gap-3 h-auto py-2.5",
      collapsed && "justify-center px-2"
    )}>
      <Avatar className="h-7 w-7">
        <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white text-xs font-bold">
          {initials}
        </AvatarFallback>
      </Avatar>
      {!collapsed && (
        <div className="flex-1 text-left min-w-0">
          <p className="text-xs font-semibold text-foreground truncate leading-tight">
            {user?.name || 'User'}
          </p>
          <p className="text-[10px] text-muted-foreground truncate mt-0.5">
            {user?.email || 'user@loopmock.app'}
          </p>
        </div>
      )}
      {!collapsed && <ChevronsUpDown size={14} className="text-muted-foreground shrink-0" />}
    </Button>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent side={collapsed ? "right" : "top"} align="start" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'user@loopmock.app'}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/dashboard')}>
          <User size={14} /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/analytics')}>
          <Settings size={14} /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
          <LogOut size={14} /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  const { toggle } = useSidebar();

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className={cn("flex items-center h-14 shrink-0 border-b border-sidebar-border", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary to-purple-500 shadow-lg shadow-primary/20">
            <Sparkles size={14} className="text-white" />
          </span>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-base tracking-tight text-foreground overflow-hidden whitespace-nowrap"
            >
              Loop<span className="text-primary">Mock</span>
            </motion.span>
          )}
        </div>
        {!collapsed && (
          <Button variant="ghost" size="icon" className="h-7 w-7 hidden md:flex" onClick={toggle}>
            <PanelLeftClose size={16} />
          </Button>
        )}
      </div>

      {/* Collapsed toggle button */}
      {collapsed && (
        <div className="flex justify-center py-2 border-b border-sidebar-border">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggle}>
            <PanelLeft size={16} />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 py-3 px-2">
        <NavItems collapsed={collapsed} onNavigate={onNavigate} />
      </ScrollArea>

      {/* User */}
      <div className="p-2 border-t border-sidebar-border">
        <UserSection collapsed={collapsed} />
      </div>
    </div>
  );
}

export default function AppSidebar() {
  const { collapsed, mobileOpen, closeMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        className="hidden md:flex shrink-0 sticky top-0 h-screen z-30"
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <SidebarContent collapsed={collapsed} />
      </motion.aside>

      {/* Mobile sidebar (sheet) */}
      <Sheet open={mobileOpen} onOpenChange={closeMobile}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <VisuallyHidden.Root>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden.Root>
          <SidebarContent collapsed={false} onNavigate={closeMobile} />
        </SheetContent>
      </Sheet>
    </>
  );
}
