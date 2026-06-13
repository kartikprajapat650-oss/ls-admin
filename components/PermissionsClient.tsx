"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Permission {
  _id: string;
  key: string;
  name: string;
  description: string;
  active: boolean;
}

interface User {
  _id: string;
  email: string;
  name: string;
  permissions: string[];
}

export default function PermissionsClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchData();
    }
  }, [status, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [permsRes, usersRes] = await Promise.all([axiosInstance.get('/api/permissions'), axiosInstance.get('/api/users')]);

      setPermissions(permsRes.data.permissions || []);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      catchResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (userId: string, permissionKey: string, hasPermission: boolean) => {
    try {
      if (hasPermission) {
        await axiosInstance.post('/api/permissions/remove', { userId, permissionKey });
      } else {
        await axiosInstance.post('/api/permissions/assign', { userId, permissionKey });
      }
      toast.success(`Permission ${hasPermission ? 'removed' : 'assigned'}!`);
      fetchData();
    } catch (error) {
      catchResponse(error);
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center text-slate-300">Loading session...</div>;
  }

  if (!session) {
    return null;
  }

  const selectedUser = users.find((u) => u._id === selectedUserId);

  return (
    <section className="rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20">
      <h2 className="text-2xl font-semibold text-white mb-6">Permission Management</h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-slate-300 mb-2">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
            >
              <option value="">-- Select a user --</option>
              {users
                .filter((u) => u._id !== 'admin-id')
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.email} ({user.name})
                  </option>
                ))}
            </select>
          </div>

          {selectedUser && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Permissions for {selectedUser.email}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissions.map((permission) => {
                  const hasPermission = selectedUser.permissions.includes(permission.key);
                  return (
                    <div key={permission._id} className="rounded-2xl border border-slate-700 bg-slate-950 p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-200">{permission.name}</p>
                        <p className="text-xs text-slate-400">{permission.description}</p>
                      </div>
                      <button
                        onClick={() => handleTogglePermission(selectedUser._id, permission.key, hasPermission)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                          hasPermission
                            ? 'bg-red-900 text-red-300 hover:bg-red-800'
                            : 'bg-green-900 text-green-300 hover:bg-green-800'
                        }`}
                      >
                        {hasPermission ? 'Remove' : 'Assign'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
