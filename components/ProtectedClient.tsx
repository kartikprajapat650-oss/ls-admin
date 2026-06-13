"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedClientProps {
  children: React.ReactNode;
}

export default function ProtectedClient({ children }: ProtectedClientProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="p-8 text-center text-slate-300">Loading session...</div>;
  }

  return <>{children}</>;
}
