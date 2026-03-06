import {
  require_browser_umd
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
  createHotContext
} from "/build/_shared/chunk-HUMZIC5X.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/models/Goals.ts
var import_mongoose = __toESM(require_browser_umd(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\models\\Goals.ts"
  );
  import.meta.hot.lastModified = "1772353506149.5254";
}
var longTermGoalSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    target_date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused", "abandoned"],
      default: "active"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    category: {
      type: String,
      required: true
    },
    smart_framework: {
      specific: String,
      measurable: String,
      achievable: String,
      relevant: String,
      time_bound: String
    },
    current_progress_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
longTermGoalSchema.index({ user_id: 1, status: 1 });
var LongTermGoal = import_mongoose.default.model("LongTermGoal", longTermGoalSchema);
var shortTermGoalSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    long_term_goal_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "LongTermGoal",
      default: null
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["active", "completed", "paused"],
      default: "active"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    milestones: [
      {
        id: import_mongoose.default.Schema.Types.ObjectId,
        title: String,
        completed: { type: Boolean, default: false }
      }
    ],
    completed_milestones_count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
shortTermGoalSchema.index({ user_id: 1, status: 1 });
shortTermGoalSchema.index({ long_term_goal_id: 1 });
var ShortTermGoal = import_mongoose.default.model("ShortTermGoal", shortTermGoalSchema);
//# sourceMappingURL=/build/_shared/chunk-QEVVQF4B.js.map
