import { Form, useNavigation } from '@remix-run/react';
import type { MetaFunction, ActionFunction } from '@remix-run/node';
import { useState } from 'react';

export const meta: MetaFunction = () => [
  { title: 'Complete Task - Goal Tracker' },
];

export const action: ActionFunction = async ({ request, params }) => {
  const { requireUserId } = await import('../services/auth.server');
  const { DailyTask } = await import('../models/Tasks');
  const { User } = await import('../models/User');
  const { redirect } = await import('@remix-run/node');

  if (request.method !== 'POST') {
    return null;
  }

  const userId = await requireUserId(request);
  const formData = await request.formData();
  const taskId = params.taskId;

  try {
    const task = await DailyTask.findOne({ _id: taskId, user_id: userId });

    if (!task) {
      return { error: 'Task not found' };
    }

    if (task.status === 'completed') {
      return { error: 'Task already completed' };
    }

    const mood_before = parseInt(formData.get('mood_before') as string);
    const mood_after = parseInt(formData.get('mood_after') as string);
    const energy_before = parseInt(formData.get('energy_before') as string);
    const energy_after = parseInt(formData.get('energy_after') as string);
    const effort_rating = parseInt(formData.get('effort_rating') as string);
    const completion_time_minutes = parseInt(formData.get('completion_time_minutes') as string);
    const flow_state_detected = formData.get('flow_state_detected') === 'on';

    // Calculate points (simple version for now)
    const moodImprovement = mood_after - mood_before;
    const energyChange = energy_after - energy_before;
    const points_earned = Math.round(
      (30 * effort_rating + moodImprovement * 10 + energyChange * 5 + (flow_state_detected ? 50 : 0)) / 10,
    );

    // Update Task
    task.status = 'completed';
    // @ts-ignore - type definitions might be missing these fields in DailyTask schema
    task.completed_at = new Date();
    // @ts-ignore
    task.actual_duration = completion_time_minutes;
    await task.save();

    // Update User
    const user = await User.findById(userId);
    if (user) {
      user.total_points += Math.max(0, points_earned); // Prevent negative points

      // Simple level up logic: level = floor(points / 1000) + 1
      const newLevel = Math.floor(user.total_points / 1000) + 1;
      if (newLevel > user.current_level) {
        user.current_level = newLevel;
      }

      await user.save();
    }

    return redirect(`/dashboard`);
  } catch (error) {
    console.error('Task completion error:', error);
    return { error: 'An error occurred completing the task' };
  }
};

export default function CompleteTaskPage() {
  const navigation = useNavigation();
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(7);
  const [energyBefore, setEnergyBefore] = useState(5);
  const [energyAfter, setEnergyAfter] = useState(7);
  const [effort, setEffort] = useState(3);
  const [time, setTime] = useState('30');
  const [flowState, setFlowState] = useState(false);
  const isLoading = navigation.state === 'submitting';

  const moodImprovement = moodAfter - moodBefore;
  const energyChange = energyAfter - energyBefore;
  const estimatedPoints = Math.round(
    (30 * effort + moodImprovement * 10 + energyChange * 5 + (flowState ? 50 : 0)) / 10,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Complete Task</h1>
          <p className="mt-1 text-sm text-gray-600">Track how you felt during this task</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <Form method="post" className="space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {/* Mood Before */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              How was your mood before starting? {moodBefore}/10
            </label>
            <div className="mt-4">
              <input
                type="range"
                name="mood_before"
                min="1"
                max="10"
                value={moodBefore}
                onChange={(e) => setMoodBefore(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>😢 Terrible</span>
                <span>😐 Neutral</span>
                <span>😄 Amazing</span>
              </div>
            </div>
          </div>

          {/* Mood After */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              How is your mood now? {moodAfter}/10
            </label>
            <div className="mt-4">
              <input
                type="range"
                name="mood_after"
                min="1"
                max="10"
                value={moodAfter}
                onChange={(e) => setMoodAfter(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>😢 Terrible</span>
                <span>😐 Neutral</span>
                <span>😄 Amazing</span>
              </div>
              {moodImprovement !== 0 && (
                <p className="mt-2 text-sm font-medium text-green-600">
                  {moodImprovement > 0 ? '+' : ''}{moodImprovement} mood change
                </p>
              )}
            </div>
          </div>

          {/* Energy Before */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              How was your energy before? {energyBefore}/10
            </label>
            <div className="mt-4">
              <input
                type="range"
                name="energy_before"
                min="1"
                max="10"
                value={energyBefore}
                onChange={(e) => setEnergyBefore(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>🪫 Exhausted</span>
                <span>⚡ Energized</span>
              </div>
            </div>
          </div>

          {/* Energy After */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              How is your energy now? {energyAfter}/10
            </label>
            <div className="mt-4">
              <input
                type="range"
                name="energy_after"
                min="1"
                max="10"
                value={energyAfter}
                onChange={(e) => setEnergyAfter(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>🪫 Exhausted</span>
                <span>⚡ Energized</span>
              </div>
              {energyChange !== 0 && (
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {energyChange > 0 ? '+' : ''}{energyChange} energy change
                </p>
              )}
            </div>
          </div>

          {/* Effort Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              How much effort did this task require? {effort}/5
            </label>
            <div className="mt-4 flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setEffort(level)}
                  className={`flex-1 rounded-md py-2 font-medium transition ${effort === level
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  {['🟢', '🟡', '🟠', '🔴', '🔴'][level - 1]}
                </button>
              ))}
            </div>
          </div>

          {/* Completion Time */}
          <div>
            <label htmlFor="completion_time_minutes" className="block text-sm font-medium text-gray-700">
              How long did it take? (minutes)
            </label>
            <input
              type="number"
              id="completion_time_minutes"
              name="completion_time_minutes"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              min="1"
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Flow State */}
          <div className="flex items-center gap-3 rounded-lg bg-blue-50 p-4">
            <input
              type="checkbox"
              id="flow_state_detected"
              name="flow_state_detected"
              checked={flowState}
              onChange={(e) => setFlowState(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="flow_state_detected" className="flex-1 text-sm font-medium text-gray-700">
              I was in a flow state (fully immersed and focused)
            </label>
            {flowState && <span className="text-xl">🌊</span>}
          </div>

          {/* Points Estimate */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-800">
              You'll earn approximately <span className="font-bold text-green-900">{estimatedPoints}</span> points
              for completing this task!
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg"
          >
            {isLoading ? 'Recording...' : '✓ Mark as Complete'}
          </button>
        </Form>
      </main>
    </div>
  );
}
