export default function ForbiddenPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100 px-6 py-10">
      <div className="max-w-xl rounded-3xl border border-slate-800 bg-slate-900/90 p-10 text-center shadow-xl shadow-slate-950/40">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">403</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Access forbidden</h1>
        <p className="mt-4 text-slate-400">You do not have permission to view this page.</p>
      </div>
    </main>
  );
}
