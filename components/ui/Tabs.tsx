'use client';

import clsx from 'clsx';
import type { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
  children?: ReactNode;
}

export function Tabs({ tabs, activeTab, onTabChange, className, children }: TabsProps) {
  return (
    <div className={className}>
      <div className="flex gap-1 rounded-xl border border-white/5 bg-white/[0.02] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={clsx(
              'rounded-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-white/10 text-slate-50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {!children && tabs.find((t) => t.id === activeTab)?.content && (
        <div className="mt-4">{tabs.find((t) => t.id === activeTab)?.content}</div>
      )}
    </div>
  );
}
