import { useLoaderData } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Analytics - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { DailyTask } = await import('../models/Tasks');
  const { User } = await import('../models/User');
  const { UserStats } = await import('../models/Analytics');

  await connectDB();
  const userId = await requireUserId(request);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const user: any = await User.findById(userId).lean();

  const [weekTasks, monthTasks, totalCompleted, weekStats] = await Promise.all([
    DailyTask.find({ user_id: userId, created_at: { $gte: startOfWeek } }).lean(),
    DailyTask.find({ user_id: userId, created_at: { $gte: startOfMonth } }).lean(),
    DailyTask.countDocuments({ user_id: userId, status: 'completed' }),
    UserStats.find({ user_id: userId, date: { $gte: startOfWeek } }).sort({ date: 1 }).lean(),
  ]);

  const weekCompleted = (weekTasks as any[]).filter((t) => t.status === 'completed');
  const monthCompleted = (monthTasks as any[]).filter((t) => t.status === 'completed');

  const moodEntries = (weekStats as any[]).filter((d) => d.mood_average != null);
  const energyEntries = (weekStats as any[]).filter((d) => d.energy_average != null);
  const avgMood = moodEntries.length > 0
    ? moodEntries.reduce((s, d) => s + d.mood_average, 0) / moodEntries.length : 0;
  const avgEnergy = energyEntries.length > 0
    ? energyEntries.reduce((s, d) => s + d.energy_average, 0) / energyEntries.length : 0;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyData = days.map((day, i) => {
    const dayStart = new Date(startOfWeek);
    dayStart.setDate(startOfWeek.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const dayTasks = (weekTasks as any[]).filter((t) => {
      const d = new Date(t.created_at);
      return d >= dayStart && d <= dayEnd;
    });
    const stat = (weekStats as any[]).find((s) => {
      const d = new Date(s.date);
      return d >= dayStart && d <= dayEnd;
    });
    return {
      date: day,
      tasks: dayTasks.filter((t) => t.status === 'completed').length,
      total: dayTasks.length,
      mood: stat?.mood_average ?? 0,
      energy: stat?.energy_average ?? 0,
    };
  });

  const categoryMap: Record<string, number> = {};
  (weekTasks as any[]).forEach((t) => {
    const cat = t.category ?? 'general';
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
  });
  const catTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1;
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([category, count]) => ({ category, count, percentage: Math.round((count / catTotal) * 100) }))
    .sort((a, b) => b.count - a.count);

  return json({
    stats: {
      week: {
        completed: weekCompleted.length,
        total: weekTasks.length,
        avgMood: Number(avgMood.toFixed(1)),
        avgEnergy: Number(avgEnergy.toFixed(1)),
      },
      month: { completed: monthCompleted.length, total: monthTasks.length },
      allTime: {
        completed: totalCompleted,
        points: user?.total_points ?? 0,
        streak: user?.streak_count ?? 0,
        level: user?.current_level ?? 1,
      },
    },
    dailyData,
    categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : [],
  });
};

const categoryColors: Record<string, string> = {
  health: 'bg-emerald-500', career: 'bg-blue-500', personal: 'bg-purple-500',
  education: 'bg-amber-500', finance: 'bg-green-500', relationships: 'bg-rose-500', general: 'bg-gray-400',
};

function StatCard({ label, value, sub, icon, bg }: {
  label: string; value: string | number; sub?: string; icon: string; bg: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-lg ${bg}`}>{icon}</div>
      </div>
      <p className="mt-3 text-3xl font-extrabold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs font-medium text-gray-500">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const { stats, dailyData, categoryBreakdown } = useLoaderData<typeof loader>();

  const weekRate = stats.week.total > 0
    ? Math.round((stats.week.completed / stats.week.total) * 100) : 0;
  const monthRate = stats.month.total > 0
    ? Math.round((stats.month.completed / stats.month.total) * 100) : 0;
  const maxTasks = Math.max(...dailyData.map((d: any) => d.total), 1);

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Your productivity insights at a glance</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8 space-y-8">

        {/* KPI Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="This Week"   value={`${stats.week.completed}/${stats.week.total}`}   sub={`${weekRate}% completion`}  icon="✅" bg="bg-blue-50 text-blue-600"    />
          <StatCard label="This Month"  value={`${stats.month.completed}/${stats.month.total}`} sub={`${monthRate}% completion`} icon="📅" bg="bg-indigo-50 text-indigo-600" />
          <StatCard label="Avg Mood"    value={stats.week.avgMood > 0 ? `${stats.week.avgMood}/10` : '—'}   sub="this week" icon="😊" bg="bg-emerald-50 text-emerald-600" />
          <StatCard label="Avg Energy"  value={stats.week.avgEnergy > 0 ? `${stats.week.avgEnergy}/10` : '—'} sub="this week" icon="⚡" bg="bg-amber-50 text-amber-600"   />
        </div>

        {/* Weekly Bar Chart */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Weekly Activity</h2>
              <p className="text-sm text-gray-500">Completed tasks per day</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500" />Done</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gray-200" />Total</span>
            </div>
          </div>

          <div className="flex items-end gap-2 h-36">
            {dailyData.map((day: any) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="relative w-full rounded-lg overflow-hidden" style={{ height: '100px' }}>
                  <div className="absolute inset-0 bg-gray-100 rounded-lg" />
                  {day.total > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gray-200 rounded-lg"
                      style={{ height: `${(day.total / maxTasks) * 100}%` }}
                    />
                  )}
                  {day.tasks > 0 && (
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg"
                      style={{ height: `${(day.tasks / maxTasks) * 100}%` }}
                    />
                  )}
                  {day.tasks > 0 && (
                    <span className="absolute inset-0 flex items-end justify-center pb-1.5 text-xs font-bold text-white z-10">
                      {day.tasks}
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold text-gray-500">{day.date}</span>
              </div>
            ))}
          </div>

          {/* Mood/energy mini row */}
          <div className="mt-5 pt-4 border-t border-gray-100 grid grid-cols-7 gap-2">
            {dailyData.map((day: any) => (
              <div key={`${day.date}-metrics`} className="flex flex-col items-center gap-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  day.mood > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.mood > 0 ? day.mood : '—'}
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  day.energy > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-400'
                }`}>
                  {day.energy > 0 ? day.energy : '—'}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Mood</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Energy</span>
          </div>
        </div>

        {/* All-time + Category */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-5">All-Time Stats</p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: 'Tasks Done',    value: stats.allTime.completed,              suffix: '' },
                { label: 'Total Points',  value: stats.allTime.points.toLocaleString(), suffix: '' },
                { label: 'Streak',        value: stats.allTime.streak,                 suffix: ' 🔥' },
                { label: 'Level',         value: stats.allTime.level,                  suffix: ' ⭐' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-xs font-semibold text-blue-300/70">{item.label}</p>
                  <p className="mt-1 text-3xl font-extrabold">{item.value}{item.suffix}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Tasks by Category</h2>
            {categoryBreakdown.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Complete tasks to see breakdown</p>
            ) : (
              <div className="space-y-4">
                {categoryBreakdown.slice(0, 5).map((cat: any) => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold capitalize text-gray-700">{cat.category}</span>
                      <span className="text-sm font-bold text-gray-900">
                        {cat.count} <span className="text-gray-400 font-normal">tasks</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${categoryColors[cat.category] ?? 'bg-gray-400'} transition-all duration-700`}
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-gray-500 w-8 text-right">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insight Card */}
        <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-lg">💡</div>
            <div>
              <p className="font-semibold text-blue-900">Weekly Insight</p>
              {stats.week.completed === 0 ? (
                <p className="mt-1 text-sm text-blue-800/80">Start completing tasks today to unlock personalized productivity insights.</p>
              ) : weekRate >= 80 ? (
                <p className="mt-1 text-sm text-blue-800/80">Excellent week! You completed {weekRate}% of your tasks. Maintain this momentum.</p>
              ) : weekRate >= 50 ? (
                <p className="mt-1 text-sm text-blue-800/80">Good progress — {stats.week.completed} tasks done. Push through the remaining {stats.week.total - stats.week.completed} to hit your target.</p>
              ) : (
                <p className="mt-1 text-sm text-blue-800/80">You're at {weekRate}% this week. Try breaking tasks into smaller steps to build momentum.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
