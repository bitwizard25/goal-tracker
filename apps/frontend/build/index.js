var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

// app/lib/db.server.ts
var db_server_exports = {};
__export(db_server_exports, {
  connectDB: () => connectDB
});
import mongoose from "mongoose";
var MONGODB_URI, cached, connectDB, init_db_server = __esm({
  async "app/lib/db.server.ts"() {
    "use strict";
    MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/goal-tracker", cached = global.mongoose;
    cached || (cached = global.mongoose = { conn: null, promise: null });
    connectDB = async () => {
      if (cached.conn)
        return cached.conn;
      if (!cached.promise) {
        let opts = {
          bufferCommands: !1
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose6) => (console.log("MongoDB Connected successfully"), mongoose6)).catch((error) => {
          throw console.error("MongoDB connection error:", error), cached.promise = null, error;
        });
      }
      try {
        cached.conn = await cached.promise;
      } catch (e) {
        throw cached.promise = null, e;
      }
      return cached.conn;
    };
  }
});

// app/models/User.ts
var User_exports = {};
__export(User_exports, {
  User: () => User
});
import mongoose2 from "mongoose";
var userSchema, User, init_User = __esm({
  "app/models/User.ts"() {
    "use strict";
    userSchema = new mongoose2.Schema(
      {
        email: {
          type: String,
          required: !0,
          unique: !0,
          lowercase: !0,
          trim: !0
        },
        password_hash: {
          type: String,
          required: !0
        },
        total_points: {
          type: Number,
          default: 0
        },
        current_level: {
          type: Number,
          default: 1
        },
        streak_count: {
          type: Number,
          default: 0
        },
        last_login: {
          type: Date,
          default: null
        }
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    ), User = mongoose2.models.User || mongoose2.model("User", userSchema);
  }
});

// app/services/session.server.ts
import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";
import { parse, serialize } from "cookie";
function createToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
function getTokenFromRequest(request) {
  let cookieHeader = request.headers.get("Cookie");
  return cookieHeader && parse(cookieHeader)[COOKIE_NAME] || null;
}
function createTokenCookie(token, remember = !0) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: !0,
    maxAge: remember ? 60 * 60 * 24 * 7 : void 0,
    // 7 days or session
    path: "/",
    sameSite: "lax",
    secure: !0
  });
}
function clearTokenCookie() {
  return serialize(COOKIE_NAME, "", {
    httpOnly: !0,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secure: !0
  });
}
var JWT_SECRET, COOKIE_NAME, TOKEN_EXPIRY, init_session_server = __esm({
  "app/services/session.server.ts"() {
    "use strict";
    dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
    dotenv.config();
    JWT_SECRET = process.env.JWT_SECRET || "s3cr3t-jwt-key", COOKIE_NAME = "__token", TOKEN_EXPIRY = "7d";
  }
});

// app/services/auth.server.ts
var auth_server_exports = {};
__export(auth_server_exports, {
  createUserSession: () => createUserSession,
  getUser: () => getUser,
  getUserId: () => getUserId,
  logout: () => logout,
  requireUserId: () => requireUserId
});
import { redirect } from "@remix-run/node";
async function getUserId(request) {
  let token = getTokenFromRequest(request);
  return token && verifyToken(token)?.userId || null;
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/auth/login?${searchParams}`);
  }
  return userId;
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (!userId)
    return null;
  try {
    return await User.findById(userId).select("-password_hash");
  } catch {
    throw logout(request);
  }
}
async function createUserSession({
  request: _request,
  userId,
  remember,
  redirectTo
}) {
  let token = createToken(userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": createTokenCookie(token, remember)
    }
  });
}
async function logout(_request) {
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": clearTokenCookie()
    }
  });
}
var init_auth_server = __esm({
  "app/services/auth.server.ts"() {
    "use strict";
    init_User();
    init_session_server();
  }
});

// app/models/Tasks.ts
var Tasks_exports = {};
__export(Tasks_exports, {
  DailyTask: () => DailyTask,
  TaskCompletion: () => TaskCompletion
});
import mongoose3 from "mongoose";
var dailyTaskSchema, DailyTask, taskCompletionSchema, TaskCompletion, init_Tasks = __esm({
  "app/models/Tasks.ts"() {
    "use strict";
    dailyTaskSchema = new mongoose3.Schema(
      {
        user_id: {
          type: mongoose3.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        short_term_goal_id: {
          type: mongoose3.Schema.Types.ObjectId,
          ref: "ShortTermGoal",
          default: null
        },
        title: {
          type: String,
          required: !0
        },
        description: {
          type: String,
          required: !0
        },
        due_date: {
          type: Date,
          required: !0
        },
        is_recurring: {
          type: Boolean,
          default: !1
        },
        recurrence_pattern: {
          type: String,
          enum: ["daily", "weekly", "custom"],
          default: null
        },
        difficulty_level: {
          type: Number,
          required: !0,
          min: 1,
          max: 5
        },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed", "failed"],
          default: "pending"
        },
        tags: [String]
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    );
    dailyTaskSchema.index({ user_id: 1, status: 1 });
    dailyTaskSchema.index({ user_id: 1, due_date: 1 });
    DailyTask = mongoose3.models.DailyTask || mongoose3.model("DailyTask", dailyTaskSchema), taskCompletionSchema = new mongoose3.Schema(
      {
        task_id: {
          type: mongoose3.Schema.Types.ObjectId,
          required: !0,
          ref: "DailyTask"
        },
        user_id: {
          type: mongoose3.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        completed_at: {
          type: Date,
          required: !0,
          default: Date.now
        },
        completion_time_minutes: {
          type: Number,
          required: !0
        },
        mood_before: {
          type: Number,
          required: !0,
          min: 1,
          max: 10
        },
        mood_after: {
          type: Number,
          required: !0,
          min: 1,
          max: 10
        },
        mood_improvement: {
          type: Number,
          calculated: !0
        },
        energy_before: {
          type: Number,
          required: !0,
          min: 1,
          max: 10
        },
        energy_after: {
          type: Number,
          required: !0,
          min: 1,
          max: 10
        },
        energy_change: {
          type: Number,
          calculated: !0
        },
        effort_rating: {
          type: Number,
          required: !0,
          min: 1,
          max: 5
        },
        flow_state_detected: {
          type: Boolean,
          default: !1
        },
        points_earned: {
          type: Number,
          required: !0
        },
        streak_contribution: {
          type: Number,
          default: 0
        },
        difficulty_actual: {
          type: Number,
          min: 1,
          max: 5
        },
        completion_delay_minutes: {
          type: Number,
          default: 0
        },
        urgency_at_completion: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
          default: "medium"
        },
        session_quality_score: {
          type: Number,
          default: 0
        },
        contextual_tags: [String],
        time_of_day_completed: String
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    );
    taskCompletionSchema.index({ user_id: 1, completed_at: 1 });
    taskCompletionSchema.index({ task_id: 1 });
    taskCompletionSchema.pre("save", function(next) {
      this.mood_improvement = this.mood_after - this.mood_before, this.energy_change = this.energy_after - this.energy_before, next();
    });
    TaskCompletion = mongoose3.models.TaskCompletion || mongoose3.model("TaskCompletion", taskCompletionSchema);
  }
});

// app/models/Goals.ts
var Goals_exports = {};
__export(Goals_exports, {
  LongTermGoal: () => LongTermGoal,
  ShortTermGoal: () => ShortTermGoal
});
import mongoose4 from "mongoose";
var longTermGoalSchema, LongTermGoal, shortTermGoalSchema, ShortTermGoal, init_Goals = __esm({
  "app/models/Goals.ts"() {
    "use strict";
    longTermGoalSchema = new mongoose4.Schema(
      {
        user_id: {
          type: mongoose4.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        title: {
          type: String,
          required: !0
        },
        description: {
          type: String,
          required: !0
        },
        target_date: {
          type: Date,
          required: !0
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
          required: !0
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
    LongTermGoal = mongoose4.models.LongTermGoal || mongoose4.model("LongTermGoal", longTermGoalSchema), shortTermGoalSchema = new mongoose4.Schema(
      {
        user_id: {
          type: mongoose4.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        long_term_goal_id: {
          type: mongoose4.Schema.Types.ObjectId,
          ref: "LongTermGoal",
          default: null
        },
        title: {
          type: String,
          required: !0
        },
        description: {
          type: String,
          required: !0
        },
        start_date: {
          type: Date,
          required: !0
        },
        end_date: {
          type: Date,
          required: !0
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
            id: mongoose4.Schema.Types.ObjectId,
            title: String,
            completed: { type: Boolean, default: !1 }
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
    ShortTermGoal = mongoose4.models.ShortTermGoal || mongoose4.model("ShortTermGoal", shortTermGoalSchema);
  }
});

// app/models/Analytics.ts
var Analytics_exports = {};
__export(Analytics_exports, {
  EnergyMoodStateMatrix: () => EnergyMoodStateMatrix,
  HabitStack: () => HabitStack,
  UserPsychologyProfile: () => UserPsychologyProfile,
  UserStats: () => UserStats
});
import mongoose5 from "mongoose";
var userStatsSchema, UserStats, userPsychologyProfileSchema, UserPsychologyProfile, habitStackSchema, HabitStack, energyMoodStateMatrixSchema, EnergyMoodStateMatrix, init_Analytics = __esm({
  "app/models/Analytics.ts"() {
    "use strict";
    userStatsSchema = new mongoose5.Schema(
      {
        user_id: {
          type: mongoose5.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        date: {
          type: Date,
          required: !0
        },
        tasks_completed: {
          type: Number,
          default: 0
        },
        tasks_total: {
          type: Number,
          default: 0
        },
        points_earned: {
          type: Number,
          default: 0
        },
        points_spent: {
          type: Number,
          default: 0
        },
        mood_average: {
          type: Number,
          min: 1,
          max: 10
        },
        mood_variance: {
          type: Number,
          default: 0
        },
        emotional_trend: String,
        energy_average: {
          type: Number,
          min: 1,
          max: 10
        },
        energy_variance: {
          type: Number,
          default: 0
        },
        energy_trend: String,
        completion_rate: {
          type: Number,
          default: 0
        },
        on_time_rate: {
          type: Number,
          default: 0
        },
        early_completion_rate: {
          type: Number,
          default: 0
        },
        flow_state_sessions: {
          type: Number,
          default: 0
        },
        flow_state_hours: {
          type: Number,
          default: 0
        },
        average_completion_time: {
          type: Number,
          default: 0
        },
        energy_peak_hours: [Number],
        energy_lowest_hours: [Number],
        energy_mood_state_distribution: Map
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    );
    userStatsSchema.index({ user_id: 1, date: 1 });
    UserStats = mongoose5.models.UserStats || mongoose5.model("UserStats", userStatsSchema), userPsychologyProfileSchema = new mongoose5.Schema(
      {
        user_id: {
          type: mongoose5.Schema.Types.ObjectId,
          required: !0,
          ref: "User",
          unique: !0
        },
        chronotype: {
          type: String,
          enum: ["morning", "afternoon", "evening"],
          default: "afternoon"
        },
        habit_strength_by_category: Map,
        motivation_triggers: [String],
        procrastination_pattern: String,
        optimal_task_timing: [String],
        emotional_baseline: {
          type: Number,
          min: 1,
          max: 10,
          default: 5
        },
        mood_sensitivity: {
          type: Number,
          default: 1
        },
        emotional_volatility: {
          type: Number,
          default: 0
        },
        energy_baseline: {
          type: Number,
          min: 1,
          max: 10,
          default: 5
        },
        energy_variance: {
          type: Number,
          default: 0
        },
        peak_energy_hours: [Number],
        self_efficacy_score: {
          type: Number,
          default: 0
        },
        confidence_trend: String,
        behavioral_economics_profile: {
          loss_aversion_level: { type: Number, default: 0 },
          sunk_cost_sensitivity: { type: Number, default: 0 }
        },
        optimal_energy_mood_state: String,
        burnout_risk_score: {
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
    ), UserPsychologyProfile = mongoose5.models.UserPsychologyProfile || mongoose5.model(
      "UserPsychologyProfile",
      userPsychologyProfileSchema
    ), habitStackSchema = new mongoose5.Schema(
      {
        user_id: {
          type: mongoose5.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        trigger_task_id: {
          type: mongoose5.Schema.Types.ObjectId,
          ref: "DailyTask"
        },
        task_sequence: [
          {
            type: mongoose5.Schema.Types.ObjectId,
            ref: "DailyTask"
          }
        ],
        frequency_type: {
          type: String,
          enum: ["daily", "weekly", "custom"],
          default: "daily"
        },
        completion_rate: {
          type: Number,
          default: 0
        },
        average_completion_time: {
          type: Number,
          default: 0
        },
        efficacy_score: {
          type: Number,
          default: 0
        },
        suggested_modifications: [String]
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    );
    habitStackSchema.index({ user_id: 1 });
    HabitStack = mongoose5.models.HabitStack || mongoose5.model("HabitStack", habitStackSchema), energyMoodStateMatrixSchema = new mongoose5.Schema(
      {
        user_id: {
          type: mongoose5.Schema.Types.ObjectId,
          required: !0,
          ref: "User"
        },
        date: {
          type: Date,
          required: !0
        },
        state_quadrant_distribution: Map,
        task_completion_by_state: Map,
        average_points_by_state: Map,
        optimal_states_for_tasks: Map,
        burnout_zone_detection: [String],
        state_transitions: Map
      },
      {
        timestamps: {
          createdAt: "created_at",
          updatedAt: "updated_at"
        }
      }
    );
    energyMoodStateMatrixSchema.index({ user_id: 1, date: 1 });
    EnergyMoodStateMatrix = mongoose5.models.EnergyMoodStateMatrix || mongoose5.model(
      "EnergyMoodStateMatrix",
      energyMoodStateMatrixSchema
    );
  }
});

// app/utils/auth.ts
var auth_exports = {};
__export(auth_exports, {
  generateSessionToken: () => generateSessionToken,
  hashPassword: () => hashPassword,
  isValidEmail: () => isValidEmail,
  validatePasswordStrength: () => validatePasswordStrength,
  verifyPassword: () => verifyPassword
});
import bcryptjs from "bcryptjs";
async function hashPassword(password) {
  return bcryptjs.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
}
function generateSessionToken() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePasswordStrength(password) {
  let feedback = [], strengthScore = 0;
  password.length >= 8 ? strengthScore++ : feedback.push("Password should be at least 8 characters"), password.length >= 12 && strengthScore++, /[A-Z]/.test(password) ? strengthScore++ : feedback.push("Include an uppercase letter"), /[a-z]/.test(password) ? strengthScore++ : feedback.push("Include a lowercase letter"), /[0-9]/.test(password) ? strengthScore++ : feedback.push("Include a number"), /[!@#$%^&*]/.test(password) ? strengthScore++ : feedback.push("Include a special character (!@#$%^&*)");
  let strength = "weak";
  return strengthScore >= 4 && (strength = "moderate"), strengthScore >= 6 && (strength = "strong"), {
    valid: strengthScore >= 3,
    strength,
    feedback
  };
}
var SALT_ROUNDS, init_auth = __esm({
  "app/utils/auth.ts"() {
    "use strict";
    SALT_ROUNDS = 10;
  }
});

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
import { PassThrough } from "stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { jsx } from "react/jsx-runtime";
var ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, _loadContext) {
  return isbot(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              status: responseStatusCode,
              headers: responseHeaders
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = !1, { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = !0;
          let body = new PassThrough(), stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new Response(stream, {
              status: responseStatusCode,
              headers: responseHeaders
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, shellRendered && console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => Root,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

// app/styles/globals.css
var globals_default = "/build/_assets/globals-XS5FPEVX.css";

// app/root.tsx
await init_db_server();
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var links = () => [
  { rel: "stylesheet", href: globals_default },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
  }
], loader = async () => (await connectDB(), null), meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { title: "Goal Tracker - Psychological Goal Management" },
  {
    name: "description",
    content: "Advanced goal tracking with energy-emotion tracking, habit formation, and gamification."
  }
];
function Root() {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx2(Meta, {}),
      /* @__PURE__ */ jsx2(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-background text-foreground font-sans antialiased", children: [
      /* @__PURE__ */ jsx2(Outlet, {}),
      /* @__PURE__ */ jsx2(ScrollRestoration, {}),
      /* @__PURE__ */ jsx2(Scripts, {})
    ] })
  ] });
}

// app/routes/tasks.complete.$taskId.tsx
var tasks_complete_taskId_exports = {};
__export(tasks_complete_taskId_exports, {
  action: () => action,
  default: () => CompleteTaskPage,
  meta: () => meta2
});
import { Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var meta2 = () => [
  { title: "Complete Task - Goal Tracker" }
], action = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { redirect: redirect2 } = await import("@remix-run/node");
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId2(request), formData = await request.formData(), taskId = params.taskId;
  try {
    let task = await DailyTask2.findOne({ _id: taskId, user_id: userId });
    if (!task)
      return { error: "Task not found" };
    if (task.status === "completed")
      return { error: "Task already completed" };
    let mood_before = parseInt(formData.get("mood_before")), mood_after = parseInt(formData.get("mood_after")), energy_before = parseInt(formData.get("energy_before")), energy_after = parseInt(formData.get("energy_after")), effort_rating = parseInt(formData.get("effort_rating")), completion_time_minutes = parseInt(formData.get("completion_time_minutes")), flow_state_detected = formData.get("flow_state_detected") === "on", moodImprovement = mood_after - mood_before, energyChange = energy_after - energy_before, points_earned = Math.round(
      (30 * effort_rating + moodImprovement * 10 + energyChange * 5 + (flow_state_detected ? 50 : 0)) / 10
    );
    task.status = "completed", task.completed_at = /* @__PURE__ */ new Date(), task.actual_duration = completion_time_minutes, await task.save();
    let user = await User2.findById(userId);
    if (user) {
      user.total_points += Math.max(0, points_earned);
      let newLevel = Math.floor(user.total_points / 1e3) + 1;
      newLevel > user.current_level && (user.current_level = newLevel), await user.save();
    }
    return redirect2("/dashboard");
  } catch (error) {
    return console.error("Task completion error:", error), { error: "An error occurred completing the task" };
  }
};
function CompleteTaskPage() {
  let navigation = useNavigation(), [moodBefore, setMoodBefore] = useState(5), [moodAfter, setMoodAfter] = useState(7), [energyBefore, setEnergyBefore] = useState(5), [energyAfter, setEnergyAfter] = useState(7), [effort, setEffort] = useState(3), [time, setTime] = useState("30"), [flowState, setFlowState] = useState(!1), isLoading = navigation.state === "submitting", moodImprovement = moodAfter - moodBefore, energyChange = energyAfter - energyBefore, estimatedPoints = Math.round(
    (30 * effort + moodImprovement * 10 + energyChange * 5 + (flowState ? 50 : 0)) / 10
  );
  return /* @__PURE__ */ jsxs2("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ jsx3("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs2("div", { className: "mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx3("h1", { className: "text-2xl font-bold text-gray-900", children: "Complete Task" }),
      /* @__PURE__ */ jsx3("p", { className: "mt-1 text-sm text-gray-600", children: "Track how you felt during this task" })
    ] }) }),
    /* @__PURE__ */ jsx3("main", { className: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs2(Form, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your mood before starting? ",
          moodBefore,
          "/10"
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "range",
              name: "mood_before",
              min: "1",
              max: "10",
              value: moodBefore,
              onChange: (e) => setMoodBefore(parseInt(e.target.value)),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxs2("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx3("span", { children: "\u{1F622} Terrible" }),
            /* @__PURE__ */ jsx3("span", { children: "\u{1F610} Neutral" }),
            /* @__PURE__ */ jsx3("span", { children: "\u{1F604} Amazing" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your mood now? ",
          moodAfter,
          "/10"
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "range",
              name: "mood_after",
              min: "1",
              max: "10",
              value: moodAfter,
              onChange: (e) => setMoodAfter(parseInt(e.target.value)),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxs2("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx3("span", { children: "\u{1F622} Terrible" }),
            /* @__PURE__ */ jsx3("span", { children: "\u{1F610} Neutral" }),
            /* @__PURE__ */ jsx3("span", { children: "\u{1F604} Amazing" })
          ] }),
          moodImprovement !== 0 && /* @__PURE__ */ jsxs2("p", { className: "mt-2 text-sm font-medium text-green-600", children: [
            moodImprovement > 0 ? "+" : "",
            moodImprovement,
            " mood change"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your energy before? ",
          energyBefore,
          "/10"
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "range",
              name: "energy_before",
              min: "1",
              max: "10",
              value: energyBefore,
              onChange: (e) => setEnergyBefore(parseInt(e.target.value)),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxs2("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx3("span", { children: "\u{1FAAB} Exhausted" }),
            /* @__PURE__ */ jsx3("span", { children: "\u26A1 Energized" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your energy now? ",
          energyAfter,
          "/10"
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsx3(
            "input",
            {
              type: "range",
              name: "energy_after",
              min: "1",
              max: "10",
              value: energyAfter,
              onChange: (e) => setEnergyAfter(parseInt(e.target.value)),
              className: "w-full"
            }
          ),
          /* @__PURE__ */ jsxs2("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsx3("span", { children: "\u{1FAAB} Exhausted" }),
            /* @__PURE__ */ jsx3("span", { children: "\u26A1 Energized" })
          ] }),
          energyChange !== 0 && /* @__PURE__ */ jsxs2("p", { className: "mt-2 text-sm font-medium text-blue-600", children: [
            energyChange > 0 ? "+" : "",
            energyChange,
            " energy change"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How much effort did this task require? ",
          effort,
          "/5"
        ] }),
        /* @__PURE__ */ jsx3("div", { className: "mt-4 flex gap-2", children: [1, 2, 3, 4, 5].map((level) => /* @__PURE__ */ jsx3(
          "button",
          {
            type: "button",
            onClick: () => setEffort(level),
            className: `flex-1 rounded-md py-2 font-medium transition ${effort === level ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`,
            children: ["\u{1F7E2}", "\u{1F7E1}", "\u{1F7E0}", "\u{1F534}", "\u{1F534}"][level - 1]
          },
          level
        )) })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx3("label", { htmlFor: "completion_time_minutes", className: "block text-sm font-medium text-gray-700", children: "How long did it take? (minutes)" }),
        /* @__PURE__ */ jsx3(
          "input",
          {
            type: "number",
            id: "completion_time_minutes",
            name: "completion_time_minutes",
            value: time,
            onChange: (e) => setTime(e.target.value),
            min: "1",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "flex items-center gap-3 rounded-lg bg-blue-50 p-4", children: [
        /* @__PURE__ */ jsx3(
          "input",
          {
            type: "checkbox",
            id: "flow_state_detected",
            name: "flow_state_detected",
            checked: flowState,
            onChange: (e) => setFlowState(e.target.checked),
            className: "h-4 w-4 rounded border-gray-300"
          }
        ),
        /* @__PURE__ */ jsx3("label", { htmlFor: "flow_state_detected", className: "flex-1 text-sm font-medium text-gray-700", children: "I was in a flow state (fully immersed and focused)" }),
        flowState && /* @__PURE__ */ jsx3("span", { className: "text-xl", children: "\u{1F30A}" })
      ] }),
      /* @__PURE__ */ jsx3("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: /* @__PURE__ */ jsxs2("p", { className: "text-sm text-green-800", children: [
        "You'll earn approximately ",
        /* @__PURE__ */ jsx3("span", { className: "font-bold text-green-900", children: estimatedPoints }),
        " points for completing this task!"
      ] }) }),
      /* @__PURE__ */ jsx3(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg",
          children: isLoading ? "Recording..." : "\u2713 Mark as Complete"
        }
      )
    ] }) })
  ] });
}

// app/routes/goals.short-term.new.tsx
var goals_short_term_new_exports = {};
__export(goals_short_term_new_exports, {
  action: () => action2,
  default: () => CreateShortTermGoal,
  meta: () => meta3
});
import { Form as Form2, useNavigation as useNavigation2 } from "@remix-run/react";
import { useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var meta3 = () => [
  { title: "Create Short-term Goal - Goal Tracker" }
], action2 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { redirect: redirect2 } = await import("@remix-run/node");
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId2(request), formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), start_date = formData.get("start_date"), end_date = formData.get("end_date"), priority = formData.get("priority"), long_term_goal_id = formData.get("long_term_goal_id");
  if (!title || !description || !start_date || !end_date)
    return { error: "Missing required fields" };
  let milestones = [];
  for (let i = 0; i < 5; i++) {
    let milestone = formData.get(`milestone_${i}`);
    milestone && typeof milestone == "string" && milestone.trim() !== "" && milestones.push({ title: milestone, completed: !1 });
  }
  try {
    return await new ShortTermGoal2({
      user_id: userId,
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      priority: priority || "medium",
      long_term_goal_id: long_term_goal_id || void 0,
      milestones,
      status: "in_progress"
    }).save(), redirect2("/goals");
  } catch (error) {
    return console.error("Create short-term goal error:", error), { error: "An error occurred creating the goal" };
  }
};
function CreateShortTermGoal() {
  let navigation = useNavigation2(), [milestones, setMilestones] = useState2(["", "", ""]), isLoading = navigation.state === "submitting", addMilestone = () => {
    milestones.length < 5 && setMilestones([...milestones, ""]);
  }, removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  }, updateMilestone = (index, value) => {
    let newMilestones = [...milestones];
    newMilestones[index] = value, setMilestones(newMilestones);
  };
  return /* @__PURE__ */ jsxs3("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx4("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs3("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx4("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Short-term Goal" }),
      /* @__PURE__ */ jsx4("p", { className: "mt-1 text-sm text-gray-600", children: "Break down your long-term vision into actionable milestones" })
    ] }) }),
    /* @__PURE__ */ jsx4("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs3(Form2, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6", children: [
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx4("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }),
          /* @__PURE__ */ jsx4(
            "input",
            {
              type: "text",
              id: "title",
              name: "title",
              required: !0,
              placeholder: "e.g., Complete Spanish Level 1 Course",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx4("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }),
          /* @__PURE__ */ jsxs3(
            "select",
            {
              id: "priority",
              name: "priority",
              defaultValue: "medium",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsx4("option", { value: "low", children: "Low" }),
                /* @__PURE__ */ jsx4("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsx4("option", { value: "high", children: "High" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx4("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }),
        /* @__PURE__ */ jsx4(
          "textarea",
          {
            id: "description",
            name: "description",
            required: !0,
            rows: 4,
            placeholder: "What are you committing to achieve?",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx4("label", { htmlFor: "start_date", className: "block text-sm font-medium text-gray-700", children: "Start Date *" }),
          /* @__PURE__ */ jsx4(
            "input",
            {
              type: "date",
              id: "start_date",
              name: "start_date",
              required: !0,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs3("div", { children: [
          /* @__PURE__ */ jsx4("label", { htmlFor: "end_date", className: "block text-sm font-medium text-gray-700", children: "End Date *" }),
          /* @__PURE__ */ jsx4(
            "input",
            {
              type: "date",
              id: "end_date",
              name: "end_date",
              required: !0,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx4("label", { htmlFor: "long_term_goal_id", className: "block text-sm font-medium text-gray-700", children: "Link to Long-term Goal (Optional)" }),
        /* @__PURE__ */ jsxs3(
          "select",
          {
            id: "long_term_goal_id",
            name: "long_term_goal_id",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx4("option", { value: "", children: "No long-term goal" }),
              /* @__PURE__ */ jsx4("option", { value: "goal-1", children: "Learn Spanish fluently" }),
              /* @__PURE__ */ jsx4("option", { value: "goal-2", children: "Build a successful business" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx4("label", { className: "block text-sm font-medium text-gray-700", children: "Milestones" }),
          /* @__PURE__ */ jsx4(
            "button",
            {
              type: "button",
              onClick: addMilestone,
              disabled: milestones.length >= 5,
              className: "text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400",
              children: "Add Milestone"
            }
          )
        ] }),
        /* @__PURE__ */ jsx4("div", { className: "mt-4 space-y-3", children: milestones.map((milestone, index) => /* @__PURE__ */ jsxs3("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx4(
            "input",
            {
              type: "text",
              name: `milestone_${index}`,
              value: milestone,
              onChange: (e) => updateMilestone(index, e.target.value),
              placeholder: `Milestone ${index + 1}`,
              className: "flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsx4(
            "button",
            {
              type: "button",
              onClick: () => removeMilestone(index),
              className: "rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 transition",
              children: "Remove"
            }
          )
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx4(
          "button",
          {
            type: "button",
            onClick: () => window.history.back(),
            className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx4(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
            children: isLoading ? "Creating..." : "Create Goal"
          }
        )
      ] })
    ] }) })
  ] });
}

// app/routes/gamification._index.tsx
var gamification_index_exports = {};
__export(gamification_index_exports, {
  default: () => GamificationPage,
  loader: () => loader2,
  meta: () => meta4
});
import { useLoaderData } from "@remix-run/react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var meta4 = () => [
  { title: "Gamification - Goal Tracker" }
], loader2 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), userId = await requireUserId2(request), user = await User2.findById(userId).lean();
  if (!user)
    throw new Error("User not found");
  let currentLevelPoints = (user.current_level - 1) * 1e3, pointsInCurrentLevel = user.total_points - currentLevelPoints, experiencePercentage = Math.min(100, Math.max(0, Math.round(pointsInCurrentLevel / 1e3 * 100)));
  return {
    user: {
      total_points: user.total_points || 0,
      current_level: user.current_level || 1,
      experience_percentage: experiencePercentage,
      streak_count: user.current_streak || 0,
      streak_best: user.longest_streak || 0
    },
    achievements: [
      {
        id: "1",
        title: "First Steps",
        description: "Complete your first task",
        icon: "\u{1F463}",
        unlocked: !0,
        date: "2025-01-15"
      },
      {
        id: "2",
        title: "Week Warrior",
        description: "Maintain a 7-day streak",
        icon: "\u2694\uFE0F",
        unlocked: Number(user.longest_streak) >= 7,
        date: Number(user.longest_streak) >= 7 ? "2025-01-22" : null
      },
      {
        id: "3",
        title: "Month Master",
        description: "Maintain a 30-day streak",
        icon: "\u{1F451}",
        unlocked: Number(user.longest_streak) >= 30,
        date: null
      },
      {
        id: "4",
        title: "Level 5",
        description: "Reach level 5",
        icon: "\u{1F31F}",
        unlocked: user.current_level >= 5,
        date: null
      },
      {
        id: "5",
        title: "Perfect Day",
        description: "Complete all tasks in a day",
        icon: "\u2728",
        unlocked: !0,
        date: "2025-02-01"
      },
      {
        id: "6",
        title: "Level 10",
        description: "Reach level 10",
        icon: "\u{1F680}",
        unlocked: user.current_level >= 10,
        date: null
      }
    ],
    leaderboard: [
      { rank: 1, username: "Alex", points: 3500, streak: 45 },
      { rank: 2, username: "Jordan", points: 3200, streak: 38 },
      { rank: 3, username: user.username || "You", points: user.total_points || 0, streak: user.current_streak || 0 },
      { rank: 4, username: "Casey", points: 980, streak: 12 },
      { rank: 5, username: "Morgan", points: 850, streak: 8 }
    ],
    recentAchievements: [
      { title: "Perfect Day", date: "2025-02-01" },
      { title: "Week Warrior", date: "2025-01-22" }
    ]
  };
};
function GamificationPage() {
  let data = useLoaderData(), { user, achievements, leaderboard, recentAchievements } = data, levels = [
    { level: 1, minPoints: 0, name: "Novice", color: "bg-gray-500" },
    { level: 2, minPoints: 100, name: "Beginner", color: "bg-green-500" },
    { level: 3, minPoints: 250, name: "Intermediate", color: "bg-blue-500" },
    { level: 4, minPoints: 500, name: "Advanced", color: "bg-purple-500" },
    { level: 5, minPoints: 1e3, name: "Expert", color: "bg-yellow-500" },
    { level: 6, minPoints: 1500, name: "Master", color: "bg-red-500" },
    { level: 7, minPoints: 2e3, name: "Legend", color: "bg-pink-500" }
  ], currentLevel = levels.find((l) => l.level === user.current_level) || levels[0];
  return /* @__PURE__ */ jsxs4("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ jsx5("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs4("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx5("h1", { className: "text-2xl font-bold text-gray-900", children: "Gamification" }),
      /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm text-gray-600", children: "Earn points, unlock achievements, and climb the leaderboard" })
    ] }) }),
    /* @__PURE__ */ jsxs4("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs4("div", { className: `rounded-lg ${currentLevel.color} p-6 text-white shadow-lg`, children: [
          /* @__PURE__ */ jsx5("p", { className: "text-sm font-medium opacity-90", children: "Current Level" }),
          /* @__PURE__ */ jsx5("p", { className: "mt-2 text-4xl font-bold", children: user.current_level }),
          /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm opacity-90", children: currentLevel.name })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx5("p", { className: "text-sm font-medium text-gray-600", children: "Total Points" }),
          /* @__PURE__ */ jsx5("p", { className: "mt-2 text-4xl font-bold text-blue-600", children: user.total_points }),
          /* @__PURE__ */ jsxs4("p", { className: "mt-1 text-xs text-gray-500", children: [
            user.experience_percentage,
            "% to next level"
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx5("p", { className: "text-sm font-medium text-gray-600", children: "Current Streak" }),
          /* @__PURE__ */ jsx5("p", { className: "mt-2 text-4xl font-bold text-orange-600", children: user.streak_count }),
          /* @__PURE__ */ jsx5("p", { className: "mt-1 text-xs text-gray-500", children: "days" })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx5("p", { className: "text-sm font-medium text-gray-600", children: "Best Streak" }),
          /* @__PURE__ */ jsx5("p", { className: "mt-2 text-4xl font-bold text-green-600", children: user.streak_best }),
          /* @__PURE__ */ jsx5("p", { className: "mt-1 text-xs text-gray-500", children: "days" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-8 rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx5("h2", { className: "text-lg font-semibold text-gray-900", children: "Experience Progress" }),
        /* @__PURE__ */ jsxs4("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs4("span", { className: "text-sm text-gray-600", children: [
              user.current_level,
              " \u2192 ",
              user.current_level + 1
            ] }),
            /* @__PURE__ */ jsxs4("span", { className: "text-sm font-medium text-gray-900", children: [
              user.experience_percentage,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx5("div", { className: "mt-2 h-4 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsx5(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
              style: { width: `${user.experience_percentage}%` }
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsx5("h2", { className: "text-xl font-bold text-gray-900", children: "Achievements" }),
        /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm text-gray-600", children: "Unlock achievements by reaching milestones" }),
        /* @__PURE__ */ jsx5("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: achievements.map((achievement) => /* @__PURE__ */ jsxs4(
          "div",
          {
            className: `rounded-lg border p-4 transition ${achievement.unlocked ? "bg-white border-gray-200 shadow-sm hover:shadow-md" : "bg-gray-50 border-gray-200 opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxs4("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs4("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx5("span", { className: "text-3xl", children: achievement.icon }),
                  /* @__PURE__ */ jsxs4("div", { children: [
                    /* @__PURE__ */ jsx5("h3", { className: "font-semibold text-gray-900", children: achievement.title }),
                    /* @__PURE__ */ jsx5("p", { className: "text-xs text-gray-600", children: achievement.description })
                  ] })
                ] }),
                achievement.unlocked && /* @__PURE__ */ jsx5("span", { className: "inline-block h-6 w-6 rounded-full bg-green-100 text-center text-sm text-green-700", children: "\u2713" })
              ] }),
              achievement.unlocked && achievement.date && /* @__PURE__ */ jsxs4("p", { className: "mt-2 text-xs text-gray-500", children: [
                "Unlocked ",
                new Date(achievement.date).toLocaleDateString()
              ] })
            ]
          },
          achievement.id
        )) })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs4("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsx5("h2", { className: "text-xl font-bold text-gray-900", children: "Global Leaderboard" }),
          /* @__PURE__ */ jsx5("div", { className: "mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxs4("table", { className: "w-full", children: [
            /* @__PURE__ */ jsx5("thead", { className: "border-b border-gray-200 bg-gray-50", children: /* @__PURE__ */ jsxs4("tr", { children: [
              /* @__PURE__ */ jsx5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Rank" }),
              /* @__PURE__ */ jsx5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "User" }),
              /* @__PURE__ */ jsx5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Points" }),
              /* @__PURE__ */ jsx5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Streak" })
            ] }) }),
            /* @__PURE__ */ jsx5("tbody", { className: "divide-y divide-gray-200", children: leaderboard.map((entry2) => /* @__PURE__ */ jsxs4(
              "tr",
              {
                className: entry2.username === "You" ? "bg-blue-50" : "",
                children: [
                  /* @__PURE__ */ jsx5("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900", children: entry2.rank === 1 ? "\u{1F947}" : entry2.rank === 2 ? "\u{1F948}" : entry2.rank === 3 ? "\u{1F949}" : `#${entry2.rank}` }),
                  /* @__PURE__ */ jsx5("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: entry2.username }),
                  /* @__PURE__ */ jsx5("td", { className: "px-6 py-4 text-sm text-gray-600", children: entry2.points.toLocaleString() }),
                  /* @__PURE__ */ jsxs4("td", { className: "px-6 py-4 text-sm text-gray-600", children: [
                    entry2.streak,
                    " days"
                  ] })
                ]
              },
              entry2.rank
            )) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx5("h2", { className: "text-xl font-bold text-gray-900", children: "Recent Unlocks" }),
          /* @__PURE__ */ jsx5("div", { className: "mt-6 space-y-4", children: recentAchievements.length === 0 ? /* @__PURE__ */ jsx5("p", { className: "text-sm text-gray-600", children: "No recent achievements yet!" }) : recentAchievements.map((achievement, i) => /* @__PURE__ */ jsxs4("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: [
            /* @__PURE__ */ jsx5("p", { className: "font-semibold text-green-900", children: achievement.title }),
            /* @__PURE__ */ jsx5("p", { className: "text-xs text-green-700", children: new Date(achievement.date).toLocaleDateString() })
          ] }, i)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx5("h2", { className: "text-lg font-semibold text-gray-900", children: "Level Progression" }),
        /* @__PURE__ */ jsx5("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: levels.map((level) => /* @__PURE__ */ jsxs4(
          "div",
          {
            className: `rounded-lg p-4 ${level.level <= user.current_level ? `${level.color} text-white` : "bg-gray-100 text-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxs4("p", { className: "text-2xl font-bold", children: [
                "Level ",
                level.level
              ] }),
              /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm font-medium", children: level.name }),
              /* @__PURE__ */ jsxs4("p", { className: "mt-2 text-xs opacity-90", children: [
                level.minPoints,
                "+ points"
              ] })
            ]
          },
          level.level
        )) })
      ] })
    ] })
  ] });
}

// app/routes/goals.long-term.new.tsx
var goals_long_term_new_exports = {};
__export(goals_long_term_new_exports, {
  action: () => action3,
  default: () => CreateLongTermGoal,
  meta: () => meta5
});
import { Form as Form3, useNavigation as useNavigation3 } from "@remix-run/react";
import { useState as useState3 } from "react";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var meta5 = () => [
  { title: "Create Long-term Goal - Goal Tracker" }
], action3 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { redirect: redirect2 } = await import("@remix-run/node");
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId2(request), formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), target_date = formData.get("target_date"), category = formData.get("category"), priority = formData.get("priority");
  if (!title || !description || !target_date || !category)
    return { error: "Missing required fields" };
  let smart_framework = {
    specific: formData.get("specific"),
    measurable: formData.get("measurable"),
    achievable: formData.get("achievable"),
    relevant: formData.get("relevant"),
    time_bound: formData.get("time_bound")
  };
  try {
    return await new LongTermGoal2({
      user_id: userId,
      title,
      description,
      target_date: new Date(target_date),
      category,
      priority: priority || "medium",
      smart_framework,
      status: "active",
      current_progress_percentage: 0,
      milestones: []
    }).save(), redirect2("/goals");
  } catch (error) {
    return console.error("Create long-term goal error:", error), { error: "An error occurred creating the goal" };
  }
};
function CreateLongTermGoal() {
  let navigation = useNavigation3(), [activeStep, setActiveStep] = useState3("basic"), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxs5("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx6("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs5("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx6("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Long-term Goal" }),
      /* @__PURE__ */ jsx6("p", { className: "mt-1 text-sm text-gray-600", children: "Define your vision with the SMART framework" })
    ] }) }),
    /* @__PURE__ */ jsx6("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs5(Form3, { method: "post", className: "space-y-8", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("basic"),
            className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "basic" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
            children: "Basic Info"
          }
        ),
        /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("smart"),
            className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "smart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
            children: "SMART Framework"
          }
        )
      ] }),
      activeStep === "basic" && /* @__PURE__ */ jsxs5("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }),
          /* @__PURE__ */ jsx6(
            "input",
            {
              type: "text",
              id: "title",
              name: "title",
              required: !0,
              placeholder: "e.g., Learn Spanish fluently",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "description",
              name: "description",
              required: !0,
              rows: 4,
              placeholder: "Describe your goal in detail...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("label", { htmlFor: "target_date", className: "block text-sm font-medium text-gray-700", children: "Target Date *" }),
            /* @__PURE__ */ jsx6(
              "input",
              {
                type: "date",
                id: "target_date",
                name: "target_date",
                required: !0,
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Category *" }),
            /* @__PURE__ */ jsxs5(
              "select",
              {
                id: "category",
                name: "category",
                required: !0,
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsx6("option", { value: "", children: "Select a category" }),
                  /* @__PURE__ */ jsx6("option", { value: "health", children: "Health & Fitness" }),
                  /* @__PURE__ */ jsx6("option", { value: "career", children: "Career" }),
                  /* @__PURE__ */ jsx6("option", { value: "education", children: "Education" }),
                  /* @__PURE__ */ jsx6("option", { value: "relationships", children: "Relationships" }),
                  /* @__PURE__ */ jsx6("option", { value: "finance", children: "Finance" }),
                  /* @__PURE__ */ jsx6("option", { value: "personal", children: "Personal Development" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }),
            /* @__PURE__ */ jsxs5(
              "select",
              {
                id: "priority",
                name: "priority",
                defaultValue: "medium",
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsx6("option", { value: "low", children: "Low" }),
                  /* @__PURE__ */ jsx6("option", { value: "medium", children: "Medium" }),
                  /* @__PURE__ */ jsx6("option", { value: "high", children: "High" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("smart"),
            className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition",
            children: "Next: SMART Framework"
          }
        )
      ] }),
      activeStep === "smart" && /* @__PURE__ */ jsxs5("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsx6("div", { className: "rounded-md bg-blue-50 p-4", children: /* @__PURE__ */ jsxs5("p", { className: "text-sm text-blue-800", children: [
          /* @__PURE__ */ jsx6("strong", { children: "SMART Goals:" }),
          " Define your goal using Specific, Measurable, Achievable, Relevant, and Time-bound criteria."
        ] }) }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "specific", className: "block text-sm font-medium text-gray-700", children: "Specific - What exactly do you want to achieve?" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "specific",
              name: "specific",
              rows: 3,
              placeholder: "Be as specific as possible...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "measurable", className: "block text-sm font-medium text-gray-700", children: "Measurable - How will you measure progress?" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "measurable",
              name: "measurable",
              rows: 3,
              placeholder: "Define metrics and milestones...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "achievable", className: "block text-sm font-medium text-gray-700", children: "Achievable - Is this goal realistic?" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "achievable",
              name: "achievable",
              rows: 3,
              placeholder: "Explain why this goal is achievable...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "relevant", className: "block text-sm font-medium text-gray-700", children: "Relevant - Why does this matter to you?" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "relevant",
              name: "relevant",
              rows: 3,
              placeholder: "Connect to your values and larger vision...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { children: [
          /* @__PURE__ */ jsx6("label", { htmlFor: "time_bound", className: "block text-sm font-medium text-gray-700", children: "Time-bound - What's your timeline?" }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              id: "time_bound",
              name: "time_bound",
              rows: 3,
              placeholder: "Define key dates and deadlines...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs5("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsx6(
            "button",
            {
              type: "button",
              onClick: () => setActiveStep("basic"),
              className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition",
              children: "Back"
            }
          ),
          /* @__PURE__ */ jsx6(
            "button",
            {
              type: "submit",
              disabled: isLoading,
              className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
              children: isLoading ? "Creating..." : "Create Goal"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}

// app/routes/analytics._index.tsx
var analytics_index_exports = {};
__export(analytics_index_exports, {
  default: () => AnalyticsPage,
  loader: () => loader3,
  meta: () => meta6
});
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var meta6 = () => [
  { title: "Analytics - Goal Tracker" }
], loader3 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), userId = await requireUserId2(request), now = /* @__PURE__ */ new Date(), startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()), startOfWeek.setHours(0, 0, 0, 0);
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  let user = await User2.findById(userId).lean(), weekTasks = await DailyTask2.find({
    user_id: userId,
    created_at: { $gte: startOfWeek }
  }).lean(), weekTasksCompleted = weekTasks.filter((t) => t.status === "completed"), monthTasks = await DailyTask2.find({
    user_id: userId,
    created_at: { $gte: startOfMonth }
  }).lean(), monthTasksCompleted = monthTasks.filter((t) => t.status === "completed"), totalTasksCompleted = await DailyTask2.countDocuments({
    user_id: userId,
    status: "completed"
  });
  return {
    stats: {
      thisWeek: {
        tasksCompleted: weekTasksCompleted.length,
        tasksTotal: weekTasks.length,
        averageMood: 7,
        // Needs UserStats tracking implementation
        averageEnergy: 7,
        flowStateSessions: 0,
        // Mocked for now until Analytics is fully hooked up
        totalPoints: user?.total_points || 0
        // Roughly speaking
      },
      thisMonth: {
        tasksCompleted: monthTasksCompleted.length,
        tasksTotal: monthTasks.length,
        averageMood: 6.9,
        averageEnergy: 6.6,
        flowStateSessions: 0,
        totalPoints: user?.total_points || 0
      },
      allTime: {
        tasksCompleted: totalTasksCompleted,
        goalsCompleted: 0,
        // Mocked 
        streakBest: user?.current_streak || 0,
        totalPoints: user?.total_points || 0
      }
    },
    // Keep daily data and insights mocked for now as a placeholder 
    // real implementation requires more complex Mongoose aggregations
    dailyData: [
      { date: "Mon", tasks: 5, mood: 6, energy: 6 },
      { date: "Tue", tasks: 6, mood: 7, energy: 7 },
      { date: "Wed", tasks: 4, mood: 5, energy: 5 },
      { date: "Thu", tasks: 7, mood: 8, energy: 7 },
      { date: "Fri", tasks: 6, mood: 8, energy: 8 },
      { date: "Sat", tasks: 3, mood: 7, energy: 6 },
      { date: "Sun", tasks: 2, mood: 6, energy: 5 }
    ],
    categoryBreakdown: [
      { category: "Health", count: 45, percentage: 25 },
      { category: "Career", count: 60, percentage: 33 },
      { category: "Personal", count: 48, percentage: 27 },
      { category: "Education", count: 27, percentage: 15 }
    ],
    insights: [
      {
        type: "neutral",
        text: "Keep tracking your tasks to see personalized insights about your productivity."
      }
    ]
  };
};
function AnalyticsPage() {
  let data = useLoaderData2(), { stats, dailyData, categoryBreakdown, insights } = data;
  return /* @__PURE__ */ jsxs6("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx7("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs6("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx7("h1", { className: "text-2xl font-bold text-gray-900", children: "Analytics" }),
      /* @__PURE__ */ jsx7("p", { className: "mt-1 text-sm text-gray-600", children: "Insights into your goal-setting progress" })
    ] }) }),
    /* @__PURE__ */ jsxs6("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs6("div", { children: [
        /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold text-gray-900", children: "This Week" }),
        /* @__PURE__ */ jsxs6("div", { className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6", children: [
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "Tasks Completed" }),
            /* @__PURE__ */ jsxs6("p", { className: "mt-1 text-2xl font-bold text-blue-600", children: [
              stats.thisWeek.tasksCompleted,
              "/",
              stats.thisWeek.tasksTotal
            ] }),
            /* @__PURE__ */ jsxs6("p", { className: "mt-1 text-xs text-gray-500", children: [
              Math.round(stats.thisWeek.tasksCompleted / stats.thisWeek.tasksTotal * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "Avg Mood" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-2xl font-bold text-green-600", children: stats.thisWeek.averageMood.toFixed(1) }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-xs text-gray-500", children: "/10" })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "Avg Energy" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-2xl font-bold text-purple-600", children: stats.thisWeek.averageEnergy.toFixed(1) }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-xs text-gray-500", children: "/10" })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "Flow States" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-2xl font-bold text-cyan-600", children: stats.thisWeek.flowStateSessions }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-xs text-gray-500", children: "sessions" })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "Points Earned" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-2xl font-bold text-yellow-600", children: stats.thisWeek.totalPoints }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-xs text-gray-500", children: "this week" })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-600", children: "This Month" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-2xl font-bold text-orange-600", children: stats.thisMonth.totalPoints }),
            /* @__PURE__ */ jsx7("p", { className: "mt-1 text-xs text-gray-500", children: "points" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold text-gray-900", children: "Weekly Overview" }),
        /* @__PURE__ */ jsx7("div", { className: "mt-6", children: /* @__PURE__ */ jsx7("div", { className: "space-y-4", children: dailyData.map((day) => /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-sm mb-1", children: [
            /* @__PURE__ */ jsx7("span", { className: "text-gray-600", children: day.date }),
            /* @__PURE__ */ jsxs6("span", { className: "font-medium text-gray-900", children: [
              day.tasks,
              " tasks"
            ] })
          ] }),
          /* @__PURE__ */ jsxs6("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx7("div", { className: "flex-1", children: /* @__PURE__ */ jsx7("div", { className: "h-2 rounded-full bg-gray-200", children: /* @__PURE__ */ jsx7(
              "div",
              {
                className: "h-full rounded-full bg-blue-600",
                style: { width: `${day.tasks / 7 * 100}%` }
              }
            ) }) }),
            /* @__PURE__ */ jsx7("div", { className: "w-16 text-xs", children: /* @__PURE__ */ jsxs6("span", { className: "text-gray-600", children: [
              "\u{1F610} ",
              day.mood,
              " \u{1F4AA} ",
              day.energy
            ] }) })
          ] })
        ] }, day.date)) }) })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs6("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2", children: [
          /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold text-gray-900", children: "Tasks by Category" }),
          /* @__PURE__ */ jsx7("div", { className: "mt-6 space-y-4", children: categoryBreakdown.map((cat) => /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsx7("span", { className: "text-gray-700", children: cat.category }),
              /* @__PURE__ */ jsxs6("span", { className: "font-medium text-gray-900", children: [
                cat.count,
                " tasks"
              ] })
            ] }),
            /* @__PURE__ */ jsx7("div", { className: "h-3 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsx7(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
                style: { width: `${cat.percentage}%` }
              }
            ) }),
            /* @__PURE__ */ jsxs6("p", { className: "mt-1 text-xs text-gray-500", children: [
              cat.percentage,
              "% of total"
            ] })
          ] }, cat.category)) })
        ] }),
        /* @__PURE__ */ jsxs6("div", { children: [
          /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold text-gray-900", children: "Insights" }),
          /* @__PURE__ */ jsx7("div", { className: "mt-6 space-y-4", children: insights.map((insight, i) => /* @__PURE__ */ jsx7(
            "div",
            {
              className: `rounded-lg p-4 text-sm ${insight.type === "positive" ? "bg-green-50 text-green-800 border border-green-200" : insight.type === "attention" ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`,
              children: insight.text
            },
            i
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "mt-8 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx7("h2", { className: "text-lg font-semibold text-gray-900", children: "All-Time Statistics" }),
        /* @__PURE__ */ jsxs6("div", { className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-600", children: "Total Tasks" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-2 text-3xl font-bold text-blue-600", children: stats.allTime.tasksCompleted })
          ] }),
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-600", children: "Goals Completed" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-2 text-3xl font-bold text-green-600", children: stats.allTime.goalsCompleted })
          ] }),
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-600", children: "Best Streak" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-2 text-3xl font-bold text-orange-600", children: stats.allTime.streakBest })
          ] }),
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-600", children: "Total Points" }),
            /* @__PURE__ */ jsx7("p", { className: "mt-2 text-3xl font-bold text-purple-600", children: stats.allTime.totalPoints })
          ] })
        ] })
      ] })
    ] })
  ] });
}

// app/routes/dashboard._index.tsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  action: () => action4,
  default: () => DashboardPage,
  loader: () => loader4,
  meta: () => meta7
});
import { useState as useState4, useEffect } from "react";
import { useLoaderData as useLoaderData3, Link, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var meta7 = () => [
  { title: "Dashboard - Goal Tracker" }
], loader4 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { UserStats: UserStats2 } = await Promise.resolve().then(() => (init_Analytics(), Analytics_exports));
  await connectDB2();
  let userId = await requireUserId2(request), user = await User2.findById(userId).select("-password_hash").lean();
  if (!user)
    throw new Response("Not Found", { status: 404 });
  let startOfDay = /* @__PURE__ */ new Date();
  startOfDay.setHours(0, 0, 0, 0);
  let endOfDay = /* @__PURE__ */ new Date();
  endOfDay.setHours(23, 59, 59, 999);
  let tasks = await DailyTask2.find({
    user_id: userId,
    due_date: { $gte: startOfDay, $lte: endOfDay }
  }).sort({ status: 1, created_at: -1 }).lean(), todayStats = await UserStats2.findOne({
    user_id: userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).lean();
  return json({
    user: {
      email: user.email,
      total_points: user.total_points,
      current_level: user.current_level,
      streak_count: user.streak_count
    },
    stats: {
      tasks_today: tasks.length,
      tasks_completed_today: tasks.filter((t) => t.status === "completed").length,
      mood_average: todayStats?.mood_average || null,
      energy_average: todayStats?.energy_average || null
    },
    recentTasks: tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      difficulty_level: t.difficulty_level
    }))
  });
}, action4 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { UserStats: UserStats2 } = await Promise.resolve().then(() => (init_Analytics(), Analytics_exports));
  await connectDB2();
  let userId = await requireUserId2(request), formData = await request.formData(), actionType = formData.get("_action"), startOfDay = /* @__PURE__ */ new Date();
  if (startOfDay.setHours(0, 0, 0, 0), actionType === "update_metrics") {
    let energy = formData.get("energy"), mood = formData.get("mood"), stats = await UserStats2.findOne({ user_id: userId, date: { $gte: startOfDay } });
    return stats || (stats = new UserStats2({ user_id: userId, date: /* @__PURE__ */ new Date() })), energy && (stats.energy_average = Number(energy)), mood && (stats.mood_average = Number(mood)), await stats.save(), json({ success: !0 });
  }
  if (actionType === "update_task_status") {
    let taskId = formData.get("taskId"), status = formData.get("status");
    return taskId && status && await DailyTask2.findOneAndUpdate({ _id: taskId, user_id: userId }, { status }), json({ success: !0 });
  }
  return json({ success: !1 }, { status: 400 });
};
function SortableTaskItem({ task, isDone }) {
  let { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id }), style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1
  };
  return /* @__PURE__ */ jsx8(
    "div",
    {
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
      className: `group relative flex cursor-grab items-center justify-between rounded-xl border p-4 shadow-sm transition-all hover:shadow-md ${isDone ? "border-emerald-100 bg-emerald-50/50" : "border-gray-100 bg-white hover:border-blue-100"}`,
      children: /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx8("div", { className: `flex h-8 w-8 items-center justify-center rounded-lg ${isDone ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`, children: /* @__PURE__ */ jsx8("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx8("path", { strokeLinecap: "round", strokeLinejoin: "round", d: isDone ? "M5 13l4 4L19 7" : "M4 6h16M4 12h16M4 18h16" }) }) }),
        /* @__PURE__ */ jsxs7("div", { children: [
          /* @__PURE__ */ jsx8("h4", { className: `font-medium ${isDone ? "text-emerald-900 line-through opacity-70" : "text-gray-900"}`, children: task.title }),
          /* @__PURE__ */ jsxs7("span", { className: "text-xs text-gray-500", children: [
            "Difficulty: ",
            task.difficulty_level,
            "/5"
          ] })
        ] })
      ] })
    }
  );
}
function TaskBoard({ tasks }) {
  let fetcher = useFetcher(), [localTasks, setLocalTasks] = useState4(tasks), sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  let pendingTasks = localTasks.filter((t) => t.status !== "completed"), completedTasks = localTasks.filter((t) => t.status === "completed");
  return /* @__PURE__ */ jsx8(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: (event) => {
    let { active, over } = event;
    if (!over)
      return;
    let taskId = active.id, overId = over.id, task = localTasks.find((t) => t.id === taskId);
    if (!task)
      return;
    let newStatus = task.status;
    if (overId === "col-pending" && task.status === "completed")
      newStatus = "pending";
    else if (overId === "col-completed" && task.status !== "completed")
      newStatus = "completed";
    else {
      let overTask = localTasks.find((t) => t.id === overId);
      overTask && overTask.status !== task.status && (newStatus = overTask.status);
    }
    if (newStatus !== task.status) {
      setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
      let formData = new FormData();
      formData.append("_action", "update_task_status"), formData.append("taskId", taskId), formData.append("status", newStatus), fetcher.submit(formData, { method: "post" });
    }
  }, children: /* @__PURE__ */ jsxs7("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8", children: [
    /* @__PURE__ */ jsxs7("div", { id: "col-pending", className: "flex flex-col gap-4 rounded-2xl bg-gray-50/50 p-6 border border-gray-100", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx8("h2", { className: "text-lg font-bold text-gray-900", children: "To Do" }),
        /* @__PURE__ */ jsx8("span", { className: "rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700", children: pendingTasks.length })
      ] }),
      /* @__PURE__ */ jsx8(SortableContext, { id: "col-pending", items: pendingTasks.map((t) => t.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsx8("div", { className: "flex min-h-[150px] flex-col gap-3 rounded-xl", children: pendingTasks.length === 0 ? /* @__PURE__ */ jsx8("div", { className: "flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm text-sm text-gray-400", children: /* @__PURE__ */ jsx8("p", { children: "All caught up!" }) }) : pendingTasks.map((task) => /* @__PURE__ */ jsx8(SortableTaskItem, { task, isDone: !1 }, task.id)) }) })
    ] }),
    /* @__PURE__ */ jsxs7("div", { id: "col-completed", className: "flex flex-col gap-4 rounded-2xl bg-emerald-50/30 p-6 border border-emerald-50/50", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx8("h2", { className: "text-lg font-bold text-gray-900", children: "Completed" }),
        /* @__PURE__ */ jsx8("span", { className: "rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700", children: completedTasks.length })
      ] }),
      /* @__PURE__ */ jsx8(SortableContext, { id: "col-completed", items: completedTasks.map((t) => t.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsx8("div", { className: "flex min-h-[150px] flex-col gap-3 rounded-xl", children: completedTasks.length === 0 ? /* @__PURE__ */ jsx8("div", { className: "flex flex-1 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/50 p-6 shadow-sm text-sm text-emerald-500/60", children: /* @__PURE__ */ jsx8("p", { children: "Drop tasks here to complete them" }) }) : completedTasks.map((task) => /* @__PURE__ */ jsx8(SortableTaskItem, { task, isDone: !0 }, task.id)) }) })
    ] })
  ] }) });
}
function MetricSlider({ title, icon, value, type, gradientClass, colorClass }) {
  let fetcher = useFetcher(), [localValue, setLocalValue] = useState4(value || 5), isPristine = value === null;
  useEffect(() => {
    value !== null && setLocalValue(value);
  }, [value]);
  let handleChange = (e) => {
    setLocalValue(Number(e.target.value));
  }, handleRelease = () => {
    if (localValue === value)
      return;
    let formData = new FormData();
    formData.append("_action", "update_metrics"), formData.append(type, localValue.toString()), fetcher.submit(formData, { method: "post" });
  };
  return /* @__PURE__ */ jsxs7("div", { className: "group flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300", children: [
    /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx8("div", { className: `flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg bg-gradient-to-br ${gradientClass}`, children: /* @__PURE__ */ jsx8("span", { className: "text-xl", children: icon }) }),
        /* @__PURE__ */ jsx8("h2", { className: "text-lg font-bold text-gray-900", children: title })
      ] }),
      isPristine ? /* @__PURE__ */ jsx8("span", { className: "text-sm font-medium text-gray-400", children: "Not Tracked" }) : /* @__PURE__ */ jsxs7("span", { className: `text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`, children: [
        localValue,
        "/10"
      ] })
    ] }),
    /* @__PURE__ */ jsxs7("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx8(
        "input",
        {
          type: "range",
          min: "1",
          max: "10",
          value: localValue,
          onChange: handleChange,
          onMouseUp: handleRelease,
          onTouchEnd: handleRelease,
          className: "w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-100",
          style: { accentColor: "currentColor" }
        }
      ),
      /* @__PURE__ */ jsxs7("div", { className: "mt-2 flex justify-between text-xs text-gray-400 font-medium tracking-wide", children: [
        /* @__PURE__ */ jsx8("span", { children: "Low" }),
        /* @__PURE__ */ jsx8("span", { children: isPristine ? "Drag to track" : "High" })
      ] })
    ] })
  ] });
}
function DashboardPage() {
  let data = useLoaderData3(), { user, stats, recentTasks } = data;
  return /* @__PURE__ */ jsxs7("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx8("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsx8("div", { className: "mx-auto max-w-6xl px-6 py-5", children: /* @__PURE__ */ jsxs7("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsxs7("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: [
          (() => {
            let hour = (/* @__PURE__ */ new Date()).getHours();
            return hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
          })(),
          " \u{1F44B}"
        ] }),
        /* @__PURE__ */ jsx8("p", { className: "mt-1 text-sm font-medium text-gray-500", children: user.email })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-2 shadow-sm transition-transform hover:scale-105", children: [
          /* @__PURE__ */ jsx8("span", { className: "text-lg", children: "\u{1F525}" }),
          /* @__PURE__ */ jsxs7("span", { className: "text-sm font-bold text-amber-700", children: [
            user.streak_count,
            " day streak"
          ] })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 shadow-sm transition-transform hover:scale-105", children: [
          /* @__PURE__ */ jsx8("span", { className: "text-lg", children: "\u2B50" }),
          /* @__PURE__ */ jsxs7("span", { className: "text-sm font-bold text-blue-700", children: [
            "Level ",
            user.current_level
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs7("div", { className: "mx-auto max-w-6xl px-6 py-8", children: [
      /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6", children: [
        /* @__PURE__ */ jsxs7("div", { className: "group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-100", children: [
          /* @__PURE__ */ jsx8("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-blue-500 transition-colors", children: "Total Points" }),
          /* @__PURE__ */ jsx8("p", { className: "text-4xl font-extrabold text-gray-900", children: user.total_points.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-emerald-100", children: [
          /* @__PURE__ */ jsx8("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors", children: "Current Level" }),
          /* @__PURE__ */ jsx8("p", { className: "text-4xl font-extrabold text-gray-900", children: user.current_level })
        ] }),
        /* @__PURE__ */ jsxs7("div", { className: "col-span-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs7("div", { className: "z-10", children: [
            /* @__PURE__ */ jsx8("p", { className: "text-xs font-bold text-indigo-100 uppercase tracking-wider mb-2", children: "Today's Progress" }),
            /* @__PURE__ */ jsxs7("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsx8("p", { className: "text-5xl font-extrabold", children: stats.tasks_completed_today }),
              /* @__PURE__ */ jsxs7("p", { className: "text-base text-indigo-200 font-bold tracking-wide", children: [
                "/ ",
                stats.tasks_today || 0,
                " completed"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "z-10 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner", children: /* @__PURE__ */ jsx8("span", { className: "text-3xl drop-shadow-lg", children: "\u{1F3C6}" }) }),
          /* @__PURE__ */ jsx8("div", { className: "absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" }),
          /* @__PURE__ */ jsx8("div", { className: "absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsx8("h2", { className: "text-2xl font-extrabold text-gray-900 mb-6 drop-shadow-sm", children: "Log Your State" }),
        /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsx8(
            MetricSlider,
            {
              title: "Energy Level",
              icon: "\u26A1",
              value: stats.energy_average,
              type: "energy",
              gradientClass: "from-cyan-400 to-blue-500"
            }
          ),
          /* @__PURE__ */ jsx8(
            MetricSlider,
            {
              title: "Mood",
              icon: "\u{1F60A}",
              value: stats.mood_average,
              type: "mood",
              gradientClass: "from-emerald-400 to-green-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs7("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsxs7("div", { className: "flex items-center justify-between border-b-2 border-gray-100 pb-4", children: [
          /* @__PURE__ */ jsx8("h2", { className: "text-2xl font-extrabold text-gray-900 drop-shadow-sm", children: "Task Board" }),
          /* @__PURE__ */ jsxs7(Link, { to: "/tasks/new", className: "inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:shadow-gray-900/30 hover:-translate-y-0.5 transition-all", children: [
            /* @__PURE__ */ jsx8("span", { children: "+" }),
            " New Task"
          ] })
        ] }),
        /* @__PURE__ */ jsx8(TaskBoard, { tasks: recentTasks })
      ] })
    ] })
  ] });
}

// app/routes/auth.register.tsx
var auth_register_exports = {};
__export(auth_register_exports, {
  action: () => action5,
  default: () => RegisterPage,
  meta: () => meta8
});
import { Form as Form4, Link as Link2, useActionData, useNavigation as useNavigation4 } from "@remix-run/react";
import { useState as useState5 } from "react";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var meta8 = () => [
  { title: "Register - Goal Tracker" }
], action5 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { UserPsychologyProfile: UserPsychologyProfile2 } = await Promise.resolve().then(() => (init_Analytics(), Analytics_exports)), { hashPassword: hashPassword2, isValidEmail: isValidEmail2, validatePasswordStrength: validatePasswordStrength2 } = await Promise.resolve().then(() => (init_auth(), auth_exports)), { createUserSession: createUserSession2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  if (await connectDB2(), request.method !== "POST")
    return null;
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), confirmPassword = formData.get("confirmPassword");
  if (password !== confirmPassword)
    return { error: "Passwords do not match" };
  if (!isValidEmail2(email))
    return { error: "Invalid email format" };
  let passwordStrength = validatePasswordStrength2(password);
  if (!passwordStrength.valid)
    return { error: "Password is too weak", feedback: passwordStrength.feedback };
  try {
    if (await User2.findOne({ email: email.toLowerCase() }))
      return { error: "Email already registered" };
    let password_hash = await hashPassword2(password), user = new User2({
      email: email.toLowerCase(),
      password_hash,
      total_points: 0,
      current_level: 1,
      streak_count: 0
    });
    return await user.save(), await new UserPsychologyProfile2({
      user_id: user._id,
      chronotype: "afternoon",
      emotional_baseline: 5,
      energy_baseline: 5
    }).save(), createUserSession2({
      request,
      userId: user._id.toString(),
      remember: !0,
      redirectTo: "/dashboard"
    });
  } catch (error) {
    return console.error("Registration error:", error), { error: "An error occurred. Please try again." };
  }
};
function RegisterPage() {
  let actionData = useActionData(), navigation = useNavigation4(), [showPassword, setShowPassword] = useState5(!1), [showConfirm, setShowConfirm] = useState5(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxs8("div", { className: "flex min-h-screen", children: [
    /* @__PURE__ */ jsxs8("div", { className: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs8("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx9("div", { className: "absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsx9("div", { className: "absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "relative z-10 flex flex-col justify-center px-16", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 mb-12", children: [
          /* @__PURE__ */ jsx9("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg", children: "GT" }),
          /* @__PURE__ */ jsx9("span", { className: "text-2xl font-bold text-white", children: "Goal Tracker" })
        ] }),
        /* @__PURE__ */ jsxs8("h2", { className: "text-4xl font-extrabold text-white leading-tight", children: [
          "Start your journey",
          /* @__PURE__ */ jsx9("br", {}),
          /* @__PURE__ */ jsx9("span", { className: "text-emerald-200", children: "to better habits." })
        ] }),
        /* @__PURE__ */ jsx9("p", { className: "mt-6 text-lg text-emerald-100/80 max-w-md", children: "Join thousands of high achievers who use science-backed tools to crush their goals every day." }),
        /* @__PURE__ */ jsxs8("div", { className: "mt-12 space-y-4", children: [
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx9("span", { children: "Psychology-based goal frameworks" })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx9("span", { children: "Energy & mood tracking" })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx9("span", { children: "Gamification & rewards system" })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx9("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx9("span", { children: "Free forever for individuals" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "flex w-full items-center justify-center px-6 lg:w-1/2 bg-white", children: /* @__PURE__ */ jsxs8("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx9("div", { className: "mb-8 lg:hidden", children: /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx9("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx9("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }) }),
      /* @__PURE__ */ jsx9("h1", { className: "text-3xl font-extrabold text-gray-900", children: "Create account" }),
      /* @__PURE__ */ jsxs8("p", { className: "mt-2 text-sm text-gray-500", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx9(Link2, { to: "/auth/login", className: "font-semibold text-emerald-600 hover:text-emerald-700 transition", children: "Sign in" })
      ] }),
      /* @__PURE__ */ jsxs8(Form4, { method: "post", className: "mt-8 space-y-5", children: [
        actionData?.error && /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700", children: [
          /* @__PURE__ */ jsx9("span", { className: "text-lg", children: "\u26A0\uFE0F" }),
          actionData.error
        ] }),
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx9("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700", children: "Email address" }),
          /* @__PURE__ */ jsx9(
            "input",
            {
              type: "email",
              id: "email",
              name: "email",
              required: !0,
              className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all",
              placeholder: "you@example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsxs8("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700", children: [
            "Password ",
            /* @__PURE__ */ jsx9("span", { className: "font-normal text-gray-400", children: "(min 8 characters)" })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
            /* @__PURE__ */ jsx9(
              "input",
              {
                type: showPassword ? "text" : "password",
                id: "password",
                name: "password",
                required: !0,
                minLength: 8,
                className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              }
            ),
            /* @__PURE__ */ jsx9(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition",
                children: showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx9("label", { htmlFor: "confirmPassword", className: "block text-sm font-semibold text-gray-700", children: "Confirm password" }),
          /* @__PURE__ */ jsxs8("div", { className: "relative", children: [
            /* @__PURE__ */ jsx9(
              "input",
              {
                type: showConfirm ? "text" : "password",
                id: "confirmPassword",
                name: "confirmPassword",
                required: !0,
                minLength: 8,
                className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              }
            ),
            /* @__PURE__ */ jsx9(
              "button",
              {
                type: "button",
                onClick: () => setShowConfirm(!showConfirm),
                className: "absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition",
                children: showConfirm ? "\u{1F648}" : "\u{1F441}\uFE0F"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx9(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200",
            children: isLoading ? /* @__PURE__ */ jsxs8("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxs8("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx9("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx9("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }),
              "Creating account..."
            ] }) : "Create account"
          }
        ),
        /* @__PURE__ */ jsx9("p", { className: "text-center text-xs text-gray-400", children: "By creating an account, you agree to our Terms of Service" })
      ] }),
      /* @__PURE__ */ jsx9("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx9(Link2, { to: "/", className: "text-sm text-gray-400 hover:text-gray-600 transition", children: "\u2190 Back to home" }) })
    ] }) })
  ] });
}

// app/routes/goals._index.tsx
var goals_index_exports = {};
__export(goals_index_exports, {
  default: () => GoalsPage,
  loader: () => loader5,
  meta: () => meta9
});
import { useLoaderData as useLoaderData4, Link as Link3 } from "@remix-run/react";
import { useState as useState6 } from "react";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var meta9 = () => [
  { title: "Goals - Goal Tracker" }
], loader5 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2, ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), userId = await requireUserId2(request), [longTermGoals, shortTermGoals] = await Promise.all([
    LongTermGoal2.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ShortTermGoal2.find({ user_id: userId }).sort({ created_at: -1 }).lean()
  ]);
  return {
    longTermGoals,
    shortTermGoals
  };
};
function GoalsPage() {
  let { longTermGoals, shortTermGoals } = useLoaderData4(), [activeTab, setActiveTab] = useState6("long-term");
  return /* @__PURE__ */ jsxs9("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx10("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsx10("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx10("h1", { className: "text-2xl font-bold text-gray-900", children: "Goals" }),
      /* @__PURE__ */ jsxs9("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx10(
          Link3,
          {
            to: "/goals/long-term/new",
            className: "rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700",
            children: "+ Long-term Goal"
          }
        ),
        /* @__PURE__ */ jsx10(
          Link3,
          {
            to: "/goals/short-term/new",
            className: "rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700",
            children: "+ Short-term Goal"
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs9("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs9("div", { className: "flex gap-4 border-b border-gray-200", children: [
        /* @__PURE__ */ jsxs9(
          "button",
          {
            onClick: () => setActiveTab("long-term"),
            className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "long-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
            children: [
              "Long-term Goals (",
              longTermGoals.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs9(
          "button",
          {
            onClick: () => setActiveTab("short-term"),
            className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "short-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
            children: [
              "Short-term Goals (",
              shortTermGoals.length,
              ")"
            ]
          }
        )
      ] }),
      activeTab === "long-term" && /* @__PURE__ */ jsx10("div", { className: "mt-8 space-y-4", children: longTermGoals.length === 0 ? /* @__PURE__ */ jsx10("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ jsx10("p", { className: "text-gray-600", children: "No long-term goals yet. Create one to get started!" }) }) : longTermGoals.map((goal) => /* @__PURE__ */ jsx10("div", { className: "rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition", children: /* @__PURE__ */ jsxs9("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx10("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }),
            /* @__PURE__ */ jsx10(
              "span",
              {
                className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "active" ? "bg-green-100 text-green-700" : goal.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
                children: goal.status === "active" ? "Active" : "Completed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs9("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxs9("div", { children: [
              /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsx10("span", { className: "text-gray-600", children: "Progress" }),
                /* @__PURE__ */ jsxs9("span", { className: "font-medium text-gray-900", children: [
                  goal.current_progress_percentage,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx10("div", { className: "mt-1 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsx10(
                "div",
                {
                  className: "h-full rounded-full bg-blue-600",
                  style: { width: `${goal.current_progress_percentage}%` }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs9("div", { children: [
                /* @__PURE__ */ jsx10("span", { className: "text-gray-600", children: "Category:" }),
                /* @__PURE__ */ jsx10("p", { className: "font-medium text-gray-900 capitalize", children: goal.category })
              ] }),
              /* @__PURE__ */ jsxs9("div", { children: [
                /* @__PURE__ */ jsx10("span", { className: "text-gray-600", children: "Priority:" }),
                /* @__PURE__ */ jsx10("p", { className: "font-medium text-gray-900 capitalize", children: goal.priority })
              ] }),
              /* @__PURE__ */ jsxs9("div", { children: [
                /* @__PURE__ */ jsx10("span", { className: "text-gray-600", children: "Target:" }),
                /* @__PURE__ */ jsx10("p", { className: "font-medium text-gray-900", children: new Date(goal.target_date).toLocaleDateString() })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "ml-4 flex gap-2", children: [
          /* @__PURE__ */ jsx10(
            Link3,
            {
              to: `/goals/long-term/${goal._id}`,
              className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50",
              children: "View"
            }
          ),
          /* @__PURE__ */ jsx10("button", { className: "rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50", children: "Edit" })
        ] })
      ] }) }, goal._id)) }),
      activeTab === "short-term" && /* @__PURE__ */ jsx10("div", { className: "mt-8 space-y-4", children: shortTermGoals.length === 0 ? /* @__PURE__ */ jsx10("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ jsx10("p", { className: "text-gray-600", children: "No short-term goals yet. Create one to get started!" }) }) : shortTermGoals.map((goal) => /* @__PURE__ */ jsx10("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: /* @__PURE__ */ jsxs9("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx10("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }),
            /* @__PURE__ */ jsx10(
              "span",
              {
                className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : goal.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`,
                children: goal.status === "in_progress" ? "In Progress" : "Completed"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs9("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx10("h4", { className: "text-sm font-medium text-gray-900", children: "Milestones" }),
            /* @__PURE__ */ jsx10("div", { className: "mt-2 space-y-2", children: goal.milestones?.map((milestone) => /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx10(
                "input",
                {
                  type: "checkbox",
                  checked: milestone.completed,
                  className: "h-4 w-4 rounded border-gray-300",
                  readOnly: !0
                }
              ),
              /* @__PURE__ */ jsx10(
                "span",
                {
                  className: milestone.completed ? "line-through text-gray-400" : "text-gray-700",
                  children: milestone.title
                }
              )
            ] }, milestone.id)) })
          ] }),
          /* @__PURE__ */ jsxs9("p", { className: "mt-3 text-sm text-gray-600", children: [
            "Due: ",
            new Date(goal.end_date).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsx10("div", { className: "ml-4 flex gap-2", children: /* @__PURE__ */ jsx10(
          Link3,
          {
            to: `/goals/short-term/${goal._id}`,
            className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50",
            children: "View"
          }
        ) })
      ] }) }, goal._id)) })
    ] })
  ] });
}

// app/routes/auth.logout.tsx
var auth_logout_exports = {};
__export(auth_logout_exports, {
  action: () => action6,
  loader: () => loader6
});
var action6 = async ({ request }) => {
  let { logout: logout2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  return logout2(request);
}, loader6 = async () => {
  let { redirect: redirect2 } = await import("@remix-run/node");
  return redirect2("/");
};

// app/routes/auth.login.tsx
var auth_login_exports = {};
__export(auth_login_exports, {
  action: () => action7,
  default: () => LoginPage,
  meta: () => meta10
});
import { Form as Form5, Link as Link4, useActionData as useActionData2, useNavigation as useNavigation5 } from "@remix-run/react";
import { useState as useState7 } from "react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var meta10 = () => [
  { title: "Login - Goal Tracker" }
], action7 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { verifyPassword: verifyPassword2 } = await Promise.resolve().then(() => (init_auth(), auth_exports)), { createUserSession: createUserSession2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  if (await connectDB2(), request.method !== "POST")
    return null;
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password");
  try {
    let user = await User2.findOne({ email: email.toLowerCase() });
    return user ? await verifyPassword2(password, user.password_hash) ? (user.last_login = /* @__PURE__ */ new Date(), await user.save(), createUserSession2({
      request,
      userId: user._id.toString(),
      remember: !0,
      redirectTo: "/dashboard"
    })) : { error: "Invalid credentials" } : { error: "Invalid credentials" };
  } catch (error) {
    return console.error("Login error:", error), { error: "An error occurred. Please try again." };
  }
};
function LoginPage() {
  let actionData = useActionData2(), navigation = useNavigation5(), [showPassword, setShowPassword] = useState7(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxs10("div", { className: "flex min-h-screen", children: [
    /* @__PURE__ */ jsxs10("div", { className: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs10("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx11("div", { className: "absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsx11("div", { className: "absolute bottom-20 right-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "relative z-10 flex flex-col justify-center px-16", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 mb-12", children: [
          /* @__PURE__ */ jsx11("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg", children: "GT" }),
          /* @__PURE__ */ jsx11("span", { className: "text-2xl font-bold text-white", children: "Goal Tracker" })
        ] }),
        /* @__PURE__ */ jsxs10("h2", { className: "text-4xl font-extrabold text-white leading-tight", children: [
          "Welcome back.",
          /* @__PURE__ */ jsx11("br", {}),
          /* @__PURE__ */ jsx11("span", { className: "text-blue-200", children: "Let's crush your goals." })
        ] }),
        /* @__PURE__ */ jsx11("p", { className: "mt-6 text-lg text-blue-100/80 max-w-md", children: "Track your progress, build streaks, and unlock achievements with science-backed productivity tools." }),
        /* @__PURE__ */ jsxs10("div", { className: "mt-12 flex gap-8", children: [
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx11("p", { className: "text-3xl font-bold text-white", children: "73%" }),
            /* @__PURE__ */ jsx11("p", { className: "text-sm text-blue-200/70", children: "Higher completion" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx11("p", { className: "text-3xl font-bold text-white", children: "2.4x" }),
            /* @__PURE__ */ jsx11("p", { className: "text-sm text-blue-200/70", children: "Faster goals" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { children: [
            /* @__PURE__ */ jsx11("p", { className: "text-3xl font-bold text-white", children: "89%" }),
            /* @__PURE__ */ jsx11("p", { className: "text-sm text-blue-200/70", children: "Keep streaks" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx11("div", { className: "flex w-full items-center justify-center px-6 lg:w-1/2 bg-white", children: /* @__PURE__ */ jsxs10("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx11("div", { className: "mb-8 lg:hidden", children: /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx11("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx11("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }) }),
      /* @__PURE__ */ jsx11("h1", { className: "text-3xl font-extrabold text-gray-900", children: "Sign in" }),
      /* @__PURE__ */ jsxs10("p", { className: "mt-2 text-sm text-gray-500", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsx11(Link4, { to: "/auth/register", className: "font-semibold text-blue-600 hover:text-blue-700 transition", children: "Create one free" })
      ] }),
      /* @__PURE__ */ jsxs10(Form5, { method: "post", className: "mt-8 space-y-5", children: [
        actionData?.error && /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700", children: [
          /* @__PURE__ */ jsx11("span", { className: "text-lg", children: "\u26A0\uFE0F" }),
          actionData.error
        ] }),
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700", children: "Email address" }),
          /* @__PURE__ */ jsx11(
            "input",
            {
              type: "email",
              id: "email",
              name: "email",
              required: !0,
              className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
              placeholder: "you@example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700", children: "Password" }),
          /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(
              "input",
              {
                type: showPassword ? "text" : "password",
                id: "password",
                name: "password",
                required: !0,
                className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all",
                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
              }
            ),
            /* @__PURE__ */ jsx11(
              "button",
              {
                type: "button",
                onClick: () => setShowPassword(!showPassword),
                className: "absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition",
                children: showPassword ? "\u{1F648}" : "\u{1F441}\uFE0F"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx11(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200",
            children: isLoading ? /* @__PURE__ */ jsxs10("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxs10("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx11("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx11("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }),
              "Signing in..."
            ] }) : "Sign in"
          }
        )
      ] }),
      /* @__PURE__ */ jsx11("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx11(Link4, { to: "/", className: "text-sm text-gray-400 hover:text-gray-600 transition", children: "\u2190 Back to home" }) })
    ] }) })
  ] });
}

// app/routes/dashboard.tsx
var dashboard_exports = {};
__export(dashboard_exports, {
  default: () => DashboardLayout,
  loader: () => loader7
});
import { Outlet as Outlet2, Link as Link5, useLocation, Form as Form6 } from "@remix-run/react";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var loader7 = async ({ request }) => {
  let { getUserId: getUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), userId = await getUserId2(request);
  if (!userId) {
    let { redirect: redirect2 } = await import("@remix-run/node");
    return redirect2("/auth/login");
  }
  return { userId };
}, navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { to: "/goals", label: "Goals", icon: "\u{1F3AF}" },
  { to: "/analytics", label: "Analytics", icon: "\u{1F4C8}" },
  { to: "/gamification", label: "Rewards", icon: "\u{1F3C6}" }
];
function DashboardLayout() {
  let location = useLocation();
  return /* @__PURE__ */ jsxs11("div", { className: "flex min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx12("aside", { className: "fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-200 bg-white lg:block", children: /* @__PURE__ */ jsxs11("div", { className: "flex h-full flex-col", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3 border-b border-gray-100 px-6 py-5", children: [
        /* @__PURE__ */ jsx12("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20", children: "GT" }),
        /* @__PURE__ */ jsx12("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsx12("nav", { className: "flex-1 space-y-1 px-3 py-4", children: navItems.map((item) => {
        let isActive = location.pathname === item.to || item.to !== "/dashboard" && location.pathname.startsWith(item.to);
        return /* @__PURE__ */ jsxs11(
          Link5,
          {
            to: item.to,
            className: `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
            children: [
              /* @__PURE__ */ jsx12("span", { className: "text-lg", children: item.icon }),
              item.label,
              isActive && /* @__PURE__ */ jsx12("div", { className: "ml-auto h-2 w-2 rounded-full bg-blue-600" })
            ]
          },
          item.to
        );
      }) }),
      /* @__PURE__ */ jsx12("div", { className: "border-t border-gray-100 p-4", children: /* @__PURE__ */ jsx12(Form6, { method: "post", action: "/auth/logout", children: /* @__PURE__ */ jsxs11(
        "button",
        {
          type: "submit",
          className: "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx12("span", { className: "text-lg", children: "\u{1F6AA}" }),
            "Sign Out"
          ]
        }
      ) }) })
    ] }) }),
    /* @__PURE__ */ jsxs11("div", { className: "fixed top-0 left-0 right-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx12("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs", children: "GT" }),
        /* @__PURE__ */ jsx12("span", { className: "text-lg font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsx12("div", { className: "flex items-center gap-2", children: navItems.map((item) => /* @__PURE__ */ jsx12(
        Link5,
        {
          to: item.to,
          className: `rounded-lg p-2 text-lg transition ${location.pathname.startsWith(item.to) ? "bg-blue-50" : "hover:bg-gray-50"}`,
          children: item.icon
        },
        item.to
      )) })
    ] }),
    /* @__PURE__ */ jsx12("main", { className: "flex-1 lg:ml-64", children: /* @__PURE__ */ jsx12("div", { className: "pt-16 lg:pt-0", children: /* @__PURE__ */ jsx12(Outlet2, {}) }) })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta11
});
import { Link as Link6 } from "@remix-run/react";
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var meta11 = () => [
  { title: "Goal Tracker \u2014 Master Your Goals with Science" },
  {
    name: "description",
    content: "Psychology-driven goal tracking with energy-emotion insights, SMART frameworks, and gamification to supercharge your productivity."
  }
];
function Index() {
  return /* @__PURE__ */ jsxs12("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx13("nav", { className: "fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxs12("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx13("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "hidden md:flex items-center gap-8", children: [
        /* @__PURE__ */ jsx13("a", { href: "#features", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "Features" }),
        /* @__PURE__ */ jsx13("a", { href: "#how-it-works", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "How It Works" }),
        /* @__PURE__ */ jsx13("a", { href: "#stats", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "Results" })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx13(
          Link6,
          {
            to: "/auth/login",
            className: "text-sm font-semibold text-gray-700 hover:text-gray-900 transition px-4 py-2",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx13(
          Link6,
          {
            to: "/auth/register",
            className: "rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200",
            children: "Get Started Free"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs12("section", { className: "relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32", children: [
      /* @__PURE__ */ jsxs12("div", { className: "absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx13("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 blur-3xl" }),
        /* @__PURE__ */ jsx13("div", { className: "absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-purple-100/40 to-pink-100/40 blur-3xl" }),
        /* @__PURE__ */ jsx13("div", { className: "absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "mx-auto max-w-7xl px-6 text-center", children: [
        /* @__PURE__ */ jsxs12("div", { className: "inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8", children: [
          /* @__PURE__ */ jsxs12("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsx13("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" }),
            /* @__PURE__ */ jsx13("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-blue-600" })
          ] }),
          "Psychology-Powered Productivity"
        ] }),
        /* @__PURE__ */ jsxs12("h1", { className: "mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl", children: [
          "Goals that actually",
          /* @__PURE__ */ jsx13("span", { className: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent", children: " get done" })
        ] }),
        /* @__PURE__ */ jsx13("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed", children: "Stop setting goals that fade away. Our science-backed system uses energy-emotion tracking, SMART frameworks, and gamification to turn your ambitions into achievements." }),
        /* @__PURE__ */ jsxs12("div", { className: "mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center", children: [
          /* @__PURE__ */ jsxs12(
            Link6,
            {
              to: "/auth/register",
              className: "group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300",
              children: [
                "Start Tracking Free",
                /* @__PURE__ */ jsx13("svg", { className: "h-5 w-5 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx13("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx13(
            Link6,
            {
              to: "/auth/login",
              className: "inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200",
              children: "Sign In"
            }
          )
        ] }),
        /* @__PURE__ */ jsx13("p", { className: "mt-4 text-sm text-gray-500", children: "No credit card required \xB7 Free forever for individuals" })
      ] })
    ] }),
    /* @__PURE__ */ jsx13("section", { id: "features", className: "py-24 bg-gray-50/50", children: /* @__PURE__ */ jsxs12("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs12("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx13("p", { className: "text-sm font-semibold uppercase tracking-widest text-blue-600", children: "Features" }),
        /* @__PURE__ */ jsxs12("h2", { className: "mt-3 text-4xl font-bold text-gray-900 md:text-5xl", children: [
          "Everything you need to ",
          /* @__PURE__ */ jsx13("span", { className: "text-blue-600", children: "succeed" })
        ] }),
        /* @__PURE__ */ jsx13("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-600", children: "Built on proven psychological principles to help you form better habits and achieve more." })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl shadow-lg shadow-orange-500/20", children: "\u26A1" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Energy & Emotion Tracking" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Map your energy and mood patterns throughout the day. Schedule tasks when you're at peak performance for maximum output." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg shadow-blue-500/20", children: "\u{1F3AF}" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "SMART Goal Framework" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Break down big ambitions into Specific, Measurable, Achievable, Relevant, and Time-bound milestones that drive real progress." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-2xl shadow-lg shadow-emerald-500/20", children: "\u{1F3C6}" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Gamification & Rewards" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Earn points, unlock achievements, and climb leaderboards. Scientifically designed rewards that reinforce positive habits." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl shadow-lg shadow-purple-500/20", children: "\u{1F9E0}" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Psychology Insights" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Get personalized insights into your productivity patterns, procrastination triggers, and optimal work windows." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white text-2xl shadow-lg shadow-rose-500/20", children: "\u{1F4CA}" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Rich Analytics" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Visualize your progress with beautiful charts. Track completion rates, streak patterns, and mood correlations over time." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-2xl shadow-lg shadow-cyan-500/20", children: "\u{1F525}" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Streak Building" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Build momentum with daily streaks. Our algorithm adapts difficulty to keep you in the flow state \u2014 not too easy, not too hard." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx13("section", { id: "how-it-works", className: "py-24", children: /* @__PURE__ */ jsxs12("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs12("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx13("p", { className: "text-sm font-semibold uppercase tracking-widest text-blue-600", children: "How it works" }),
        /* @__PURE__ */ jsxs12("h2", { className: "mt-3 text-4xl font-bold text-gray-900 md:text-5xl", children: [
          "Three steps to ",
          /* @__PURE__ */ jsx13("span", { className: "text-blue-600", children: "better habits" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-1 gap-12 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs12("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx13("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20", children: "1" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Set Your Goals" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600", children: "Define long-term visions and break them into actionable short-term goals using our SMART framework wizard." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx13("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20", children: "2" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Track Daily" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600", children: "Complete daily tasks, log your mood and energy, and watch your streaks grow. The app learns your optimal schedule." })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx13("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/20", children: "3" }),
          /* @__PURE__ */ jsx13("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Level Up" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-3 text-gray-600", children: "Earn rewards, unlock achievements, and see your productivity soar with data-driven insights and personalized coaching." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx13("section", { id: "stats", className: "py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white", children: /* @__PURE__ */ jsxs12("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs12("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs12("h2", { className: "text-4xl font-bold md:text-5xl", children: [
          "Built for ",
          /* @__PURE__ */ jsx13("span", { className: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent", children: "results" })
        ] }),
        /* @__PURE__ */ jsx13("p", { className: "mt-4 text-lg text-blue-200/70", children: "The science of habit formation, powered by technology." })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-8 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx13("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent", children: "73%" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-2 text-sm text-blue-200/60", children: "Higher completion rate" })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx13("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent", children: "2.4x" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-2 text-sm text-blue-200/60", children: "Faster goal achievement" })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx13("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent", children: "89%" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-2 text-sm text-blue-200/60", children: "Users maintain streaks" })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx13("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent", children: "47d" }),
          /* @__PURE__ */ jsx13("p", { className: "mt-2 text-sm text-blue-200/60", children: "Average streak length" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx13("section", { className: "py-24", children: /* @__PURE__ */ jsxs12("div", { className: "mx-auto max-w-4xl px-6 text-center", children: [
      /* @__PURE__ */ jsxs12("h2", { className: "text-4xl font-bold text-gray-900 md:text-5xl", children: [
        "Ready to achieve ",
        /* @__PURE__ */ jsx13("span", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "your goals" }),
        "?"
      ] }),
      /* @__PURE__ */ jsx13("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-gray-600", children: "Join thousands of high achievers who use Goal Tracker to build better habits, track their progress, and unlock their potential." }),
      /* @__PURE__ */ jsx13("div", { className: "mt-10", children: /* @__PURE__ */ jsxs12(
        Link6,
        {
          to: "/auth/register",
          className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300",
          children: [
            "Get Started \u2014 It's Free",
            /* @__PURE__ */ jsx13("svg", { className: "h-5 w-5 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx13("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" }) })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx13("footer", { className: "border-t border-gray-100 bg-gray-50 py-12", children: /* @__PURE__ */ jsx13("div", { className: "mx-auto max-w-7xl px-6", children: /* @__PURE__ */ jsxs12("div", { className: "flex flex-col items-center justify-between gap-6 md:flex-row", children: [
      /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs", children: "GT" }),
        /* @__PURE__ */ jsx13("span", { className: "text-lg font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsxs12("p", { className: "text-sm text-gray-500", children: [
        "\xA9 ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Goal Tracker. Psychology-powered productivity."
      ] })
    ] }) }) })
  ] });
}

// app/routes/auth.tsx
var auth_exports2 = {};
__export(auth_exports2, {
  default: () => AuthLayout
});
import { Outlet as Outlet3 } from "@remix-run/react";
import { jsx as jsx14 } from "react/jsx-runtime";
function AuthLayout() {
  return /* @__PURE__ */ jsx14(Outlet3, {});
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-RJQYT24D.js", imports: ["/build/_shared/chunk-AOAPHHAE.js", "/build/_shared/chunk-2QEWK57A.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-KHIJF5US.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-SVOKK25M.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/analytics._index": { id: "routes/analytics._index", parentId: "root", path: "analytics", index: !0, caseSensitive: void 0, module: "/build/routes/analytics._index-QHDXKNZJ.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-75I6IVAL.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.login": { id: "routes/auth.login", parentId: "routes/auth", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.login-TXYHVVEK.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.logout": { id: "routes/auth.logout", parentId: "routes/auth", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.logout-RT7NNDUM.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.register": { id: "routes/auth.register", parentId: "routes/auth", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.register-OAHWLT7K.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard": { id: "routes/dashboard", parentId: "root", path: "dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/dashboard-SE67BSPS.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "routes/dashboard", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-5DO4772X.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/gamification._index": { id: "routes/gamification._index", parentId: "root", path: "gamification", index: !0, caseSensitive: void 0, module: "/build/routes/gamification._index-2IJLNUE6.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals._index": { id: "routes/goals._index", parentId: "root", path: "goals", index: !0, caseSensitive: void 0, module: "/build/routes/goals._index-IGBAIR34.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.long-term.new": { id: "routes/goals.long-term.new", parentId: "root", path: "goals/long-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.long-term.new-YYD2I3TW.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.short-term.new": { id: "routes/goals.short-term.new", parentId: "root", path: "goals/short-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.short-term.new-UH47DMLE.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/tasks.complete.$taskId": { id: "routes/tasks.complete.$taskId", parentId: "root", path: "tasks/complete/:taskId", index: void 0, caseSensitive: void 0, module: "/build/routes/tasks.complete.$taskId-3IUJE7KO.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "38b8f785", hmr: void 0, url: "/build/manifest-38B8F785.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "production", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !0, v3_relativeSplatPath: !0, v3_throwAbortReason: !0, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/tasks.complete.$taskId": {
    id: "routes/tasks.complete.$taskId",
    parentId: "root",
    path: "tasks/complete/:taskId",
    index: void 0,
    caseSensitive: void 0,
    module: tasks_complete_taskId_exports
  },
  "routes/goals.short-term.new": {
    id: "routes/goals.short-term.new",
    parentId: "root",
    path: "goals/short-term/new",
    index: void 0,
    caseSensitive: void 0,
    module: goals_short_term_new_exports
  },
  "routes/gamification._index": {
    id: "routes/gamification._index",
    parentId: "root",
    path: "gamification",
    index: !0,
    caseSensitive: void 0,
    module: gamification_index_exports
  },
  "routes/goals.long-term.new": {
    id: "routes/goals.long-term.new",
    parentId: "root",
    path: "goals/long-term/new",
    index: void 0,
    caseSensitive: void 0,
    module: goals_long_term_new_exports
  },
  "routes/analytics._index": {
    id: "routes/analytics._index",
    parentId: "root",
    path: "analytics",
    index: !0,
    caseSensitive: void 0,
    module: analytics_index_exports
  },
  "routes/dashboard._index": {
    id: "routes/dashboard._index",
    parentId: "routes/dashboard",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: dashboard_index_exports
  },
  "routes/auth.register": {
    id: "routes/auth.register",
    parentId: "routes/auth",
    path: "register",
    index: void 0,
    caseSensitive: void 0,
    module: auth_register_exports
  },
  "routes/goals._index": {
    id: "routes/goals._index",
    parentId: "root",
    path: "goals",
    index: !0,
    caseSensitive: void 0,
    module: goals_index_exports
  },
  "routes/auth.logout": {
    id: "routes/auth.logout",
    parentId: "routes/auth",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: auth_logout_exports
  },
  "routes/auth.login": {
    id: "routes/auth.login",
    parentId: "routes/auth",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: auth_login_exports
  },
  "routes/dashboard": {
    id: "routes/dashboard",
    parentId: "root",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: dashboard_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/auth": {
    id: "routes/auth",
    parentId: "root",
    path: "auth",
    index: void 0,
    caseSensitive: void 0,
    module: auth_exports2
  }
};
export {
  assets_manifest_default as assets,
  assetsBuildDirectory,
  entry,
  future,
  mode,
  publicPath,
  routes
};
