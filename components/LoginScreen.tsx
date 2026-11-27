import React from 'react';

interface LoginScreenProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

const features = [
  { label: 'Inventory', detail: 'Stock and expiry dates', accent: 'bg-blue-500' },
  { label: 'Operations', detail: 'Sales and checkout', accent: 'bg-emerald-500' },
  { label: 'Control', detail: 'Roles and audit trail', accent: 'bg-violet-500' },
];

export const LoginScreen = ({ onSubmit }: LoginScreenProps) => (
  <main className="relative min-h-screen overflow-hidden bg-[#07090d] text-white">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute -bottom-52 -right-24 h-[32rem] w-[32rem] rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>

    <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 lg:px-10">
      <section className="grid w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/40 backdrop-blur-xl lg:grid-cols-[1.15fr_.85fr]">
        <div className="flex flex-col justify-between gap-14 border-b border-white/10 p-8 sm:p-12 lg:border-b-0 lg:border-r lg:p-14">
          <div>
            <div className="mb-12 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/25">
                <span className="text-xl font-black italic">P+</span>
              </div>
              <div>
                <p className="text-xl font-black tracking-tight">PharmaPro</p>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-300/70">Pharmacy management</p>
              </div>
            </div>

            <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300">
              Clear operations. Inventory under control.
            </span>
            <h1 className="mt-6 max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl">
              A complete view of your pharmacy.
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
              Monitor stock, expiry dates, sales, and team activity from one workspace designed for fast operations.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className={`mb-3 h-1.5 w-8 rounded-full ${feature.accent}`} />
                <p className="text-sm font-bold">{feature.label}</p>
                <p className="mt-1 text-xs text-slate-500">{feature.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center p-8 sm:p-12 lg:p-14">
          <div className="w-full">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Secure access</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Welcome</h2>
            <p className="mt-2 text-sm text-slate-500">Sign in with the credentials assigned to your role.</p>

            <form onSubmit={onSubmit} className="mt-9 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Username</span>
                <input
                  name="user"
                  autoComplete="username"
                  required
                  placeholder="Ej. admin"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-700 hover:border-white/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</span>
                <input
                  type="password"
                  name="pass"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-sm text-white outline-none transition placeholder:text-slate-700 hover:border-white/20 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </label>
              <button className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:translate-y-0">
                Sign in
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,.75)]" />
              Access restricted to authorized personnel
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
);
