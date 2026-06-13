'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Home Content', href: '/dashboard/home-content' },
  { label: 'About Content', href: '/dashboard/about-content' },
  { label: 'Product Content', href: '/dashboard/product-content' },
  { label: 'Users', href: '/dashboard/users' },
  { label: 'Permissions', href: '/dashboard/permissions' },
  { label: 'Login History', href: '/dashboard/login-history' },
  { label: 'Activity Logs', href: '/dashboard/activity-logs' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full max-w-[260px] border-r border-slate-800 bg-slate-950/95 p-5 text-slate-200 md:min-h-screen">
      <div className="mb-10 px-2">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Admin Dashboard</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">RBAC Control</h2>
        <p className="mt-2 text-sm text-slate-400">Manage users, permissions, content and logs from one place.</p>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? 'bg-slate-800 text-white shadow-inner shadow-slate-900'
                  : 'text-slate-200 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
