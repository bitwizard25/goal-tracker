import { Form, useNavigation } from '@remix-run/react';
import type { MetaFunction, ActionFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Create Short-term Goal - Goal Tracker' },
];

export const action: ActionFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { ShortTermGoal } = await import('../models/Goals');
  const { redirect } = await import('@remix-run/node');

  if (request.method !== 'POST') {
    return null;
  }

  const userId = await requireUserId(request);
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
      long_term_goal_id: long_term_goal_id || undefined,
      milestones,
      status: 'in_progress',
    });

    await goal.save();

    return redirect(`/goals`);
  } catch (error) {
    console.error('Create short-term goal error:', error);
    return { error: 'An error occurred creating the goal' };
  }
};

export default function CreateShortTermGoal() {
  const navigation = useNavigation();
  const [milestones, setMilestones] = useState<string[]>(['', '', '']);
  const isLoading = navigation.state === 'submitting';

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
        <Form method="post" className="space-y-8 rounded-lg border border-gray-200 bg-white p-6">
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
                defaultValue="medium"
                className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="What are you committing to achieve?"
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
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
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">No long-term goal</option>
              <option value="goal-1">Learn Spanish fluently</option>
              <option value="goal-2">Build a successful business</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Milestones</label>
              <button
                type="button"
                onClick={addMilestone}
                disabled={milestones.length >= 5}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                Add Milestone
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
                    className="rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {isLoading ? 'Creating...' : 'Create Goal'}
            </button>
          </div>
        </Form>
      </main>
    </div>
  );
}
