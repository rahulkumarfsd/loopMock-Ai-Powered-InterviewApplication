import { useNavigate } from 'react-router-dom';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@/components/ui/command';
import {
  LayoutDashboard, Brain, Terminal, BarChart3, Building2,
  Users2, Play, Plus, Settings,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'AI Interview', icon: Brain, path: '/interview' },
  { label: 'Coding', icon: Terminal, path: '/coding' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { label: 'Company Prep', icon: Building2, path: '/companies' },
  { label: 'Peer Mock', icon: Users2, path: '/peer' },
];

const ACTIONS = [
  { label: 'Start DSA Interview', icon: Play, path: '/interview' },
  { label: 'Start System Design', icon: Plus, path: '/interview' },
  { label: 'Start Coding Challenge', icon: Terminal, path: '/coding' },
];

export default function CommandPalette({ open, onOpenChange }) {
  const navigate = useNavigate();

  const runAction = (path) => {
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {NAV_ITEMS.map((item) => (
            <CommandItem key={item.path} onSelect={() => runAction(item.path)}>
              <item.icon size={16} />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {ACTIONS.map((item) => (
            <CommandItem key={item.label} onSelect={() => runAction(item.path)}>
              <item.icon size={16} />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
