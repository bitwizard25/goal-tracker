import mongoose from 'mongoose';

// Long-term goal schema
const longTermGoalSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    target_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'abandoned'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      required: true,
    },
    smart_framework: {
      specific: String,
      measurable: String,
      achievable: String,
      relevant: String,
      time_bound: String,
    },
    current_progress_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

longTermGoalSchema.index({ user_id: 1, status: 1 });

export const LongTermGoal = mongoose.models.LongTermGoal || mongoose.model('LongTermGoal', longTermGoalSchema);

// Short-term goal schema
const shortTermGoalSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    long_term_goal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LongTermGoal',
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    milestones: [
      {
        id: mongoose.Schema.Types.ObjectId,
        title: String,
        completed: { type: Boolean, default: false },
      },
    ],
    completed_milestones_count: {
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

shortTermGoalSchema.index({ user_id: 1, status: 1 });
shortTermGoalSchema.index({ long_term_goal_id: 1 });

export const ShortTermGoal = mongoose.models.ShortTermGoal || mongoose.model('ShortTermGoal', shortTermGoalSchema);
