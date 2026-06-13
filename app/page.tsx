import LoginForm from '../components/LoginForm';

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-10 rounded-4xl bg-slate-900/90 p-10 shadow-2xl shadow-slate-950/40">
          <h1 className="text-4xl font-semibold text-white">Admin Dashboard</h1>
          <p className="mt-3 max-w-xl text-slate-400">Sign in to manage users, permissions, content, and activity logs with role-based access control.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
