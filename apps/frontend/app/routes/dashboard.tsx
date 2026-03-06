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
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/goals', label: 'Goals', icon: '🎯' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
  { to: '/gamification', label: 'Rewards', icon: '🏆' },
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20">
              GT
            </div>
            <span className="text-xl font-bold text-gray-900">Goal Tracker</span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to ||
                (item.to !== '/dashboard' && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-blue-600" />
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
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
              >
                <span className="text-lg">🚪</span>
                Sign Out
              </button>
            </Form>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs">
            GT
          </div>
          <span className="text-lg font-bold text-gray-900">Goal Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-lg p-2 text-lg transition ${location.pathname.startsWith(item.to) ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
