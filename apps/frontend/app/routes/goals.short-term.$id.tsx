import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import type { MetaFunction, LoaderFunction, ActionFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `${(data as any)?.goal?.title ?? 'Goal'} - Goal Tracker` },
];

export const loader: LoaderFunction = async ({ request, params }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { ShortTermGoal } = await import('../models/Goals');
  const { connectDB } = await import('../utils/db.server');

  await connectDB();
  const userId = await requireUserId(request);
  const goal = await ShortTermGoal.findOne({ _id: params.id, user_id: userId }).lean() as any;

  if (!goal) throw new Response('Not Found', { status: 404 });

  return Response.json({
    goal: {
      _id: goal._id.toString(),
      title: goal.title,
      description: goal.description,
      status: goal.status,
      priority: goal.priority ?? 'medium',
      start_date: goal.start_date ? new Date(goal.start_date).toISOString() : null,
      end_date: goal.end_date ? new Date(goal.end_date).toISOString() : null,
      milestones: (goal.milestones ?? []).map((m: any) => ({
        id: (m._id ?? m.id).toString(),
        title: m.title,
        completed: !!m.completed,
      })),
      created_at: goal.created_at ? new Date(goal.created_at).toISOString() : null,
    },
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { ShortTermGoal } = await import('../models/Goals');
  const { connectDB } = await import('../utils/db.server');

  await connectDB();
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const _action = formData.get('_action') as string;

  if (_action === 'toggle_milestone') {
    const milestoneId = formData.get('milestone_id') as string;
    const completed = formData.get('completed') === 'true';
    const goal = await ShortTermGoal.findOne({ _id: params.id, user_id: userId });
    if (!goal) return Response.json({ error: 'Not found' }, { status: 404 });
    const m = goal.milestones.find((m: any) => m._id.toString() === milestoneId);
    if (m) { m.completed = completed; goal.completed_milestones_count = goal.milestones.filter((x: any) => x.completed).length; }
    await goal.save();
    return Response.json({ ok: true });
  }

  if (_action === 'update_status') {
    const status = formData.get('status') as string;
    await ShortTermGoal.findOneAndUpdate({ _id: params.id, user_id: userId }, { status });
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'Unknown action' }, { status: 400 });
};

const priorityConfig: Record<string, { dot: string; text: string; label: string; bg: string }> = {
  high:   { dot: 'bg-red-500',   text: 'text-red-700',   label: 'High',   bg: 'bg-red-50'   },
  medium: { dot: 'bg-amber-400', text: 'text-amber-700', label: 'Medium', bg: 'bg-amber-50' },
  low:    { dot: 'bg-gray-400',  text: 'text-gray-600',  label: 'Low',    bg: 'bg-gray-50'  },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: '⚡ Active',    color: 'text-blue-700',    bg: 'bg-blue-100'    },
  completed: { label: '✓ Completed',  color: 'text-emerald-700', bg: 'bg-emerald-100' },
  paused:    { label: '⏸ Paused',    color: 'text-amber-700',   bg: 'bg-amber-100'   },
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ShortTermGoalDetail() {
  const { goal } = useLoaderData<typeof loader>() as any;
  const fetcher = useFetcher();
  const [milestones, setMilestones] = useState(goal.milestones);

  // Optimistic milestone toggle
  const toggleMilestone = (id: string, current: boolean) => {
    setMilestones((prev: any[]) => prev.map((m) => m.id === id ? { ...m, completed: !current } : m));
    const fd = new FormData();
    fd.append('_action', 'toggle_milestone');
    fd.append('milestone_id', id);
    fd.append('completed', String(!current));
    fetcher.submit(fd, { method: 'post' });
  };

  const done = milestones.filter((m: any) => m.completed).length;
  const total = milestones.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const pri = priorityConfig[goal.priority] ?? priorityConfig.medium;
  const stat = statusConfig[goal.status] ?? statusConfig.active;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link to="/goals" className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition">
              ←
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Short-term Goal</p>
              <h1 className="truncate text-lg font-bold text-gray-900">{goal.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-5">

        {/* Overview card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stat.bg} ${stat.color}`}>
              {stat.label}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pri.bg} ${pri.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${pri.dot}`} />
              {pri.label} priority
            </span>
          </div>

          <p className="text-gray-600 leading-relaxed">{goal.description}</p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Start Date</p>
              <p className="mt-1 font-semibold text-gray-800">{fmtDate(goal.start_date)}</p>
            </div>
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">End Date</p>
              <p className="mt-1 font-semibold text-gray-800">{fmtDate(goal.end_date)}</p>
            </div>
          </div>

          {/* Status changer */}
          <fetcher.Form method="post" className="flex gap-2">
            <input type="hidden" name="_action" value="update_status" />
            {(['active', 'completed', 'paused'] as const).map((s) => (
              <button
                key={s}
                name="status"
                value={s}
                disabled={goal.status === s}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                  goal.status === s
                    ? `${statusConfig[s].bg} ${statusConfig[s].color} border border-current/20`
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {statusConfig[s].label}
              </button>
            ))}
          </fetcher.Form>
        </div>

        {/* Progress */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">Milestones</h2>
            <span className="text-sm font-bold text-gray-600">{done}/{total} done · {progress}%</span>
          </div>

          <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden mb-6">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          {total === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">No milestones added yet.</p>
          ) : (
            <div className="space-y-2">
              {milestones.map((m: any) => (
                <button
                  key={m.id}
                  onClick={() => toggleMilestone(m.id, m.completed)}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                    m.completed ? 'bg-emerald-50 border border-emerald-100' : 'bg-gray-50 border border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold border-2 transition-all ${
                    m.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300 text-gray-300'
                  }`}>
                    {m.completed ? '✓' : ''}
                  </div>
                  <span className={`flex-1 text-sm font-medium ${m.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {m.title}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
