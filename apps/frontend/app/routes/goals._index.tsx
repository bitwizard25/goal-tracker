import { useLoaderData, Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useState, useEffect } from 'react';

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
      priority: g.priority ?? 'medium',
      milestones: (g.milestones ?? []).map((m: any) => ({
        id: m.id ?? m._id?.toString() ?? String(Math.random()),
        title: m.title,
        completed: !!m.completed,
      })),
      start_date: g.start_date ? new Date(g.start_date).toISOString() : null,
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

function getDaysUntil(dateStr: string | null, now: number): { label: string; urgent: boolean } | null {
  if (!dateStr || !now) return null;
  const diff = Math.ceil((new Date(dateStr).getTime() - now) / (1000 * 60 * 60 * 24));
  if (diff < 0)   return { label: 'Overdue',      urgent: true  };
  if (diff === 0) return { label: 'Due today',     urgent: true  };
  if (diff <= 7)  return { label: `${diff}d left`, urgent: true  };
  return           { label: `${diff}d left`,        urgent: false };
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
  const [now, setNow] = useState(0); // 0 = server side, set client-side after hydration
  useEffect(() => { setNow(Date.now()); }, []);

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
                const cat  = categoryConfig[goal.category] ?? { color: 'text-gray-700', bg: 'bg-gray-100', icon: '📌' };
                const pri  = priorityConfig[goal.priority] ?? priorityConfig.low;
                const due  = getDaysUntil(goal.target_date, now);
                const prog = Math.min(100, goal.current_progress_percentage ?? 0);

                // SVG ring
                const R = 26; const circ = 2 * Math.PI * R;
                const dash = (prog / 100) * circ;

                const isCompleted = goal.status === 'completed';
                const isUrgent    = due?.urgent && !isCompleted;

                return (
                  <div
                    key={goal._id}
                    className={`rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                      isUrgent ? 'border-red-200' : 'border-gray-100 hover:border-blue-100'
                    }`}
                  >
                    {isCompleted && <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />}
                    {isUrgent    && <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />}

                    <div className="p-6">
                      <div className="flex items-start gap-5">
                        {/* Progress ring */}
                        <div className="relative shrink-0 flex flex-col items-center gap-1">
                          <svg width="68" height="68" viewBox="0 0 68 68">
                            <circle cx="34" cy="34" r={R} fill="none" stroke="#f3f4f6" strokeWidth="6" />
                            <circle
                              cx="34" cy="34" r={R} fill="none"
                              stroke={isCompleted ? '#10b981' : prog >= 60 ? '#6366f1' : '#3b82f6'}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={`${dash} ${circ}`}
                              style={{ transform: 'rotate(-90deg)', transformOrigin: '34px 34px', transition: 'stroke-dasharray 0.7s ease' }}
                            />
                            <text x="34" y="37" textAnchor="middle" fontSize="13" fontWeight="700"
                              fill={isCompleted ? '#059669' : '#374151'}>
                              {prog}%
                            </text>
                          </svg>
                          <span className="text-xs font-semibold text-gray-400">done</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat.bg} ${cat.color}`}>
                              {cat.icon} {goal.category ?? 'general'}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 ${pri.text}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
                              {pri.label}
                            </span>
                            {isCompleted && (
                              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">✓ Completed</span>
                            )}
                            {due && !isCompleted && (
                              <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                                due.urgent ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                              }`}>
                                {due.urgent ? '⚠️' : '🗓'} {due.label}
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-base font-bold text-gray-900 leading-snug">{goal.title}</h3>

                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                  : prog >= 60 ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                                  : 'bg-gradient-to-r from-blue-400 to-indigo-400'
                                }`}
                                style={{ width: `${prog}%` }}
                              />
                            </div>
                            {prog === 0 && (
                              <p className="mt-1.5 text-xs text-gray-400">No progress yet — open goal to update</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-5">
                        <Link
                          to={`/goals/long-term/${goal._id}`}
                          className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition-all ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:opacity-90'
                          }`}
                        >
                          {isCompleted ? '🏆 View Achievement' : prog === 0 ? '🚀 Start Goal' : '📈 Update Progress'}
                          <span>→</span>
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
                const milestonePct = total > 0 ? Math.round((done / total) * 100) : 0;

                // Time elapsed fraction (client-side only via `now`)
                const startMs = goal.start_date ? new Date(goal.start_date).getTime() : 0;
                const endMs   = goal.end_date   ? new Date(goal.end_date).getTime()   : 0;
                const spanMs  = endMs - startMs;
                const timePct = now && spanMs > 0
                  ? Math.min(100, Math.max(0, Math.round(((now - startMs) / spanMs) * 100)))
                  : 0;
                const daysTotal   = spanMs > 0 ? Math.ceil(spanMs / 86400000) : 0;
                const daysElapsed = now && startMs ? Math.max(0, Math.ceil((now - startMs) / 86400000)) : 0;
                const daysLeft    = now && endMs   ? Math.max(0, Math.ceil((endMs - now) / 86400000))   : daysTotal;

                // Behind: milestone progress lags time by >15%
                const isBehind  = timePct > 0 && milestonePct < timePct - 15;
                const isOnTrack = milestonePct >= timePct - 15;
                const isDone    = goal.status === 'completed';

                const accentColor = isDone   ? 'emerald'
                                  : isBehind ? 'amber'
                                  : 'emerald';

                // SVG ring
                const R = 26; const circ = 2 * Math.PI * R;
                const dash = (milestonePct / 100) * circ;

                // Next incomplete milestone
                const nextMilestone = milestones.find((m: any) => !m.completed);

                return (
                  <div
                    key={goal._id}
                    className={`rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                      isBehind ? 'border-amber-200' : 'border-gray-100 hover:border-emerald-100'
                    }`}
                  >
                    {/* Urgency top stripe */}
                    {isBehind && (
                      <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-400" />
                    )}
                    {isDone && (
                      <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" />
                    )}

                    <div className="p-6">
                      {/* Header row */}
                      <div className="flex items-start gap-5">
                        {/* Progress ring */}
                        <div className="relative shrink-0 flex flex-col items-center gap-1">
                          <svg width="68" height="68" viewBox="0 0 68 68">
                            {/* track */}
                            <circle cx="34" cy="34" r={R} fill="none" stroke="#f3f4f6" strokeWidth="6" />
                            {/* progress */}
                            <circle
                              cx="34" cy="34" r={R} fill="none"
                              stroke={isDone ? '#10b981' : isBehind ? '#f59e0b' : '#10b981'}
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeDasharray={`${dash} ${circ}`}
                              strokeDashoffset={circ / 4}  /* start at top */
                              style={{ transform: 'rotate(-90deg)', transformOrigin: '34px 34px', transition: 'stroke-dasharray 0.7s ease' }}
                            />
                            <text x="34" y="37" textAnchor="middle" fontSize="13" fontWeight="700"
                              fill={isDone ? '#059669' : isBehind ? '#d97706' : '#374151'}>
                              {milestonePct}%
                            </text>
                          </svg>
                          <span className="text-xs font-semibold text-gray-400">{done}/{total}</span>
                        </div>

                        {/* Title + badges */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              isDone ? 'bg-emerald-100 text-emerald-700'
                              : isBehind ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                              {isDone ? '✓ Completed' : isBehind ? '⚠️ Behind' : '⚡ Active'}
                            </span>
                            {daysLeft > 0 && !isDone && (
                              <span className={`text-xs font-bold rounded-full px-2.5 py-1 ${
                                daysLeft <= 3  ? 'bg-red-100 text-red-700'
                                : daysLeft <= 7 ? 'bg-amber-100 text-amber-700'
                                : 'bg-gray-100 text-gray-600'
                              }`}>
                                🗓 {daysLeft}d left
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-base font-bold text-gray-900 leading-snug">{goal.title}</h3>
                        </div>
                      </div>

                      {/* Dual progress bars */}
                      {daysTotal > 0 && (
                        <div className="mt-5 space-y-2.5">
                          <div className="flex items-center gap-3">
                            <span className="w-20 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">Time</span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-700"
                                style={{ width: `${timePct}%` }}
                              />
                            </div>
                            <span className="w-16 text-right text-xs font-semibold text-gray-500">{daysElapsed}/{daysTotal}d</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="w-20 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0">Progress</span>
                            <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-700 ${
                                  isDone ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                  : isBehind ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                                  : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                }`}
                                style={{ width: `${milestonePct}%` }}
                              />
                            </div>
                            <span className="w-16 text-right text-xs font-semibold text-gray-500">{done}/{total}</span>
                          </div>
                          {isBehind && (
                            <p className="text-xs text-amber-600 font-medium pl-[92px]">
                              You're {timePct - milestonePct}% behind schedule — start now to catch up!
                            </p>
                          )}
                        </div>
                      )}

                      {/* Next Up — implementation intention focal point */}
                      {nextMilestone && !isDone && (
                        <div className="mt-5">
                          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">▶ Next Up</p>
                          <Link
                            to={`/goals/short-term/${goal._id}`}
                            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-all group/next ${
                              isBehind
                                ? 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                                : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100'
                            }`}
                          >
                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              isBehind ? 'border-amber-400' : 'border-emerald-400'
                            }`} />
                            <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">{nextMilestone.title}</span>
                            <span className={`shrink-0 text-xs font-bold transition-transform group-hover/next:translate-x-0.5 ${
                              isBehind ? 'text-amber-600' : 'text-emerald-600'
                            }`}>→</span>
                          </Link>
                        </div>
                      )}

                      {/* All milestones compact list */}
                      {total > 0 && (
                        <div className="mt-4 space-y-1.5">
                          {milestones.map((m: any, idx: number) => (
                            m.id === nextMilestone?.id ? null : (
                              <div key={m.id} className="flex items-center gap-2.5">
                                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  m.completed ? 'bg-emerald-500 text-white' : 'border border-gray-300 text-gray-300'
                                }`}>
                                  {m.completed ? '✓' : ''}
                                </div>
                                <span className={`text-sm leading-snug ${
                                  m.completed ? 'line-through text-gray-400' : 'text-gray-500'
                                }`}>
                                  {m.title}
                                </span>
                              </div>
                            )
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-5">
                        <Link
                          to={`/goals/short-term/${goal._id}`}
                          className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : isBehind
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 hover:opacity-90'
                              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:opacity-90'
                          }`}
                        >
                          {isDone ? '🏆 View Achievement' : isBehind ? '🔥 Catch Up Now' : '⚡ Continue Sprint'}
                          <span>→</span>
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
