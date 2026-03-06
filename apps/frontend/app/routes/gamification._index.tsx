import { useLoaderData } from '@remix-run/react';
import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';

export const meta: MetaFunction = () => [
  { title: 'Rewards - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { User } = await import('../models/User');

  await connectDB();
  const userId = await requireUserId(request);
  const user: any = await User.findById(userId).lean();

  if (!user) throw new Error('User not found');

  const pointsPerLevel = 1000;
  const currentLevelPoints = (user.current_level - 1) * pointsPerLevel;
  const pointsInLevel = user.total_points - currentLevelPoints;
  const xpPercent = Math.min(100, Math.max(0, Math.round((pointsInLevel / pointsPerLevel) * 100)));
  const pointsToNext = pointsPerLevel - pointsInLevel;

  const levelNames = ['', 'Novice', 'Beginner', 'Apprentice', 'Intermediate', 'Advanced',
    'Expert', 'Master', 'Legend', 'Champion', 'Grandmaster'];

  return json({
    user: {
      email: user.email,
      total_points: user.total_points ?? 0,
      current_level: user.current_level ?? 1,
      level_name: levelNames[user.current_level] ?? 'Grandmaster+',
      xp_percent: xpPercent,
      points_to_next: pointsToNext > 0 ? pointsToNext : 0,
      streak_count: user.streak_count ?? 0,
      longest_streak: user.longest_streak ?? 0,
    },
    achievements: [
      { id: '1', title: 'First Steps',    description: 'Complete your first task',     icon: '👣', unlocked: true,                                   rarity: 'common'   },
      { id: '2', title: 'Week Warrior',   description: 'Maintain a 7-day streak',      icon: '⚔️', unlocked: (user.longest_streak ?? 0) >= 7,         rarity: 'uncommon' },
      { id: '3', title: 'Perfect Day',    description: 'Complete all tasks in a day',  icon: '✨', unlocked: true,                                   rarity: 'uncommon' },
      { id: '4', title: 'Level 5',        description: 'Reach level 5',                icon: '🌟', unlocked: (user.current_level ?? 1) >= 5,          rarity: 'rare'     },
      { id: '5', title: 'Month Master',   description: 'Maintain a 30-day streak',     icon: '👑', unlocked: (user.longest_streak ?? 0) >= 30,        rarity: 'epic'     },
      { id: '6', title: 'Level 10',       description: 'Reach level 10',               icon: '🚀', unlocked: (user.current_level ?? 1) >= 10,         rarity: 'epic'     },
      { id: '7', title: 'Century Club',   description: 'Complete 100 tasks',           icon: '💯', unlocked: (user.total_points ?? 0) >= 500,         rarity: 'rare'     },
      { id: '8', title: 'Unstoppable',    description: 'Maintain a 100-day streak',    icon: '🔥', unlocked: (user.longest_streak ?? 0) >= 100,       rarity: 'legendary'},
    ],
    leaderboard: [
      { rank: 1, username: 'Alex J.',   points: 3500, streak: 45, isMe: false },
      { rank: 2, username: 'Jordan K.', points: 3200, streak: 38, isMe: false },
      { rank: 3, username: user.email?.split('@')[0] ?? 'You', points: user.total_points ?? 0, streak: user.streak_count ?? 0, isMe: true },
      { rank: 4, username: 'Casey M.', points: 980, streak: 12, isMe: false },
      { rank: 5, username: 'Morgan R.', points: 850, streak: 8,  isMe: false },
    ],
  });
};

const rarityStyles: Record<string, { ring: string; glow: string; badge: string; badgeText: string }> = {
  common:    { ring: 'ring-gray-200',   glow: '',                               badge: 'bg-gray-100 text-gray-600',    badgeText: 'Common'    },
  uncommon:  { ring: 'ring-emerald-200',glow: 'shadow-emerald-100',             badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Uncommon' },
  rare:      { ring: 'ring-blue-200',   glow: 'shadow-blue-100',                badge: 'bg-blue-100 text-blue-700',    badgeText: 'Rare'      },
  epic:      { ring: 'ring-purple-300', glow: 'shadow-purple-100',              badge: 'bg-purple-100 text-purple-700',badgeText: 'Epic'      },
  legendary: { ring: 'ring-amber-300',  glow: 'shadow-amber-200 shadow-lg',     badge: 'bg-amber-100 text-amber-700',  badgeText: 'Legendary' },
};

const levelColors = [
  'from-gray-500 to-gray-600',
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-blue-500',
];

export default function GamificationPage() {
  const { user, achievements, leaderboard } = useLoaderData<typeof loader>();

  const levelGradient = levelColors[(user.current_level - 1) % levelColors.length];
  const unlockedCount = achievements.filter((a: any) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Rewards
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">{unlockedCount}/{achievements.length} achievements unlocked</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8 space-y-8">

        {/* ── Hero Level Card ── */}
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${levelGradient} p-8 text-white shadow-2xl`}>
          {/* Decorative blobs */}
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-white/70">Current Rank</p>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-6xl font-extrabold">{user.current_level}</span>
                <span className="text-2xl font-bold text-white/80">{user.level_name}</span>
              </div>

              {/* XP Bar */}
              <div className="mt-4 w-full sm:w-72">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white/70">Level Progress</span>
                  <span className="text-xs font-bold">{user.xp_percent}%</span>
                </div>
                <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-700"
                    style={{ width: `${user.xp_percent}%` }}
                  />
                </div>
                {user.points_to_next > 0 && (
                  <p className="mt-1.5 text-xs text-white/60">{user.points_to_next} pts to level {user.current_level + 1}</p>
                )}
              </div>
            </div>

            {/* Stats pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-4 min-w-[90px]">
                <span className="text-2xl font-extrabold">{user.total_points.toLocaleString()}</span>
                <span className="mt-1 text-xs font-semibold text-white/70">Total Points</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-4 min-w-[90px]">
                <span className="text-2xl font-extrabold">{user.streak_count}🔥</span>
                <span className="mt-1 text-xs font-semibold text-white/70">Day Streak</span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-4 min-w-[90px]">
                <span className="text-2xl font-extrabold">{user.longest_streak}</span>
                <span className="mt-1 text-xs font-semibold text-white/70">Best Streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Achievements ── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
              <p className="text-sm text-gray-500">Unlock by reaching milestones</p>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700">
              {unlockedCount}/{achievements.length}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {achievements.map((a: any) => {
              const style = rarityStyles[a.rarity] ?? rarityStyles.common;
              return (
                <div
                  key={a.id}
                  className={`relative rounded-2xl border bg-white p-5 transition-all duration-300 ${
                    a.unlocked
                      ? `ring-2 ${style.ring} shadow-md ${style.glow} hover:scale-[1.02]`
                      : 'border-gray-100 opacity-50 grayscale'
                  }`}
                >
                  {a.unlocked && (
                    <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow">✓</div>
                  )}
                  <div className="text-4xl mb-3">{a.icon}</div>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug">{a.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">{a.description}</p>
                  <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`}>
                    {style.badgeText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Leaderboard ── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Leaderboard</h2>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {leaderboard.map((entry: any) => (
                <div
                  key={entry.rank}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    entry.isMe ? 'bg-blue-50/80' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 text-center shrink-0">
                    {entry.rank === 1 ? <span className="text-2xl">🥇</span>
                    : entry.rank === 2 ? <span className="text-2xl">🥈</span>
                    : entry.rank === 3 ? <span className="text-2xl">🥉</span>
                    : <span className="text-sm font-bold text-gray-500">#{entry.rank}</span>}
                  </div>

                  {/* Avatar */}
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    entry.isMe ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {entry.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${entry.isMe ? 'text-blue-700' : 'text-gray-900'}`}>
                      {entry.username} {entry.isMe && <span className="text-xs font-normal text-blue-500">(you)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{entry.streak} day streak 🔥</p>
                  </div>

                  {/* Points */}
                  <div className="shrink-0 text-right">
                    <p className={`text-sm font-extrabold ${entry.isMe ? 'text-blue-700' : 'text-gray-800'}`}>
                      {entry.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Level Roadmap ── */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-5">Level Roadmap</h2>
          <div className="relative">
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" />
            <div className="space-y-3">
              {[1,2,3,4,5,6,7,8,9,10].map((lvl) => {
                const reached = lvl <= user.current_level;
                const isCurrent = lvl === user.current_level;
                const names = ['', 'Novice', 'Beginner', 'Apprentice', 'Intermediate', 'Advanced',
                  'Expert', 'Master', 'Legend', 'Champion', 'Grandmaster'];
                const grad = levelColors[(lvl - 1) % levelColors.length];
                return (
                  <div key={lvl} className="relative flex items-center gap-4 pl-12">
                    {/* Dot */}
                    <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold z-10 shadow-sm ${
                      isCurrent ? `bg-gradient-to-br ${grad} text-white ring-4 ring-white ring-offset-2`
                      : reached ? 'bg-emerald-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                      {reached && !isCurrent ? '✓' : lvl}
                    </div>

                    <div className={`flex-1 flex items-center justify-between rounded-xl px-5 py-3 transition-all ${
                      isCurrent ? `bg-gradient-to-r ${grad} text-white shadow-lg`
                      : reached ? 'bg-white border border-emerald-100'
                      : 'bg-white border border-gray-100'
                    }`}>
                      <div>
                        <p className={`font-bold text-sm ${isCurrent ? 'text-white' : reached ? 'text-gray-900' : 'text-gray-500'}`}>
                          Level {lvl} — {names[lvl]}
                        </p>
                        {isCurrent && (
                          <p className="text-xs text-white/70 mt-0.5">{user.xp_percent}% progress · {user.points_to_next} pts to next</p>
                        )}
                      </div>
                      <span className={`text-xs font-semibold ${isCurrent ? 'text-white/80' : 'text-gray-400'}`}>
                        {(lvl - 1) * 1000}+ pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
