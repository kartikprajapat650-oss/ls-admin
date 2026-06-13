"use client";

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#e2e8f0',
          border: '1px solid #334155',
          borderRadius: '0.75rem',
        },
        success: {
          style: {
            background: '#166534',
            color: '#dcfce7',
          },
          iconTheme: {
            primary: '#22c55e',
            secondary: '#166534',
          },
        },
        error: {
          style: {
            background: '#7f1d1d',
            color: '#fee2e2',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#7f1d1d',
          },
        },
      }}
    />
  );
}
