"use client";

import toast from 'react-hot-toast';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import { useState } from 'react';

interface User {
  _id: string;
  email: string;
  name: string;
  role: string;
  active: boolean;
}

interface UserListProps {
  users: User[];
  onRefresh: () => void;
}

export default function UserList({ users, onRefresh }: UserListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setDeletingId(userId);
    try {
      await axiosInstance.delete(`/api/users/${userId}`);
      toast.success('User deleted successfully!');
      onRefresh();
    } catch (error) {
      catchResponse(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await axiosInstance.put(`/api/users/${userId}`, { active: !currentStatus });
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}!`);
      onRefresh();
    } catch (error) {
      catchResponse(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-slate-200">
        <thead className="border-b border-slate-700 bg-slate-950">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Role</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3 capitalize">{user.role}</td>
              <td className="px-4 py-3">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${user.active ? 'bg-green-950 text-green-300' : 'bg-red-950 text-red-300'}`}>
                  {user.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={() => handleToggleActive(user._id, user.active)}
                  className="rounded px-2 py-1 text-xs font-semibold bg-slate-700 hover:bg-slate-600 transition"
                >
                  {user.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={deletingId === user._id}
                  className="rounded px-2 py-1 text-xs font-semibold bg-red-900 hover:bg-red-800 disabled:opacity-60 transition"
                >
                  {deletingId === user._id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
