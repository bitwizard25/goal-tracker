import { useLoaderData, Link } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Goals - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { LongTermGoal, ShortTermGoal } = await import('../models/Goals');

  const userId = await requireUserId(request);

  const [longTermGoals, shortTermGoals] = await Promise.all([
    LongTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ShortTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
  ]);

  return {
    longTermGoals,
    shortTermGoals,
  };
};

export default function GoalsPage() {
  const { longTermGoals, shortTermGoals } = useLoaderData<typeof loader>();
  const [activeTab, setActiveTab] = useState<'long-term' | 'short-term'>('long-term');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Goals</h1>
            <div className="flex gap-2">
              <Link
                to="/goals/long-term/new"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                + Long-term Goal
              </Link>
              <Link
                to="/goals/short-term/new"
                className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
              >
                + Short-term Goal
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('long-term')}
            className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === 'long-term'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            Long-term Goals ({longTermGoals.length})
          </button>
          <button
            onClick={() => setActiveTab('short-term')}
            className={`px-4 py-3 font-medium border-b-2 transition ${activeTab === 'short-term'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            Short-term Goals ({shortTermGoals.length})
          </button>
        </div>

        {/* Long-term Goals Tab */}
        {activeTab === 'long-term' && (
          <div className="mt-8 space-y-4">
            {longTermGoals.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">No long-term goals yet. Create one to get started!</p>
              </div>
            ) : (
              longTermGoals.map((goal: any) => (
                <div key={goal._id} className="rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${goal.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : goal.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {goal.status === 'active' ? 'Active' : 'Completed'}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">{goal.current_progress_percentage}%</span>
                          </div>
                          <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${goal.current_progress_percentage}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Category:</span>
                            <p className="font-medium text-gray-900 capitalize">{goal.category}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Priority:</span>
                            <p className="font-medium text-gray-900 capitalize">{goal.priority}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Target:</span>
                            <p className="font-medium text-gray-900">
                              {new Date(goal.target_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Link
                        to={`/goals/long-term/${goal._id}`}
                        className="rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Link>
                      <button className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Short-term Goals Tab */}
        {activeTab === 'short-term' && (
          <div className="mt-8 space-y-4">
            {shortTermGoals.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
                <p className="text-gray-600">No short-term goals yet. Create one to get started!</p>
              </div>
            ) : (
              shortTermGoals.map((goal: any) => (
                <div key={goal._id} className="rounded-lg border border-gray-200 bg-white p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${goal.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : goal.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {goal.status === 'in_progress' ? 'In Progress' : 'Completed'}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900">Milestones</h4>
                        <div className="mt-2 space-y-2">
                          {goal.milestones?.map((milestone: any) => (
                            <div key={milestone.id} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={milestone.completed}
                                className="h-4 w-4 rounded border-gray-300"
                                readOnly
                              />
                              <span
                                className={
                                  milestone.completed ? 'line-through text-gray-400' : 'text-gray-700'
                                }
                              >
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-600">
                        Due: {new Date(goal.end_date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="ml-4 flex gap-2">
                      <Link
                        to={`/goals/short-term/${goal._id}`}
                        className="rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
