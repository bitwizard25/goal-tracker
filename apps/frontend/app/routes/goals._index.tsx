import { useLoaderData, Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Goals - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal, ShortTermGoal } = await import('../models/Goals');

  await connectDB();
  const userId = await requireUserId(request);

  const [longTermGoals, shortTermGoals] = await Promise.all([
    LongTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ShortTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
  ]);

  return json({
    longTermGoals: longTermGoals.map((g: any) => ({
      _id: g._id.toString(),
      title: g.title,
      status: g.status,
      category: g.category,
      priority: g.priority,
      current_progress_percentage: g.current_progress_percentage ?? 0,
      target_date: g.target_date ? new Date(g.target_date).toISOString() : null,
    })),
    shortTermGoals: shortTermGoals.map((g: any) => ({
      _id: g._id.toString(),
      title: g.title,
      status: g.status,
      milestones: (g.milestones ?? []).map((m: any) => ({
        id: m.id ?? m._id?.toString() ?? String(Math.random()),
        title: m.title,
        completed: !!m.completed,
      })),
      end_date: g.end_date ? new Date(g.end_date).toISOString() : null,
    })),
  });
};

const categoryConfig: Record<string, { color: string; bg: string; icon: string }> = {
  health:        { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '💪' },
  career:        { color: 'text-blue-700',    bg: 'bg-blue-100',    icon: '💼' },
  personal:      { color: 'text-purple-700',  bg: 'bg-purple-100',  icon: '🌱' },
  education:     { color: 'text-amber-700',   bg: 'bg-amber-100',   icon: '📚' },
  finance:       { color: 'text-green-700',   bg: 'bg-green-100',   icon: '💰' },
  relationships: { color: 'text-rose-700',    bg: 'bg-rose-100',    icon: '❤️' },
};

const priorityConfig: Record<string, { dot: string; text: string; label: string }> = {
  high:   { dot: 'bg-red-500',   text: 'text-red-700',   label: 'High'   },
  medium: { dot: 'bg-amber-400', text: 'text-amber-700', label: 'Medium' },
  low:    { dot: 'bg-gray-400',  text: 'text-gray-600',  label: 'Low'    },
};

function getDaysUntil(dateStr: string | null): { label: string; urgent: boolean } | null {
  if (!dateStr) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return { label: 'Overdue',       urgent: true  };
  if (diff === 0) return { label: 'Due today',      urgent: true  };
  if (diff <= 7)  return { label: `${diff}d left`,  urgent: true  };
  return           { label: `${diff}d left`,         urgent: false };
}

function EmptyState({
  icon, title, description, ctaLabel, ctaTo, gradient, shadow,
}: {
  icon: string; title: string; description: string;
  ctaLabel: string; ctaTo: string; gradient: string; shadow: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center px-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-inner">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-bold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500 leading-relaxed">{description}</p>
      <Link
        to={ctaTo}
        className={`mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-7 py-3 text-sm font-semibold text-white shadow-lg ${shadow} hover:scale-105 hover:shadow-xl transition-all duration-200`}
      >
        {ctaLabel} →
      </Link>
    </div>
  );
}

export default function GoalsPage() {
  const { longTermGoals, shortTermGoals } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<'long-term' | 'short-term'>('long-term');

  const totalCompleted =
    longTermGoals.filter((g: any) => g.status === 'completed').length +
    shortTermGoals.filter((g: any) => g.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Sticky Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                My Goals
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">
                {longTermGoals.length + shortTermGoals.length} goals &middot; {totalCompleted} completed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/goals/long-term/new"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-all"
              >
                + Long-term
              </Link>
              <Link
                to="/goals/short-term/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
              >
                + New Goal
              </Link>
            </div>
          </div>

          {/* Tab Pills */}
          <div className="mt-5 flex gap-1 rounded-xl bg-gray-100/80 p-1 w-fit">
            {([
              { id: 'long-term',  label: '🎯 Long-term',  count: longTermGoals.length,  activeClasses: 'bg-blue-100 text-blue-700'    },
              { id: 'short-term', label: '⚡ Short-term', count: shortTermGoals.length, activeClasses: 'bg-emerald-100 text-emerald-700' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.label}
                <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                  activeTab === tab.id ? tab.activeClasses : 'bg-gray-200 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8">

        {/* ── Long-term Goals ── */}
        {activeTab === 'long-term' && (
          <div className="space-y-4">
            {longTermGoals.length === 0 ? (
              <EmptyState
                icon="🎯"
                title="No long-term goals yet"
                description="Define where you want to be in 3, 6, or 12 months. Break big ambitions into achievable milestones."
                ctaLabel="Create your first goal"
                ctaTo="/goals/long-term/new"
                gradient="from-blue-600 to-indigo-600"
                shadow="shadow-blue-500/25"
              />
            ) : (
              longTermGoals.map((goal: any) => {
                const cat = categoryConfig[goal.category] ?? { color: 'text-gray-700', bg: 'bg-gray-100', icon: '📌' };
                const pri = priorityConfig[goal.priority] ?? priorityConfig.low;
                const due = getDaysUntil(goal.target_date);
                const prog = Math.min(100, goal.current_progress_percentage ?? 0);

                return (
                  <div
                    key={goal._id}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat.bg} ${cat.color}`}>
                            {cat.icon} {goal.category ?? 'general'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 ${pri.text}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
                            {pri.label} priority
                          </span>
                          {goal.status === 'completed' && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">✓ Completed</span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-gray-900 leading-snug">{goal.title}</h3>

                        {/* Progress */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Progress</span>
                            <span className="text-sm font-bold text-gray-800">{prog}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ${
                                prog >= 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                : prog >= 60  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                              }`}
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        {due && (
                          <span className={`text-xs font-bold rounded-full px-3 py-1 ${
                            due.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {due.urgent ? '⚠️' : '🗓'} {due.label}
                          </span>
                        )}
                        <Link
                          to={`/goals/long-term/${goal._id}`}
                          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── Short-term Goals ── */}
        {activeTab === 'short-term' && (
          <div className="space-y-4">
            {shortTermGoals.length === 0 ? (
              <EmptyState
                icon="⚡"
                title="No short-term goals yet"
                description="Break your big goals into weekly or monthly sprints. Small wins build unstoppable momentum."
                ctaLabel="Create your first sprint"
                ctaTo="/goals/short-term/new"
                gradient="from-emerald-500 to-teal-600"
                shadow="shadow-emerald-500/25"
              />
            ) : (
              shortTermGoals.map((goal: any) => {
                const milestones = goal.milestones ?? [];
                const done = milestones.filter((m: any) => m.completed).length;
                const total = milestones.length;
                const progress = total > 0 ? Math.round((done / total) * 100) : 0;
                const due = getDaysUntil(goal.end_date);

                return (
                  <div
                    key={goal._id}
                    className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            goal.status === 'completed'  ? 'bg-emerald-100 text-emerald-700'
                            : goal.status === 'in_progress' ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                          }`}>
                            {goal.status === 'completed' ? '✓ Done'
                            : goal.status === 'in_progress' ? '⚡ In Progress'
                            : '○ Pending'}
                          </span>
                          {due && (
                            <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                              due.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {due.urgent ? '⚠️' : '🗓'} {due.label}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-lg font-bold text-gray-900">{goal.title}</h3>

                        {total > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Milestones</span>
                              <span className="text-sm font-bold text-gray-800">{done}/{total}</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="mt-3 space-y-1.5">
                              {milestones.slice(0, 3).map((m: any) => (
                                <div key={m.id} className="flex items-center gap-2.5">
                                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    m.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {m.completed ? '✓' : '·'}
                                  </div>
                                  <span className={`text-sm ${m.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                    {m.title}
                                  </span>
                                </div>
                              ))}
                              {milestones.length > 3 && (
                                <p className="text-xs text-gray-400 pl-7">+{milestones.length - 3} more</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        <Link
                          to={`/goals/short-term/${goal._id}`}
                          className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                        >
                          View →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
