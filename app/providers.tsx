"use client";

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ToasterProvider } from '../components/ToasterProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ToasterProvider />
      {children}
    </SessionProvider>
  );
}
