import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import type { MetaFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${(data as any)?.goal?.title ?? 'Goal'} - Goal Tracker` },
];

export const loader: LoaderFunction = async ({ request, params }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal } = await import('../models/Goals');
  const { connectDB } = await import('../lib/db.server');

  await connectDB();
  const userId = await requireUserId(request);
  const goal = await LongTermGoal.findOne({ _id: params.id, user_id: userId }).lean() as any;

  if (!goal) throw new Response('Not Found', { status: 404 });

  return Response.json({
    goal: {
      _id: goal._id.toString(),
      title: goal.title,
      description: goal.description,
      status: goal.status,
      priority: goal.priority ?? 'medium',
      category: goal.category,
      current_progress_percentage: goal.current_progress_percentage ?? 0,
      target_date: goal.target_date ? new Date(goal.target_date).toISOString() : null,
      created_at: goal.created_at ? new Date(goal.created_at).toISOString() : null,
      smart_framework: goal.smart_framework ?? {},
    },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal } = await import('../models/Goals');
  const { connectDB } = await import('../lib/db.server');

  await connectDB();
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const _action = formData.get('_action') as string;

  if (_action === 'update_status') {
    const status = formData.get('status') as string;
    await LongTermGoal.findOneAndUpdate({ _id: params.id, user_id: userId }, { status });
    return Response.json({ ok: true });
  }

  if (_action === 'update_progress') {
    const progress = Number(formData.get('progress'));
    await LongTermGoal.findOneAndUpdate(
      { _id: params.id, user_id: userId },
      { current_progress_percentage: Math.max(0, Math.min(100, progress)) },
    );
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
};

const categoryConfig: Record<string, { color: string; bg: string; icon: string }> = {
  health:        { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '💪' },
  career:        { color: 'text-blue-700',    bg: 'bg-blue-100',    icon: '💼' },
  personal:      { color: 'text-purple-700',  bg: 'bg-purple-100',  icon: '🌱' },
  education:     { color: 'text-amber-700',   bg: 'bg-amber-100',   icon: '📚' },
  finance:       { color: 'text-green-700',   bg: 'bg-green-100',   icon: '💰' },
  relationships: { color: 'text-rose-700',    bg: 'bg-rose-100',    icon: '❤️' },
};

const priorityConfig: Record<string, { dot: string; text: string; label: string; bg: string }> = {
  high:   { dot: 'bg-red-500',   text: 'text-red-700',   label: 'High',   bg: 'bg-red-50'   },
  medium: { dot: 'bg-amber-400', text: 'text-amber-700', label: 'Medium', bg: 'bg-amber-50' },
  low:    { dot: 'bg-gray-400',  text: 'text-gray-600',  label: 'Low',    bg: 'bg-gray-50'  },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: '⚡ Active',     color: 'text-blue-700',    bg: 'bg-blue-100'    },
  completed: { label: '✓ Completed',   color: 'text-emerald-700', bg: 'bg-emerald-100' },
  paused:    { label: '⏸ Paused',     color: 'text-amber-700',   bg: 'bg-amber-100'   },
  abandoned: { label: '✗ Abandoned',   color: 'text-red-700',     bg: 'bg-red-100'     },
};

const smartLabels: Record<string, { emoji: string; label: string; desc: string }> = {
  specific:   { emoji: '🎯', label: 'Specific',   desc: 'What exactly will you achieve?' },
  measurable: { emoji: '📏', label: 'Measurable', desc: 'How will you track progress?'   },
  achievable: { emoji: '💪', label: 'Achievable', desc: 'Why is this realistic?'          },
  relevant:   { emoji: '❤️', label: 'Relevant',   desc: 'Why does this matter to you?'   },
  time_bound: { emoji: '⏰', label: 'Time-bound', desc: 'What is your timeline?'          },
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function LongTermGoalDetail() {
  const { goal } = useLoaderData<typeof loader>() as any;
  const fetcher = useFetcher();
  const [progress, setProgress] = useState(goal.current_progress_percentage);

  const cat = categoryConfig[goal.category] ?? { color: 'text-gray-700', bg: 'bg-gray-100', icon: '📌' };
  const pri = priorityConfig[goal.priority] ?? priorityConfig.medium;
  const stat = statusConfig[goal.status] ?? statusConfig.active;
  const smart = goal.smart_framework ?? {};
  const hasSmart = Object.values(smart).some(Boolean);

  const handleProgressRelease = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const val = Number((e.target as HTMLInputElement).value);
    const fd = new FormData();
    fd.append('_action', 'update_progress');
    fd.append('progress', val.toString());
    fetcher.submit(fd, { method: 'post' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/goals" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
              ←
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Long-term Goal</p>
              <h1 className="truncate text-lg font-bold text-gray-900">{goal.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-5">

        {/* Overview card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${cat.bg} ${cat.color}`}>
              {cat.icon} {goal.category}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stat.bg} ${stat.color}`}>
              {stat.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pri.bg} ${pri.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
              {pri.label} priority
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{goal.description}</p>

          <div className="rounded-xl bg-gray-50 px-4 py-3 flex items-center gap-2">
            <span className="text-lg">🗓</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Target Date</p>
              <p className="font-semibold text-gray-800">{fmtDate(goal.target_date)}</p>
            </div>
          </div>

          {/* Status changer */}
          <fetcher.Form method="post" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <input type="hidden" name="_action" value="update_status" />
            {(['active', 'completed', 'paused', 'abandoned'] as const).map((s) => (
              <button
                key={s}
                name="status"
                value={s}
                disabled={goal.status === s}
                className={`rounded-xl py-2 text-xs font-semibold transition ${
                  goal.status === s
                    ? `${statusConfig[s].bg} ${statusConfig[s].color}`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </fetcher.Form>
        </div>

        {/* Progress card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Progress</h2>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              {progress}%
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : progress >= 60  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                : 'bg-gradient-to-r from-blue-400 to-indigo-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            onMouseUp={handleProgressRelease}
            onTouchEnd={handleProgressRelease}
            className="w-full accent-indigo-500"
          />
          <p className="text-xs text-gray-400 text-center">Drag to update your progress</p>
        </div>

        {/* SMART Framework */}
        {hasSmart && (
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-900">SMART Framework</h2>
            <div className="space-y-3">
              {Object.entries(smartLabels).map(([key, { emoji, label, desc }]) => {
                const text = smart[key];
                if (!text) return null;
                return (
                  <div key={key} className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      {emoji} {label} — <span className="font-normal normal-case">{desc}</span>
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
