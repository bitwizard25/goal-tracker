/**
 * Urgency Scoring Algorithm
 * Calculates real-time urgency based on deadline proximity, task importance, and impact
 */

// import type { DailyTask } from '@goal-tracker/shared';

interface UrgencyParams {
  task: any;
  daysUntilDue: number;
  taskImportance: 'low' | 'medium' | 'high';
  estimatedCompletionDays: number; // How many days to complete
}

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export function calculateUrgency(params: UrgencyParams): UrgencyLevel {
  const { daysUntilDue, taskImportance, estimatedCompletionDays } = params;

  // If task is already past due
  if (daysUntilDue <= 0) {
    return 'critical';
  }

  // Calculate time pressure score (0-100)
  const timePressure = Math.max(0, Math.min(100, (estimatedCompletionDays / daysUntilDue) * 100));

  // Importance multiplier
  const importanceScore = {
    low: 0.5,
    medium: 1.0,
    high: 1.5,
  };

  const finalScore = timePressure * importanceScore[taskImportance];

  // Determine urgency level
  if (finalScore >= 75 || daysUntilDue <= 1) {
    return 'critical';
  } else if (finalScore >= 50 || daysUntilDue <= 3) {
    return 'high';
  } else if (finalScore >= 25 || daysUntilDue <= 7) {
    return 'medium';
  } else {
    return 'low';
  }
}

export function getUrgencyColor(urgency: UrgencyLevel): string {
  const colors = {
    low: '#10b981', // green
    medium: '#f59e0b', // amber
    high: '#ef4444', // red
    critical: '#7c2d12', // dark red
  };
  return colors[urgency];
}

export function getUrgencyNotificationIntensity(urgency: UrgencyLevel): 'low' | 'medium' | 'high' {
  const intensity = {
    low: 'low',
    medium: 'low',
    high: 'medium',
    critical: 'high',
  };
  return intensity[urgency] as 'low' | 'medium' | 'high';
}

/**
 * Calculate optimal task ordering based on urgency and other factors
 */
export interface TaskWithScore {
  taskId: string;
  urgencyScore: number;
  recommendedPosition: number;
}

export function orderTasksByUrgency(
  tasks: Array<{
    id: string;
    daysUntilDue: number;
    importance: 'low' | 'medium' | 'high';
    estimatedDays: number;
  }>,
): TaskWithScore[] {
  const tasksWithScores = tasks.map((task) => {
    const urgency = calculateUrgency({
      task: task as any,
      daysUntilDue: task.daysUntilDue,
      taskImportance: task.importance,
      estimatedCompletionDays: task.estimatedDays,
    });

    const scoreMap = {
      critical: 100,
      high: 75,
      medium: 50,
      low: 25,
    };

    return {
      taskId: task.id,
      urgencyScore: scoreMap[urgency],
      recommendedPosition: 0,
    };
  });

  // Sort by urgency score descending
  tasksWithScores.sort((a, b) => b.urgencyScore - a.urgencyScore);

  // Add recommended position
  tasksWithScores.forEach((task, index) => {
    task.recommendedPosition = index + 1;
  });

  return tasksWithScores;
}

/**
 * Predict optimal completion time window based on urgency and user patterns
 */
export function getOptimalCompletionWindow(
  urgencyLevel: UrgencyLevel,
  userChronotype: 'morning' | 'afternoon' | 'evening',
): { start: number; end: number }[] {
  // Return hour ranges (0-23)
  const windows = {
    critical: {
      morning: [{ start: 6, end: 12 }],
      afternoon: [{ start: 12, end: 18 }],
      evening: [{ start: 18, end: 23 }],
    },
    high: {
      morning: [
        { start: 6, end: 9 },
        { start: 19, end: 23 },
      ],
      afternoon: [
        { start: 12, end: 15 },
        { start: 19, end: 23 },
      ],
      evening: [
        { start: 18, end: 23 },
      ],
    },
    medium: {
      morning: [{ start: 6, end: 11 }],
      afternoon: [{ start: 14, end: 17 }],
      evening: [{ start: 19, end: 23 }],
    },
    low: {
      morning: [{ start: 10, end: 12 }],
      afternoon: [{ start: 14, end: 16 }],
      evening: [{ start: 20, end: 22 }],
    },
  };

  return windows[urgencyLevel][userChronotype] || [{ start: 9, end: 17 }];
}
