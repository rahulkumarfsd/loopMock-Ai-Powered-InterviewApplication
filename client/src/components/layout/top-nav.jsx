import { useLocation, Link } from 'react-router-dom';
import { useTheme } from 'next-themes';
import { useSidebar } from './sidebar-context';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Menu, Search, Sun, Moon, Monitor } from 'lucide-react';

const ROUTE_LABELS = {
  dashboard: 'Dashboard',
  interview: 'AI Interview',
  coding: 'Coding',
  analytics: 'Analytics',
  companies: 'Company Prep',
  peer: 'Peer Mock',
  feedback: 'Interview Review',
  resume: 'Resume AI',
};

export default function TopNav({ onCommandOpen }) {
  const location = useLocation();
  const { toggleMobile } = useSidebar();
  const { theme, setTheme } = useTheme();

  // Build breadcrumb from path
  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbItems = segments.map((seg, i) => ({
    label: ROUTE_LABELS[seg] || seg,
    path: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-md px-4">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={toggleMobile}>
        <Menu size={18} />
      </Button>

      <Separator orientation="vertical" className="h-5 md:hidden" />

      {/* Breadcrumbs */}
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">LoopMock</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbItems.map((item) => (
            <span key={item.path} className="contents">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Mobile title */}
      <span className="sm:hidden text-sm font-semibold text-foreground truncate">
        {breadcrumbItems[breadcrumbItems.length - 1]?.label || 'Dashboard'}
      </span>

      <div className="flex-1" />

      {/* Search trigger */}
      <Button
        variant="outline"
        size="sm"
        className="hidden sm:flex gap-2 text-muted-foreground font-normal h-8 w-[200px] lg:w-[260px] justify-start"
        onClick={onCommandOpen}
      >
        <Search size={14} />
        <span>Search...</span>
        <kbd className="ml-auto pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Mobile search */}
      <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8" onClick={onCommandOpen}>
        <Search size={18} />
      </Button>

      {/* Theme switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Sun size={16} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon size={16} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            <Sun size={14} /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            <Moon size={14} /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            <Monitor size={14} /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
