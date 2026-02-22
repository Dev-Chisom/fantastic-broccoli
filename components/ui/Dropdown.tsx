'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import type { ReactNode, HTMLAttributes } from 'react';

type DropdownActionOption = {
  label: string;
  value: string;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: false;
};

type DropdownDividerOption = {
  divider: true;
};

export type DropdownOption = DropdownActionOption | DropdownDividerOption;

interface DropdownProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  trigger: ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export default function Dropdown({
  options,
  onSelect,
  trigger,
  align = 'right',
  className,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (value: string, disabled?: boolean) => {
    if (disabled) return;
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)} {...props}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 min-w-[200px] rounded-lg border border-white/10 bg-surface shadow-xl',
            'animate-in fade-in-0 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1">
            {options.map((option, index) => {
              if (option.divider) {
                return <div key={`divider-${index}`} className="my-1 border-t border-white/5" />;
              }

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value, option.disabled)}
                  disabled={option.disabled}
                  className={clsx(
                    'flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 transition-colors',
                    'hover:bg-white/5 hover:text-slate-50',
                    'focus:bg-white/5 focus:text-slate-50 focus:outline-none',
                    option.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                  <span className="flex-1 text-left">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
