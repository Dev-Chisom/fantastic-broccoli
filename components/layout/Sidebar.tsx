'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/create-series', label: 'Create Series' },
  { href: '/content-library', label: 'Content Library' },
  { href: '/scheduled-posts', label: 'Scheduled Posts' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/social-accounts', label: 'Social Accounts' },
  { href: '/referral-credits', label: 'Referral & Credits' },
  { href: '/billing-plans', label: 'Billing & Plans' },
  { href: '/settings', label: 'Settings' }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-shrink-0 flex-col border-r border-white/5 bg-[#05060A]/90 px-4 py-5 backdrop-blur lg:flex overflow-hidden">
      <div className="flex items-center gap-2 px-2 flex-shrink-0">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400 shadow-soft" />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold tracking-tight text-slate-50 truncate">AI Series Studio</div>
          <div className="text-xs text-slate-500 truncate">Faceless content automation</div>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1 overflow-y-auto min-h-0">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-300 transition-all',
                'hover:bg-white/5 hover:text-slate-50',
                active &&
                  'gradient-border gradient-border--active bg-white/[0.02] text-slate-50'
              )}
            >
              <span className="text-sm truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 px-2 pt-8 text-xs text-slate-400 flex-shrink-0">
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-400">Credits</span>
            <span className="text-[11px] text-emerald-400 font-medium whitespace-nowrap">12,450</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400" />
          </div>
          <div className="mt-2 text-[11px] text-slate-500">You’re on Scale plan</div>
        </div>
      </div>
    </aside>
  );
}

