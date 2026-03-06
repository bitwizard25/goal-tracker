import mongoose from 'mongoose';

// Daily task schema
const dailyTaskSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    short_term_goal_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShortTermGoal',
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
    due_date: {
      type: Date,
      required: true,
    },
    is_recurring: {
      type: Boolean,
      default: false,
    },
    recurrence_pattern: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      default: null,
    },
    difficulty_level: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
    },
    tags: [String],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

dailyTaskSchema.index({ user_id: 1, status: 1 });
dailyTaskSchema.index({ user_id: 1, due_date: 1 });

export const DailyTask = mongoose.models.DailyTask || mongoose.model('DailyTask', dailyTaskSchema);

// Task completion schema
const taskCompletionSchema = new mongoose.Schema(
  {
    task_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'DailyTask',
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    completed_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completion_time_minutes: {
      type: Number,
      required: true,
    },
    mood_before: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    mood_after: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    mood_improvement: {
      type: Number,
      calculated: true,
    },
    energy_before: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    energy_after: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    energy_change: {
      type: Number,
      calculated: true,
    },
    effort_rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    flow_state_detected: {
      type: Boolean,
      default: false,
    },
    points_earned: {
      type: Number,
      required: true,
    },
    streak_contribution: {
      type: Number,
      default: 0,
    },
    difficulty_actual: {
      type: Number,
      min: 1,
      max: 5,
    },
    completion_delay_minutes: {
      type: Number,
      default: 0,
    },
    urgency_at_completion: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    session_quality_score: {
      type: Number,
      default: 0,
    },
    contextual_tags: [String],
    time_of_day_completed: String,
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

taskCompletionSchema.index({ user_id: 1, completed_at: 1 });
taskCompletionSchema.index({ task_id: 1 });

// Pre-save hook to calculate derived fields
taskCompletionSchema.pre('save', function (next) {
  this.mood_improvement = this.mood_after - this.mood_before;
  this.energy_change = this.energy_after - this.energy_before;
  next();
});

export const TaskCompletion = mongoose.models.TaskCompletion || mongoose.model('TaskCompletion', taskCompletionSchema);
