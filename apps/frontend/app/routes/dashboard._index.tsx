import React, { useState, useEffect } from 'react';
import { useLoaderData, Link, useFetcher } from '@remix-run/react';
import { json, type LoaderFunction, type ActionFunction, type MetaFunction } from '@remix-run/node';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent, DragOverlay, defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const meta: MetaFunction = () => [
  { title: 'Dashboard - Goal Tracker' },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { User } = await import('../models/User');
  const { DailyTask } = await import('../models/Tasks');
  const { UserStats } = await import('../models/Analytics');

  await connectDB();
  const userId = await requireUserId(request);
  const user: any = await User.findById(userId).select('-password_hash').lean();

  if (!user) throw new Response('Not Found', { status: 404 });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const tasks = await DailyTask.find({
    user_id: userId,
    due_date: { $gte: startOfDay, $lte: endOfDay },
  })
    .sort({ sort_order: 1, created_at: -1 })
    .lean() as any[];

  const todayStats = await UserStats.findOne({
    user_id: userId,
    date: { $gte: startOfDay, $lte: endOfDay },
  }).lean() as any;

  return json({
    user: {
      email: user.email,
      total_points: user.total_points,
      current_level: user.current_level,
      streak_count: user.streak_count,
    },
    stats: {
      tasks_today: tasks.length,
      tasks_completed_today: tasks.filter((t) => t.status === 'completed').length,
      mood_average: todayStats?.mood_average ?? null,
      energy_average: todayStats?.energy_average ?? null,
    },
    recentTasks: tasks.map((t: any) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      difficulty_level: t.difficulty_level,
      sort_order: t.sort_order ?? 0,
      tags: t.tags ?? [],
    })),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const { connectDB } = await import('../lib/db.server');
  const { requireUserId } = await import('../services/auth.server');
  const { DailyTask } = await import('../models/Tasks');
  const { UserStats } = await import('../models/Analytics');

  await connectDB();
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const actionType = formData.get('_action');

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  if (actionType === 'update_metrics') {
    const energy = formData.get('energy');
    const mood = formData.get('mood');
    let stats = await UserStats.findOne({ user_id: userId, date: { $gte: startOfDay } });
    if (!stats) stats = new UserStats({ user_id: userId, date: new Date() });
    if (energy) stats.energy_average = Number(energy);
    if (mood) stats.mood_average = Number(mood);
    await stats.save();
    return json({ success: true });
  }

  if (actionType === 'update_task_status') {
    const taskId = formData.get('taskId');
    const status = formData.get('status');
    if (taskId && status) {
      await DailyTask.findOneAndUpdate({ _id: taskId, user_id: userId }, { status });
    }
    return json({ success: true });
  }

  if (actionType === 'reorder_tasks') {
    const raw = formData.get('taskIds') as string;
    try {
      const taskIds: string[] = JSON.parse(raw);
      await Promise.all(
        taskIds.map((id, index) =>
          DailyTask.findOneAndUpdate({ _id: id, user_id: userId }, { sort_order: index }),
        ),
      );
    } catch { /* ignore parse errors */ }
    return json({ success: true });
  }

  return json({ success: false }, { status: 400 });
};

// ─── Priority badge ────────────────────────────────────────────────────────────
const priorityStyles = [
  { bg: 'bg-red-500',    ring: 'ring-red-200',    label: 'P1' },
  { bg: 'bg-orange-400', ring: 'ring-orange-200',  label: 'P2' },
  { bg: 'bg-yellow-400', ring: 'ring-yellow-200',  label: 'P3' },
  { bg: 'bg-gray-300',   ring: 'ring-gray-200',    label: 'P4' },
];

function PriorityBadge({ rank }: { rank: number }) {
  const s = priorityStyles[Math.min(rank, priorityStyles.length - 1)];
  return (
    <span
      title={`Priority ${rank + 1} — drag to reprioritize`}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 ${s.bg} ${s.ring}`}
    >
      {rank + 1}
    </span>
  );
}

// ─── SortableTaskItem ─────────────────────────────────────────────────────────
function SortableTaskItem({
  task, isDone, rank,
}: { task: any; isDone: boolean; rank: number }) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative flex cursor-grab items-center gap-3 rounded-xl border p-3.5 shadow-sm transition-all active:cursor-grabbing ${
        isDragging
          ? 'border-blue-300 bg-blue-50/80 shadow-lg'
          : isDone
          ? 'border-emerald-100 bg-emerald-50/50 hover:shadow-md'
          : 'border-gray-100 bg-white hover:border-blue-100 hover:shadow-md'
      }`}
    >
      {/* Drag handle indicator */}
      <div className="flex shrink-0 flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity">
        {[0,1,2].map(i => (
          <span key={i} className="flex gap-0.5">
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
            <span className="h-0.5 w-0.5 rounded-full bg-current" />
          </span>
        ))}
      </div>

      {/* Status icon */}
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
        isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
      }`}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round"
            d={isDone ? 'M5 13l4 4L19 7' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </div>

      {/* Task info */}
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-semibold leading-snug truncate ${
          isDone ? 'text-emerald-900 line-through opacity-70' : 'text-gray-900'
        }`}>
          {task.title}
        </h4>
        <div className="mt-1 flex items-center gap-2">
          {/* Difficulty dots */}
          <span className="flex gap-0.5">
            {[1,2,3,4,5].map((n) => (
              <span key={n} className={`h-1.5 w-1.5 rounded-full ${
                n <= task.difficulty_level
                  ? isDone ? 'bg-emerald-400' : 'bg-blue-400'
                  : 'bg-gray-200'
              }`} />
            ))}
          </span>
          {task.tags?.slice(0, 2).map((tag: string) => (
            <span key={tag} className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Priority badge (only on pending tasks) */}
      {!isDone && <PriorityBadge rank={rank} />}
    </div>
  );
}

// ─── TaskBoard ────────────────────────────────────────────────────────────────
function TaskBoard({ tasks }: { tasks: any[] }) {
  const statusFetcher  = useFetcher();
  const reorderFetcher = useFetcher();
  const [localTasks, setLocalTasks] = useState(tasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const pendingTasks   = localTasks.filter((t) => t.status !== 'completed');
  const completedTasks = localTasks.filter((t) => t.status === 'completed');
  const activeTask     = activeId ? localTasks.find((t) => t.id === activeId) : null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    const task   = localTasks.find((t) => t.id === taskId);
    if (!task) return;

    // ── Dropped on a column zone ──
    if (overId === 'col-pending' || overId === 'col-completed') {
      const newStatus = overId === 'col-pending' ? 'pending' : 'completed';
      if (newStatus !== task.status) {
        setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
        const fd = new FormData();
        fd.append('_action', 'update_task_status');
        fd.append('taskId', taskId);
        fd.append('status', newStatus);
        statusFetcher.submit(fd, { method: 'post' });
      }
      return;
    }

    const overTask = localTasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (task.status === overTask.status) {
      // ── Same column → reorder for priority ──
      const colTasks  = localTasks.filter((t) => t.status === task.status);
      const oldIndex  = colTasks.findIndex((t) => t.id === taskId);
      const newIndex  = colTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== newIndex) {
        const reordered = arrayMove(colTasks, oldIndex, newIndex);
        setLocalTasks((prev) => [
          ...prev.filter((t) => t.status !== task.status),
          ...reordered,
        ]);

        // Persist new order
        const fd = new FormData();
        fd.append('_action', 'reorder_tasks');
        fd.append('taskIds', JSON.stringify(reordered.map((t) => t.id)));
        reorderFetcher.submit(fd, { method: 'post' });
      }
    } else {
      // ── Different column → status change ──
      const newStatus = overTask.status;
      setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
      const fd = new FormData();
      fd.append('_action', 'update_task_status');
      fd.append('taskId', taskId);
      fd.append('status', newStatus);
      statusFetcher.submit(fd, { method: 'post' });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={(e) => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
    >
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">

        {/* ── To Do Column ── */}
        <div id="col-pending" className="flex flex-col gap-3 rounded-2xl bg-gray-50/60 p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-gray-900">To Do</h2>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                {pendingTasks.length}
              </span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              ↕ drag to reprioritize
            </span>
          </div>

          <SortableContext id="col-pending" items={pendingTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex min-h-[140px] flex-col gap-2">
              {pendingTasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-400">
                  All caught up! 🎉
                </div>
              ) : (
                pendingTasks.map((task, index) => (
                  <SortableTaskItem key={task.id} task={task} isDone={false} rank={index} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

        {/* ── Completed Column ── */}
        <div id="col-completed" className="flex flex-col gap-3 rounded-2xl bg-emerald-50/30 p-5 border border-emerald-100/50">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-900">Completed</h2>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
              {completedTasks.length}
            </span>
          </div>

          <SortableContext id="col-completed" items={completedTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            <div className="flex min-h-[140px] flex-col gap-2">
              {completedTasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/50 p-6 text-sm text-emerald-500/60">
                  Drop tasks here to complete them
                </div>
              ) : (
                completedTasks.map((task, index) => (
                  <SortableTaskItem key={task.id} task={task} isDone={true} rank={index} />
                ))
              )}
            </div>
          </SortableContext>
        </div>

      </div>

      {/* Drag overlay — ghost card while dragging */}
      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
        }}
      >
        {activeTask && (
          <div className="flex cursor-grabbing items-center gap-3 rounded-xl border border-blue-300 bg-white p-3.5 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-400/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{activeTask.title}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

// ─── MetricSlider ─────────────────────────────────────────────────────────────
const moodEmojis: [number, string][] = [[2,'😢'],[4,'😕'],[6,'😐'],[8,'😊'],[10,'🤩']];
const energyEmojis: [number, string][] = [[2,'🪫'],[4,'😴'],[6,'⚡'],[8,'💪'],[10,'🔥']];

function getEmoji(type: string, val: number) {
  const map = type === 'mood' ? moodEmojis : energyEmojis;
  return (map.find(([threshold]) => val <= threshold) ?? map[map.length - 1])[1];
}

function MetricSlider({ title, value, type, gradientClass }: any) {
  const fetcher = useFetcher();
  const [localValue, setLocalValue] = useState(value || 5);
  const isPristine = value === null;
  const icon = getEmoji(type, localValue);

  useEffect(() => {
    if (value !== null) setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(Number(e.target.value));
  };

  const handleRelease = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    const currentValue = Number((e.target as HTMLInputElement).value);
    if (currentValue === value) return;
    const formData = new FormData();
    formData.append('_action', 'update_metrics');
    formData.append(type, currentValue.toString());
    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="group flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg bg-gradient-to-br ${gradientClass}`}>
            <span className="text-xl">{icon}</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        {isPristine ? (
          <span className="text-sm font-medium text-gray-400">Not Tracked</span>
        ) : (
          <span className={`text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
            {localValue}/10
          </span>
        )}
      </div>

      <div className="mt-6">
        <input
          type="range"
          min="1"
          max="10"
          value={localValue}
          onChange={handleChange}
          onMouseUp={handleRelease}
          onTouchEnd={handleRelease}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-100"
          style={{ accentColor: 'currentColor' }}
        />
        <div className="mt-2 flex justify-between text-xs text-gray-400 font-medium tracking-wide">
          <span>Low</span>
          <span>{isPristine ? 'Drag to track' : 'High'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const data = useLoaderData<typeof loader>();
  const { user, stats, recentTasks } = data;

  const [greeting, setGreeting] = useState('Welcome');
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {greeting} 👋
              </h1>
              <p className="mt-1 text-sm font-medium text-gray-500">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-2 shadow-sm transition-transform hover:scale-105">
                <span className="text-lg">🔥</span>
                <span className="text-sm font-bold text-amber-700">{user.streak_count} day streak</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 shadow-sm transition-transform hover:scale-105">
                <span className="text-lg">⭐</span>
                <span className="text-sm font-bold text-blue-700">Level {user.current_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-8 pb-28 lg:pb-8">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-blue-500 transition-colors">Total Points</p>
            <p className="text-4xl font-extrabold text-gray-900">{user.total_points.toLocaleString()}</p>
          </div>
          <div className="group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-emerald-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors">Current Level</p>
            <p className="text-4xl font-extrabold text-gray-900">{user.current_level}</p>
          </div>
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden flex items-center justify-between">
            <div className="z-10">
              <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-2">Today's Progress</p>
              <div className="flex items-baseline gap-2">
                <p className="text-5xl font-extrabold">{stats.tasks_completed_today}</p>
                <p className="text-base text-indigo-200 font-bold tracking-wide">/ {stats.tasks_today || 0} done</p>
              </div>
            </div>
            <div className="z-10 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
              <span className="text-3xl drop-shadow-lg">🏆</span>
            </div>
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" />
          </div>
        </div>

        {/* State Trackers */}
        <div className="mt-10">
          <h2 className="text-xl font-extrabold text-gray-900 mb-5">Log Your State</h2>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MetricSlider title="Energy Level" value={stats.energy_average} type="energy" gradientClass="from-cyan-400 to-blue-500" />
            <MetricSlider title="Mood"         value={stats.mood_average}   type="mood"   gradientClass="from-emerald-400 to-green-500" />
          </div>
        </div>

        {/* Task Board */}
        <div className="mt-12">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">Task Board</h2>
              <p className="mt-0.5 text-xs text-gray-400 font-medium">
                Drag within a column to reprioritize · Drag across to change status
              </p>
            </div>
            <Link
              to="/tasks/new"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all"
            >
              ✨ New Task
            </Link>
          </div>

          <TaskBoard tasks={recentTasks} />
        </div>

      </div>
    </div>
  );
}
