import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../lib/auth';
import DashboardShell from '../../../components/DashboardShell';
import Topbar from '../../../components/Topbar';
import ContentEditorClient from '../../../components/ContentEditorClient';

export default async function ProductContentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/');

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Topbar email={session.user?.email || 'Admin'} />
        <ContentEditorClient slug="product-content" title="Product Content" />
      </div>
    </DashboardShell>
  );
}
