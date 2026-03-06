import mongoose from 'mongoose';

// Streak schema
const streakSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    type: {
      type: String,
      enum: ['daily_login', 'task_completion', 'category', 'mood_stability', 'flow_state'],
      required: true,
    },
    current_count: {
      type: Number,
      default: 0,
    },
    best_count: {
      type: Number,
      default: 0,
    },
    last_completion_date: {
      type: Date,
      required: true,
    },
    multiplier_level: {
      type: Number,
      default: 1,
    },
    grace_days_used: {
      type: Number,
      default: 0,
    },
    streak_insurance_active: {
      type: Boolean,
      default: false,
    },
    momentum_score: {
      type: Number,
      default: 0,
    },
    at_risk_status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

streakSchema.index({ user_id: 1, type: 1 });

export const Streak = mongoose.model('Streak', streakSchema);

// Achievement schema
const achievementSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    badge_id: {
      type: String,
      required: true,
    },
    badge_name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['habit', 'milestone', 'consistency', 'emotion', 'challenge', 'strategic'],
      required: true,
    },
    earned_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    points_awarded: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold'],
      default: 'bronze',
    },
    unlock_criteria_met: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    hidden_metric: {
      type: Boolean,
      default: false,
    },
    display_priority: {
      type: Number,
      default: 0,
    },
    notification_message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

achievementSchema.index({ user_id: 1, earned_at: 1 });
achievementSchema.index({ user_id: 1, badge_id: 1 });

export const Achievement = mongoose.model('Achievement', achievementSchema);
