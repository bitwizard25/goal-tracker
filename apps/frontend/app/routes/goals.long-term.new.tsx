import { useFetcher, useNavigation, Form } from '@remix-run/react';
import { json, type MetaFunction, type ActionFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Create Long-term Goal - Goal Tracker' },
];

export const action: ActionFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal } = await import('../models/Goals');
  const { connectDB } = await import('../lib/db.server');
  const { redirect } = await import('@remix-run/node');

  if (request.method !== 'POST') return null;

  const userId = await requireUserId(request);
  await connectDB();
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const target_date = formData.get('target_date') as string;
  const category = formData.get('category') as string;
  const priority = formData.get('priority') as string;

  if (!title || !description || !target_date || !category) {
    return json({ error: 'Missing required fields' }, { status: 400 });
  }

  const smart_framework = {
    specific: formData.get('specific') as string,
    measurable: formData.get('measurable') as string,
    achievable: formData.get('achievable') as string,
    relevant: formData.get('relevant') as string,
    time_bound: formData.get('time_bound') as string,
  };

  try {
    const goal = new LongTermGoal({
      user_id: userId,
      title,
      description,
      target_date: new Date(target_date),
      category,
      priority: priority || 'medium',
      smart_framework,
      status: 'active',
      current_progress_percentage: 0,
      milestones: [],
    });

    await goal.save();
    return redirect('/goals');
  } catch (error) {
    console.error('Create long-term goal error:', error);
    return json({ error: 'An error occurred creating the goal' }, { status: 500 });
  }
};

// ─── Thinking animation dots ───────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1 ml-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block h-1.5 w-1.5 rounded-full bg-indigo-400"
          style={{ animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

const thinkingMessages = [
  'Reading your goal…',
  'Thinking about category…',
  'Setting a realistic timeline…',
  'Crafting SMART criteria…',
  'Polishing the details…',
];

// ─── Main component ────────────────────────────────────────────────────────────
export default function CreateLongTermGoal() {
  const navigation = useNavigation();
  const aiFetcher = useFetcher<any>();

  const [phase, setPhase] = useState<'idle' | 'thinking' | 'filled'>('idle');
  const [rawInput, setRawInput] = useState('');
  const [msgIdx, setMsgIdx] = useState(0);
  const [revealStep, setRevealStep] = useState(0);
  const [activeStep, setActiveStep] = useState<'basic' | 'smart'>('basic');
  const [aiError, setAiError] = useState('');

  // Controlled field state
  const [fields, setFields] = useState({
    title: '',
    description: '',
    target_date: '',
    category: '',
    priority: 'medium',
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    time_bound: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  // Cycle thinking messages
  useEffect(() => {
    if (phase !== 'thinking') return;
    const id = setInterval(() => setMsgIdx((i) => (i + 1) % thinkingMessages.length), 1800);
    return () => clearInterval(id);
  }, [phase]);

  // On AI response
  useEffect(() => {
    if (aiFetcher.state !== 'idle' || !aiFetcher.data) return;
    if (aiFetcher.data.error) {
      setAiError(aiFetcher.data.error);
      setPhase('idle');
      return;
    }
    const d = aiFetcher.data.data;
    setFields({
      title: d.title ?? '',
      description: d.description ?? '',
      target_date: d.target_date ?? '',
      category: d.category ?? '',
      priority: d.priority ?? 'medium',
      specific: d.smart?.specific ?? '',
      measurable: d.smart?.measurable ?? '',
      achievable: d.smart?.achievable ?? '',
      relevant: d.smart?.relevant ?? '',
      time_bound: d.smart?.time_bound ?? '',
    });
    setPhase('filled');
    setRevealStep(0);
  }, [aiFetcher.state, aiFetcher.data]);

  // Stagger field reveal
  useEffect(() => {
    if (phase !== 'filled') return;
    const totalFields = 10;
    if (revealStep >= totalFields) return;
    const id = setTimeout(() => setRevealStep((s) => s + 1), 100);
    return () => clearTimeout(id);
  }, [phase, revealStep]);

  const handleGenerate = () => {
    if (rawInput.trim().length < 5) return;
    setAiError('');
    setPhase('thinking');
    const fd = new FormData();
    fd.append('description', rawInput);
    aiFetcher.submit(fd, { method: 'post', action: '/api/generate-goal' });
  };

  const isSubmitting = navigation.state === 'submitting';

  const fieldClass = (step: number) =>
    `transition-all duration-500 ${revealStep > step ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;

  const inputClass =
    'mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition';
  const labelClass = 'block text-sm font-semibold text-gray-700';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-sm">
              🎯
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Create Long-term Goal</h1>
              <p className="text-xs text-gray-500">Describe it — AI fills everything with SMART criteria</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6">

        {/* ── AI Input Card ─────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
            <p className="text-white font-semibold text-sm tracking-wide uppercase">✨ AI Goal Builder</p>
            <p className="text-indigo-100 text-xs mt-0.5">Describe what you want to achieve — we'll do the rest</p>
          </div>

          <div className="p-6 space-y-4">
            {phase === 'idle' || phase === 'filled' ? (
              <>
                <textarea
                  rows={3}
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="e.g., I want to get fit and run a half marathon by the end of the year…"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition resize-none"
                />
                {aiError && <p className="text-sm text-red-500">{aiError}</p>}
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={rawInput.trim().length < 5}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {phase === 'filled' ? '🔄 Regenerate with AI' : '✨ Generate Goal with AI'}
                </button>
              </>
            ) : (
              /* Thinking panel */
              <div className="flex flex-col items-center gap-4 py-6">
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" />
                  <div className="relative text-3xl animate-pulse">🧠</div>
                </div>
                <div className="flex items-center gap-2 text-indigo-600 font-medium">
                  <span>{thinkingMessages[msgIdx]}</span>
                  <ThinkingDots />
                </div>
                <div className="w-full max-w-xs h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse" style={{ width: '70%' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Form (shown when filled) ───────────────────────────────────── */}
        {phase === 'filled' && (
          <Form method="post" className="space-y-4">
            {/* Hidden fields for SMART */}
            <input type="hidden" name="specific"   value={fields.specific} />
            <input type="hidden" name="measurable" value={fields.measurable} />
            <input type="hidden" name="achievable" value={fields.achievable} />
            <input type="hidden" name="relevant"   value={fields.relevant} />
            <input type="hidden" name="time_bound" value={fields.time_bound} />

            {/* Step tabs */}
            <div className="flex gap-3">
              {(['basic', 'smart'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setActiveStep(s)}
                  className={`px-5 py-2 rounded-xl font-semibold text-sm transition ${
                    activeStep === s
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {s === 'basic' ? '📋 Basic Info' : '🎯 SMART Framework'}
                </button>
              ))}
            </div>

            {/* Basic Info */}
            {activeStep === 'basic' && (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
                <div className={fieldClass(0)}>
                  <label className={labelClass}>Goal Title *</label>
                  <input type="text" name="title" required value={fields.title} onChange={set('title')} className={inputClass} placeholder="e.g., Run a half marathon" />
                </div>

                <div className={fieldClass(1)}>
                  <label className={labelClass}>Description *</label>
                  <textarea name="description" required rows={3} value={fields.description} onChange={set('description')} className={inputClass + ' resize-none'} placeholder="Describe your goal…" />
                </div>

                <div className={`grid grid-cols-1 gap-5 md:grid-cols-3 ${fieldClass(2)}`}>
                  <div>
                    <label className={labelClass}>Target Date *</label>
                    <input type="date" name="target_date" required value={fields.target_date} onChange={set('target_date')} className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Category *</label>
                    <select name="category" required value={fields.category} onChange={set('category')} className={inputClass}>
                      <option value="">Select a category</option>
                      <option value="health">Health &amp; Fitness</option>
                      <option value="career">Career</option>
                      <option value="education">Education</option>
                      <option value="relationships">Relationships</option>
                      <option value="finance">Finance</option>
                      <option value="personal">Personal Development</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Priority</label>
                    <select name="priority" value={fields.priority} onChange={set('priority')} className={inputClass}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className={fieldClass(3)}>
                  <button
                    type="button"
                    onClick={() => setActiveStep('smart')}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 transition"
                  >
                    Next: SMART Framework →
                  </button>
                </div>
              </div>
            )}

            {/* SMART Framework */}
            {activeStep === 'smart' && (
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
                  <p className="text-sm text-indigo-700 font-medium">AI has filled these in — review and edit as needed.</p>
                </div>

                {[
                  { key: 'specific',   label: 'Specific',   desc: 'What exactly will you achieve?',  emoji: '🎯', step: 4 },
                  { key: 'measurable', label: 'Measurable', desc: 'How will you track progress?',     emoji: '📏', step: 5 },
                  { key: 'achievable', label: 'Achievable', desc: 'Why is this realistic?',           emoji: '💪', step: 6 },
                  { key: 'relevant',   label: 'Relevant',   desc: 'Why does this matter to you?',     emoji: '❤️', step: 7 },
                  { key: 'time_bound', label: 'Time-bound', desc: 'What is your timeline?',           emoji: '⏰', step: 8 },
                ].map(({ key, label, desc, emoji, step }) => (
                  <div key={key} className={fieldClass(step)}>
                    <label className={labelClass}>
                      {emoji} {label} — <span className="font-normal text-gray-500">{desc}</span>
                    </label>
                    <textarea
                      rows={3}
                      value={(fields as any)[key]}
                      onChange={set(key)}
                      className={inputClass + ' resize-none'}
                      placeholder={`${label}…`}
                    />
                  </div>
                ))}

                <div className={`flex gap-3 ${fieldClass(9)}`}>
                  <button
                    type="button"
                    onClick={() => setActiveStep('basic')}
                    className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 disabled:opacity-50 transition"
                  >
                    {isSubmitting ? 'Creating…' : '🚀 Create Goal'}
                  </button>
                </div>
              </div>
            )}
          </Form>
        )}
      </main>
    </div>
  );
}
