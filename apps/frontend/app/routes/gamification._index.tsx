import { useLoaderData } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Gamification - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { User } = await import('../models/User');

  const userId = await requireUserId(request);
  const user: any = await User.findById(userId).lean();

  if (!user) {
    throw new Error('User not found');
  }

  // Simple logic: each level takes 1000 points
  const currentLevelPoints = (user.current_level - 1) * 1000;
  const pointsInCurrentLevel = user.total_points - currentLevelPoints;
  const experiencePercentage = Math.min(100, Math.max(0, Math.round((pointsInCurrentLevel / 1000) * 100)));

  // Mock data - in production, fetch from Gamification/Achievements API (would need more models)
  return {
    user: {
      total_points: user.total_points || 0,
      current_level: user.current_level || 1,
      experience_percentage: experiencePercentage,
      streak_count: user.current_streak || 0,
      streak_best: user.longest_streak || 0,
    },
    achievements: [
      {
        id: '1',
        title: 'First Steps',
        description: 'Complete your first task',
        icon: '👣',
        unlocked: true,
        date: '2025-01-15',
      },
      {
        id: '2',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '⚔️',
        unlocked: Number(user.longest_streak) >= 7,
        date: Number(user.longest_streak) >= 7 ? '2025-01-22' : null,
      },
      {
        id: '3',
        title: 'Month Master',
        description: 'Maintain a 30-day streak',
        icon: '👑',
        unlocked: Number(user.longest_streak) >= 30,
        date: null,
      },
      {
        id: '4',
        title: 'Level 5',
        description: 'Reach level 5',
        icon: '🌟',
        unlocked: user.current_level >= 5,
        date: null,
      },
      {
        id: '5',
        title: 'Perfect Day',
        description: 'Complete all tasks in a day',
        icon: '✨',
        unlocked: true,
        date: '2025-02-01',
      },
      {
        id: '6',
        title: 'Level 10',
        description: 'Reach level 10',
        icon: '🚀',
        unlocked: user.current_level >= 10,
        date: null,
      },
    ],
    leaderboard: [
      { rank: 1, username: 'Alex', points: 3500, streak: 45 },
      { rank: 2, username: 'Jordan', points: 3200, streak: 38 },
      { rank: 3, username: user.username || 'You', points: user.total_points || 0, streak: user.current_streak || 0 },
      { rank: 4, username: 'Casey', points: 980, streak: 12 },
      { rank: 5, username: 'Morgan', points: 850, streak: 8 },
    ],
    recentAchievements: [
      { title: 'Perfect Day', date: '2025-02-01' },
      { title: 'Week Warrior', date: '2025-01-22' },
    ],
  };
};

export default function GamificationPage() {
  const data = useLoaderData<typeof loader>();
  const { user, achievements, leaderboard, recentAchievements } = data;

  const levels = [
    { level: 1, minPoints: 0, name: 'Novice', color: 'bg-gray-500' },
    { level: 2, minPoints: 100, name: 'Beginner', color: 'bg-green-500' },
    { level: 3, minPoints: 250, name: 'Intermediate', color: 'bg-blue-500' },
    { level: 4, minPoints: 500, name: 'Advanced', color: 'bg-purple-500' },
    { level: 5, minPoints: 1000, name: 'Expert', color: 'bg-yellow-500' },
    { level: 6, minPoints: 1500, name: 'Master', color: 'bg-red-500' },
    { level: 7, minPoints: 2000, name: 'Legend', color: 'bg-pink-500' },
  ];

  const currentLevel = levels.find(l => l.level === user.current_level) || levels[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Gamification</h1>
          <p className="mt-1 text-sm text-gray-600">Earn points, unlock achievements, and climb the leaderboard</p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Level Card */}
          <div className={`rounded-lg ${currentLevel.color} p-6 text-white shadow-lg`}>
            <p className="text-sm font-medium opacity-90">Current Level</p>
            <p className="mt-2 text-4xl font-bold">{user.current_level}</p>
            <p className="mt-1 text-sm opacity-90">{currentLevel.name}</p>
          </div>

          {/* Points Card */}
          <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Total Points</p>
            <p className="mt-2 text-4xl font-bold text-blue-600">{user.total_points}</p>
            <p className="mt-1 text-xs text-gray-500">{user.experience_percentage}% to next level</p>
          </div>

          {/* Streak Card */}
          <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="mt-2 text-4xl font-bold text-orange-600">{user.streak_count}</p>
            <p className="mt-1 text-xs text-gray-500">days</p>
          </div>

          {/* Best Streak Card */}
          <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-600">Best Streak</p>
            <p className="mt-2 text-4xl font-bold text-green-600">{user.streak_best}</p>
            <p className="mt-1 text-xs text-gray-500">days</p>
          </div>
        </div>

        {/* Experience Progress */}
        <div className="mt-8 rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Experience Progress</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {user.current_level} → {user.current_level + 1}
              </span>
              <span className="text-sm font-medium text-gray-900">{user.experience_percentage}%</span>
            </div>
            <div className="mt-2 h-4 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${user.experience_percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          <p className="mt-1 text-sm text-gray-600">Unlock achievements by reaching milestones</p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement: any) => (
              <div
                key={achievement.id}
                className={`rounded-lg border p-4 transition ${achievement.unlocked
                  ? 'bg-white border-gray-200 shadow-sm hover:shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-60'
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.unlocked && (
                    <span className="inline-block h-6 w-6 rounded-full bg-green-100 text-center text-sm text-green-700">
                      ✓
                    </span>
                  )}
                </div>
                {achievement.unlocked && achievement.date && (
                  <p className="mt-2 text-xs text-gray-500">
                    Unlocked {new Date(achievement.date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900">Global Leaderboard</h2>
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((entry: any) => (
                    <tr
                      key={entry.rank}
                      className={entry.username === 'You' ? 'bg-blue-50' : ''}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{entry.username}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.points.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{entry.streak} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Achievements Sidebar */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Unlocks</h2>
            <div className="mt-6 space-y-4">
              {recentAchievements.length === 0 ? (
                <p className="text-sm text-gray-600">No recent achievements yet!</p>
              ) : (
                recentAchievements.map((achievement: any, i: number) => (
                  <div key={i} className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-semibold text-green-900">{achievement.title}</p>
                    <p className="text-xs text-green-700">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Level Progression Guide */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Level Progression</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {levels.map(level => (
              <div
                key={level.level}
                className={`rounded-lg p-4 ${level.level <= user.current_level
                  ? `${level.color} text-white`
                  : 'bg-gray-100 text-gray-700'
                  }`}
              >
                <p className="text-2xl font-bold">Level {level.level}</p>
                <p className="mt-1 text-sm font-medium">{level.name}</p>
                <p className="mt-2 text-xs opacity-90">{level.minPoints}+ points</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
