import { Form, Link, useFetcher, useNavigation } from '@remix-run/react';
import type { ActionFunction, MetaFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useState, useRef, useEffect } from 'react';

export const meta: MetaFunction = () => [{ title: 'New Task - Goal Tracker' }];

export const action: ActionFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { DailyTask } = await import('../models/Tasks');

  await connectDB();
  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = (formData.get('title') as string)?.trim();
  if (!title) return json({ error: 'Title is required' }, { status: 400 });

  const description = (formData.get('description') as string)?.trim() ?? '';
  const difficulty_level = Math.min(5, Math.max(1, Number(formData.get('difficulty_level')) || 3));
  const due_date_str = formData.get('due_date') as string;
  const tagsRaw = (formData.get('tags') as string) ?? '';
  const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

  const taskCount = await DailyTask.countDocuments({ user_id: userId, status: { $ne: 'completed' } });

  await DailyTask.create({
    user_id: userId,
    title,
    description,
    difficulty_level,
    due_date: due_date_str ? new Date(due_date_str) : new Date(),
    tags,
    status: 'pending',
    sort_order: taskCount,
  });

  return redirect('/dashboard');
};

// ─── Types ───────────────────────────────────────────────────────────────────
type Phase = 'idle' | 'thinking' | 'filled';

interface TaskFields {
  title: string;
  description: string;
  difficulty_level: number;
  due_date: string;
  tags: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const difficultyMeta = [
  null,
  { emoji: '😌', label: 'Trivial',   color: 'from-gray-400 to-gray-500'     },
  { emoji: '🙂', label: 'Easy',      color: 'from-emerald-400 to-teal-500'   },
  { emoji: '🤔', label: 'Medium',    color: 'from-blue-400 to-indigo-500'    },
  { emoji: '💪', label: 'Hard',      color: 'from-orange-400 to-red-500'     },
  { emoji: '🔥', label: 'Very Hard', color: 'from-red-500 to-rose-700'       },
];

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Today';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric',
    });
  } catch { return dateStr; }
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span className="flex items-center gap-[3px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-current animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
        />
      ))}
    </span>
  );
}

function ThinkingPanel() {
  const steps = [
    'Analyzing your task description…',
    'Estimating difficulty level…',
    'Picking the best deadline…',
    'Selecting relevant tags…',
    'Crafting a clear title…',
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % steps.length), 650);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center gap-4 py-1">
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-violet-300/40 animate-ping" />
        <span className="absolute inset-1 rounded-full bg-violet-300/30 animate-pulse" />
        <span className="relative z-10 text-2xl select-none">🧠</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{steps[step]}</p>
        <p className="mt-0.5 text-xs text-gray-400">Powered by Gemini AI</p>
      </div>
    </div>
  );
}

function FieldReveal({
  show, label, children,
}: { show: boolean; label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-start gap-3 transition-all duration-300"
      style={{ opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(6px)' }}
    >
      <span className="mt-0.5 w-20 shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function NewTaskPage() {
  const aiFetcher = useFetcher<any>();
  const navigation = useNavigation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [phase, setPhase] = useState<Phase>('idle');
  const [rawInput, setRawInput] = useState('');
  const [revealStep, setRevealStep] = useState(0);
  const [fields, setFields] = useState<TaskFields>({
    title: '', description: '', difficulty_level: 3, due_date: '', tags: '',
  });

  const isSubmitting = navigation.state === 'submitting';
  const isThinking   = phase === 'thinking' || aiFetcher.state === 'submitting';

  // When AI responds → fill fields + start reveal animation
  useEffect(() => {
    if (aiFetcher.data?.success) {
      const d = aiFetcher.data.data;
      setFields({
        title:            d.title ?? '',
        description:      d.description ?? '',
        difficulty_level: d.difficulty_level ?? 3,
        due_date:         d.due_date ?? '',
        tags:             Array.isArray(d.tags) ? d.tags.join(', ') : (d.tags ?? ''),
      });
      setPhase('filled');
      setRevealStep(0);
    } else if (aiFetcher.data?.error) {
      setPhase('idle');
    }
  }, [aiFetcher.data]);

  // Stagger reveal — one field every 120 ms
  useEffect(() => {
    if (phase === 'filled' && revealStep < 5) {
      const t = setTimeout(() => setRevealStep((s) => s + 1), 120);
      return () => clearTimeout(t);
    }
  }, [phase, revealStep]);

  const handleGenerate = () => {
    if (rawInput.trim().length < 5 || isThinking) return;
    setPhase('thinking');
    const fd = new FormData();
    fd.append('description', rawInput);
    aiFetcher.submit(fd, { method: 'post', action: '/api/generate-task' });
  };

  const dm = difficultyMeta[fields.difficulty_level];

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-2xl px-6 py-5">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all"
            >
              ←
            </Link>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                New Task
              </h1>
              <p className="mt-0.5 text-sm text-gray-500">Describe it in plain English — AI structures it</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 pb-28 lg:pb-8 space-y-5">

        {/* ── AI Input Card ── */}
        <div className={`rounded-2xl border bg-white shadow-sm transition-all duration-500 overflow-hidden ${
          phase === 'filled' ? 'border-violet-200 shadow-violet-100/60'
          : phase === 'thinking' ? 'border-violet-200'
          : 'border-gray-100'
        }`}>
          <div className="p-6">
            {/* Card header */}
            <div className="flex items-start gap-3 mb-4">
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-xl shadow-md transition-all duration-300 ${
                phase === 'filled' ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-400/30'
                : 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-400/30'
              }`}>
                {phase === 'filled' ? '✓' : '✨'}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {phase === 'filled' ? 'AI structured your task' : 'Describe your task'}
                </p>
                <p className="text-xs text-gray-500">
                  {phase === 'filled'
                    ? 'Review below, edit any field, then save'
                    : 'Write freely — AI extracts title, difficulty, deadline & tags'}
                </p>
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
              disabled={isThinking}
              placeholder={`e.g. "review last quarter's sales data and prepare a 5-slide summary for the Monday board meeting"`}
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20 disabled:opacity-60 transition-all"
            />

            {/* Controls row */}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {rawInput.length > 0 ? `${rawInput.length} chars · Ctrl+Enter to generate` : 'Tip: the more detail you give, the better the result'}
              </span>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={rawInput.trim().length < 5 || isThinking}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  rawInput.trim().length < 5
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : isThinking
                    ? 'bg-violet-100 text-violet-600 cursor-wait'
                    : 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:scale-[1.03] hover:shadow-violet-500/40 active:scale-100'
                }`}
              >
                {isThinking ? <><ThinkingDots /> Thinking</> : <>✨ Generate with AI</>}
              </button>
            </div>

            {/* AI error */}
            {aiFetcher.data?.error && (
              <p className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">
                {aiFetcher.data.error}
              </p>
            )}
          </div>

          {/* Thinking panel */}
          {phase === 'thinking' && (
            <div className="border-t border-violet-100 bg-violet-50/40 px-6 py-5">
              <ThinkingPanel />
            </div>
          )}

          {/* Filled preview */}
          {phase === 'filled' && (
            <div className="border-t border-violet-100 bg-violet-50/30 px-6 py-5">
              <div className="space-y-3.5">
                <FieldReveal show={revealStep >= 1} label="Title">
                  <span className="text-sm font-bold text-gray-900">{fields.title}</span>
                </FieldReveal>

                <FieldReveal show={revealStep >= 2} label="Description">
                  <span className="text-sm text-gray-600 leading-relaxed">{fields.description}</span>
                </FieldReveal>

                <FieldReveal show={revealStep >= 3} label="Difficulty">
                  {dm && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                      {dm.emoji} {dm.label}
                    </span>
                  )}
                </FieldReveal>

                <FieldReveal show={revealStep >= 4} label="Due Date">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    🗓 {formatDate(fields.due_date)}
                  </span>
                </FieldReveal>

                <FieldReveal show={revealStep >= 5} label="Tags">
                  <div className="flex flex-wrap gap-1.5">
                    {fields.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                      <span key={tag} className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </FieldReveal>
              </div>

              <button
                type="button"
                onClick={() => { setPhase('idle'); setRevealStep(0); }}
                className="mt-4 text-xs text-gray-400 hover:text-violet-600 transition-colors"
              >
                ↺ Re-generate with different description
              </button>
            </div>
          )}
        </div>

        {/* ── Manual / Edit Form ── */}
        <Form method="post" className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              {phase === 'filled' ? 'Review & Edit Fields' : 'Fill in Manually'}
            </p>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Task Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={fields.title}
                onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
                required
                placeholder="What needs to be done?"
                className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Description <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                name="description"
                value={fields.description}
                onChange={(e) => setFields((f) => ({ ...f, description: e.target.value }))}
                placeholder="Add context, steps, or notes…"
                rows={3}
                className="block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              />
            </div>

            {/* Difficulty picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty
                {dm && (
                  <span className="ml-2 font-normal text-gray-500">
                    — {dm.emoji} {dm.label}
                  </span>
                )}
              </label>
              <input type="hidden" name="difficulty_level" value={fields.difficulty_level} />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => {
                  const meta = difficultyMeta[n]!;
                  const active = fields.difficulty_level === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFields((f) => ({ ...f, difficulty_level: n }))}
                      title={meta.label}
                      className={`flex-1 flex flex-col items-center gap-1 rounded-xl py-3 text-sm transition-all duration-200 ${
                        active
                          ? `bg-gradient-to-b ${meta.color} text-white shadow-md scale-105`
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <span className="text-lg">{meta.emoji}</span>
                      <span className="text-xs font-bold">{n}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due date + Tags */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  name="due_date"
                  value={fields.due_date}
                  onChange={(e) => setFields((f) => ({ ...f, due_date: e.target.value }))}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tags <span className="text-gray-400 font-normal">comma-separated</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  value={fields.tags}
                  onChange={(e) => setFields((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="work, urgent, planning…"
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!fields.title.trim() || isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating task…
              </span>
            ) : (
              '✓ Create Task'
            )}
          </button>
        </Form>
      </div>
    </div>
  );
}
