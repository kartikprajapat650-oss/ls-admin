import { Session } from 'next-auth';

export function hasPermission(session: Session | null, permission: string) {
  if (!session) return false;
  const user = session.user as any;
  if (user?.role === 'super-admin') return true;
  return Array.isArray(user?.permissions) && user.permissions.includes(permission);
}
