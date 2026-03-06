/**
 * Points calculation engine
 * Dynamic points based on multiple factors
 */

interface PointsCalculationParams {
  baseDifficulty: number; // 1-5
  completionSpeed: 'fast' | 'normal' | 'slow'; // relative to estimated time
  moodImprovement: number; // mood_after - mood_before
  energyChange: number; // energy_after - energy_before
  streakMultiplier: number; // 1, 2, 3, 5 based on streak
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  flowStateDetected: boolean;
}

export function calculatePoints(params: PointsCalculationParams): number {
  let points = 0;

  // Base points from difficulty (10-50 points)
  const difficultyPoints = params.baseDifficulty * 10;
  points += difficultyPoints;

  // Speed bonus (0-25 points)
  if (params.completionSpeed === 'fast') {
    points += 25;
  } else if (params.completionSpeed === 'normal') {
    points += 15;
  } else {
    points += 5; // slow completion still gets some bonus
  }

  // Mood improvement bonus (0-30 points)
  if (params.moodImprovement > 0) {
    points += Math.min(30, params.moodImprovement * 3);
  }

  // Energy change bonus (0-20 points)
  if (params.energyChange >= 0) {
    points += Math.min(20, params.energyChange * 2);
  }

  // Flow state bonus (50 points)
  if (params.flowStateDetected) {
    points += 50;
  }

  // Urgency bonus (0-40 points)
  const urgencyBonus = {
    low: 0,
    medium: 10,
    high: 25,
    critical: 40,
  };
  points += urgencyBonus[params.urgencyLevel];

  // Apply streak multiplier
  points = Math.round(points * params.streakMultiplier);

  return Math.max(10, points); // Minimum 10 points
}

export function calculateStreakMultiplier(days: number): number {
  if (days < 7) return 1;
  if (days < 14) return 2;
  if (days < 30) return 3;
  if (days < 100) return 5;
  return 10;
}

export function calculateLevelProgress(totalPoints: number): {
  level: number;
  progressPercent: number;
  pointsToNextLevel: number;
} {
  // Exponential leveling: Level 1 = 100 points, Level 2 = 300 points, etc.
  let level = 1;
  let pointsNeeded = 0;

  while (pointsNeeded + level * 100 <= totalPoints) {
    pointsNeeded += level * 100;
    level += 1;
  }

  const pointsForCurrentLevel = level * 100;
  const pointsEarned = totalPoints - pointsNeeded;
  const progressPercent = Math.round((pointsEarned / pointsForCurrentLevel) * 100);
  const pointsToNextLevel = pointsForCurrentLevel - pointsEarned;

  return {
    level,
    progressPercent,
    pointsToNextLevel,
  };
}
