import Sidebar from './Sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid min-h-screen grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-8">
        <Sidebar />
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
