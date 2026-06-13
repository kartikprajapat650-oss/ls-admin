import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import { hasPermission } from '../../../lib/authHelpers';
import DashboardShell from '../../../components/DashboardShell';
import Topbar from '../../../components/Topbar';
import PermissionsClient from '../../../components/PermissionsClient';

export default async function PermissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');
  if (!hasPermission(session, 'permission-management')) redirect('/forbidden');

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Topbar email={session.user?.email || 'Admin'} />
        <PermissionsClient />
      </div>
    </DashboardShell>
  );
}
