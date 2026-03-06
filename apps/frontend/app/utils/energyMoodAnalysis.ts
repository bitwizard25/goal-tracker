/**
 * Energy-Emotion Analysis Engine
 * Analyzes 16-state matrix combining energy and mood levels
 */

export type EnergyLevel = 'very_low' | 'low' | 'moderate' | 'high';
export type MoodLevel = 'very_negative' | 'negative' | 'neutral' | 'positive';

export interface EnergyMoodState {
  energy: EnergyLevel;
  mood: MoodLevel;
  quadrant: string;
  description: string;
  optimalTaskTypes: string[];
  recommendedActions: string[];
  burnoutRisk: boolean;
}

/**
 * Convert numeric scales (1-10) to categorical levels
 */
export function toEnergyLevel(score: number): EnergyLevel {
  if (score <= 2.5) return 'very_low';
  if (score <= 5) return 'low';
  if (score <= 7.5) return 'moderate';
  return 'high';
}

export function toMoodLevel(score: number): MoodLevel {
  if (score <= 2.5) return 'very_negative';
  if (score <= 5) return 'negative';
  if (score <= 7.5) return 'neutral';
  return 'positive';
}

/**
 * Get state description and characteristics
 */
export function getEnergyMoodState(energy: number, mood: number): EnergyMoodState {
  const energyLevel = toEnergyLevel(energy);
  const moodLevel = toMoodLevel(mood);

  const stateMap: Record<string, EnergyMoodState> = {
    'very_low-very_negative': {
      energy: 'very_low',
      mood: 'very_negative',
      quadrant: 'critical-danger',
      description: 'Exhausted and deeply demotivated - Burnout risk zone',
      optimalTaskTypes: ['rest', 'light_social', 'mindfulness'],
      recommendedActions: [
        'Take a break',
        'Practice self-care',
        'Reach out for support',
        'Consider postponing tasks',
      ],
      burnoutRisk: true,
    },
    'very_low-negative': {
      energy: 'very_low',
      mood: 'negative',
      quadrant: 'critical-danger',
      description: 'Very fatigued with low mood - High burnout risk',
      optimalTaskTypes: ['rest', 'routine', 'creative_relaxation'],
      recommendedActions: [
        'Rest and recover',
        'Do gentle activities',
        'Avoid stressful tasks',
      ],
      burnoutRisk: true,
    },
    'very_low-neutral': {
      energy: 'very_low',
      mood: 'neutral',
      quadrant: 'caution',
      description: 'Exhausted but stable - Need recovery',
      optimalTaskTypes: ['routine', 'small_wins', 'habit_based'],
      recommendedActions: ['Take breaks', 'Do routine tasks', 'Build momentum gradually'],
      burnoutRisk: true,
    },
    'very_low-positive': {
      energy: 'very_low',
      mood: 'positive',
      quadrant: 'balanced',
      description: 'Tired but motivated - Conserve energy for important tasks',
      optimalTaskTypes: ['important_only', 'mental_tasks', 'passion_projects'],
      recommendedActions: ['Focus on meaningful work', 'Take strategic breaks'],
      burnoutRisk: false,
    },
    'low-very_negative': {
      energy: 'low',
      mood: 'very_negative',
      quadrant: 'critical-danger',
      description: 'Low energy with crisis mood - Seek support',
      optimalTaskTypes: ['light_tasks', 'support', 'reflection'],
      recommendedActions: [
        'Talk to someone',
        'Do only essential tasks',
        'Practice stress relief',
      ],
      burnoutRisk: true,
    },
    'low-negative': {
      energy: 'low',
      mood: 'negative',
      quadrant: 'caution',
      description: 'Below average energy and mood - Avoid overcommitting',
      optimalTaskTypes: ['routine', 'collaborative', 'social'],
      recommendedActions: [
        'Work with others',
        'Do enjoyable tasks',
        'Take mood-boosting breaks',
      ],
      burnoutRisk: false,
    },
    'low-neutral': {
      energy: 'low',
      mood: 'neutral',
      quadrant: 'caution',
      description: 'Lower energy but stable - Pace yourself',
      optimalTaskTypes: ['moderate', 'routine', 'planning'],
      recommendedActions: [
        'Do moderate tasks',
        'Plan for tomorrow',
        'Take recovery time',
      ],
      burnoutRisk: false,
    },
    'low-positive': {
      energy: 'low',
      mood: 'positive',
      quadrant: 'balanced',
      description: 'Good mood but low energy - Good for creative thinking',
      optimalTaskTypes: ['creative', 'brainstorming', 'planning', 'learning'],
      recommendedActions: ['Leverage good mood for strategic work', 'Rest physically'],
      burnoutRisk: false,
    },
    'moderate-very_negative': {
      energy: 'moderate',
      mood: 'very_negative',
      quadrant: 'caution',
      description: 'Decent energy but struggling emotionally - Process emotions',
      optimalTaskTypes: ['expressive', 'journaling', 'physical', 'social_support'],
      recommendedActions: [
        'Express feelings',
        'Physical activity',
        'Talk it out',
        'Do physical tasks',
      ],
      burnoutRisk: false,
    },
    'moderate-negative': {
      energy: 'moderate',
      mood: 'negative',
      quadrant: 'neutral',
      description: 'Functional but discouraged - Do mood-lifting activities',
      optimalTaskTypes: ['social', 'achievement', 'hobby', 'team_work'],
      recommendedActions: [
        'Connect with others',
        'Celebrate small wins',
        'Do enjoyable work',
      ],
      burnoutRisk: false,
    },
    'moderate-neutral': {
      energy: 'moderate',
      mood: 'neutral',
      quadrant: 'neutral',
      description: 'Balanced state - Good for routine work and learning',
      optimalTaskTypes: ['analytical', 'routine', 'learning', 'administrative'],
      recommendedActions: [
        'Steady progress',
        'Build on foundations',
        'Do important work',
      ],
      burnoutRisk: false,
    },
    'moderate-positive': {
      energy: 'moderate',
      mood: 'positive',
      quadrant: 'optimal',
      description: 'Good all-around state - Productive and sustainable',
      optimalTaskTypes: [
        'any',
        'challenging',
        'creative',
        'collaborative',
      ],
      recommendedActions: [
        'Tackle important tasks',
        'Maintain momentum',
        'Enjoy the work',
      ],
      burnoutRisk: false,
    },
    'high-very_negative': {
      energy: 'high',
      mood: 'very_negative',
      quadrant: 'volatile',
      description: 'High energy but distressed - Channel energy productively',
      optimalTaskTypes: [
        'physical',
        'competitive',
        'high_intensity',
        'problem_solving',
      ],
      recommendedActions: [
        'Channel energy into productive work',
        'Physical activity',
        'Problem-solve',
      ],
      burnoutRisk: false,
    },
    'high-negative': {
      energy: 'high',
      mood: 'negative',
      quadrant: 'volatile',
      description: 'High energy but unmotivated - High intensity physical work',
      optimalTaskTypes: ['physical', 'challenge', 'competitive', 'intense'],
      recommendedActions: [
        'Do high-intensity work',
        'Physical exercise',
        'Challenging tasks',
      ],
      burnoutRisk: false,
    },
    'high-neutral': {
      energy: 'high',
      mood: 'neutral',
      quadrant: 'optimal',
      description: 'High energy and focused - Perfect for challenging work',
      optimalTaskTypes: ['difficult', 'challenging', 'creative', 'learning'],
      recommendedActions: [
        'Tackle the hardest task',
        'Take on challenges',
        'Push limits',
      ],
      burnoutRisk: false,
    },
    'high-positive': {
      energy: 'high',
      mood: 'positive',
      quadrant: 'peak',
      description: 'Peak performance state - Tackle the most challenging tasks',
      optimalTaskTypes: [
        'very_difficult',
        'important',
        'creative',
        'innovative',
        'flow',
      ],
      recommendedActions: [
        'Work on biggest goals',
        'Take on major challenges',
        'Create and innovate',
      ],
      burnoutRisk: false,
    },
  };

  const key = `${energyLevel}-${moodLevel}`;
  return stateMap[key] || stateMap['moderate-neutral'];
}

/**
 * Analyze energy-mood patterns over time
 */
export function analyzeEnergyMoodPatterns(
  completions: Array<{ energy_before: number; mood_before: number; date: Date }>,
) {
  const hourlyPatterns: Record<number, { energy: number[]; mood: number[] }> = {};

  completions.forEach((completion) => {
    const hour = new Date(completion.date).getHours();
    if (!hourlyPatterns[hour]) {
      hourlyPatterns[hour] = { energy: [], mood: [] };
    }
    hourlyPatterns[hour].energy.push(completion.energy_before);
    hourlyPatterns[hour].mood.push(completion.mood_before);
  });

  const analysis = Object.entries(hourlyPatterns).map(([hour, data]) => {
    const avgEnergy = data.energy.reduce((a, b) => a + b, 0) / data.energy.length;
    const avgMood = data.mood.reduce((a, b) => a + b, 0) / data.mood.length;

    return {
      hour: parseInt(hour),
      avgEnergy: Math.round(avgEnergy),
      avgMood: Math.round(avgMood),
      state: getEnergyMoodState(avgEnergy, avgMood),
    };
  });

  return analysis.sort((a, b) => a.hour - b.hour);
}

/**
 * Detect burnout risk based on energy-mood trends
 */
export function detectBurnoutRisk(
  recentCompletions: Array<{ energy_before: number; mood_before: number; date: Date }>,
): {
  riskScore: number;
  level: 'low' | 'moderate' | 'high' | 'critical';
  indicators: string[];
  recommendations: string[];
} {
  if (recentCompletions.length === 0) {
    return {
      riskScore: 0,
      level: 'low',
      indicators: [],
      recommendations: [],
    };
  }

  const avgEnergy = recentCompletions.reduce((a, b) => a + b.energy_before, 0) / recentCompletions.length;
  const avgMood = recentCompletions.reduce((a, b) => a + b.mood_before, 0) / recentCompletions.length;

  const indicators: string[] = [];
  let riskScore = 0;

  // Low energy indicator
  if (avgEnergy <= 3) {
    indicators.push('Consistently low energy levels');
    riskScore += 30;
  }

  // Low mood indicator
  if (avgMood <= 3) {
    indicators.push('Consistently negative mood');
    riskScore += 30;
  }

  // Declining trend
  const last5 = recentCompletions.slice(-5);
  if (last5.length >= 3) {
    const trend = last5.map(c => c.energy_before).reduce((a, b, i, arr) => {
      if (i === 0) return a;
      return a + (b - arr[i - 1]);
    }, 0);

    if (trend < -5) {
      indicators.push('Energy declining over time');
      riskScore += 20;
    }
  }

  // Very low combined state
  if (avgEnergy <= 4 && avgMood <= 4) {
    indicators.push('Combined low energy and mood');
    riskScore += 20;
  }

  const recommendations = [];
  if (riskScore >= 75) {
    recommendations.push('Take extended break or day off');
    recommendations.push('Seek support from friends or professionals');
    recommendations.push('Reassess your goals and commitments');
  } else if (riskScore >= 50) {
    recommendations.push('Take regular breaks');
    recommendations.push('Reduce task load temporarily');
    recommendations.push('Focus on self-care activities');
  } else if (riskScore >= 25) {
    recommendations.push('Monitor your energy and mood patterns');
    recommendations.push('Increase leisure time');
  }

  const level = riskScore >= 75 ? 'critical' : riskScore >= 50 ? 'high' : riskScore >= 25 ? 'moderate' : 'low';

  return {
    riskScore: Math.round(riskScore),
    level,
    indicators,
    recommendations,
  };
}
