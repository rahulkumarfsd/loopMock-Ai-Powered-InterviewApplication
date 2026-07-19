import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import AppSidebar from '@/components/layout/app-sidebar';
import TopNav from '@/components/layout/top-nav';
import CommandPalette from '@/components/layout/command-palette';

function LayoutInner() {
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex min-h-screen min-h-[100dvh] bg-background overflow-x-hidden">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        <TopNav onCommandOpen={() => setCommandOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}

export default function Layout() {
  return (
    <SidebarProvider>
      <LayoutInner />
    </SidebarProvider>
  );
}
