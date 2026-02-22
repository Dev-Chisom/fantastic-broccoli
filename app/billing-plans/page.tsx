'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';

const PLANS = [
  { name: 'Starter', credits: '5,000/mo', price: '$29', current: false },
  { name: 'Pro', credits: '15,000/mo', price: '$79', current: true },
  { name: 'Scale', credits: '50,000/mo', price: '$199', current: false },
];

export default function BillingPlansPage() {
  return (
    <ProtectedRoute>
      <AppShell>
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Billing & plans
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your subscription and billing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            selected={plan.current}
            className="flex flex-col"
          >
            <h3 className="text-sm font-medium text-slate-50">{plan.name}</h3>
            <p className="mt-2 text-2xl font-semibold text-slate-50">{plan.price}</p>
            <p className="text-xs text-slate-400">/month</p>
            <p className="mt-2 text-xs text-slate-400">{plan.credits} credits</p>
            <div className="mt-4 flex-1" />
            <Button
              variant={plan.current ? 'secondary' : 'primary'}
              size="sm"
              className="w-full"
              disabled={plan.current}
            >
              {plan.current ? 'Current plan' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
      </AppShell>
    </ProtectedRoute>
  );
}
