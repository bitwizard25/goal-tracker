import { Outlet, Link, useLocation, Form } from '@remix-run/react';
import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ request }) => {
  const { getUserId } = await import('../services/auth.server');
  const userId = await getUserId(request);
  if (!userId) {
    const { redirect } = await import('@remix-run/node');
    return redirect('/auth/login');
  }
  return { userId };
};

const navItems = [
  { to: '/dashboard',      label: 'Dashboard', icon: '📊' },
  { to: '/goals',          label: 'Goals',     icon: '🎯' },
  { to: '/analytics',      label: 'Analytics', icon: '📈' },
  { to: '/gamification',   label: 'Rewards',   icon: '🏆' },
];

export default function DashboardLayout() {
  const location = useLocation();

  const isActive = (to: string) =>
    to === '/dashboard'
      ? location.pathname === to
      : location.pathname.startsWith(to);

  return (
    <div className="flex min-h-screen bg-gray-50/30">

      {/* ── Desktop Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-100 bg-white lg:flex flex-col shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20">
            GT
          </div>
          <span className="text-xl font-bold text-gray-900">Goal Tracker</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400">Navigation</p>
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {/* Left accent bar */}
                <span className={`absolute left-0 h-8 w-1 rounded-r-full bg-blue-600 transition-all duration-200 ${
                  active ? 'opacity-100' : 'opacity-0'
                }`} style={{ position: 'relative', width: '3px', height: '20px', borderRadius: '2px', background: active ? '#2563EB' : 'transparent', flexShrink: 0 }} />
                <span className="text-lg w-6 text-center">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {active && (
                  <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
            >
              <span className="text-lg w-6 text-center">🚪</span>
              Sign Out
            </button>
          </Form>
        </div>
      </aside>

      {/* ── Mobile Top Bar (logo only) ── */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center border-b border-gray-100 bg-white/90 backdrop-blur-md px-5 py-4 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs shadow">
            GT
          </div>
          <span className="text-lg font-bold text-gray-900">Goal Tracker</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-[57px] lg:pt-0">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${
                  active ? 'text-blue-600' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-blue-600" style={{ position: 'absolute', top: 0 }} />
                )}
                <span className="text-xl">{item.icon}</span>
                <span className={`text-xs font-semibold ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
