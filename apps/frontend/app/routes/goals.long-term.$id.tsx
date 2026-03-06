import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import { json, type MetaFunction, type LoaderFunction, type ActionFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

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

  return json({
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
    return json({ ok: true });
  }

  if (_action === 'update_progress') {
    const progress = Number(formData.get('progress'));
    await LongTermGoal.findOneAndUpdate(
      { _id: params.id, user_id: userId },
      { current_progress_percentage: Math.max(0, Math.min(100, progress)) },
    );
    return json({ ok: true });
  }

  if (_action === 'add_tasks') {
    const { DailyTask } = await import('../models/Tasks');
    const raw = formData.get('tasks') as string;
    try {
      const tasks = JSON.parse(raw);
      const count = await DailyTask.countDocuments({ user_id: userId });
      await DailyTask.insertMany(
        tasks.map((t: any, i: number) => ({
          user_id: userId,
          title: t.title,
          description: t.description ?? '',
          difficulty_level: Math.min(5, Math.max(1, Number(t.difficulty_level) || 3)),
          due_date: t.due_date ? new Date(t.due_date) : new Date(),
          tags: t.tags ?? [],
          status: 'pending',
          sort_order: count + i,
        })),
      );
      return json({ ok: true, added: tasks.length });
    } catch (e) {
      return json({ error: 'Failed to add tasks.' }, { status: 500 });
    }
  }

  return json({ error: 'Unknown action' }, { status: 400 });
};

const categoryConfig: Record<string, { color: string; bg: string; icon: string }> = {
  health: { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '💪' },
  career: { color: 'text-blue-700', bg: 'bg-blue-100', icon: '💼' },
  personal: { color: 'text-purple-700', bg: 'bg-purple-100', icon: '🌱' },
  education: { color: 'text-amber-700', bg: 'bg-amber-100', icon: '📚' },
  finance: { color: 'text-green-700', bg: 'bg-green-100', icon: '💰' },
  relationships: { color: 'text-rose-700', bg: 'bg-rose-100', icon: '❤️' },
};

const priorityConfig: Record<string, { dot: string; text: string; label: string; bg: string }> = {
  high: { dot: 'bg-red-500', text: 'text-red-700', label: 'High', bg: 'bg-red-50' },
  medium: { dot: 'bg-amber-400', text: 'text-amber-700', label: 'Medium', bg: 'bg-amber-50' },
  low: { dot: 'bg-gray-400', text: 'text-gray-600', label: 'Low', bg: 'bg-gray-50' },
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: '⚡ Active', color: 'text-blue-700', bg: 'bg-blue-100' },
  completed: { label: '✓ Completed', color: 'text-emerald-700', bg: 'bg-emerald-100' },
  paused: { label: '⏸ Paused', color: 'text-amber-700', bg: 'bg-amber-100' },
  abandoned: { label: '✗ Abandoned', color: 'text-red-700', bg: 'bg-red-100' },
};

const smartLabels: Record<string, { emoji: string; label: string; desc: string }> = {
  specific: { emoji: '🎯', label: 'Specific', desc: 'What exactly will you achieve?' },
  measurable: { emoji: '📏', label: 'Measurable', desc: 'How will you track progress?' },
  achievable: { emoji: '💪', label: 'Achievable', desc: 'Why is this realistic?' },
  relevant: { emoji: '❤️', label: 'Relevant', desc: 'Why does this matter to you?' },
  time_bound: { emoji: '⏰', label: 'Time-bound', desc: 'What is your timeline?' },
};

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const taskGenMessages = [
  'Reading your goal…',
  'Planning actions for the week…',
  'Sizing each task to one day…',
  'Ordering by importance…',
  'Almost done…',
];

const difficultyEmoji = ['', '😌', '🙂', '🤔', '💪', '🔥'];

export default function LongTermGoalDetail() {
  const { goal } = useLoaderData<typeof loader>() as any;
  const fetcher = useFetcher();
  const taskFetcher = useFetcher<any>();
  const createFetcher = useFetcher<any>();

  const [progress, setProgress] = useState(goal.current_progress_percentage);
  const [taskGenPhase, setTaskGenPhase] = useState<'idle' | 'thinking' | 'review'>('idle');
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [taskMsgIdx, setTaskMsgIdx] = useState(0);
  const [addedCount, setAddedCount] = useState(0);

  const cat = categoryConfig[goal.category] ?? { color: 'text-gray-700', bg: 'bg-gray-100', icon: '📌' };
  const pri = priorityConfig[goal.priority] ?? priorityConfig.medium;
  const stat = statusConfig[goal.status] ?? statusConfig.active;
  const smart = goal.smart_framework ?? {};
  const hasSmart = Object.values(smart).some(Boolean);

  // Cycle thinking messages during task generation
  useEffect(() => {
    if (taskGenPhase !== 'thinking') return;
    const id = setInterval(() => setTaskMsgIdx((i) => (i + 1) % taskGenMessages.length), 1800);
    return () => clearInterval(id);
  }, [taskGenPhase]);

  // Handle task generation response
  useEffect(() => {
    if (taskFetcher.state !== 'idle' || !taskFetcher.data) return;
    if (taskFetcher.data.error) { setTaskGenPhase('idle'); return; }
    const tasks = taskFetcher.data.tasks ?? [];
    setGeneratedTasks(tasks);
    setSelectedTasks(new Set(tasks.map((_: any, i: number) => i)));
    setTaskGenPhase('review');
  }, [taskFetcher.state, taskFetcher.data]);

  // Handle task creation response
  useEffect(() => {
    if (createFetcher.state !== 'idle' || !createFetcher.data) return;
    if (createFetcher.data.ok) {
      setAddedCount(selectedTasks.size);
      setTaskGenPhase('idle');
      setGeneratedTasks([]);
    }
  }, [createFetcher.state, createFetcher.data]);

  const handleGenerateTasks = () => {
    setTaskGenPhase('thinking');
    const fd = new FormData();
    fd.append('goalTitle', goal.title);
    fd.append('goalDescription', goal.description ?? '');
    fd.append('targetDate', goal.target_date ?? '');
    fd.append('category', goal.category ?? '');
    taskFetcher.submit(fd, { method: 'post', action: '/api/generate-goal-tasks' });
  };

  const handleAddSelected = () => {
    const selected = generatedTasks.filter((_, i) => selectedTasks.has(i));
    const fd = new FormData();
    fd.append('_action', 'add_tasks');
    fd.append('tasks', JSON.stringify(selected));
    createFetcher.submit(fd, { method: 'post', action: '/dashboard' });
  };

  const toggleTask = (i: number) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

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
                className={`rounded-xl py-2 text-xs font-semibold transition ${goal.status === s
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
              className={`h-full rounded-full transition-all duration-700 ${progress >= 100 ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                : progress >= 60 ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
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

        {/* ── AI Goal → Tasks Generator ─────────────────────────────── */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Header strip */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm tracking-wide">✨ AI Task Cascade</p>
              <p className="text-indigo-100 text-xs mt-0.5">Generate daily tasks for the week from your goal</p>
            </div>
            {addedCount > 0 && (
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white">
                ✓ {addedCount} added to board
              </span>
            )}
          </div>

          <div className="bg-white p-6">
            {taskGenPhase === 'idle' && (
              <button
                onClick={handleGenerateTasks}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50 py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all"
              >
                <span className="text-lg">🚀</span>
                Generate 5 daily tasks for this week
              </button>
            )}

            {taskGenPhase === 'thinking' && (
              <div className="flex items-center gap-4 py-4">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" />
                  <span className="relative text-xl animate-pulse">🧠</span>
                </div>
                <div>
                  <p className="font-semibold text-indigo-700 text-sm">{taskGenMessages[taskMsgIdx]}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Creating focused daily tasks…</p>
                </div>
              </div>
            )}

            {taskGenPhase === 'review' && generatedTasks.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">
                  Select tasks to add to your board:
                </p>
                {generatedTasks.map((task, i) => (
                  <button
                    key={i}
                    onClick={() => toggleTask(i)}
                    className={`w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${selectedTasks.has(i)
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-gray-100 bg-gray-50 opacity-60'
                      }`}
                  >
                    <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${selectedTasks.has(i)
                      ? 'border-indigo-500 bg-indigo-500 text-white'
                      : 'border-gray-300 text-transparent'
                      }`}>✓</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{task.title}</span>
                        <span className="text-xs text-gray-400">{difficultyEmoji[task.difficulty_level] ?? ''}</span>
                        <span className="text-xs text-gray-400">· {task.due_date}</span>
                      </div>
                      {task.description && (
                        <p className="mt-0.5 text-xs text-gray-500 leading-snug">{task.description}</p>
                      )}
                      {task.tags?.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {task.tags.map((tag: string) => (
                            <span key={tag} className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setTaskGenPhase('idle')}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSelected}
                    disabled={selectedTasks.size === 0 || createFetcher.state !== 'idle'}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-bold text-white shadow hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {createFetcher.state !== 'idle'
                      ? 'Adding…'
                      : `Add ${selectedTasks.size} task${selectedTasks.size !== 1 ? 's' : ''} to board`}
                  </button>
                </div>
              </div>
            )}
          </div>
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
