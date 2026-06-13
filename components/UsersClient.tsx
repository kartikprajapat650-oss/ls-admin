"use client";

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import UserList from './UserList';
import CreateUserForm from './CreateUserForm';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

export default function UsersClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/api/users');
      setUsers(response.data.users || []);
    } catch (error) {
      catchResponse(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    setShowCreateForm(false);
    fetchUsers();
  };

  if (status === 'loading') {
    return <div className="p-8 text-center text-slate-300">Loading session...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
        >
          + Create User
        </button>
      ) : (
        <CreateUserForm onSuccess={handleUserCreated} onCancel={() => setShowCreateForm(false)} />
      )}

      <section className="rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20">
        <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
        {loading ? (
          <p className="text-slate-400">Loading users...</p>
        ) : users.length > 0 ? (
          <UserList users={users} onRefresh={fetchUsers} />
        ) : (
          <p className="text-slate-400">No users found</p>
        )}
      </section>
    </>
  );
}
