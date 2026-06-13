import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../lib/auth';
import DashboardShell from '../../components/DashboardShell';
import Topbar from '../../components/Topbar';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/');
  }

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Topbar email={session.user?.email || 'Admin'} />

        <section className="grid gap-6 rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">Dashboard Overview</h2>
            <p className="mt-3 text-slate-400">
              This is your admin control panel. Use the sidebar to manage users, permissions, activity logs, and content sections.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Users</p>
              <p className="mt-3 text-3xl font-semibold text-white">128</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Permissions</p>
              <p className="mt-3 text-3xl font-semibold text-white">24</p>
            </div>
            <div className="rounded-3xl bg-slate-950/80 p-4 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Activity</p>
              <p className="mt-3 text-3xl font-semibold text-white">52</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-3 text-slate-300">
              <li>- Manage users</li>
              <li>- Update permissions</li>
              <li>- Review activity logs</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20">
            <h3 className="text-lg font-semibold text-white">Latest Status</h3>
            <p className="mt-4 text-slate-300">All systems are running normally. No pending alerts.</p>
          </div>
          <div className="rounded-3xl bg-slate-900/85 p-6 shadow-xl shadow-slate-950/20">
            <h3 className="text-lg font-semibold text-white">Need help?</h3>
            <p className="mt-4 text-slate-300">Use the sidebar options to navigate to the section you want to update.</p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
