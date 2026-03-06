import mongoose from 'mongoose';

// User stats schema
const userStatsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    tasks_completed: {
      type: Number,
      default: 0,
    },
    tasks_total: {
      type: Number,
      default: 0,
    },
    points_earned: {
      type: Number,
      default: 0,
    },
    points_spent: {
      type: Number,
      default: 0,
    },
    mood_average: {
      type: Number,
      min: 1,
      max: 10,
    },
    mood_variance: {
      type: Number,
      default: 0,
    },
    emotional_trend: String,
    energy_average: {
      type: Number,
      min: 1,
      max: 10,
    },
    energy_variance: {
      type: Number,
      default: 0,
    },
    energy_trend: String,
    completion_rate: {
      type: Number,
      default: 0,
    },
    on_time_rate: {
      type: Number,
      default: 0,
    },
    early_completion_rate: {
      type: Number,
      default: 0,
    },
    flow_state_sessions: {
      type: Number,
      default: 0,
    },
    flow_state_hours: {
      type: Number,
      default: 0,
    },
    average_completion_time: {
      type: Number,
      default: 0,
    },
    energy_peak_hours: [Number],
    energy_lowest_hours: [Number],
    energy_mood_state_distribution: Map,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userStatsSchema.index({ user_id: 1, date: 1 });

export const UserStats = mongoose.models.UserStats || mongoose.model('UserStats', userStatsSchema);

// User psychology profile schema
const userPsychologyProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    chronotype: {
      type: String,
      enum: ['morning', 'afternoon', 'evening'],
      default: 'afternoon',
    },
    habit_strength_by_category: Map,
    motivation_triggers: [String],
    procrastination_pattern: String,
    optimal_task_timing: [String],
    emotional_baseline: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    mood_sensitivity: {
      type: Number,
      default: 1,
    },
    emotional_volatility: {
      type: Number,
      default: 0,
    },
    energy_baseline: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    energy_variance: {
      type: Number,
      default: 0,
    },
    peak_energy_hours: [Number],
    self_efficacy_score: {
      type: Number,
      default: 0,
    },
    confidence_trend: String,
    behavioral_economics_profile: {
      loss_aversion_level: { type: Number, default: 0 },
      sunk_cost_sensitivity: { type: Number, default: 0 },
    },
    optimal_energy_mood_state: String,
    burnout_risk_score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const UserPsychologyProfile = mongoose.models.UserPsychologyProfile || mongoose.model(
  'UserPsychologyProfile',
  userPsychologyProfileSchema,
);

// Habit stack schema
const habitStackSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    trigger_task_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DailyTask',
    },
    task_sequence: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DailyTask',
      },
    ],
    frequency_type: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: 'daily',
    },
    completion_rate: {
      type: Number,
      default: 0,
    },
    average_completion_time: {
      type: Number,
      default: 0,
    },
    efficacy_score: {
      type: Number,
      default: 0,
    },
    suggested_modifications: [String],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

habitStackSchema.index({ user_id: 1 });

export const HabitStack = mongoose.models.HabitStack || mongoose.model('HabitStack', habitStackSchema);

// Energy-Mood state matrix schema
const energyMoodStateMatrixSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    date: {
      type: Date,
      required: true,
    },
    state_quadrant_distribution: Map,
    task_completion_by_state: Map,
    average_points_by_state: Map,
    optimal_states_for_tasks: Map,
    burnout_zone_detection: [String],
    state_transitions: Map,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

energyMoodStateMatrixSchema.index({ user_id: 1, date: 1 });

export const EnergyMoodStateMatrix = mongoose.models.EnergyMoodStateMatrix || mongoose.model(
  'EnergyMoodStateMatrix',
  energyMoodStateMatrixSchema,
);
