import { Form, useNavigation, useLoaderData, useFetcher } from '@remix-run/react';
import { json, type MetaFunction, type ActionFunction, type LoaderFunction } from '@remix-run/node';
import { useState, useEffect } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Create Short-term Goal - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { connectDB } = await import('../lib/db.server');
  const { LongTermGoal } = await import('../models/Goals');

  const userId = await requireUserId(request);
  await connectDB();

  const longTermGoals = await LongTermGoal.find({ user_id: userId, status: 'active' }).select('_id title').lean();

  return json({
    longTermGoals: longTermGoals.map((g: any) => ({ id: g._id.toString(), title: g.title }))
  });
};

export const action: ActionFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { connectDB } = await import('../lib/db.server');
  const { ShortTermGoal } = await import('../models/Goals');
  const { redirect } = await import('@remix-run/node');

  if (request.method !== 'POST') {
    return null;
  }

  const userId = await requireUserId(request);
  await connectDB();
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const start_date = formData.get('start_date') as string;
  const end_date = formData.get('end_date') as string;
  const priority = formData.get('priority') as string;
  const long_term_goal_id = formData.get('long_term_goal_id') as string;

  if (!title || !description || !start_date || !end_date) {
    return { error: 'Missing required fields' };
  }

  const milestones: any[] = [];
  for (let i = 0; i < 5; i++) {
    const milestone = formData.get(`milestone_${i}`);
    if (milestone && typeof milestone === 'string' && milestone.trim() !== '') {
      milestones.push({ title: milestone, completed: false });
    }
  }

  try {
    const goal = new ShortTermGoal({
      user_id: userId,
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      priority: priority || 'medium',
      long_term_goal_id: long_term_goal_id || null,
      milestones,
      status: 'active',
    });

    await goal.save();

    return redirect(`/goals`);
  } catch (error) {
    console.error('Create short-term goal error:', error);
    return { error: 'An error occurred creating the goal' };
  }
};

export default function CreateShortTermGoal() {
  const { longTermGoals } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const aiFetcher = useFetcher<any>();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    priority: 'medium',
    long_term_goal_id: '',
  });

  const [milestones, setMilestones] = useState<string[]>(['', '', '']);
  const isLoading = navigation.state === 'submitting';
  const isAILoading = aiFetcher.state === 'submitting';

  // Listen for AI completion response
  useEffect(() => {
    if (aiFetcher.data?.success && aiFetcher.data.data) {
      const aiData = aiFetcher.data.data;
      setFormData(prev => ({
        ...prev,
        title: aiData.title || prev.title,
        description: aiData.description || prev.description,
        start_date: aiData.start_date || prev.start_date,
        end_date: aiData.end_date || prev.end_date,
        priority: aiData.priority || prev.priority,
        long_term_goal_id: aiData.long_term_goal_id || prev.long_term_goal_id,
      }));

      if (aiData.milestones && Array.isArray(aiData.milestones)) {
        setMilestones(aiData.milestones.slice(0, 5));
      }
    } else if (aiFetcher.data?.error) {
      alert(aiFetcher.data.error);
    }
  }, [aiFetcher.data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateAI = () => {
    if (!formData.description || formData.description.length < 5) {
      alert("Please provide a bit more detail in the Description field for the AI to understand your goal.");
      return;
    }

    const data = new FormData();
    data.append("description", formData.description);
    aiFetcher.submit(data, { method: "post", action: "/api/generate-goal" });
  };

  const addMilestone = () => {
    if (milestones.length < 5) {
      setMilestones([...milestones, '']);
    }
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, value: string) => {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    setMilestones(newMilestones);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Short-term Goal</h1>
          <p className="mt-1 text-sm text-gray-600">Break down your long-term vision into actionable milestones</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Form method="post" className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5">
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="block text-sm font-bold text-blue-900">
                What are you committing to achieve? *
              </label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isAILoading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isAILoading ? (
                  <span className="animate-pulse">Generating...</span>
                ) : (
                  <><span>✨</span> Autofill with AI</>
                )}
              </button>
            </div>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Type a brief idea here and hit the '✨ Autofill with AI' button, or fill out the form manually..."
              className="mt-2 block w-full rounded-lg border border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="text-xs text-blue-600/70 font-medium">The AI will generate an actionable title, estimate dates, map out milestones, and link it to your Long-Term Goals.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Goal Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Spanish Level 1 Course"
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="long_term_goal_id" className="block text-sm font-medium text-gray-700">
              Link to Long-term Goal (Optional)
            </label>
            <select
              id="long_term_goal_id"
              name="long_term_goal_id"
              value={formData.long_term_goal_id}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No long-term goal</option>
              {longTermGoals.map((goal: { id: string, title: string }) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Milestones</label>
              <button
                type="button"
                onClick={addMilestone}
                disabled={milestones.length >= 5}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                + Add Milestone
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    name={`milestone_${index}`}
                    value={milestone}
                    onChange={(e) => updateMilestone(index, e.target.value)}
                    placeholder={`Milestone ${index + 1}`}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="rounded-md border border-red-200 bg-red-50 text-red-600 px-3 py-2 text-sm font-medium hover:bg-red-100 hover:border-red-300 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isAILoading}
              className="flex-1 rounded-full bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 hover:shadow-md disabled:opacity-50 transition"
            >
              {isLoading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </Form>
      </main>
    </div>
  );
}
