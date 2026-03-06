import { useLoaderData } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Analytics - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { DailyTask } = await import('../models/Tasks');
  const { User } = await import('../models/User');

  const userId = await requireUserId(request);

  // Calculate date ranges
  const now = new Date();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Fetch basic user context
  const user: any = await User.findById(userId).lean();

  // Aggregate Tasks for this week
  const weekTasks = await DailyTask.find({
    user_id: userId,
    created_at: { $gte: startOfWeek }
  }).lean();

  const weekTasksCompleted = weekTasks.filter(t => t.status === 'completed');

  // Aggregate Tasks for this month
  const monthTasks = await DailyTask.find({
    user_id: userId,
    created_at: { $gte: startOfMonth }
  }).lean();

  const monthTasksCompleted = monthTasks.filter(t => t.status === 'completed');

  // Total all-time stats
  const totalTasksCompleted = await DailyTask.countDocuments({
    user_id: userId,
    status: 'completed'
  });

  return {
    stats: {
      thisWeek: {
        tasksCompleted: weekTasksCompleted.length,
        tasksTotal: weekTasks.length,
        averageMood: 7.0, // Needs UserStats tracking implementation
        averageEnergy: 7.0,
        flowStateSessions: 0, // Mocked for now until Analytics is fully hooked up
        totalPoints: user?.total_points || 0, // Roughly speaking
      },
      thisMonth: {
        tasksCompleted: monthTasksCompleted.length,
        tasksTotal: monthTasks.length,
        averageMood: 6.9,
        averageEnergy: 6.6,
        flowStateSessions: 0,
        totalPoints: user?.total_points || 0,
      },
      allTime: {
        tasksCompleted: totalTasksCompleted,
        goalsCompleted: 0, // Mocked 
        streakBest: user?.current_streak || 0,
        totalPoints: user?.total_points || 0,
      },
    },
    // Keep daily data and insights mocked for now as a placeholder 
    // real implementation requires more complex Mongoose aggregations
    dailyData: [
      { date: 'Mon', tasks: 5, mood: 6, energy: 6 },
      { date: 'Tue', tasks: 6, mood: 7, energy: 7 },
      { date: 'Wed', tasks: 4, mood: 5, energy: 5 },
      { date: 'Thu', tasks: 7, mood: 8, energy: 7 },
      { date: 'Fri', tasks: 6, mood: 8, energy: 8 },
      { date: 'Sat', tasks: 3, mood: 7, energy: 6 },
      { date: 'Sun', tasks: 2, mood: 6, energy: 5 },
    ],
    categoryBreakdown: [
      { category: 'Health', count: 45, percentage: 25 },
      { category: 'Career', count: 60, percentage: 33 },
      { category: 'Personal', count: 48, percentage: 27 },
      { category: 'Education', count: 27, percentage: 15 },
    ],
    insights: [
      {
        type: 'neutral',
        text: 'Keep tracking your tasks to see personalized insights about your productivity.',
      },
    ],
  };
};

export default function AnalyticsPage() {
  const data = useLoaderData<typeof loader>();
  const { stats, dailyData, categoryBreakdown, insights } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">Insights into your goal-setting progress</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* This Week Stats */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">Tasks Completed</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {stats.thisWeek.tasksCompleted}/{stats.thisWeek.tasksTotal}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {Math.round((stats.thisWeek.tasksCompleted / stats.thisWeek.tasksTotal) * 100)}%
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">Avg Mood</p>
              <p className="mt-1 text-2xl font-bold text-green-600">{stats.thisWeek.averageMood.toFixed(1)}</p>
              <p className="mt-1 text-xs text-gray-500">/10</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">Avg Energy</p>
              <p className="mt-1 text-2xl font-bold text-purple-600">{stats.thisWeek.averageEnergy.toFixed(1)}</p>
              <p className="mt-1 text-xs text-gray-500">/10</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">Flow States</p>
              <p className="mt-1 text-2xl font-bold text-cyan-600">{stats.thisWeek.flowStateSessions}</p>
              <p className="mt-1 text-xs text-gray-500">sessions</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">Points Earned</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">{stats.thisWeek.totalPoints}</p>
              <p className="mt-1 text-xs text-gray-500">this week</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-600">This Month</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">{stats.thisMonth.totalPoints}</p>
              <p className="mt-1 text-xs text-gray-500">points</p>
            </div>
          </div>
        </div>

        {/* Daily Activity Chart */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Weekly Overview</h2>
          <div className="mt-6">
            <div className="space-y-4">
              {dailyData.map((day: any) => (
                <div key={day.date}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{day.date}</span>
                    <span className="font-medium text-gray-900">{day.tasks} tasks</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <div className="h-2 rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(day.tasks / 7) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-16 text-xs">
                      <span className="text-gray-600">😐 {day.mood} 💪 {day.energy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">Tasks by Category</h2>
            <div className="mt-6 space-y-4">
              {categoryBreakdown.map((cat: any) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700">{cat.category}</span>
                    <span className="font-medium text-gray-900">{cat.count} tasks</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{cat.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
            <div className="mt-6 space-y-4">
              {insights.map((insight: any, i: number) => (
                <div
                  key={i}
                  className={`rounded-lg p-4 text-sm ${insight.type === 'positive'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : insight.type === 'attention'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}
                >
                  {insight.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* All-Time Stats */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">All-Time Statistics</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats.allTime.tasksCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Goals Completed</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.allTime.goalsCompleted}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Streak</p>
              <p className="mt-2 text-3xl font-bold text-orange-600">{stats.allTime.streakBest}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">{stats.allTime.totalPoints}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
