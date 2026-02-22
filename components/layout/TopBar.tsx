'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import Dropdown, { type DropdownOption } from '@/components/ui/Dropdown';

export default function TopBar() {
  const pathname = usePathname();
  const { user, workspace, logout } = useAuth();
  const isCreateSeries = pathname.startsWith('/create-series');

  const userMenuOptions: DropdownOption[] = [
    { label: 'Profile', value: 'profile', icon: <span>👤</span> },
    { label: 'Settings', value: 'settings', icon: <span>⚙️</span> },
    { label: 'Billing', value: 'billing', icon: <span>💳</span> },
    { divider: true },
    { label: 'Logout', value: 'logout', icon: <span>🚪</span> },
  ];

  const handleUserMenuSelect = (value: string) => {
    if (value === 'logout') {
      logout();
    } else if (value === 'profile') {
      window.location.href = '/settings/profile';
    } else if (value === 'settings') {
      window.location.href = '/settings';
    } else if (value === 'billing') {
      window.location.href = '/settings/billing';
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#05060A]/70 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            AI Content Automation
          </span>
          <span className="text-sm text-slate-300">
            {isCreateSeries
              ? 'Create a fully automated short-form series'
              : 'Scale faceless video series on autopilot'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {workspace && (
            <div className="hidden items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span>{workspace.creditsBalance.toLocaleString()} credits</span>
            </div>
          )}
          <Link href="/create-series" className="hidden sm:inline-flex">
            <Button size="sm">Create series</Button>
          </Link>
          {user && (
            <Dropdown
              options={userMenuOptions}
              onSelect={handleUserMenuSelect}
              trigger={
                <button className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary" />
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
              }
            />
          )}
        </div>
      </div>
    </header>
  );
}

