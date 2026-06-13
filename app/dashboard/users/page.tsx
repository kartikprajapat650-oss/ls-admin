import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { hasPermission } from '../../../lib/authHelpers';
import DashboardShell from '../../../components/DashboardShell';
import Topbar from '../../../components/Topbar';
import UsersClient from '../../../components/UsersClient';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (!hasPermission(session, 'user-management')) redirect('/forbidden');

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Topbar email={session.user?.email || 'Admin'} />
        <UsersClient />
      </div>
    </DashboardShell>
  );
}
