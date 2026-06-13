'use client';

import { signOut } from 'next-auth/react';

interface TopbarProps {
  email: string;
}

export default function Topbar({ email }: TopbarProps) {
  return (
    <header className="flex items-center justify-between rounded-3xl bg-slate-900/95 px-5 py-4 shadow-lg shadow-slate-950/20">
      <div>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h1 className="text-lg font-semibold text-white">{email}</h1>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="rounded-2xl bg-slate-800 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
      >
        Sign out
      </button>
    </header>
  );
}
