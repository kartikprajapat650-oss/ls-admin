"use client";

import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosConfig';
import { catchResponse } from '../lib/catchResponse';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginHistoryEntry {
  _id: string;
  email: string;
  loginAt: string;
  logoutAt?: string;
  device?: string;
  browser?: string;
  status: string;
}

interface ActivityLogEntry {
  _id: string;
  email: string;
  action: string;
  target?: string;
  details?: string;
  createdAt: string;
}

type LogEntry = LoginHistoryEntry | ActivityLogEntry;

interface LoginHistoryClientProps {
  type: 'login-history' | 'activity-logs';
}

export default function LogsClient({ type }: LoginHistoryClientProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchEmail, setSearchEmail] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    if (status === 'authenticated') {
      fetchLogs();
    }
  }, [status, router, page, searchEmail]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const endpoint = type === 'login-history' ? '/api/logs/login-history' : '/api/logs/activity';
      const response = await axiosInstance.get(endpoint, {
        params: {
          page,
          limit: 10,
          email: searchEmail || undefined,
        },
      });
      setLogs(response.data.histories || response.data.activities || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      catchResponse(error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center text-slate-300">Loading session...</div>;
  }

  if (!session) {
    return null;
  }

  const title = type === 'login-history' ? 'Login History' : 'Activity Logs';
  const totalPages = Math.ceil(total / 10);

  return (
    <section className="rounded-3xl bg-slate-900/85 p-8 shadow-xl shadow-slate-950/20">
      <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>

      <div className="mb-6">
        <input
          type="email"
          placeholder="Filter by email..."
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-sky-500 focus:outline-none"
        />
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : logs.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-200">
              <thead className="border-b border-slate-700 bg-slate-950">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    {type === 'login-history' ? 'Login Time' : 'Timestamp'}
                  </th>
                  {type === 'login-history' && (
                    <>
                      <th className="px-4 py-3 text-left font-semibold">Device</th>
                      <th className="px-4 py-3 text-left font-semibold">Browser</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const timestamp = 'createdAt' in log ? log.createdAt : log.loginAt;
                  const formattedDate = new Date(timestamp).toLocaleString();
                  const isHistory = type === 'login-history';

                  return (
                    <tr key={log._id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                      <td className="px-4 py-3">{log.email}</td>
                      <td className="px-4 py-3">
                        {formattedDate !== 'Invalid Date' ? formattedDate : 'Unknown time'}
                      </td>
                      {isHistory && (
                        <>
                          <td className="px-4 py-3 text-xs">{(log as LoginHistoryEntry).device || 'N/A'}</td>
                          <td className="px-4 py-3 text-xs">{(log as LoginHistoryEntry).browser || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                (log as LoginHistoryEntry).status === 'success'
                                  ? 'bg-green-950 text-green-300'
                                  : 'bg-red-950 text-red-300'
                              }`}
                            >
                              {(log as LoginHistoryEntry).status}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-60 transition"
              >
                Previous
              </button>
              <span className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-2xl bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:opacity-60 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-slate-400">No records found</p>
      )}
    </section>
  );
}
