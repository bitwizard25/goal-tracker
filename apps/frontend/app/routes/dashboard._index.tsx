import { useLoaderData, Link } from '@remix-run/react';
import type { LoaderFunction, MetaFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Dashboard - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { User } = await import('../models/User');

  await connectDB();
  const userId = await requireUserId(request);
  const user: any = await User.findById(userId).select('-password_hash').lean();

  if (!user) {
    throw new Response('Not Found', { status: 404 });
  }

  return {
    user: {
      email: user.email,
      total_points: user.total_points,
      current_level: user.current_level,
      streak_count: user.streak_count,
    },
    stats: {
      tasks_today: 0,
      tasks_completed_today: 0,
      mood_average: 7,
      energy_average: 6,
    },
    recentTasks: [],
  };
};

export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();
  const { user, stats } = data;
  const [greeting, setGreeting] = useState('Welcome');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{greeting} 👋</h1>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-4 py-2">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-semibold text-amber-700">{user.streak_count} day streak</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 px-4 py-2">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-semibold text-blue-700">Level {user.current_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg shadow-lg shadow-blue-500/20">
                ⭐
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Points</p>
                <p className="text-2xl font-bold text-gray-900">{user.total_points.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-lg shadow-lg shadow-emerald-500/20">
                🏅
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Level</p>
                <p className="text-2xl font-bold text-gray-900">{user.current_level}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-lg shadow-lg shadow-orange-500/20">
                🔥
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</p>
                <p className="text-2xl font-bold text-gray-900">{user.streak_count}<span className="text-sm font-normal text-gray-400 ml-1">days</span></p>
              </div>
            </div>
          </div>

          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-lg shadow-lg shadow-purple-500/20">
                ✅
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasks_completed_today}<span className="text-sm font-normal text-gray-400">/{stats.tasks_today}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Energy & Mood Section */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white text-lg">⚡</div>
                <h2 className="text-lg font-bold text-gray-900">Energy Level</h2>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">{stats.energy_average}/10</span>
            </div>
            <div className="mt-5">
              <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 transition-all duration-1000"
                  style={{ width: `${(stats.energy_average / 10) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 text-white text-lg">😊</div>
                <h2 className="text-lg font-bold text-gray-900">Mood</h2>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 to-green-600 bg-clip-text text-transparent">{stats.mood_average}/10</span>
            </div>
            <div className="mt-5">
              <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all duration-1000"
                  style={{ width: `${(stats.mood_average / 10) * 100}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Today&apos;s Tasks</h2>
            <Link to="/tasks/new" className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition">
              <span>+</span> Add Task
            </Link>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
            <div className="text-4xl">📋</div>
            <h3 className="mt-3 text-lg font-semibold text-gray-900">No tasks for today</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first task to get started!</p>
            <Link
              to="/goals/short-term/new"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105 transition-all duration-200"
            >
              Create a Goal
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              to="/goals/long-term/new"
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl shadow-lg shadow-blue-500/20">
                🎯
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">Long-term Goal</h3>
                <p className="text-xs text-gray-500">Build your vision</p>
              </div>
            </Link>

            <Link
              to="/goals/short-term/new"
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-xl shadow-lg shadow-emerald-500/20">
                📅
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition">Short-term Goal</h3>
                <p className="text-xs text-gray-500">Set milestones</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="group flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-xl shadow-lg shadow-purple-500/20">
                📊
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition">Analytics</h3>
                <p className="text-xs text-gray-500">Track progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
