import { Form, useNavigation } from '@remix-run/react';
import type { MetaFunction, ActionFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Create Long-term Goal - Goal Tracker' },
];

export const action: ActionFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal } = await import('../models/Goals');
  const { redirect } = await import('@remix-run/node');

  if (request.method !== 'POST') {
    return null;
  }

  const userId = await requireUserId(request);
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const target_date = formData.get('target_date') as string;
  const category = formData.get('category') as string;
  const priority = formData.get('priority') as string;

  if (!title || !description || !target_date || !category) {
    return { error: 'Missing required fields' };
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

    return redirect(`/goals`);
  } catch (error) {
    console.error('Create long-term goal error:', error);
    return { error: 'An error occurred creating the goal' };
  }
};

export default function CreateLongTermGoal() {
  const navigation = useNavigation();
  const [activeStep, setActiveStep] = useState<'basic' | 'smart'>('basic');
  const isLoading = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Long-term Goal</h1>
          <p className="mt-1 text-sm text-gray-600">Define your vision with the SMART framework</p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Form method="post" className="space-y-8">
          {/* Step Indicator */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setActiveStep('basic')}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeStep === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveStep('smart')}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeStep === 'smart'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              SMART Framework
            </button>
          </div>

          {/* Basic Info Step */}
          {activeStep === 'basic' && (
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Goal Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="e.g., Learn Spanish fluently"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
                  placeholder="Describe your goal in detail..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label htmlFor="target_date" className="block text-sm font-medium text-gray-700">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    id="target_date"
                    name="target_date"
                    required
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select a category</option>
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career</option>
                    <option value="education">Education</option>
                    <option value="relationships">Relationships</option>
                    <option value="finance">Finance</option>
                    <option value="personal">Personal Development</option>
                  </select>
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

              <button
                type="button"
                onClick={() => setActiveStep('smart')}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition"
              >
                Next: SMART Framework
              </button>
            </div>
          )}

          {/* SMART Framework Step */}
          {activeStep === 'smart' && (
            <div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6">
              <div className="rounded-md bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>SMART Goals:</strong> Define your goal using Specific, Measurable, Achievable, Relevant, and Time-bound criteria.
                </p>
              </div>

              <div>
                <label htmlFor="specific" className="block text-sm font-medium text-gray-700">
                  Specific - What exactly do you want to achieve?
                </label>
                <textarea
                  id="specific"
                  name="specific"
                  rows={3}
                  placeholder="Be as specific as possible..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="measurable" className="block text-sm font-medium text-gray-700">
                  Measurable - How will you measure progress?
                </label>
                <textarea
                  id="measurable"
                  name="measurable"
                  rows={3}
                  placeholder="Define metrics and milestones..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="achievable" className="block text-sm font-medium text-gray-700">
                  Achievable - Is this goal realistic?
                </label>
                <textarea
                  id="achievable"
                  name="achievable"
                  rows={3}
                  placeholder="Explain why this goal is achievable..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="relevant" className="block text-sm font-medium text-gray-700">
                  Relevant - Why does this matter to you?
                </label>
                <textarea
                  id="relevant"
                  name="relevant"
                  rows={3}
                  placeholder="Connect to your values and larger vision..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="time_bound" className="block text-sm font-medium text-gray-700">
                  Time-bound - What's your timeline?
                </label>
                <textarea
                  id="time_bound"
                  name="time_bound"
                  rows={3}
                  placeholder="Define key dates and deadlines..."
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveStep('basic')}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {isLoading ? 'Creating...' : 'Create Goal'}
                </button>
              </div>
            </div>
          )}
        </Form>
      </main>
    </div>
  );
}
