import { z } from 'zod';

// ============ USER TYPES ============
export const UserSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  total_points: z.number().default(0),
  current_level: z.number().default(1),
  streak_count: z.number().default(0),
  last_login: z.date().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// ============ GOAL TYPES ============
export const SmartFrameworkSchema = z.object({
  specific: z.string(),
  measurable: z.string(),
  achievable: z.string(),
  relevant: z.string(),
  time_bound: z.string(),
});

export const LongTermGoalSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  title: z.string(),
  description: z.string(),
  target_date: z.date(),
  status: z.enum(['active', 'completed', 'paused', 'abandoned']),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string(),
  smart_framework: SmartFrameworkSchema,
  current_progress_percentage: z.number().min(0).max(100),
  created_at: z.date(),
  updated_at: z.date(),
});

export type LongTermGoal = z.infer<typeof LongTermGoalSchema>;

export const ShortTermGoalSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  long_term_goal_id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  start_date: z.date(),
  end_date: z.date(),
  status: z.enum(['active', 'completed', 'paused']),
  priority: z.enum(['low', 'medium', 'high']),
  milestones: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
  })).optional(),
  completed_milestones_count: z.number().default(0),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ShortTermGoal = z.infer<typeof ShortTermGoalSchema>;

// ============ TASK TYPES ============
export const DailyTaskSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  short_term_goal_id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  due_date: z.date(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.enum(['daily', 'weekly', 'custom']).optional(),
  difficulty_level: z.number().min(1).max(5),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
  tags: z.array(z.string()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type DailyTask = z.infer<typeof DailyTaskSchema>;

// ============ COMPLETION TYPES ============
export const TaskCompletionSchema = z.object({
  _id: z.string(),
  task_id: z.string(),
  user_id: z.string(),
  completed_at: z.date(),
  completion_time_minutes: z.number(),
  mood_before: z.number().min(1).max(10),
  mood_after: z.number().min(1).max(10),
  mood_improvement: z.number(),
  energy_before: z.number().min(1).max(10),
  energy_after: z.number().min(1).max(10),
  energy_change: z.number(),
  effort_rating: z.number().min(1).max(5),
  flow_state_detected: z.boolean(),
  points_earned: z.number(),
  streak_contribution: z.number(),
  difficulty_actual: z.number().min(1).max(5),
  completion_delay_minutes: z.number(),
  urgency_at_completion: z.enum(['low', 'medium', 'high', 'critical']),
  session_quality_score: z.number(),
  contextual_tags: z.array(z.string()).optional(),
  time_of_day_completed: z.string(),
});

export type TaskCompletion = z.infer<typeof TaskCompletionSchema>;

// ============ STREAK TYPES ============
export const StreakSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  type: z.enum(['daily_login', 'task_completion', 'category', 'mood_stability', 'flow_state']),
  current_count: z.number(),
  best_count: z.number(),
  last_completion_date: z.date(),
  multiplier_level: z.number(),
  grace_days_used: z.number(),
  streak_insurance_active: z.boolean(),
  momentum_score: z.number(),
  at_risk_status: z.boolean(),
});

export type Streak = z.infer<typeof StreakSchema>;

// ============ ACHIEVEMENT TYPES ============
export const AchievementSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  badge_id: z.string(),
  badge_name: z.string(),
  category: z.string(),
  earned_at: z.date(),
  points_awarded: z.number(),
  icon: z.string(),
  tier: z.enum(['bronze', 'silver', 'gold']),
  unlock_criteria_met: z.record(z.any()),
  hidden_metric: z.boolean(),
  display_priority: z.number(),
  notification_message: z.string(),
});

export type Achievement = z.infer<typeof AchievementSchema>;

// ============ STATS TYPES ============
export const UserStatsSchema = z.object({
  _id: z.string(),
  user_id: z.string(),
  date: z.date(),
  tasks_completed: z.number(),
  tasks_total: z.number(),
  points_earned: z.number(),
  points_spent: z.number(),
  mood_average: z.number().min(1).max(10),
  mood_variance: z.number(),
  emotional_trend: z.string(),
  energy_average: z.number().min(1).max(10),
  energy_variance: z.number(),
  energy_trend: z.string(),
  completion_rate: z.number(),
  on_time_rate: z.number(),
  early_completion_rate: z.number(),
  flow_state_sessions: z.number(),
  flow_state_hours: z.number(),
  average_completion_time: z.number(),
  energy_peak_hours: z.array(z.number()).optional(),
  energy_lowest_hours: z.array(z.number()).optional(),
  energy_mood_state_distribution: z.record(z.number()).optional(),
});

export type UserStats = z.infer<typeof UserStatsSchema>;

// ============ AUTH TYPES ============
export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  user: UserSchema.optional(),
  token: z.string().optional(),
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// ============ API RESPONSE TYPES ============
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};
