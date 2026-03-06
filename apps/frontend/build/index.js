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
          default: ""
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
        tags: [String],
        sort_order: {
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
var globals_default = "/build/_assets/globals-3ZH4SJ5E.css";

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

// app/routes/api.generate-goal-tasks.tsx
var api_generate_goal_tasks_exports = {};
__export(api_generate_goal_tasks_exports, {
  action: () => action
});
import { json } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";
var action = async ({ request }) => {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, { status: 405 });
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  await requireUserId2(request);
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return json({ error: "AI not configured." }, { status: 500 });
  let formData = await request.formData(), goalTitle = formData.get("goalTitle") ?? "", goalDescription = formData.get("goalDescription") ?? "", targetDate = formData.get("targetDate") ?? "", category = formData.get("category") ?? "";
  if (!goalTitle)
    return json({ error: "Goal title is required." }, { status: 400 });
  try {
    let model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    }), today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], prompt = `You are a productivity coach. A user has a long-term goal they want to start acting on TODAY.

Goal: "${goalTitle}"
Description: "${goalDescription}"
Category: ${category}
Target date: ${targetDate || "not set"}
Today: ${today}

Generate exactly 5 concrete daily tasks they should start doing this week to make meaningful progress toward this goal.

Return ONLY a valid JSON array of 5 objects, each with this schema:
{
  "title": "Action-oriented task title starting with a verb (5-10 words)",
  "description": "1 sentence: what to do and why it moves the goal forward",
  "difficulty_level": <integer 1-5>,
  "due_date": "<YYYY-MM-DD \u2014 spread across today through today+6 days, start with the most foundational task today>",
  "tags": ["tag1", "tag2"] <choose 2 from: work, personal, health, learning, creative, admin, urgent, planning, review, meeting>
}

Make the tasks specific, achievable in one day, and directly connected to the goal. Order from most foundational to most advanced.
Respond with ONLY the JSON array.`.trim(), result = await model.generateContent(prompt), parsed = JSON.parse(result.response.text());
    return json({ success: !0, tasks: parsed });
  } catch (e) {
    return console.error("Goal tasks generation error:", e), json({ error: "Failed to generate tasks. Please try again." }, { status: 500 });
  }
};

// app/routes/tasks.complete.$taskId.tsx
var tasks_complete_taskId_exports = {};
__export(tasks_complete_taskId_exports, {
  action: () => action2,
  default: () => CompleteTaskPage,
  meta: () => meta2
});
import { Form, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var meta2 = () => [
  { title: "Complete Task - Goal Tracker" }
], action2 = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { redirect: redirect3 } = await import("@remix-run/node");
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
    return redirect3("/dashboard");
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

// app/routes/goals.short-term.$id.tsx
var goals_short_term_id_exports = {};
__export(goals_short_term_id_exports, {
  action: () => action3,
  default: () => ShortTermGoalDetail,
  loader: () => loader2,
  meta: () => meta3
});
import { useLoaderData, Link, useFetcher } from "@remix-run/react";
import { json as json2 } from "@remix-run/node";
import { useState as useState2 } from "react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
var meta3 = ({ data }) => [
  { title: `${data?.goal?.title ?? "Goal"} - Goal Tracker` }
], loader2 = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports);
  await connectDB2();
  let userId = await requireUserId2(request), goal = await ShortTermGoal2.findOne({ _id: params.id, user_id: userId }).lean();
  if (!goal)
    throw new Response("Not Found", { status: 404 });
  return json2({
    goal: {
      _id: goal._id.toString(),
      title: goal.title,
      description: goal.description,
      status: goal.status,
      priority: goal.priority ?? "medium",
      start_date: goal.start_date ? new Date(goal.start_date).toISOString() : null,
      end_date: goal.end_date ? new Date(goal.end_date).toISOString() : null,
      milestones: (goal.milestones ?? []).map((m) => ({
        id: (m._id ?? m.id).toString(),
        title: m.title,
        completed: !!m.completed
      })),
      created_at: goal.created_at ? new Date(goal.created_at).toISOString() : null
    }
  });
}, action3 = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports);
  await connectDB2();
  let userId = await requireUserId2(request), formData = await request.formData(), _action = formData.get("_action");
  if (_action === "toggle_milestone") {
    let milestoneId = formData.get("milestone_id"), completed = formData.get("completed") === "true", goal = await ShortTermGoal2.findOne({ _id: params.id, user_id: userId });
    if (!goal)
      return json2({ error: "Not found" }, { status: 404 });
    let m = goal.milestones.find((m2) => m2._id.toString() === milestoneId);
    return m && (m.completed = completed, goal.completed_milestones_count = goal.milestones.filter((x) => x.completed).length), await goal.save(), json2({ ok: !0 });
  }
  if (_action === "update_status") {
    let status = formData.get("status");
    return await ShortTermGoal2.findOneAndUpdate({ _id: params.id, user_id: userId }, { status }), json2({ ok: !0 });
  }
  return json2({ error: "Unknown action" }, { status: 400 });
}, priorityConfig = {
  high: { dot: "bg-red-500", text: "text-red-700", label: "High", bg: "bg-red-50" },
  medium: { dot: "bg-amber-400", text: "text-amber-700", label: "Medium", bg: "bg-amber-50" },
  low: { dot: "bg-gray-400", text: "text-gray-600", label: "Low", bg: "bg-gray-50" }
}, statusConfig = {
  active: { label: "\u26A1 Active", color: "text-blue-700", bg: "bg-blue-100" },
  completed: { label: "\u2713 Completed", color: "text-emerald-700", bg: "bg-emerald-100" },
  paused: { label: "\u23F8 Paused", color: "text-amber-700", bg: "bg-amber-100" }
};
function fmtDate(iso) {
  return iso ? new Date(iso).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" }) : "\u2014";
}
function ShortTermGoalDetail() {
  let { goal } = useLoaderData(), fetcher = useFetcher(), [milestones, setMilestones] = useState2(goal.milestones), toggleMilestone = (id, current) => {
    setMilestones((prev) => prev.map((m) => m.id === id ? { ...m, completed: !current } : m));
    let fd = new FormData();
    fd.append("_action", "toggle_milestone"), fd.append("milestone_id", id), fd.append("completed", String(!current)), fetcher.submit(fd, { method: "post" });
  }, done = milestones.filter((m) => m.completed).length, total = milestones.length, progress = total > 0 ? Math.round(done / total * 100) : 0, pri = priorityConfig[goal.priority] ?? priorityConfig.medium, stat = statusConfig[goal.status] ?? statusConfig.active;
  return /* @__PURE__ */ jsxs3("div", { className: "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50", children: [
    /* @__PURE__ */ jsx4("header", { className: "sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsx4("div", { className: "mx-auto max-w-3xl px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx4(Link, { to: "/goals", className: "flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition", children: "\u2190" }),
      /* @__PURE__ */ jsxs3("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx4("p", { className: "text-xs font-semibold uppercase tracking-wide text-emerald-600", children: "Short-term Goal" }),
        /* @__PURE__ */ jsx4("h1", { className: "truncate text-lg font-bold text-gray-900", children: goal.title })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs3("main", { className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-5", children: [
      /* @__PURE__ */ jsxs3("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx4("span", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stat.bg} ${stat.color}`, children: stat.label }),
          /* @__PURE__ */ jsxs3("span", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pri.bg} ${pri.text}`, children: [
            /* @__PURE__ */ jsx4("span", { className: `h-1.5 w-1.5 rounded-full ${pri.dot}` }),
            pri.label,
            " priority"
          ] })
        ] }),
        /* @__PURE__ */ jsx4("p", { className: "text-gray-600 leading-relaxed", children: goal.description }),
        /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-2 gap-4 pt-2", children: [
          /* @__PURE__ */ jsxs3("div", { className: "rounded-xl bg-gray-50 px-4 py-3", children: [
            /* @__PURE__ */ jsx4("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-400", children: "Start Date" }),
            /* @__PURE__ */ jsx4("p", { className: "mt-1 font-semibold text-gray-800", children: fmtDate(goal.start_date) })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "rounded-xl bg-gray-50 px-4 py-3", children: [
            /* @__PURE__ */ jsx4("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-400", children: "End Date" }),
            /* @__PURE__ */ jsx4("p", { className: "mt-1 font-semibold text-gray-800", children: fmtDate(goal.end_date) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs3(fetcher.Form, { method: "post", className: "flex gap-2", children: [
          /* @__PURE__ */ jsx4("input", { type: "hidden", name: "_action", value: "update_status" }),
          ["active", "completed", "paused"].map((s) => /* @__PURE__ */ jsx4(
            "button",
            {
              name: "status",
              value: s,
              disabled: goal.status === s,
              className: `flex-1 rounded-xl py-2 text-xs font-semibold transition ${goal.status === s ? `${statusConfig[s].bg} ${statusConfig[s].color} border border-current/20` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              children: statusConfig[s].label
            },
            s
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6", children: [
        /* @__PURE__ */ jsxs3("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsx4("h2", { className: "font-bold text-gray-900", children: "Milestones" }),
          /* @__PURE__ */ jsxs3("span", { className: "text-sm font-bold text-gray-600", children: [
            done,
            "/",
            total,
            " done \xB7 ",
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx4("div", { className: "h-2.5 w-full rounded-full bg-gray-100 overflow-hidden mb-6", children: /* @__PURE__ */ jsx4(
          "div",
          {
            className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700",
            style: { width: `${progress}%` }
          }
        ) }),
        total === 0 ? /* @__PURE__ */ jsx4("p", { className: "text-center text-sm text-gray-400 py-6", children: "No milestones added yet." }) : /* @__PURE__ */ jsx4("div", { className: "space-y-2", children: milestones.map((m) => /* @__PURE__ */ jsxs3(
          "button",
          {
            onClick: () => toggleMilestone(m.id, m.completed),
            className: `w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${m.completed ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50 border border-gray-100 hover:border-emerald-200"}`,
            children: [
              /* @__PURE__ */ jsx4("div", { className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold border-2 transition-all ${m.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-gray-300 text-gray-300"}`, children: m.completed ? "\u2713" : "" }),
              /* @__PURE__ */ jsx4("span", { className: `flex-1 text-sm font-medium ${m.completed ? "line-through text-gray-400" : "text-gray-700"}`, children: m.title })
            ]
          },
          m.id
        )) })
      ] })
    ] })
  ] });
}

// app/routes/goals.short-term.new.tsx
var goals_short_term_new_exports = {};
__export(goals_short_term_new_exports, {
  action: () => action4,
  default: () => CreateShortTermGoal,
  loader: () => loader3,
  meta: () => meta4
});
import { Form as Form2, useNavigation as useNavigation2, useLoaderData as useLoaderData2, useFetcher as useFetcher2 } from "@remix-run/react";
import { json as json3 } from "@remix-run/node";
import { useState as useState3, useEffect as useEffect2 } from "react";
import { Fragment, jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
var meta4 = () => [
  { title: "Create Short-term Goal - Goal Tracker" }
], loader3 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { LongTermGoal: LongTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), userId = await requireUserId2(request);
  await connectDB2();
  let longTermGoals = await LongTermGoal2.find({ user_id: userId, status: "active" }).select("_id title").lean();
  return json3({
    longTermGoals: longTermGoals.map((g) => ({ id: g._id.toString(), title: g.title }))
  });
}, action4 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { redirect: redirect3 } = await import("@remix-run/node");
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId2(request);
  await connectDB2();
  let formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), start_date = formData.get("start_date"), end_date = formData.get("end_date"), priority = formData.get("priority"), long_term_goal_id = formData.get("long_term_goal_id");
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
      long_term_goal_id: long_term_goal_id || null,
      milestones,
      status: "active"
    }).save(), redirect3("/goals");
  } catch (error) {
    return console.error("Create short-term goal error:", error), { error: "An error occurred creating the goal" };
  }
};
function CreateShortTermGoal() {
  let { longTermGoals } = useLoaderData2(), navigation = useNavigation2(), aiFetcher = useFetcher2(), [formData, setFormData] = useState3({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority: "medium",
    long_term_goal_id: ""
  }), [milestones, setMilestones] = useState3(["", "", ""]), isLoading = navigation.state === "submitting", isAILoading = aiFetcher.state === "submitting";
  useEffect2(() => {
    if (aiFetcher.data?.success && aiFetcher.data.data) {
      let aiData = aiFetcher.data.data;
      setFormData((prev) => ({
        ...prev,
        title: aiData.title || prev.title,
        description: aiData.description || prev.description,
        start_date: aiData.start_date || prev.start_date,
        end_date: aiData.end_date || prev.end_date,
        priority: aiData.priority || prev.priority,
        long_term_goal_id: aiData.long_term_goal_id || prev.long_term_goal_id
      })), aiData.milestones && Array.isArray(aiData.milestones) && setMilestones(aiData.milestones.slice(0, 5));
    } else
      aiFetcher.data?.error && alert(aiFetcher.data.error);
  }, [aiFetcher.data]);
  let handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }, handleGenerateAI = () => {
    if (!formData.description || formData.description.length < 5) {
      alert("Please provide a bit more detail in the Description field for the AI to understand your goal.");
      return;
    }
    let data = new FormData();
    data.append("description", formData.description), aiFetcher.submit(data, { method: "post", action: "/api/generate-goal" });
  }, addMilestone = () => {
    milestones.length < 5 && setMilestones([...milestones, ""]);
  }, removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  }, updateMilestone = (index, value) => {
    let newMilestones = [...milestones];
    newMilestones[index] = value, setMilestones(newMilestones);
  };
  return /* @__PURE__ */ jsxs4("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx5("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxs4("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsx5("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Short-term Goal" }),
      /* @__PURE__ */ jsx5("p", { className: "mt-1 text-sm text-gray-600", children: "Break down your long-term vision into actionable milestones" })
    ] }) }),
    /* @__PURE__ */ jsx5("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs4(Form2, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex flex-col gap-2 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-5", children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "description", className: "block text-sm font-bold text-blue-900", children: "What are you committing to achieve? *" }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              type: "button",
              onClick: handleGenerateAI,
              disabled: isAILoading,
              className: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0",
              children: isAILoading ? /* @__PURE__ */ jsx5("span", { className: "animate-pulse", children: "Generating..." }) : /* @__PURE__ */ jsxs4(Fragment, { children: [
                /* @__PURE__ */ jsx5("span", { children: "\u2728" }),
                " Autofill with AI"
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx5(
          "textarea",
          {
            id: "description",
            name: "description",
            required: !0,
            rows: 3,
            value: formData.description,
            onChange: handleChange,
            placeholder: "Type a brief idea here and hit the '\u2728 Autofill with AI' button, or fill out the form manually...",
            className: "mt-2 block w-full rounded-lg border border-blue-200 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          }
        ),
        /* @__PURE__ */ jsx5("p", { className: "text-xs text-blue-600/70 font-medium", children: "The AI will generate an actionable title, estimate dates, map out milestones, and link it to your Long-Term Goals." })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              type: "text",
              id: "title",
              name: "title",
              required: !0,
              value: formData.title,
              onChange: handleChange,
              placeholder: "e.g., Complete Spanish Level 1 Course",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }),
          /* @__PURE__ */ jsxs4(
            "select",
            {
              id: "priority",
              name: "priority",
              value: formData.priority,
              onChange: handleChange,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsx5("option", { value: "low", children: "Low" }),
                /* @__PURE__ */ jsx5("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsx5("option", { value: "high", children: "High" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "start_date", className: "block text-sm font-medium text-gray-700", children: "Start Date *" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              type: "date",
              id: "start_date",
              name: "start_date",
              required: !0,
              value: formData.start_date,
              onChange: handleChange,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs4("div", { children: [
          /* @__PURE__ */ jsx5("label", { htmlFor: "end_date", className: "block text-sm font-medium text-gray-700", children: "End Date *" }),
          /* @__PURE__ */ jsx5(
            "input",
            {
              type: "date",
              id: "end_date",
              name: "end_date",
              required: !0,
              value: formData.end_date,
              onChange: handleChange,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsx5("label", { htmlFor: "long_term_goal_id", className: "block text-sm font-medium text-gray-700", children: "Link to Long-term Goal (Optional)" }),
        /* @__PURE__ */ jsxs4(
          "select",
          {
            id: "long_term_goal_id",
            name: "long_term_goal_id",
            value: formData.long_term_goal_id,
            onChange: handleChange,
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsx5("option", { value: "", children: "No long-term goal" }),
              longTermGoals.map((goal) => /* @__PURE__ */ jsx5("option", { value: goal.id, children: goal.title }, goal.id))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs4("div", { children: [
        /* @__PURE__ */ jsxs4("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx5("label", { className: "block text-sm font-medium text-gray-700", children: "Milestones" }),
          /* @__PURE__ */ jsx5(
            "button",
            {
              type: "button",
              onClick: addMilestone,
              disabled: milestones.length >= 5,
              className: "text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed",
              children: "+ Add Milestone"
            }
          )
        ] }),
        /* @__PURE__ */ jsx5("div", { className: "mt-4 space-y-3", children: milestones.map((milestone, index) => /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx5(
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
          /* @__PURE__ */ jsx5(
            "button",
            {
              type: "button",
              onClick: () => removeMilestone(index),
              className: "rounded-md border border-red-200 bg-red-50 text-red-600 px-3 py-2 text-sm font-medium hover:bg-red-100 hover:border-red-300 transition",
              children: "Remove"
            }
          )
        ] }, index)) })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "flex gap-4 pt-4 border-t border-gray-100", children: [
        /* @__PURE__ */ jsx5(
          "button",
          {
            type: "button",
            onClick: () => window.history.back(),
            className: "flex-1 rounded-full border border-gray-300 px-4 py-2 text-gray-700 font-semibold hover:bg-gray-50 transition",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx5(
          "button",
          {
            type: "submit",
            disabled: isLoading || isAILoading,
            className: "flex-1 rounded-full bg-gray-900 px-4 py-2 text-white font-semibold hover:bg-gray-800 hover:shadow-md disabled:opacity-50 transition",
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
  loader: () => loader4,
  meta: () => meta5
});
import { useLoaderData as useLoaderData3 } from "@remix-run/react";
import { json as json4 } from "@remix-run/node";
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var meta5 = () => [
  { title: "Rewards - Goal Tracker" }
], loader4 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports));
  await connectDB2();
  let userId = await requireUserId2(request), user = await User2.findById(userId).lean();
  if (!user)
    throw new Error("User not found");
  let pointsPerLevel = 1e3, currentLevelPoints = (user.current_level - 1) * pointsPerLevel, pointsInLevel = user.total_points - currentLevelPoints, xpPercent = Math.min(100, Math.max(0, Math.round(pointsInLevel / pointsPerLevel * 100))), pointsToNext = pointsPerLevel - pointsInLevel, levelNames = [
    "",
    "Novice",
    "Beginner",
    "Apprentice",
    "Intermediate",
    "Advanced",
    "Expert",
    "Master",
    "Legend",
    "Champion",
    "Grandmaster"
  ], totalTasksDone = await DailyTask2.countDocuments({ user_id: userId, status: "completed" }), leaderboard = (await User2.find({}).select("_id email total_points streak_count").sort({ total_points: -1 }).limit(10).lean()).map((u, i) => ({
    rank: i + 1,
    username: u.email.split("@")[0],
    points: u.total_points ?? 0,
    streak: u.streak_count ?? 0,
    isMe: u._id.toString() === userId
  }));
  if (!leaderboard.some((e) => e.isMe)) {
    let ahead = await User2.countDocuments({ total_points: { $gt: user.total_points ?? 0 } });
    leaderboard.push({
      rank: ahead + 1,
      username: user.email.split("@")[0],
      points: user.total_points ?? 0,
      streak: user.streak_count ?? 0,
      isMe: !0
    });
  }
  let achievements = [
    { id: "1", title: "First Steps", description: "Complete your first task", icon: "\u{1F463}", unlocked: totalTasksDone >= 1, rarity: "common" },
    { id: "2", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "\u2694\uFE0F", unlocked: (user.longest_streak ?? 0) >= 7, rarity: "uncommon" },
    { id: "3", title: "Task x10", description: "Complete 10 tasks", icon: "\u2705", unlocked: totalTasksDone >= 10, rarity: "uncommon" },
    { id: "4", title: "Level 5", description: "Reach level 5", icon: "\u{1F31F}", unlocked: (user.current_level ?? 1) >= 5, rarity: "rare" },
    { id: "5", title: "Task x50", description: "Complete 50 tasks", icon: "\u{1F4AF}", unlocked: totalTasksDone >= 50, rarity: "rare" },
    { id: "6", title: "Month Master", description: "Maintain a 30-day streak", icon: "\u{1F451}", unlocked: (user.longest_streak ?? 0) >= 30, rarity: "epic" },
    { id: "7", title: "Level 10", description: "Reach level 10", icon: "\u{1F680}", unlocked: (user.current_level ?? 1) >= 10, rarity: "epic" },
    { id: "8", title: "Unstoppable", description: "Maintain a 100-day streak", icon: "\u{1F525}", unlocked: (user.longest_streak ?? 0) >= 100, rarity: "legendary" }
  ];
  return json4({
    user: {
      email: user.email,
      total_points: user.total_points ?? 0,
      current_level: user.current_level ?? 1,
      level_name: levelNames[Math.min(user.current_level ?? 1, levelNames.length - 1)] ?? "Grandmaster+",
      xp_percent: xpPercent,
      points_to_next: pointsToNext > 0 ? pointsToNext : 0,
      streak_count: user.streak_count ?? 0,
      longest_streak: user.longest_streak ?? 0,
      tasks_completed: totalTasksDone
    },
    achievements,
    leaderboard
  });
}, rarityStyles = {
  common: { ring: "ring-gray-200", glow: "", badge: "bg-gray-100 text-gray-600", badgeText: "Common" },
  uncommon: { ring: "ring-emerald-200", glow: "shadow-emerald-100", badge: "bg-emerald-100 text-emerald-700", badgeText: "Uncommon" },
  rare: { ring: "ring-blue-200", glow: "shadow-blue-100", badge: "bg-blue-100 text-blue-700", badgeText: "Rare" },
  epic: { ring: "ring-purple-300", glow: "shadow-purple-100", badge: "bg-purple-100 text-purple-700", badgeText: "Epic" },
  legendary: { ring: "ring-amber-300", glow: "shadow-amber-200 shadow-lg", badge: "bg-amber-100 text-amber-700", badgeText: "Legendary" }
}, levelColors = [
  "from-gray-500 to-gray-600",
  "from-emerald-500 to-teal-600",
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-violet-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-cyan-500 to-blue-500"
];
function GamificationPage() {
  let { user, achievements, leaderboard } = useLoaderData3(), levelGradient = levelColors[(user.current_level - 1) % levelColors.length], unlockedCount = achievements.filter((a) => a.unlocked).length;
  return /* @__PURE__ */ jsxs5("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx6("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsxs5("div", { className: "mx-auto max-w-5xl px-6 py-5", children: [
      /* @__PURE__ */ jsx6("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: "Rewards" }),
      /* @__PURE__ */ jsxs5("p", { className: "mt-0.5 text-sm text-gray-500", children: [
        unlockedCount,
        "/",
        achievements.length,
        " achievements unlocked"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs5("div", { className: "mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8 space-y-8", children: [
      /* @__PURE__ */ jsxs5("div", { className: `relative overflow-hidden rounded-3xl bg-gradient-to-br ${levelGradient} p-8 text-white shadow-2xl`, children: [
        /* @__PURE__ */ jsx6("div", { className: "absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsx6("div", { className: "absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-black/10 blur-2xl" }),
        /* @__PURE__ */ jsxs5("div", { className: "relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between", children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("p", { className: "text-sm font-bold uppercase tracking-widest text-white/70", children: "Current Rank" }),
            /* @__PURE__ */ jsxs5("div", { className: "mt-1 flex items-baseline gap-3", children: [
              /* @__PURE__ */ jsx6("span", { className: "text-6xl font-extrabold", children: user.current_level }),
              /* @__PURE__ */ jsx6("span", { className: "text-2xl font-bold text-white/80", children: user.level_name })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "mt-4 w-full sm:w-72", children: [
              /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-1.5", children: [
                /* @__PURE__ */ jsx6("span", { className: "text-xs font-semibold text-white/70", children: "Level Progress" }),
                /* @__PURE__ */ jsxs5("span", { className: "text-xs font-bold", children: [
                  user.xp_percent,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx6("div", { className: "h-3 w-full rounded-full bg-white/20 overflow-hidden", children: /* @__PURE__ */ jsx6(
                "div",
                {
                  className: "h-full rounded-full bg-white transition-all duration-700",
                  style: { width: `${user.xp_percent}%` }
                }
              ) }),
              user.points_to_next > 0 && /* @__PURE__ */ jsxs5("p", { className: "mt-1.5 text-xs text-white/60", children: [
                user.points_to_next,
                " pts to level ",
                user.current_level + 1
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-5 py-4 min-w-[80px]", children: [
              /* @__PURE__ */ jsx6("span", { className: "text-2xl font-extrabold", children: user.total_points.toLocaleString() }),
              /* @__PURE__ */ jsx6("span", { className: "mt-1 text-xs font-semibold text-white/70", children: "Points" })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-5 py-4 min-w-[80px]", children: [
              /* @__PURE__ */ jsxs5("span", { className: "text-2xl font-extrabold", children: [
                user.streak_count,
                " \u{1F525}"
              ] }),
              /* @__PURE__ */ jsx6("span", { className: "mt-1 text-xs font-semibold text-white/70", children: "Streak" })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-5 py-4 min-w-[80px]", children: [
              /* @__PURE__ */ jsx6("span", { className: "text-2xl font-extrabold", children: user.longest_streak }),
              /* @__PURE__ */ jsx6("span", { className: "mt-1 text-xs font-semibold text-white/70", children: "Best Streak" })
            ] }),
            /* @__PURE__ */ jsxs5("div", { className: "flex flex-col items-center rounded-2xl bg-white/20 backdrop-blur-sm px-5 py-4 min-w-[80px]", children: [
              /* @__PURE__ */ jsx6("span", { className: "text-2xl font-extrabold", children: user.tasks_completed }),
              /* @__PURE__ */ jsx6("span", { className: "mt-1 text-xs font-semibold text-white/70", children: "Tasks Done" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsxs5("div", { children: [
            /* @__PURE__ */ jsx6("h2", { className: "text-xl font-bold text-gray-900", children: "Achievements" }),
            /* @__PURE__ */ jsx6("p", { className: "text-sm text-gray-500", children: "Unlock by reaching milestones" })
          ] }),
          /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-bold text-gray-700", children: [
            unlockedCount,
            "/",
            achievements.length
          ] })
        ] }),
        /* @__PURE__ */ jsx6("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4", children: achievements.map((a) => {
          let style = rarityStyles[a.rarity] ?? rarityStyles.common;
          return /* @__PURE__ */ jsxs5(
            "div",
            {
              className: `relative rounded-2xl border bg-white p-5 transition-all duration-300 ${a.unlocked ? `ring-2 ${style.ring} shadow-md ${style.glow} hover:scale-[1.02]` : "border-gray-100 opacity-50 grayscale"}`,
              children: [
                a.unlocked && /* @__PURE__ */ jsx6("div", { className: "absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow", children: "\u2713" }),
                /* @__PURE__ */ jsx6("div", { className: "text-4xl mb-3", children: a.icon }),
                /* @__PURE__ */ jsx6("h3", { className: "font-bold text-gray-900 text-sm leading-snug", children: a.title }),
                /* @__PURE__ */ jsx6("p", { className: "mt-1 text-xs text-gray-500", children: a.description }),
                /* @__PURE__ */ jsx6("span", { className: `mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${style.badge}`, children: style.badgeText })
              ]
            },
            a.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsx6("h2", { className: "text-xl font-bold text-gray-900", children: "Leaderboard" }),
          /* @__PURE__ */ jsxs5("span", { className: "text-xs font-semibold text-gray-400", children: [
            leaderboard.length,
            " users"
          ] })
        ] }),
        leaderboard.length === 1 && leaderboard[0].isMe ? (
          /* Solo state — only the current user exists */
          /* @__PURE__ */ jsxs5("div", { className: "rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm", children: [
            /* @__PURE__ */ jsx6("div", { className: "text-4xl mb-3", children: "\u{1F3C6}" }),
            /* @__PURE__ */ jsx6("p", { className: "font-bold text-gray-900", children: "You're #1!" }),
            /* @__PURE__ */ jsx6("p", { className: "mt-1 text-sm text-gray-500", children: "You're the only one here so far. Share the app to compete with friends." }),
            /* @__PURE__ */ jsxs5("div", { className: "mt-5 inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-700 shadow-sm", children: [
              /* @__PURE__ */ jsx6("span", { className: "text-xl", children: "\u{1F947}" }),
              /* @__PURE__ */ jsx6("span", { className: "font-semibold", children: leaderboard[0].username }),
              /* @__PURE__ */ jsx6("span", { className: "text-gray-400", children: "\xB7" }),
              /* @__PURE__ */ jsxs5("span", { className: "font-bold text-blue-700", children: [
                leaderboard[0].points.toLocaleString(),
                " pts"
              ] }),
              /* @__PURE__ */ jsx6("span", { className: "text-gray-400", children: "\xB7" }),
              /* @__PURE__ */ jsxs5("span", { children: [
                leaderboard[0].streak,
                " \u{1F525}"
              ] })
            ] })
          ] })
        ) : /* @__PURE__ */ jsx6("div", { className: "rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden", children: /* @__PURE__ */ jsx6("div", { className: "divide-y divide-gray-100", children: leaderboard.map((entry2) => /* @__PURE__ */ jsxs5(
          "div",
          {
            className: `flex items-center gap-4 px-6 py-4 transition-colors ${entry2.isMe ? "bg-blue-50/80" : "hover:bg-gray-50"}`,
            children: [
              /* @__PURE__ */ jsx6("div", { className: "w-10 text-center shrink-0", children: entry2.rank === 1 ? /* @__PURE__ */ jsx6("span", { className: "text-2xl", children: "\u{1F947}" }) : entry2.rank === 2 ? /* @__PURE__ */ jsx6("span", { className: "text-2xl", children: "\u{1F948}" }) : entry2.rank === 3 ? /* @__PURE__ */ jsx6("span", { className: "text-2xl", children: "\u{1F949}" }) : /* @__PURE__ */ jsxs5("span", { className: "text-sm font-bold text-gray-500", children: [
                "#",
                entry2.rank
              ] }) }),
              /* @__PURE__ */ jsx6("div", { className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${entry2.isMe ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gradient-to-br from-gray-400 to-gray-500"}`, children: entry2.username.charAt(0).toUpperCase() }),
              /* @__PURE__ */ jsxs5("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs5("p", { className: `font-semibold text-sm truncate ${entry2.isMe ? "text-blue-700" : "text-gray-900"}`, children: [
                  entry2.username,
                  entry2.isMe && /* @__PURE__ */ jsx6("span", { className: "ml-1.5 text-xs font-normal text-blue-500", children: "(you)" })
                ] }),
                /* @__PURE__ */ jsxs5("p", { className: "text-xs text-gray-500", children: [
                  entry2.streak,
                  " day streak \u{1F525}"
                ] })
              ] }),
              /* @__PURE__ */ jsxs5("div", { className: "shrink-0 text-right", children: [
                /* @__PURE__ */ jsx6("p", { className: `text-sm font-extrabold ${entry2.isMe ? "text-blue-700" : "text-gray-800"}`, children: entry2.points.toLocaleString() }),
                /* @__PURE__ */ jsx6("p", { className: "text-xs text-gray-400", children: "pts" })
              ] })
            ]
          },
          `${entry2.rank}-${entry2.username}`
        )) }) })
      ] }),
      /* @__PURE__ */ jsxs5("div", { children: [
        /* @__PURE__ */ jsx6("h2", { className: "text-xl font-bold text-gray-900 mb-5", children: "Level Roadmap" }),
        /* @__PURE__ */ jsxs5("div", { className: "relative", children: [
          /* @__PURE__ */ jsx6("div", { className: "absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200 z-0" }),
          /* @__PURE__ */ jsx6("div", { className: "space-y-3", children: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => {
            let reached = lvl <= user.current_level, isCurrent = lvl === user.current_level, names = [
              "",
              "Novice",
              "Beginner",
              "Apprentice",
              "Intermediate",
              "Advanced",
              "Expert",
              "Master",
              "Legend",
              "Champion",
              "Grandmaster"
            ], grad = levelColors[(lvl - 1) % levelColors.length];
            return /* @__PURE__ */ jsxs5("div", { className: "relative flex items-center gap-4 pl-12", children: [
              /* @__PURE__ */ jsx6("div", { className: `absolute left-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold z-10 shadow-sm ${isCurrent ? `bg-gradient-to-br ${grad} text-white ring-4 ring-white ring-offset-2` : reached ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`, children: reached && !isCurrent ? "\u2713" : lvl }),
              /* @__PURE__ */ jsxs5("div", { className: `flex-1 flex items-center justify-between rounded-xl px-5 py-3 transition-all ${isCurrent ? `bg-gradient-to-r ${grad} text-white shadow-lg` : reached ? "bg-white border border-emerald-100" : "bg-white border border-gray-100"}`, children: [
                /* @__PURE__ */ jsxs5("div", { children: [
                  /* @__PURE__ */ jsxs5("p", { className: `font-bold text-sm ${isCurrent ? "text-white" : reached ? "text-gray-900" : "text-gray-500"}`, children: [
                    "Level ",
                    lvl,
                    " \u2014 ",
                    names[lvl]
                  ] }),
                  isCurrent && /* @__PURE__ */ jsxs5("p", { className: "text-xs text-white/70 mt-0.5", children: [
                    user.xp_percent,
                    "% progress \xB7 ",
                    user.points_to_next,
                    " pts to next"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs5("span", { className: `text-xs font-semibold ${isCurrent ? "text-white/80" : "text-gray-400"}`, children: [
                  (lvl - 1) * 1e3,
                  "+ pts"
                ] })
              ] })
            ] }, lvl);
          }) })
        ] })
      ] })
    ] })
  ] });
}

// app/routes/goals.long-term.$id.tsx
var goals_long_term_id_exports = {};
__export(goals_long_term_id_exports, {
  action: () => action5,
  default: () => LongTermGoalDetail,
  loader: () => loader5,
  meta: () => meta6
});
import { useLoaderData as useLoaderData4, Link as Link2, useFetcher as useFetcher3 } from "@remix-run/react";
import { json as json5 } from "@remix-run/node";
import { useState as useState4, useEffect as useEffect3 } from "react";
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var meta6 = ({ data }) => [
  { title: `${data?.goal?.title ?? "Goal"} - Goal Tracker` }
], loader5 = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports);
  await connectDB2();
  let userId = await requireUserId2(request), goal = await LongTermGoal2.findOne({ _id: params.id, user_id: userId }).lean();
  if (!goal)
    throw new Response("Not Found", { status: 404 });
  return json5({
    goal: {
      _id: goal._id.toString(),
      title: goal.title,
      description: goal.description,
      status: goal.status,
      priority: goal.priority ?? "medium",
      category: goal.category,
      current_progress_percentage: goal.current_progress_percentage ?? 0,
      target_date: goal.target_date ? new Date(goal.target_date).toISOString() : null,
      created_at: goal.created_at ? new Date(goal.created_at).toISOString() : null,
      smart_framework: goal.smart_framework ?? {}
    }
  });
}, action5 = async ({ request, params }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports);
  await connectDB2();
  let userId = await requireUserId2(request), formData = await request.formData(), _action = formData.get("_action");
  if (_action === "update_status") {
    let status = formData.get("status");
    return await LongTermGoal2.findOneAndUpdate({ _id: params.id, user_id: userId }, { status }), json5({ ok: !0 });
  }
  if (_action === "update_progress") {
    let progress = Number(formData.get("progress"));
    return await LongTermGoal2.findOneAndUpdate(
      { _id: params.id, user_id: userId },
      { current_progress_percentage: Math.max(0, Math.min(100, progress)) }
    ), json5({ ok: !0 });
  }
  if (_action === "add_tasks") {
    let { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), raw = formData.get("tasks");
    try {
      let tasks = JSON.parse(raw), count = await DailyTask2.countDocuments({ user_id: userId });
      return await DailyTask2.insertMany(
        tasks.map((t, i) => ({
          user_id: userId,
          title: t.title,
          description: t.description ?? "",
          difficulty_level: Math.min(5, Math.max(1, Number(t.difficulty_level) || 3)),
          due_date: t.due_date ? new Date(t.due_date) : /* @__PURE__ */ new Date(),
          tags: t.tags ?? [],
          status: "pending",
          sort_order: count + i
        }))
      ), json5({ ok: !0, added: tasks.length });
    } catch {
      return json5({ error: "Failed to add tasks." }, { status: 500 });
    }
  }
  return json5({ error: "Unknown action" }, { status: 400 });
}, categoryConfig = {
  health: { color: "text-emerald-700", bg: "bg-emerald-100", icon: "\u{1F4AA}" },
  career: { color: "text-blue-700", bg: "bg-blue-100", icon: "\u{1F4BC}" },
  personal: { color: "text-purple-700", bg: "bg-purple-100", icon: "\u{1F331}" },
  education: { color: "text-amber-700", bg: "bg-amber-100", icon: "\u{1F4DA}" },
  finance: { color: "text-green-700", bg: "bg-green-100", icon: "\u{1F4B0}" },
  relationships: { color: "text-rose-700", bg: "bg-rose-100", icon: "\u2764\uFE0F" }
}, priorityConfig2 = {
  high: { dot: "bg-red-500", text: "text-red-700", label: "High", bg: "bg-red-50" },
  medium: { dot: "bg-amber-400", text: "text-amber-700", label: "Medium", bg: "bg-amber-50" },
  low: { dot: "bg-gray-400", text: "text-gray-600", label: "Low", bg: "bg-gray-50" }
}, statusConfig2 = {
  active: { label: "\u26A1 Active", color: "text-blue-700", bg: "bg-blue-100" },
  completed: { label: "\u2713 Completed", color: "text-emerald-700", bg: "bg-emerald-100" },
  paused: { label: "\u23F8 Paused", color: "text-amber-700", bg: "bg-amber-100" },
  abandoned: { label: "\u2717 Abandoned", color: "text-red-700", bg: "bg-red-100" }
}, smartLabels = {
  specific: { emoji: "\u{1F3AF}", label: "Specific", desc: "What exactly will you achieve?" },
  measurable: { emoji: "\u{1F4CF}", label: "Measurable", desc: "How will you track progress?" },
  achievable: { emoji: "\u{1F4AA}", label: "Achievable", desc: "Why is this realistic?" },
  relevant: { emoji: "\u2764\uFE0F", label: "Relevant", desc: "Why does this matter to you?" },
  time_bound: { emoji: "\u23F0", label: "Time-bound", desc: "What is your timeline?" }
};
function fmtDate2(iso) {
  return iso ? new Date(iso).toLocaleDateString(void 0, { year: "numeric", month: "short", day: "numeric" }) : "\u2014";
}
var taskGenMessages = [
  "Reading your goal\u2026",
  "Planning actions for the week\u2026",
  "Sizing each task to one day\u2026",
  "Ordering by importance\u2026",
  "Almost done\u2026"
], difficultyEmoji = ["", "\u{1F60C}", "\u{1F642}", "\u{1F914}", "\u{1F4AA}", "\u{1F525}"];
function LongTermGoalDetail() {
  let { goal } = useLoaderData4(), fetcher = useFetcher3(), taskFetcher = useFetcher3(), createFetcher = useFetcher3(), [progress, setProgress] = useState4(goal.current_progress_percentage), [taskGenPhase, setTaskGenPhase] = useState4("idle"), [generatedTasks, setGeneratedTasks] = useState4([]), [selectedTasks, setSelectedTasks] = useState4(/* @__PURE__ */ new Set()), [taskMsgIdx, setTaskMsgIdx] = useState4(0), [addedCount, setAddedCount] = useState4(0), cat = categoryConfig[goal.category] ?? { color: "text-gray-700", bg: "bg-gray-100", icon: "\u{1F4CC}" }, pri = priorityConfig2[goal.priority] ?? priorityConfig2.medium, stat = statusConfig2[goal.status] ?? statusConfig2.active, smart = goal.smart_framework ?? {}, hasSmart = Object.values(smart).some(Boolean);
  useEffect3(() => {
    if (taskGenPhase !== "thinking")
      return;
    let id = setInterval(() => setTaskMsgIdx((i) => (i + 1) % taskGenMessages.length), 1800);
    return () => clearInterval(id);
  }, [taskGenPhase]), useEffect3(() => {
    if (taskFetcher.state !== "idle" || !taskFetcher.data)
      return;
    if (taskFetcher.data.error) {
      setTaskGenPhase("idle");
      return;
    }
    let tasks = taskFetcher.data.tasks ?? [];
    setGeneratedTasks(tasks), setSelectedTasks(new Set(tasks.map((_, i) => i))), setTaskGenPhase("review");
  }, [taskFetcher.state, taskFetcher.data]), useEffect3(() => {
    createFetcher.state !== "idle" || !createFetcher.data || createFetcher.data.ok && (setAddedCount(selectedTasks.size), setTaskGenPhase("idle"), setGeneratedTasks([]));
  }, [createFetcher.state, createFetcher.data]);
  let handleGenerateTasks = () => {
    setTaskGenPhase("thinking");
    let fd = new FormData();
    fd.append("goalTitle", goal.title), fd.append("goalDescription", goal.description ?? ""), fd.append("targetDate", goal.target_date ?? ""), fd.append("category", goal.category ?? ""), taskFetcher.submit(fd, { method: "post", action: "/api/generate-goal-tasks" });
  }, handleAddSelected = () => {
    let selected = generatedTasks.filter((_, i) => selectedTasks.has(i)), fd = new FormData();
    fd.append("_action", "add_tasks"), fd.append("tasks", JSON.stringify(selected)), createFetcher.submit(fd, { method: "post", action: "/dashboard" });
  }, toggleTask = (i) => {
    setSelectedTasks((prev) => {
      let next = new Set(prev);
      return next.has(i) ? next.delete(i) : next.add(i), next;
    });
  }, handleProgressRelease = (e) => {
    let val = Number(e.target.value), fd = new FormData();
    fd.append("_action", "update_progress"), fd.append("progress", val.toString()), fetcher.submit(fd, { method: "post" });
  };
  return /* @__PURE__ */ jsxs6("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50", children: [
    /* @__PURE__ */ jsx7("header", { className: "sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsx7("div", { className: "mx-auto max-w-3xl px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx7(Link2, { to: "/goals", className: "flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition", children: "\u2190" }),
      /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx7("p", { className: "text-xs font-semibold uppercase tracking-wide text-indigo-600", children: "Long-term Goal" }),
        /* @__PURE__ */ jsx7("h1", { className: "truncate text-lg font-bold text-gray-900", children: goal.title })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs6("main", { className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-5", children: [
      /* @__PURE__ */ jsxs6("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxs6("span", { className: `inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${cat.bg} ${cat.color}`, children: [
            cat.icon,
            " ",
            goal.category
          ] }),
          /* @__PURE__ */ jsx7("span", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${stat.bg} ${stat.color}`, children: stat.label }),
          /* @__PURE__ */ jsxs6("span", { className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${pri.bg} ${pri.text}`, children: [
            /* @__PURE__ */ jsx7("span", { className: `h-1.5 w-1.5 rounded-full ${pri.dot}` }),
            pri.label,
            " priority"
          ] })
        ] }),
        /* @__PURE__ */ jsx7("p", { className: "text-gray-600 leading-relaxed", children: goal.description }),
        /* @__PURE__ */ jsxs6("div", { className: "rounded-xl bg-gray-50 px-4 py-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx7("span", { className: "text-lg", children: "\u{1F5D3}" }),
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-400", children: "Target Date" }),
            /* @__PURE__ */ jsx7("p", { className: "font-semibold text-gray-800", children: fmtDate2(goal.target_date) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs6(fetcher.Form, { method: "post", className: "grid grid-cols-2 sm:grid-cols-4 gap-2", children: [
          /* @__PURE__ */ jsx7("input", { type: "hidden", name: "_action", value: "update_status" }),
          ["active", "completed", "paused", "abandoned"].map((s) => /* @__PURE__ */ jsx7(
            "button",
            {
              name: "status",
              value: s,
              disabled: goal.status === s,
              className: `rounded-xl py-2 text-xs font-semibold transition ${goal.status === s ? `${statusConfig2[s].bg} ${statusConfig2[s].color}` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
              children: statusConfig2[s].label
            },
            s
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs6("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx7("h2", { className: "font-bold text-gray-900", children: "Progress" }),
          /* @__PURE__ */ jsxs6("span", { className: "text-2xl font-extrabold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent", children: [
            progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx7("div", { className: "h-3 w-full rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx7(
          "div",
          {
            className: `h-full rounded-full transition-all duration-700 ${progress >= 100 ? "bg-gradient-to-r from-emerald-400 to-teal-500" : progress >= 60 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gradient-to-r from-blue-400 to-indigo-400"}`,
            style: { width: `${progress}%` }
          }
        ) }),
        /* @__PURE__ */ jsx7(
          "input",
          {
            type: "range",
            min: 0,
            max: 100,
            step: 5,
            value: progress,
            onChange: (e) => setProgress(Number(e.target.value)),
            onMouseUp: handleProgressRelease,
            onTouchEnd: handleProgressRelease,
            className: "w-full accent-indigo-500"
          }
        ),
        /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-400 text-center", children: "Drag to update your progress" })
      ] }),
      /* @__PURE__ */ jsxs6("div", { className: "rounded-2xl overflow-hidden border border-gray-100 shadow-sm", children: [
        /* @__PURE__ */ jsxs6("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs6("div", { children: [
            /* @__PURE__ */ jsx7("p", { className: "text-white font-bold text-sm tracking-wide", children: "\u2728 AI Task Cascade" }),
            /* @__PURE__ */ jsx7("p", { className: "text-indigo-100 text-xs mt-0.5", children: "Generate daily tasks for the week from your goal" })
          ] }),
          addedCount > 0 && /* @__PURE__ */ jsxs6("span", { className: "rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white", children: [
            "\u2713 ",
            addedCount,
            " added to board"
          ] })
        ] }),
        /* @__PURE__ */ jsxs6("div", { className: "bg-white p-6", children: [
          taskGenPhase === "idle" && /* @__PURE__ */ jsxs6(
            "button",
            {
              onClick: handleGenerateTasks,
              className: "w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-indigo-200 bg-indigo-50 py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all",
              children: [
                /* @__PURE__ */ jsx7("span", { className: "text-lg", children: "\u{1F680}" }),
                "Generate 5 daily tasks for this week"
              ]
            }
          ),
          taskGenPhase === "thinking" && /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-4 py-4", children: [
            /* @__PURE__ */ jsxs6("div", { className: "relative flex h-10 w-10 shrink-0 items-center justify-center", children: [
              /* @__PURE__ */ jsx7("div", { className: "absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" }),
              /* @__PURE__ */ jsx7("span", { className: "relative text-xl animate-pulse", children: "\u{1F9E0}" })
            ] }),
            /* @__PURE__ */ jsxs6("div", { children: [
              /* @__PURE__ */ jsx7("p", { className: "font-semibold text-indigo-700 text-sm", children: taskGenMessages[taskMsgIdx] }),
              /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-400 mt-0.5", children: "Creating focused daily tasks\u2026" })
            ] })
          ] }),
          taskGenPhase === "review" && generatedTasks.length > 0 && /* @__PURE__ */ jsxs6("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx7("p", { className: "text-xs font-bold uppercase tracking-wide text-gray-400 mb-3", children: "Select tasks to add to your board:" }),
            generatedTasks.map((task, i) => /* @__PURE__ */ jsxs6(
              "button",
              {
                onClick: () => toggleTask(i),
                className: `w-full flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all ${selectedTasks.has(i) ? "border-indigo-200 bg-indigo-50" : "border-gray-100 bg-gray-50 opacity-60"}`,
                children: [
                  /* @__PURE__ */ jsx7("div", { className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${selectedTasks.has(i) ? "border-indigo-500 bg-indigo-500 text-white" : "border-gray-300 text-transparent"}`, children: "\u2713" }),
                  /* @__PURE__ */ jsxs6("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs6("div", { className: "flex items-center gap-2 flex-wrap", children: [
                      /* @__PURE__ */ jsx7("span", { className: "text-sm font-semibold text-gray-900", children: task.title }),
                      /* @__PURE__ */ jsx7("span", { className: "text-xs text-gray-400", children: difficultyEmoji[task.difficulty_level] ?? "" }),
                      /* @__PURE__ */ jsxs6("span", { className: "text-xs text-gray-400", children: [
                        "\xB7 ",
                        task.due_date
                      ] })
                    ] }),
                    task.description && /* @__PURE__ */ jsx7("p", { className: "mt-0.5 text-xs text-gray-500 leading-snug", children: task.description }),
                    task.tags?.length > 0 && /* @__PURE__ */ jsx7("div", { className: "mt-1.5 flex flex-wrap gap-1", children: task.tags.map((tag) => /* @__PURE__ */ jsx7("span", { className: "rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700", children: tag }, tag)) })
                  ] })
                ]
              },
              i
            )),
            /* @__PURE__ */ jsxs6("div", { className: "flex gap-2 pt-2", children: [
              /* @__PURE__ */ jsx7(
                "button",
                {
                  onClick: () => setTaskGenPhase("idle"),
                  className: "flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsx7(
                "button",
                {
                  onClick: handleAddSelected,
                  disabled: selectedTasks.size === 0 || createFetcher.state !== "idle",
                  className: "flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2.5 text-sm font-bold text-white shadow hover:opacity-90 disabled:opacity-50 transition",
                  children: createFetcher.state !== "idle" ? "Adding\u2026" : `Add ${selectedTasks.size} task${selectedTasks.size !== 1 ? "s" : ""} to board`
                }
              )
            ] })
          ] })
        ] })
      ] }),
      hasSmart && /* @__PURE__ */ jsxs6("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-4", children: [
        /* @__PURE__ */ jsx7("h2", { className: "font-bold text-gray-900", children: "SMART Framework" }),
        /* @__PURE__ */ jsx7("div", { className: "space-y-3", children: Object.entries(smartLabels).map(([key, { emoji, label, desc }]) => {
          let text = smart[key];
          return text ? /* @__PURE__ */ jsxs6("div", { className: "rounded-xl bg-gray-50 border border-gray-100 px-4 py-3", children: [
            /* @__PURE__ */ jsxs6("p", { className: "text-xs font-bold text-gray-500 uppercase tracking-wide mb-1", children: [
              emoji,
              " ",
              label,
              " \u2014 ",
              /* @__PURE__ */ jsx7("span", { className: "font-normal normal-case", children: desc })
            ] }),
            /* @__PURE__ */ jsx7("p", { className: "text-sm text-gray-700 leading-relaxed", children: text })
          ] }, key) : null;
        }) })
      ] })
    ] })
  ] });
}

// app/routes/goals.long-term.new.tsx
var goals_long_term_new_exports = {};
__export(goals_long_term_new_exports, {
  action: () => action6,
  default: () => CreateLongTermGoal,
  meta: () => meta7
});
import { useFetcher as useFetcher4, useNavigation as useNavigation3, Form as Form3, useActionData } from "@remix-run/react";
import { json as json6 } from "@remix-run/node";
import { useState as useState5, useEffect as useEffect4 } from "react";
import { Fragment as Fragment2, jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var meta7 = () => [
  { title: "Create Long-term Goal - Goal Tracker" }
], action6 = async ({ request }) => {
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports)), { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { redirect: redirect3 } = await import("@remix-run/node");
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId2(request);
  await connectDB2();
  let formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), target_date = formData.get("target_date"), category = formData.get("category"), priority = formData.get("priority");
  if (!title || !description || !target_date || !category)
    return json6({ error: "Missing required fields" }, { status: 400 });
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
    }).save(), redirect3("/goals");
  } catch (error) {
    return console.error("Create long-term goal error:", error), json6({ error: "An error occurred creating the goal" }, { status: 500 });
  }
};
function ThinkingDots() {
  return /* @__PURE__ */ jsx8("span", { className: "inline-flex items-center gap-1 ml-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx8(
    "span",
    {
      className: "block h-1.5 w-1.5 rounded-full bg-indigo-400",
      style: { animation: "bounce 1s infinite", animationDelay: `${i * 0.15}s` }
    },
    i
  )) });
}
var thinkingMessages = [
  "Reading your goal\u2026",
  "Thinking about category\u2026",
  "Setting a realistic timeline\u2026",
  "Crafting SMART criteria\u2026",
  "Polishing the details\u2026"
];
function CreateLongTermGoal() {
  let navigation = useNavigation3(), aiFetcher = useFetcher4(), actionData = useActionData(), [phase, setPhase] = useState5("idle"), [rawInput, setRawInput] = useState5(""), [msgIdx, setMsgIdx] = useState5(0), [revealStep, setRevealStep] = useState5(0), [activeStep, setActiveStep] = useState5("basic"), [aiError, setAiError] = useState5(""), [fields, setFields] = useState5({
    title: "",
    description: "",
    target_date: "",
    category: "",
    priority: "medium",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    time_bound: ""
  }), set = (k) => (e) => setFields((f) => ({ ...f, [k]: e.target.value }));
  useEffect4(() => {
    if (phase !== "thinking")
      return;
    let id = setInterval(() => setMsgIdx((i) => (i + 1) % thinkingMessages.length), 1800);
    return () => clearInterval(id);
  }, [phase]), useEffect4(() => {
    if (aiFetcher.state !== "idle" || !aiFetcher.data)
      return;
    if (aiFetcher.data.error) {
      setAiError(aiFetcher.data.error), setPhase("idle");
      return;
    }
    let d = aiFetcher.data.data;
    setFields({
      title: d.title ?? "",
      description: d.description ?? "",
      target_date: d.target_date ?? "",
      category: d.category ?? "",
      priority: d.priority ?? "medium",
      specific: d.smart?.specific ?? "",
      measurable: d.smart?.measurable ?? "",
      achievable: d.smart?.achievable ?? "",
      relevant: d.smart?.relevant ?? "",
      time_bound: d.smart?.time_bound ?? ""
    }), setPhase("filled"), setRevealStep(0);
  }, [aiFetcher.state, aiFetcher.data]), useEffect4(() => {
    if (phase !== "filled" || revealStep >= 10)
      return;
    let id = setTimeout(() => setRevealStep((s) => s + 1), 100);
    return () => clearTimeout(id);
  }, [phase, revealStep]);
  let handleGenerate = () => {
    if (rawInput.trim().length < 5)
      return;
    setAiError(""), setPhase("thinking");
    let fd = new FormData();
    fd.append("description", rawInput), aiFetcher.submit(fd, { method: "post", action: "/api/generate-goal" });
  }, isSubmitting = navigation.state === "submitting", fieldClass = (step) => `transition-all duration-500 ${revealStep > step ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`, inputClass = "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition", labelClass = "block text-sm font-semibold text-gray-700";
  return /* @__PURE__ */ jsxs7("div", { className: "min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50", children: [
    /* @__PURE__ */ jsx8("header", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10", children: /* @__PURE__ */ jsx8("div", { className: "mx-auto max-w-3xl px-4 py-4 sm:px-6", children: /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx8("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-xl shadow-sm", children: "\u{1F3AF}" }),
      /* @__PURE__ */ jsxs7("div", { children: [
        /* @__PURE__ */ jsx8("h1", { className: "text-xl font-bold text-gray-900", children: "Create Long-term Goal" }),
        /* @__PURE__ */ jsx8("p", { className: "text-xs text-gray-500", children: "Describe it \u2014 AI fills everything with SMART criteria" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs7("main", { className: "mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6", children: [
      /* @__PURE__ */ jsxs7("div", { className: "rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden", children: [
        /* @__PURE__ */ jsxs7("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4", children: [
          /* @__PURE__ */ jsx8("p", { className: "text-white font-semibold text-sm tracking-wide uppercase", children: "\u2728 AI Goal Builder" }),
          /* @__PURE__ */ jsx8("p", { className: "text-indigo-100 text-xs mt-0.5", children: "Describe what you want to achieve \u2014 we'll do the rest" })
        ] }),
        /* @__PURE__ */ jsx8("div", { className: "p-6 space-y-4", children: phase === "idle" || phase === "filled" ? /* @__PURE__ */ jsxs7(Fragment2, { children: [
          /* @__PURE__ */ jsx8(
            "textarea",
            {
              rows: 3,
              value: rawInput,
              onChange: (e) => setRawInput(e.target.value),
              placeholder: "e.g., I want to get fit and run a half marathon by the end of the year\u2026",
              className: "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition resize-none"
            }
          ),
          aiError && /* @__PURE__ */ jsx8("p", { className: "text-sm text-red-500", children: aiError }),
          /* @__PURE__ */ jsx8(
            "button",
            {
              type: "button",
              onClick: handleGenerate,
              disabled: rawInput.trim().length < 5,
              className: "w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed",
              children: phase === "filled" ? "\u{1F504} Regenerate with AI" : "\u2728 Generate Goal with AI"
            }
          )
        ] }) : (
          /* Thinking panel */
          /* @__PURE__ */ jsxs7("div", { className: "flex flex-col items-center gap-4 py-6", children: [
            /* @__PURE__ */ jsxs7("div", { className: "relative flex h-16 w-16 items-center justify-center", children: [
              /* @__PURE__ */ jsx8("div", { className: "absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" }),
              /* @__PURE__ */ jsx8("div", { className: "relative text-3xl animate-pulse", children: "\u{1F9E0}" })
            ] }),
            /* @__PURE__ */ jsxs7("div", { className: "flex items-center gap-2 text-indigo-600 font-medium", children: [
              /* @__PURE__ */ jsx8("span", { children: thinkingMessages[msgIdx] }),
              /* @__PURE__ */ jsx8(ThinkingDots, {})
            ] }),
            /* @__PURE__ */ jsx8("div", { className: "w-full max-w-xs h-1.5 rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx8("div", { className: "h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full animate-pulse", style: { width: "70%" } }) })
          ] })
        ) })
      ] }),
      phase === "filled" && /* @__PURE__ */ jsxs7(Form3, { method: "post", className: "space-y-4", children: [
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "title", value: fields.title }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "description", value: fields.description }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "target_date", value: fields.target_date }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "category", value: fields.category }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "priority", value: fields.priority }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "specific", value: fields.specific }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "measurable", value: fields.measurable }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "achievable", value: fields.achievable }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "relevant", value: fields.relevant }),
        /* @__PURE__ */ jsx8("input", { type: "hidden", name: "time_bound", value: fields.time_bound }),
        actionData?.error && /* @__PURE__ */ jsx8("div", { className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600", children: actionData.error }),
        /* @__PURE__ */ jsx8("div", { className: "flex gap-3", children: ["basic", "smart"].map((s) => /* @__PURE__ */ jsx8(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep(s),
            className: `px-5 py-2 rounded-xl font-semibold text-sm transition ${activeStep === s ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`,
            children: s === "basic" ? "\u{1F4CB} Basic Info" : "\u{1F3AF} SMART Framework"
          },
          s
        )) }),
        activeStep === "basic" && /* @__PURE__ */ jsxs7("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs7("div", { className: fieldClass(0), children: [
            /* @__PURE__ */ jsx8("label", { className: labelClass, children: "Goal Title *" }),
            /* @__PURE__ */ jsx8("input", { type: "text", value: fields.title, onChange: set("title"), className: inputClass, placeholder: "e.g., Run a half marathon" })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: fieldClass(1), children: [
            /* @__PURE__ */ jsx8("label", { className: labelClass, children: "Description *" }),
            /* @__PURE__ */ jsx8("textarea", { rows: 3, value: fields.description, onChange: set("description"), className: inputClass + " resize-none", placeholder: "Describe your goal\u2026" })
          ] }),
          /* @__PURE__ */ jsxs7("div", { className: `grid grid-cols-1 gap-5 md:grid-cols-3 ${fieldClass(2)}`, children: [
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx8("label", { className: labelClass, children: "Target Date *" }),
              /* @__PURE__ */ jsx8("input", { type: "date", value: fields.target_date, onChange: set("target_date"), className: inputClass })
            ] }),
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx8("label", { className: labelClass, children: "Category *" }),
              /* @__PURE__ */ jsxs7("select", { value: fields.category, onChange: set("category"), className: inputClass, children: [
                /* @__PURE__ */ jsx8("option", { value: "", children: "Select a category" }),
                /* @__PURE__ */ jsx8("option", { value: "health", children: "Health & Fitness" }),
                /* @__PURE__ */ jsx8("option", { value: "career", children: "Career" }),
                /* @__PURE__ */ jsx8("option", { value: "education", children: "Education" }),
                /* @__PURE__ */ jsx8("option", { value: "relationships", children: "Relationships" }),
                /* @__PURE__ */ jsx8("option", { value: "finance", children: "Finance" }),
                /* @__PURE__ */ jsx8("option", { value: "personal", children: "Personal Development" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs7("div", { children: [
              /* @__PURE__ */ jsx8("label", { className: labelClass, children: "Priority" }),
              /* @__PURE__ */ jsxs7("select", { value: fields.priority, onChange: set("priority"), className: inputClass, children: [
                /* @__PURE__ */ jsx8("option", { value: "low", children: "Low" }),
                /* @__PURE__ */ jsx8("option", { value: "medium", children: "Medium" }),
                /* @__PURE__ */ jsx8("option", { value: "high", children: "High" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: fieldClass(3), children: /* @__PURE__ */ jsx8(
            "button",
            {
              type: "button",
              onClick: () => setActiveStep("smart"),
              className: "w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 transition",
              children: "Next: SMART Framework \u2192"
            }
          ) })
        ] }),
        activeStep === "smart" && /* @__PURE__ */ jsxs7("div", { className: "rounded-2xl bg-white border border-gray-100 shadow-sm p-6 space-y-5", children: [
          /* @__PURE__ */ jsx8("div", { className: "rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3", children: /* @__PURE__ */ jsx8("p", { className: "text-sm text-indigo-700 font-medium", children: "AI has filled these in \u2014 review and edit as needed." }) }),
          [
            { key: "specific", label: "Specific", desc: "What exactly will you achieve?", emoji: "\u{1F3AF}", step: 4 },
            { key: "measurable", label: "Measurable", desc: "How will you track progress?", emoji: "\u{1F4CF}", step: 5 },
            { key: "achievable", label: "Achievable", desc: "Why is this realistic?", emoji: "\u{1F4AA}", step: 6 },
            { key: "relevant", label: "Relevant", desc: "Why does this matter to you?", emoji: "\u2764\uFE0F", step: 7 },
            { key: "time_bound", label: "Time-bound", desc: "What is your timeline?", emoji: "\u23F0", step: 8 }
          ].map(({ key, label, desc, emoji, step }) => /* @__PURE__ */ jsxs7("div", { className: fieldClass(step), children: [
            /* @__PURE__ */ jsxs7("label", { className: labelClass, children: [
              emoji,
              " ",
              label,
              " \u2014 ",
              /* @__PURE__ */ jsx8("span", { className: "font-normal text-gray-500", children: desc })
            ] }),
            /* @__PURE__ */ jsx8(
              "textarea",
              {
                rows: 3,
                value: fields[key],
                onChange: set(key),
                className: inputClass + " resize-none",
                placeholder: `${label}\u2026`
              }
            )
          ] }, key)),
          /* @__PURE__ */ jsxs7("div", { className: `flex gap-3 ${fieldClass(9)}`, children: [
            /* @__PURE__ */ jsx8(
              "button",
              {
                type: "button",
                onClick: () => setActiveStep("basic"),
                className: "flex-1 rounded-xl border border-gray-200 bg-white py-3 text-gray-700 font-semibold hover:bg-gray-50 transition",
                children: "\u2190 Back"
              }
            ),
            /* @__PURE__ */ jsx8(
              "button",
              {
                type: "submit",
                disabled: isSubmitting,
                className: "flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-white font-semibold shadow hover:opacity-90 disabled:opacity-50 transition",
                children: isSubmitting ? "Creating\u2026" : "\u{1F680} Create Goal"
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}

// app/routes/api.generate-goal.tsx
var api_generate_goal_exports = {};
__export(api_generate_goal_exports, {
  action: () => action7
});
import { json as json7 } from "@remix-run/node";
import { GoogleGenerativeAI as GoogleGenerativeAI2 } from "@google/generative-ai";
var action7 = async ({ request }) => {
  if (request.method !== "POST")
    return json7({ error: "Method not allowed" }, { status: 405 });
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  await requireUserId2(request);
  let description = (await request.formData()).get("description");
  if (!description || description.trim().length < 5)
    return json7({ error: "Please describe your goal in a bit more detail." }, { status: 400 });
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return json7({ error: "AI service is not configured on the server." }, { status: 500 });
  try {
    let model = new GoogleGenerativeAI2(apiKey).getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    }), today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], prompt = `You are a smart productivity and life coach assistant. A user described a long-term goal:

"${description}"

Convert this into a fully structured SMART goal. Return ONLY a valid JSON object with this exact schema:
{
  "title": "Concise goal title (5-10 words, starts with a verb)",
  "description": "Expanded 2-3 sentence description of the goal, context, and why it matters.",
  "target_date": "<YYYY-MM-DD, today is ${today}. Infer from the description \u2014 if no timeframe mentioned, use 6 months from today>",
  "category": "<exactly one of: health, career, education, relationships, finance, personal>",
  "priority": "<exactly one of: low, medium, high \u2014 infer from urgency/importance>",
  "smart": {
    "specific": "1-2 sentences: exactly what will be accomplished, clearly defined",
    "measurable": "1-2 sentences: concrete metrics, numbers, or milestones to track progress",
    "achievable": "1-2 sentences: why this goal is realistic given typical resources and effort",
    "relevant": "1-2 sentences: why this goal matters, how it connects to broader life values",
    "time_bound": "1-2 sentences: timeline breakdown \u2014 when it starts, key checkpoints, final deadline"
  }
}

Respond with ONLY the JSON object. No markdown, no explanation.`.trim(), responseText = (await model.generateContent(prompt)).response.text(), parsed = JSON.parse(responseText);
    return json7({ success: !0, data: parsed });
  } catch (error) {
    return console.error("AI goal generation error:", error), json7({ error: "Failed to generate goal. Please try again." }, { status: 500 });
  }
};

// app/routes/api.generate-task.tsx
var api_generate_task_exports = {};
__export(api_generate_task_exports, {
  action: () => action8
});
import { json as json8 } from "@remix-run/node";
import { GoogleGenerativeAI as GoogleGenerativeAI3 } from "@google/generative-ai";
var action8 = async ({ request }) => {
  if (request.method !== "POST")
    return json8({ error: "Method not allowed" }, { status: 405 });
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  await requireUserId2(request);
  let description = (await request.formData()).get("description");
  if (!description || description.trim().length < 5)
    return json8({ error: "Please describe your task in a bit more detail." }, { status: 400 });
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return json8({ error: "AI service is not configured on the server." }, { status: 500 });
  try {
    let model = new GoogleGenerativeAI3(apiKey).getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    }), today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0], prompt = `You are a smart productivity assistant. A user described a task they need to do:

"${description}"

Convert this rough description into a structured, actionable task. Return ONLY a valid JSON object with this exact schema:
{
  "title": "Concise, action-oriented task title (5-10 words, starts with a verb)",
  "description": "Expanded 2-3 sentence description explaining what needs to be done, any context, and why it matters.",
  "difficulty_level": <integer 1-5 where 1=trivial, 2=easy, 3=medium, 4=hard, 5=very hard>,
  "due_date": "<YYYY-MM-DD, today is ${today}. Infer urgency from the description. If none implied, use today+1 for urgent tasks, today+3 for normal tasks, today+7 for low-urgency>",
  "tags": ["tag1", "tag2"] <choose 2-3 relevant tags ONLY from: work, personal, health, learning, creative, admin, urgent, planning, review, meeting>
}

Respond with ONLY the JSON object. No markdown, no explanation.`.trim(), responseText = (await model.generateContent(prompt)).response.text(), parsed = JSON.parse(responseText);
    return json8({ success: !0, data: parsed });
  } catch (error) {
    return console.error("AI task generation error:", error), json8({ error: "Failed to generate task. Please try again." }, { status: 500 });
  }
};

// app/routes/analytics._index.tsx
var analytics_index_exports = {};
__export(analytics_index_exports, {
  default: () => AnalyticsPage,
  loader: () => loader6,
  meta: () => meta8
});
import { useLoaderData as useLoaderData5 } from "@remix-run/react";
import { json as json9 } from "@remix-run/node";
import { jsx as jsx9, jsxs as jsxs8 } from "react/jsx-runtime";
var meta8 = () => [
  { title: "Analytics - Goal Tracker" }
], loader6 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { User: User2 } = await Promise.resolve().then(() => (init_User(), User_exports)), { UserStats: UserStats2 } = await Promise.resolve().then(() => (init_Analytics(), Analytics_exports));
  await connectDB2();
  let userId = await requireUserId2(request), now = /* @__PURE__ */ new Date(), startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()), startOfWeek.setHours(0, 0, 0, 0);
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1), user = await User2.findById(userId).lean(), [weekTasks, monthTasks, totalCompleted, weekStats] = await Promise.all([
    DailyTask2.find({ user_id: userId, created_at: { $gte: startOfWeek } }).lean(),
    DailyTask2.find({ user_id: userId, created_at: { $gte: startOfMonth } }).lean(),
    DailyTask2.countDocuments({ user_id: userId, status: "completed" }),
    UserStats2.find({ user_id: userId, date: { $gte: startOfWeek } }).sort({ date: 1 }).lean()
  ]), weekCompleted = weekTasks.filter((t) => t.status === "completed"), monthCompleted = monthTasks.filter((t) => t.status === "completed"), moodEntries = weekStats.filter((d) => d.mood_average != null), energyEntries = weekStats.filter((d) => d.energy_average != null), avgMood = moodEntries.length > 0 ? moodEntries.reduce((s, d) => s + d.mood_average, 0) / moodEntries.length : 0, avgEnergy = energyEntries.length > 0 ? energyEntries.reduce((s, d) => s + d.energy_average, 0) / energyEntries.length : 0, dailyData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
    let dayStart = new Date(startOfWeek);
    dayStart.setDate(startOfWeek.getDate() + i);
    let dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    let dayTasks = weekTasks.filter((t) => {
      let d = new Date(t.created_at);
      return d >= dayStart && d <= dayEnd;
    }), stat = weekStats.find((s) => {
      let d = new Date(s.date);
      return d >= dayStart && d <= dayEnd;
    });
    return {
      date: day,
      tasks: dayTasks.filter((t) => t.status === "completed").length,
      total: dayTasks.length,
      mood: stat?.mood_average ?? 0,
      energy: stat?.energy_average ?? 0
    };
  }), categoryMap = {};
  weekTasks.forEach((t) => {
    let cat = t.category ?? "general";
    categoryMap[cat] = (categoryMap[cat] ?? 0) + 1;
  });
  let catTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0) || 1, categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({ category, count, percentage: Math.round(count / catTotal * 100) })).sort((a, b) => b.count - a.count);
  return json9({
    stats: {
      week: {
        completed: weekCompleted.length,
        total: weekTasks.length,
        avgMood: Number(avgMood.toFixed(1)),
        avgEnergy: Number(avgEnergy.toFixed(1))
      },
      month: { completed: monthCompleted.length, total: monthTasks.length },
      allTime: {
        completed: totalCompleted,
        points: user?.total_points ?? 0,
        streak: user?.streak_count ?? 0,
        level: user?.current_level ?? 1
      }
    },
    dailyData,
    categoryBreakdown: categoryBreakdown.length > 0 ? categoryBreakdown : []
  });
}, categoryColors = {
  health: "bg-emerald-500",
  career: "bg-blue-500",
  personal: "bg-purple-500",
  education: "bg-amber-500",
  finance: "bg-green-500",
  relationships: "bg-rose-500",
  general: "bg-gray-400"
};
function StatCard({ label, value, sub, icon, bg }) {
  return /* @__PURE__ */ jsxs8("div", { className: "rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300", children: [
    /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsx9("p", { className: "text-xs font-bold uppercase tracking-wider text-gray-400", children: label }),
      /* @__PURE__ */ jsx9("div", { className: `flex h-9 w-9 items-center justify-center rounded-xl text-lg ${bg}`, children: icon })
    ] }),
    /* @__PURE__ */ jsx9("p", { className: "mt-3 text-3xl font-extrabold text-gray-900", children: value }),
    sub && /* @__PURE__ */ jsx9("p", { className: "mt-1 text-xs font-medium text-gray-500", children: sub })
  ] });
}
function AnalyticsPage() {
  let { stats, dailyData, categoryBreakdown } = useLoaderData5(), weekRate = stats.week.total > 0 ? Math.round(stats.week.completed / stats.week.total * 100) : 0, monthRate = stats.month.total > 0 ? Math.round(stats.month.completed / stats.month.total * 100) : 0, maxTasks = Math.max(...dailyData.map((d) => d.total), 1);
  return /* @__PURE__ */ jsxs8("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx9("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsxs8("div", { className: "mx-auto max-w-5xl px-6 py-5", children: [
      /* @__PURE__ */ jsx9("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: "Analytics" }),
      /* @__PURE__ */ jsx9("p", { className: "mt-0.5 text-sm text-gray-500", children: "Your productivity insights at a glance" })
    ] }) }),
    /* @__PURE__ */ jsxs8("div", { className: "mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8 space-y-8", children: [
      /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4", children: [
        /* @__PURE__ */ jsx9(StatCard, { label: "This Week", value: `${stats.week.completed}/${stats.week.total}`, sub: `${weekRate}% completion`, icon: "\u2705", bg: "bg-blue-50 text-blue-600" }),
        /* @__PURE__ */ jsx9(StatCard, { label: "This Month", value: `${stats.month.completed}/${stats.month.total}`, sub: `${monthRate}% completion`, icon: "\u{1F4C5}", bg: "bg-indigo-50 text-indigo-600" }),
        /* @__PURE__ */ jsx9(StatCard, { label: "Avg Mood", value: stats.week.avgMood > 0 ? `${stats.week.avgMood}/10` : "\u2014", sub: "this week", icon: "\u{1F60A}", bg: "bg-emerald-50 text-emerald-600" }),
        /* @__PURE__ */ jsx9(StatCard, { label: "Avg Energy", value: stats.week.avgEnergy > 0 ? `${stats.week.avgEnergy}/10` : "\u2014", sub: "this week", icon: "\u26A1", bg: "bg-amber-50 text-amber-600" })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx9("h2", { className: "text-lg font-bold text-gray-900", children: "Weekly Activity" }),
            /* @__PURE__ */ jsx9("p", { className: "text-sm text-gray-500", children: "Completed tasks per day" })
          ] }),
          /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-4 text-xs font-semibold text-gray-500", children: [
            /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx9("span", { className: "h-2.5 w-2.5 rounded-full bg-blue-500" }),
              "Done"
            ] }),
            /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx9("span", { className: "h-2.5 w-2.5 rounded-full bg-gray-200" }),
              "Total"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx9("div", { className: "flex items-end gap-2 h-36", children: dailyData.map((day) => /* @__PURE__ */ jsxs8("div", { className: "flex-1 flex flex-col items-center gap-1.5", children: [
          /* @__PURE__ */ jsxs8("div", { className: "relative w-full rounded-lg overflow-hidden", style: { height: "100px" }, children: [
            /* @__PURE__ */ jsx9("div", { className: "absolute inset-0 bg-gray-100 rounded-lg" }),
            day.total > 0 && /* @__PURE__ */ jsx9(
              "div",
              {
                className: "absolute bottom-0 left-0 right-0 bg-gray-200 rounded-lg",
                style: { height: `${day.total / maxTasks * 100}%` }
              }
            ),
            day.tasks > 0 && /* @__PURE__ */ jsx9(
              "div",
              {
                className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg",
                style: { height: `${day.tasks / maxTasks * 100}%` }
              }
            ),
            day.tasks > 0 && /* @__PURE__ */ jsx9("span", { className: "absolute inset-0 flex items-end justify-center pb-1.5 text-xs font-bold text-white z-10", children: day.tasks })
          ] }),
          /* @__PURE__ */ jsx9("span", { className: "text-xs font-semibold text-gray-500", children: day.date })
        ] }, day.date)) }),
        /* @__PURE__ */ jsx9("div", { className: "mt-5 pt-4 border-t border-gray-100 grid grid-cols-7 gap-2", children: dailyData.map((day) => /* @__PURE__ */ jsxs8("div", { className: "flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsx9("div", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${day.mood > 0 ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`, children: day.mood > 0 ? day.mood : "\u2014" }),
          /* @__PURE__ */ jsx9("div", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${day.energy > 0 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-400"}`, children: day.energy > 0 ? day.energy : "\u2014" })
        ] }, `${day.date}-metrics`)) }),
        /* @__PURE__ */ jsxs8("div", { className: "mt-2 flex justify-center gap-6 text-xs text-gray-400 font-medium", children: [
          /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx9("span", { className: "h-2 w-2 rounded-full bg-emerald-400" }),
            "Mood"
          ] }),
          /* @__PURE__ */ jsxs8("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx9("span", { className: "h-2 w-2 rounded-full bg-amber-400" }),
            "Energy"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxs8("div", { className: "lg:col-span-2 rounded-2xl bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 p-6 text-white shadow-xl", children: [
          /* @__PURE__ */ jsx9("p", { className: "text-xs font-bold uppercase tracking-widest text-blue-300 mb-5", children: "All-Time Stats" }),
          /* @__PURE__ */ jsx9("div", { className: "grid grid-cols-2 gap-5", children: [
            { label: "Tasks Done", value: stats.allTime.completed, suffix: "" },
            { label: "Total Points", value: stats.allTime.points.toLocaleString(), suffix: "" },
            { label: "Streak", value: stats.allTime.streak, suffix: " \u{1F525}" },
            { label: "Level", value: stats.allTime.level, suffix: " \u2B50" }
          ].map((item) => /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsx9("p", { className: "text-xs font-semibold text-blue-300/70", children: item.label }),
            /* @__PURE__ */ jsxs8("p", { className: "mt-1 text-3xl font-extrabold", children: [
              item.value,
              item.suffix
            ] })
          ] }, item.label)) })
        ] }),
        /* @__PURE__ */ jsxs8("div", { className: "lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsx9("h2", { className: "text-lg font-bold text-gray-900 mb-5", children: "Tasks by Category" }),
          categoryBreakdown.length === 0 ? /* @__PURE__ */ jsx9("p", { className: "text-sm text-gray-400 text-center py-8", children: "Complete tasks to see breakdown" }) : /* @__PURE__ */ jsx9("div", { className: "space-y-4", children: categoryBreakdown.slice(0, 5).map((cat) => /* @__PURE__ */ jsxs8("div", { children: [
            /* @__PURE__ */ jsxs8("div", { className: "flex items-center justify-between mb-1.5", children: [
              /* @__PURE__ */ jsx9("span", { className: "text-sm font-semibold capitalize text-gray-700", children: cat.category }),
              /* @__PURE__ */ jsxs8("span", { className: "text-sm font-bold text-gray-900", children: [
                cat.count,
                " ",
                /* @__PURE__ */ jsx9("span", { className: "text-gray-400 font-normal", children: "tasks" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx9("div", { className: "flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx9(
                "div",
                {
                  className: `h-full rounded-full ${categoryColors[cat.category] ?? "bg-gray-400"} transition-all duration-700`,
                  style: { width: `${cat.percentage}%` }
                }
              ) }),
              /* @__PURE__ */ jsxs8("span", { className: "text-xs font-bold text-gray-500 w-8 text-right", children: [
                cat.percentage,
                "%"
              ] })
            ] })
          ] }, cat.category)) })
        ] })
      ] }),
      /* @__PURE__ */ jsx9("div", { className: "rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6", children: /* @__PURE__ */ jsxs8("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx9("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white text-lg", children: "\u{1F4A1}" }),
        /* @__PURE__ */ jsxs8("div", { children: [
          /* @__PURE__ */ jsx9("p", { className: "font-semibold text-blue-900", children: "Weekly Insight" }),
          stats.week.completed === 0 ? /* @__PURE__ */ jsx9("p", { className: "mt-1 text-sm text-blue-800/80", children: "Start completing tasks today to unlock personalized productivity insights." }) : weekRate >= 80 ? /* @__PURE__ */ jsxs8("p", { className: "mt-1 text-sm text-blue-800/80", children: [
            "Excellent week! You completed ",
            weekRate,
            "% of your tasks. Maintain this momentum."
          ] }) : weekRate >= 50 ? /* @__PURE__ */ jsxs8("p", { className: "mt-1 text-sm text-blue-800/80", children: [
            "Good progress \u2014 ",
            stats.week.completed,
            " tasks done. Push through the remaining ",
            stats.week.total - stats.week.completed,
            " to hit your target."
          ] }) : /* @__PURE__ */ jsxs8("p", { className: "mt-1 text-sm text-blue-800/80", children: [
            "You're at ",
            weekRate,
            "% this week. Try breaking tasks into smaller steps to build momentum."
          ] })
        ] })
      ] }) })
    ] })
  ] });
}

// app/routes/dashboard._index.tsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  action: () => action9,
  default: () => DashboardPage,
  loader: () => loader7,
  meta: () => meta9
});
import { useState as useState6, useEffect as useEffect5 } from "react";
import { useLoaderData as useLoaderData6, Link as Link3, useFetcher as useFetcher5 } from "@remix-run/react";
import { json as json10 } from "@remix-run/node";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { jsx as jsx10, jsxs as jsxs9 } from "react/jsx-runtime";
var meta9 = () => [
  { title: "Dashboard - Goal Tracker" }
], loader7 = async ({ request }) => {
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
  }).sort({ sort_order: 1, created_at: -1 }).lean(), todayStats = await UserStats2.findOne({
    user_id: userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  }).lean();
  return json10({
    user: {
      email: user.email,
      total_points: user.total_points,
      current_level: user.current_level,
      streak_count: user.streak_count
    },
    stats: {
      tasks_today: tasks.length,
      tasks_completed_today: tasks.filter((t) => t.status === "completed").length,
      mood_average: todayStats?.mood_average ?? null,
      energy_average: todayStats?.energy_average ?? null
    },
    recentTasks: tasks.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      status: t.status,
      difficulty_level: t.difficulty_level,
      sort_order: t.sort_order ?? 0,
      tags: t.tags ?? []
    }))
  });
}, action9 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports)), { UserStats: UserStats2 } = await Promise.resolve().then(() => (init_Analytics(), Analytics_exports));
  await connectDB2();
  let userId = await requireUserId2(request), formData = await request.formData(), actionType = formData.get("_action"), startOfDay = /* @__PURE__ */ new Date();
  if (startOfDay.setHours(0, 0, 0, 0), actionType === "update_metrics") {
    let energy = formData.get("energy"), mood = formData.get("mood"), stats = await UserStats2.findOne({ user_id: userId, date: { $gte: startOfDay } });
    return stats || (stats = new UserStats2({ user_id: userId, date: /* @__PURE__ */ new Date() })), energy && (stats.energy_average = Number(energy)), mood && (stats.mood_average = Number(mood)), await stats.save(), json10({ success: !0 });
  }
  if (actionType === "update_task_status") {
    let taskId = formData.get("taskId"), status = formData.get("status");
    return taskId && status && await DailyTask2.findOneAndUpdate({ _id: taskId, user_id: userId }, { status }), json10({ success: !0 });
  }
  if (actionType === "reorder_tasks") {
    let raw = formData.get("taskIds");
    try {
      let taskIds = JSON.parse(raw);
      await Promise.all(
        taskIds.map(
          (id, index) => DailyTask2.findOneAndUpdate({ _id: id, user_id: userId }, { sort_order: index })
        )
      );
    } catch {
    }
    return json10({ success: !0 });
  }
  return json10({ success: !1 }, { status: 400 });
}, briefMessages = [
  "Reading your task list\u2026",
  "Analysing your streak\u2026",
  "Detecting your energy pattern\u2026",
  "Crafting your focus plan\u2026",
  "Almost ready\u2026"
];
function AIDailyBrief({ tasks, stats, user }) {
  let fetcher = useFetcher5(), [phase, setPhase] = useState6("idle"), [brief, setBrief] = useState6(null), [msgIdx, setMsgIdx] = useState6(0);
  useEffect5(() => {
    if (phase !== "thinking")
      return;
    let id = setInterval(() => setMsgIdx((i) => (i + 1) % briefMessages.length), 1800);
    return () => clearInterval(id);
  }, [phase]), useEffect5(() => {
    if (!(fetcher.state !== "idle" || !fetcher.data)) {
      if (fetcher.data.error) {
        setPhase("idle");
        return;
      }
      setBrief(fetcher.data.data), setPhase("filled");
    }
  }, [fetcher.state, fetcher.data]);
  let handleGenerate = () => {
    setPhase("thinking");
    let fd = new FormData(), pending = tasks.filter((t) => t.status !== "completed");
    fd.append("pending", String(pending.length)), fd.append("completed", String(tasks.filter((t) => t.status === "completed").length)), fd.append("total", String(tasks.length)), fd.append("streak", String(user.streak_count)), stats.mood_average && fd.append("mood", String(stats.mood_average)), stats.energy_average && fd.append("energy", String(stats.energy_average)), fd.append("userName", user.email.split("@")[0]), fd.append("taskTitles", pending.map((t) => t.title).slice(0, 5).join(", ")), fetcher.submit(fd, { method: "post", action: "/api/daily-brief" });
  };
  return phase === "dismissed" ? null : /* @__PURE__ */ jsxs9("div", { className: "mt-6", children: [
    phase === "idle" && /* @__PURE__ */ jsxs9(
      "button",
      {
        onClick: handleGenerate,
        className: "w-full flex items-center justify-center gap-2.5 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/60 px-6 py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 transition-all group",
        children: [
          /* @__PURE__ */ jsx10("span", { className: "text-lg group-hover:scale-110 transition-transform", children: "\u2728" }),
          "Get your AI morning brief \u2014 focus, insight & tip for today",
          /* @__PURE__ */ jsx10("span", { className: "ml-auto text-xs text-indigo-400 font-normal", children: "powered by Gemini" })
        ]
      }
    ),
    phase === "thinking" && /* @__PURE__ */ jsxs9("div", { className: "rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 flex items-center gap-5 shadow-lg shadow-indigo-500/20", children: [
      /* @__PURE__ */ jsxs9("div", { className: "relative flex h-12 w-12 shrink-0 items-center justify-center", children: [
        /* @__PURE__ */ jsx10("div", { className: "absolute inset-0 rounded-full bg-white/20 animate-ping" }),
        /* @__PURE__ */ jsx10("span", { className: "relative text-2xl animate-pulse", children: "\u{1F9E0}" })
      ] }),
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsx10("p", { className: "text-white font-semibold", children: briefMessages[msgIdx] }),
        /* @__PURE__ */ jsx10("p", { className: "text-indigo-200 text-xs mt-0.5", children: "Personalising your brief\u2026" })
      ] })
    ] }),
    phase === "filled" && brief && /* @__PURE__ */ jsxs9("div", { className: "rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-6 shadow-xl shadow-indigo-500/25 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx10("div", { className: "absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl pointer-events-none" }),
      /* @__PURE__ */ jsx10("div", { className: "absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-purple-400/10 blur-2xl pointer-events-none" }),
      /* @__PURE__ */ jsxs9("div", { className: "flex items-start justify-between relative z-10", children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx10("span", { className: "text-xl", children: "\u2728" }),
          /* @__PURE__ */ jsx10("span", { className: "text-xs font-bold uppercase tracking-widest text-indigo-200", children: "AI Morning Brief" })
        ] }),
        /* @__PURE__ */ jsx10(
          "button",
          {
            onClick: () => setPhase("dismissed"),
            className: "text-indigo-300 hover:text-white transition-colors text-lg leading-none",
            children: "\xD7"
          }
        )
      ] }),
      /* @__PURE__ */ jsx10("p", { className: "relative z-10 mt-4 text-xl font-bold text-white leading-snug", children: brief.greeting }),
      /* @__PURE__ */ jsx10("div", { className: "relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3", children: [
        { label: "\u{1F3AF} Focus", value: brief.focus, border: "border-blue-400/40", bg: "bg-blue-500/10" },
        { label: "\u{1F4A1} Insight", value: brief.insight, border: "border-purple-400/40", bg: "bg-purple-500/10" },
        { label: "\u26A1 Tip", value: brief.tip, border: "border-indigo-400/40", bg: "bg-indigo-500/10" }
      ].map(({ label, value, border, bg }) => /* @__PURE__ */ jsxs9("div", { className: `rounded-xl border ${border} ${bg} px-4 py-3 backdrop-blur-sm`, children: [
        /* @__PURE__ */ jsx10("p", { className: "text-xs font-bold text-indigo-200 mb-1", children: label }),
        /* @__PURE__ */ jsx10("p", { className: "text-sm font-medium text-white leading-snug", children: value })
      ] }, label)) }),
      /* @__PURE__ */ jsx10(
        "button",
        {
          onClick: handleGenerate,
          className: "relative z-10 mt-4 text-xs text-indigo-300 hover:text-white transition-colors",
          children: "\u21BB Refresh brief"
        }
      )
    ] })
  ] });
}
var priorityStyles = [
  { bg: "bg-red-500", ring: "ring-red-200", label: "P1" },
  { bg: "bg-orange-400", ring: "ring-orange-200", label: "P2" },
  { bg: "bg-yellow-400", ring: "ring-yellow-200", label: "P3" },
  { bg: "bg-gray-300", ring: "ring-gray-200", label: "P4" }
];
function PriorityBadge({ rank }) {
  let s = priorityStyles[Math.min(rank, priorityStyles.length - 1)];
  return /* @__PURE__ */ jsx10(
    "span",
    {
      title: `Priority ${rank + 1} \u2014 drag to reprioritize`,
      className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white ring-2 ${s.bg} ${s.ring}`,
      children: rank + 1
    }
  );
}
function SortableTaskItem({
  task,
  isDone,
  rank
}) {
  let {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id }), style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxs9(
    "div",
    {
      ref: setNodeRef,
      style,
      ...attributes,
      ...listeners,
      className: `group relative flex cursor-grab items-center gap-3 rounded-xl border p-3.5 shadow-sm transition-all active:cursor-grabbing ${isDragging ? "border-blue-300 bg-blue-50/80 shadow-lg" : isDone ? "border-emerald-100 bg-emerald-50/50 hover:shadow-md" : "border-gray-100 bg-white hover:border-blue-100 hover:shadow-md"}`,
      children: [
        /* @__PURE__ */ jsx10("div", { className: "flex shrink-0 flex-col gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs9("span", { className: "flex gap-0.5", children: [
          /* @__PURE__ */ jsx10("span", { className: "h-0.5 w-0.5 rounded-full bg-current" }),
          /* @__PURE__ */ jsx10("span", { className: "h-0.5 w-0.5 rounded-full bg-current" })
        ] }, i)) }),
        /* @__PURE__ */ jsx10("div", { className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isDone ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-400"}`, children: /* @__PURE__ */ jsx10("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx10(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: isDone ? "M5 13l4 4L19 7" : "M4 6h16M4 12h16M4 18h16"
          }
        ) }) }),
        /* @__PURE__ */ jsxs9("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx10("h4", { className: `text-sm font-semibold leading-snug truncate ${isDone ? "text-emerald-900 line-through opacity-70" : "text-gray-900"}`, children: task.title }),
          /* @__PURE__ */ jsxs9("div", { className: "mt-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx10("span", { className: "flex gap-0.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsx10("span", { className: `h-1.5 w-1.5 rounded-full ${n <= task.difficulty_level ? isDone ? "bg-emerald-400" : "bg-blue-400" : "bg-gray-200"}` }, n)) }),
            task.tags?.slice(0, 2).map((tag) => /* @__PURE__ */ jsx10("span", { className: "rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-500", children: tag }, tag))
          ] })
        ] }),
        !isDone && /* @__PURE__ */ jsx10(PriorityBadge, { rank })
      ]
    }
  );
}
function TaskBoard({ tasks }) {
  let statusFetcher = useFetcher5(), reorderFetcher = useFetcher5(), [localTasks, setLocalTasks] = useState6(tasks), [activeId, setActiveId] = useState6(null), sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );
  useEffect5(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  let pendingTasks = localTasks.filter((t) => t.status !== "completed"), completedTasks = localTasks.filter((t) => t.status === "completed"), activeTask = activeId ? localTasks.find((t) => t.id === activeId) : null;
  return /* @__PURE__ */ jsxs9(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragStart: (e) => setActiveId(e.active.id),
      onDragEnd: (event) => {
        let { active, over } = event;
        if (setActiveId(null), !over)
          return;
        let taskId = active.id, overId = over.id, task = localTasks.find((t) => t.id === taskId);
        if (!task)
          return;
        if (overId === "col-pending" || overId === "col-completed") {
          let newStatus = overId === "col-pending" ? "pending" : "completed";
          if (newStatus !== task.status) {
            setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
            let fd = new FormData();
            fd.append("_action", "update_task_status"), fd.append("taskId", taskId), fd.append("status", newStatus), statusFetcher.submit(fd, { method: "post" });
          }
          return;
        }
        let overTask = localTasks.find((t) => t.id === overId);
        if (overTask)
          if (task.status === overTask.status) {
            let colTasks = localTasks.filter((t) => t.status === task.status), oldIndex = colTasks.findIndex((t) => t.id === taskId), newIndex = colTasks.findIndex((t) => t.id === overId);
            if (oldIndex !== newIndex) {
              let reordered = arrayMove(colTasks, oldIndex, newIndex);
              setLocalTasks((prev) => [
                ...prev.filter((t) => t.status !== task.status),
                ...reordered
              ]);
              let fd = new FormData();
              fd.append("_action", "reorder_tasks"), fd.append("taskIds", JSON.stringify(reordered.map((t) => t.id))), reorderFetcher.submit(fd, { method: "post" });
            }
          } else {
            let newStatus = overTask.status;
            setLocalTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t));
            let fd = new FormData();
            fd.append("_action", "update_task_status"), fd.append("taskId", taskId), fd.append("status", newStatus), statusFetcher.submit(fd, { method: "post" });
          }
      },
      onDragCancel: () => setActiveId(null),
      children: [
        /* @__PURE__ */ jsxs9("div", { className: "mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8", children: [
          /* @__PURE__ */ jsxs9("div", { id: "col-pending", className: "flex flex-col gap-3 rounded-2xl bg-gray-50/60 p-5 border border-gray-100", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx10("h2", { className: "text-base font-bold text-gray-900", children: "To Do" }),
                /* @__PURE__ */ jsx10("span", { className: "rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700", children: pendingTasks.length })
              ] }),
              /* @__PURE__ */ jsx10("span", { className: "text-[10px] font-semibold uppercase tracking-widest text-gray-400", children: "\u2195 drag to reprioritize" })
            ] }),
            /* @__PURE__ */ jsx10(SortableContext, { id: "col-pending", items: pendingTasks.map((t) => t.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsx10("div", { className: "flex min-h-[140px] flex-col gap-2", children: pendingTasks.length === 0 ? /* @__PURE__ */ jsx10("div", { className: "flex flex-1 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-400", children: "All caught up! \u{1F389}" }) : pendingTasks.map((task, index) => /* @__PURE__ */ jsx10(SortableTaskItem, { task, isDone: !1, rank: index }, task.id)) }) })
          ] }),
          /* @__PURE__ */ jsxs9("div", { id: "col-completed", className: "flex flex-col gap-3 rounded-2xl bg-emerald-50/30 p-5 border border-emerald-100/50", children: [
            /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx10("h2", { className: "text-base font-bold text-gray-900", children: "Completed" }),
              /* @__PURE__ */ jsx10("span", { className: "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700", children: completedTasks.length })
            ] }),
            /* @__PURE__ */ jsx10(SortableContext, { id: "col-completed", items: completedTasks.map((t) => t.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsx10("div", { className: "flex min-h-[140px] flex-col gap-2", children: completedTasks.length === 0 ? /* @__PURE__ */ jsx10("div", { className: "flex flex-1 items-center justify-center rounded-xl border border-dashed border-emerald-200 bg-white/50 p-6 text-sm text-emerald-500/60", children: "Drop tasks here to complete them" }) : completedTasks.map((task, index) => /* @__PURE__ */ jsx10(SortableTaskItem, { task, isDone: !0, rank: index }, task.id)) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx10(
          DragOverlay,
          {
            dropAnimation: {
              sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: "0.5" } } })
            },
            children: activeTask && /* @__PURE__ */ jsxs9("div", { className: "flex cursor-grabbing items-center gap-3 rounded-xl border border-blue-300 bg-white p-3.5 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-400/30", children: [
              /* @__PURE__ */ jsx10("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600", children: /* @__PURE__ */ jsx10("svg", { className: "h-4 w-4", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx10("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M4 6h16M4 12h16M4 18h16" }) }) }),
              /* @__PURE__ */ jsx10("span", { className: "text-sm font-semibold text-gray-900 truncate max-w-[200px]", children: activeTask.title })
            ] })
          }
        )
      ]
    }
  );
}
var moodEmojis = [[2, "\u{1F622}"], [4, "\u{1F615}"], [6, "\u{1F610}"], [8, "\u{1F60A}"], [10, "\u{1F929}"]], energyEmojis = [[2, "\u{1FAAB}"], [4, "\u{1F634}"], [6, "\u26A1"], [8, "\u{1F4AA}"], [10, "\u{1F525}"]];
function getEmoji(type, val) {
  let map = type === "mood" ? moodEmojis : energyEmojis;
  return (map.find(([threshold]) => val <= threshold) ?? map[map.length - 1])[1];
}
function MetricSlider({ title, value, type, gradientClass }) {
  let fetcher = useFetcher5(), [localValue, setLocalValue] = useState6(value || 5), isPristine = value === null, icon = getEmoji(type, localValue);
  useEffect5(() => {
    value !== null && setLocalValue(value);
  }, [value]);
  let handleChange = (e) => {
    setLocalValue(Number(e.target.value));
  }, handleRelease = (e) => {
    let currentValue = Number(e.target.value);
    if (currentValue === value)
      return;
    let formData = new FormData();
    formData.append("_action", "update_metrics"), formData.append(type, currentValue.toString()), fetcher.submit(formData, { method: "post" });
  };
  return /* @__PURE__ */ jsxs9("div", { className: "group flex-1 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300", children: [
    /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx10("div", { className: `flex h-10 w-10 items-center justify-center rounded-xl text-white text-lg bg-gradient-to-br ${gradientClass}`, children: /* @__PURE__ */ jsx10("span", { className: "text-xl", children: icon }) }),
        /* @__PURE__ */ jsx10("h2", { className: "text-lg font-bold text-gray-900", children: title })
      ] }),
      isPristine ? /* @__PURE__ */ jsx10("span", { className: "text-sm font-medium text-gray-400", children: "Not Tracked" }) : /* @__PURE__ */ jsxs9("span", { className: `text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`, children: [
        localValue,
        "/10"
      ] })
    ] }),
    /* @__PURE__ */ jsxs9("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsx10(
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
      /* @__PURE__ */ jsxs9("div", { className: "mt-2 flex justify-between text-xs text-gray-400 font-medium tracking-wide", children: [
        /* @__PURE__ */ jsx10("span", { children: "Low" }),
        /* @__PURE__ */ jsx10("span", { children: isPristine ? "Drag to track" : "High" })
      ] })
    ] })
  ] });
}
function DashboardPage() {
  let data = useLoaderData6(), { user, stats, recentTasks } = data, [greeting, setGreeting] = useState6("Welcome");
  return useEffect5(() => {
    let hour = (/* @__PURE__ */ new Date()).getHours();
    hour < 12 ? setGreeting("Good morning") : hour < 17 ? setGreeting("Good afternoon") : setGreeting("Good evening");
  }, []), /* @__PURE__ */ jsxs9("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx10("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsx10("div", { className: "mx-auto max-w-6xl px-6 py-5", children: /* @__PURE__ */ jsxs9("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxs9("div", { children: [
        /* @__PURE__ */ jsxs9("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: [
          greeting,
          " \u{1F44B}"
        ] }),
        /* @__PURE__ */ jsx10("p", { className: "mt-1 text-sm font-medium text-gray-500", children: user.email })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-4 py-2 shadow-sm transition-transform hover:scale-105", children: [
          /* @__PURE__ */ jsx10("span", { className: "text-lg", children: "\u{1F525}" }),
          /* @__PURE__ */ jsxs9("span", { className: "text-sm font-bold text-amber-700", children: [
            user.streak_count,
            " day streak"
          ] })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2 rounded-full bg-blue-50 border border-blue-100 px-4 py-2 shadow-sm transition-transform hover:scale-105", children: [
          /* @__PURE__ */ jsx10("span", { className: "text-lg", children: "\u2B50" }),
          /* @__PURE__ */ jsxs9("span", { className: "text-sm font-bold text-blue-700", children: [
            "Level ",
            user.current_level
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs9("div", { className: "mx-auto max-w-6xl px-6 py-8 pb-28 lg:pb-8", children: [
      /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6", children: [
        /* @__PURE__ */ jsxs9("div", { className: "group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-100", children: [
          /* @__PURE__ */ jsx10("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-blue-500 transition-colors", children: "Total Points" }),
          /* @__PURE__ */ jsx10("p", { className: "text-4xl font-extrabold text-gray-900", children: user.total_points.toLocaleString() })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "group rounded-2xl bg-white p-5 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-emerald-100", children: [
          /* @__PURE__ */ jsx10("p", { className: "text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-emerald-500 transition-colors", children: "Current Level" }),
          /* @__PURE__ */ jsx10("p", { className: "text-4xl font-extrabold text-gray-900", children: user.current_level })
        ] }),
        /* @__PURE__ */ jsxs9("div", { className: "col-span-2 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 shadow-xl shadow-indigo-500/20 text-white relative overflow-hidden flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs9("div", { className: "z-10", children: [
            /* @__PURE__ */ jsx10("p", { className: "text-xs font-bold text-indigo-100 uppercase tracking-wider mb-2", children: "Today's Progress" }),
            /* @__PURE__ */ jsxs9("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsx10("p", { className: "text-5xl font-extrabold", children: stats.tasks_completed_today }),
              /* @__PURE__ */ jsxs9("p", { className: "text-base text-indigo-200 font-bold tracking-wide", children: [
                "/ ",
                stats.tasks_today || 0,
                " done"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx10("div", { className: "z-10 h-16 w-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md shadow-inner", children: /* @__PURE__ */ jsx10("span", { className: "text-3xl drop-shadow-lg", children: "\u{1F3C6}" }) }),
          /* @__PURE__ */ jsx10("div", { className: "absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl" }),
          /* @__PURE__ */ jsx10("div", { className: "absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-purple-400/20 blur-2xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsx10(AIDailyBrief, { tasks: recentTasks, stats, user }),
      /* @__PURE__ */ jsxs9("div", { className: "mt-10", children: [
        /* @__PURE__ */ jsx10("h2", { className: "text-xl font-extrabold text-gray-900 mb-5", children: "Log Your State" }),
        /* @__PURE__ */ jsxs9("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsx10(MetricSlider, { title: "Energy Level", value: stats.energy_average, type: "energy", gradientClass: "from-cyan-400 to-blue-500" }),
          /* @__PURE__ */ jsx10(MetricSlider, { title: "Mood", value: stats.mood_average, type: "mood", gradientClass: "from-emerald-400 to-green-500" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs9("div", { className: "mt-12", children: [
        /* @__PURE__ */ jsxs9("div", { className: "flex items-center justify-between pb-4", children: [
          /* @__PURE__ */ jsxs9("div", { children: [
            /* @__PURE__ */ jsx10("h2", { className: "text-xl font-extrabold text-gray-900", children: "Task Board" }),
            /* @__PURE__ */ jsx10("p", { className: "mt-0.5 text-xs text-gray-400 font-medium", children: "Drag within a column to reprioritize \xB7 Drag across to change status" })
          ] }),
          /* @__PURE__ */ jsx10(
            Link3,
            {
              to: "/tasks/new",
              className: "inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all",
              children: "\u2728 New Task"
            }
          )
        ] }),
        /* @__PURE__ */ jsx10(TaskBoard, { tasks: recentTasks })
      ] })
    ] })
  ] });
}

// app/routes/api.daily-brief.tsx
var api_daily_brief_exports = {};
__export(api_daily_brief_exports, {
  action: () => action10
});
import { json as json11 } from "@remix-run/node";
import { GoogleGenerativeAI as GoogleGenerativeAI4 } from "@google/generative-ai";
var action10 = async ({ request }) => {
  if (request.method !== "POST")
    return json11({ error: "Method not allowed" }, { status: 405 });
  let { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  await requireUserId2(request);
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey)
    return json11({ error: "AI not configured." }, { status: 500 });
  let formData = await request.formData(), pending = Number(formData.get("pending") ?? 0), completed = Number(formData.get("completed") ?? 0), total = Number(formData.get("total") ?? 0), streak = Number(formData.get("streak") ?? 0), mood = formData.get("mood") ? Number(formData.get("mood")) : null, energy = formData.get("energy") ? Number(formData.get("energy")) : null, userName = formData.get("userName") ?? "there", taskTitles = formData.get("taskTitles") ?? "";
  try {
    let model = new GoogleGenerativeAI4(apiKey).getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    }), today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }), moodLine = mood != null ? `Mood: ${mood}/10` : "Mood: not logged yet", energyLine = energy != null ? `Energy: ${energy}/10` : "Energy: not logged yet", prompt = `You are a warm, motivating personal productivity coach. Today is ${today}.

Here is the user's current context:
- Name: ${userName}
- Current streak: ${streak} day${streak !== 1 ? "s" : ""}
- Tasks today: ${total} total, ${completed} completed, ${pending} still pending
- ${moodLine}
- ${energyLine}
- Pending tasks: ${taskTitles || "none listed"}

Write a short daily brief for this person. Return ONLY a valid JSON object:
{
  "greeting": "A warm, personalized 1-sentence good-${streak > 0 ? "keep-the-streak" : "fresh-start"} opening (use their first name if known, else just be warm)",
  "focus": "1 sentence: the single most important thing they should focus on today based on their pending tasks and energy",
  "insight": "1 short insight or pattern observation \u2014 could be about their streak, mood, or task load (be specific, not generic)",
  "tip": "1 concrete, actionable micro-tip they can apply in the next 30 minutes"
}

Tone: warm, smart, human \u2014 like a trusted coach. No corporate fluff. Under 20 words per field.
Respond with ONLY the JSON object.`.trim(), result = await model.generateContent(prompt), parsed = JSON.parse(result.response.text());
    return json11({ success: !0, data: parsed });
  } catch (e) {
    return console.error("Daily brief error:", e), json11({ error: "Failed to generate brief." }, { status: 500 });
  }
};

// app/routes/auth.register.tsx
var auth_register_exports = {};
__export(auth_register_exports, {
  action: () => action11,
  default: () => RegisterPage,
  meta: () => meta10
});
import { Form as Form4, Link as Link4, useActionData as useActionData2, useNavigation as useNavigation4 } from "@remix-run/react";
import { useState as useState7 } from "react";
import { jsx as jsx11, jsxs as jsxs10 } from "react/jsx-runtime";
var meta10 = () => [
  { title: "Register - Goal Tracker" }
], action11 = async ({ request }) => {
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
  let actionData = useActionData2(), navigation = useNavigation4(), [showPassword, setShowPassword] = useState7(!1), [showConfirm, setShowConfirm] = useState7(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxs10("div", { className: "flex min-h-screen", children: [
    /* @__PURE__ */ jsxs10("div", { className: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs10("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx11("div", { className: "absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsx11("div", { className: "absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "relative z-10 flex flex-col justify-center px-16", children: [
        /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 mb-12", children: [
          /* @__PURE__ */ jsx11("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg", children: "GT" }),
          /* @__PURE__ */ jsx11("span", { className: "text-2xl font-bold text-white", children: "Goal Tracker" })
        ] }),
        /* @__PURE__ */ jsxs10("h2", { className: "text-4xl font-extrabold text-white leading-tight", children: [
          "Start your journey",
          /* @__PURE__ */ jsx11("br", {}),
          /* @__PURE__ */ jsx11("span", { className: "text-emerald-200", children: "to better habits." })
        ] }),
        /* @__PURE__ */ jsx11("p", { className: "mt-6 text-lg text-emerald-100/80 max-w-md", children: "Join thousands of high achievers who use science-backed tools to crush their goals every day." }),
        /* @__PURE__ */ jsxs10("div", { className: "mt-12 space-y-4", children: [
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx11("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx11("span", { children: "Psychology-based goal frameworks" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx11("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx11("span", { children: "Energy & mood tracking" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx11("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx11("span", { children: "Gamification & rewards system" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-3 text-white/90", children: [
            /* @__PURE__ */ jsx11("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm", children: "\u2713" }),
            /* @__PURE__ */ jsx11("span", { children: "Free forever for individuals" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx11("div", { className: "flex w-full items-center justify-center px-6 lg:w-1/2 bg-white", children: /* @__PURE__ */ jsxs10("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx11("div", { className: "mb-8 lg:hidden", children: /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx11("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx11("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }) }),
      /* @__PURE__ */ jsx11("h1", { className: "text-3xl font-extrabold text-gray-900", children: "Create account" }),
      /* @__PURE__ */ jsxs10("p", { className: "mt-2 text-sm text-gray-500", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx11(Link4, { to: "/auth/login", className: "font-semibold text-emerald-600 hover:text-emerald-700 transition", children: "Sign in" })
      ] }),
      /* @__PURE__ */ jsxs10(Form4, { method: "post", className: "mt-8 space-y-5", children: [
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
              className: "mt-2 block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all",
              placeholder: "you@example.com"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsxs10("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700", children: [
            "Password ",
            /* @__PURE__ */ jsx11("span", { className: "font-normal text-gray-400", children: "(min 8 characters)" })
          ] }),
          /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(
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
        /* @__PURE__ */ jsxs10("div", { children: [
          /* @__PURE__ */ jsx11("label", { htmlFor: "confirmPassword", className: "block text-sm font-semibold text-gray-700", children: "Confirm password" }),
          /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
            /* @__PURE__ */ jsx11(
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
            /* @__PURE__ */ jsx11(
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
        /* @__PURE__ */ jsx11(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200",
            children: isLoading ? /* @__PURE__ */ jsxs10("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxs10("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx11("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx11("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }),
              "Creating account..."
            ] }) : "Create account"
          }
        ),
        /* @__PURE__ */ jsx11("p", { className: "text-center text-xs text-gray-400", children: "By creating an account, you agree to our Terms of Service" })
      ] }),
      /* @__PURE__ */ jsx11("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx11(Link4, { to: "/", className: "text-sm text-gray-400 hover:text-gray-600 transition", children: "\u2190 Back to home" }) })
    ] }) })
  ] });
}

// app/routes/goals._index.tsx
var goals_index_exports = {};
__export(goals_index_exports, {
  default: () => GoalsPage,
  loader: () => loader8,
  meta: () => meta11
});
import { useLoaderData as useLoaderData7, Link as Link5 } from "@remix-run/react";
import { json as json12 } from "@remix-run/node";
import { useState as useState8, useEffect as useEffect6 } from "react";
import { jsx as jsx12, jsxs as jsxs11 } from "react/jsx-runtime";
var meta11 = () => [
  { title: "Goals - Goal Tracker" }
], loader8 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { LongTermGoal: LongTermGoal2, ShortTermGoal: ShortTermGoal2 } = await Promise.resolve().then(() => (init_Goals(), Goals_exports));
  await connectDB2();
  let userId = await requireUserId2(request), [longTermGoals, shortTermGoals] = await Promise.all([
    LongTermGoal2.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ShortTermGoal2.find({ user_id: userId }).sort({ created_at: -1 }).lean()
  ]);
  return json12({
    longTermGoals: longTermGoals.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      status: g.status,
      category: g.category,
      priority: g.priority,
      current_progress_percentage: g.current_progress_percentage ?? 0,
      target_date: g.target_date ? new Date(g.target_date).toISOString() : null
    })),
    shortTermGoals: shortTermGoals.map((g) => ({
      _id: g._id.toString(),
      title: g.title,
      status: g.status,
      priority: g.priority ?? "medium",
      milestones: (g.milestones ?? []).map((m) => ({
        id: m.id ?? m._id?.toString() ?? String(Math.random()),
        title: m.title,
        completed: !!m.completed
      })),
      start_date: g.start_date ? new Date(g.start_date).toISOString() : null,
      end_date: g.end_date ? new Date(g.end_date).toISOString() : null
    }))
  });
}, categoryConfig2 = {
  health: { color: "text-emerald-700", bg: "bg-emerald-100", icon: "\u{1F4AA}" },
  career: { color: "text-blue-700", bg: "bg-blue-100", icon: "\u{1F4BC}" },
  personal: { color: "text-purple-700", bg: "bg-purple-100", icon: "\u{1F331}" },
  education: { color: "text-amber-700", bg: "bg-amber-100", icon: "\u{1F4DA}" },
  finance: { color: "text-green-700", bg: "bg-green-100", icon: "\u{1F4B0}" },
  relationships: { color: "text-rose-700", bg: "bg-rose-100", icon: "\u2764\uFE0F" }
}, priorityConfig3 = {
  high: { dot: "bg-red-500", text: "text-red-700", label: "High" },
  medium: { dot: "bg-amber-400", text: "text-amber-700", label: "Medium" },
  low: { dot: "bg-gray-400", text: "text-gray-600", label: "Low" }
};
function getDaysUntil(dateStr, now) {
  if (!dateStr || !now)
    return null;
  let diff = Math.ceil((new Date(dateStr).getTime() - now) / (1e3 * 60 * 60 * 24));
  return diff < 0 ? { label: "Overdue", urgent: !0 } : diff === 0 ? { label: "Due today", urgent: !0 } : diff <= 7 ? { label: `${diff}d left`, urgent: !0 } : { label: `${diff}d left`, urgent: !1 };
}
function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  ctaTo,
  gradient,
  shadow
}) {
  return /* @__PURE__ */ jsxs11("div", { className: "flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20 text-center px-6", children: [
    /* @__PURE__ */ jsx12("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 text-3xl shadow-inner", children: icon }),
    /* @__PURE__ */ jsx12("h3", { className: "mt-5 text-lg font-bold text-gray-900", children: title }),
    /* @__PURE__ */ jsx12("p", { className: "mt-2 max-w-sm text-sm text-gray-500 leading-relaxed", children: description }),
    /* @__PURE__ */ jsxs11(
      Link5,
      {
        to: ctaTo,
        className: `mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r ${gradient} px-7 py-3 text-sm font-semibold text-white shadow-lg ${shadow} hover:scale-105 hover:shadow-xl transition-all duration-200`,
        children: [
          ctaLabel,
          " \u2192"
        ]
      }
    )
  ] });
}
function GoalsPage() {
  let { longTermGoals, shortTermGoals } = useLoaderData7(), [activeTab, setActiveTab] = useState8("long-term"), [now, setNow] = useState8(0);
  useEffect6(() => {
    setNow(Date.now());
  }, []);
  let totalCompleted = longTermGoals.filter((g) => g.status === "completed").length + shortTermGoals.filter((g) => g.status === "completed").length;
  return /* @__PURE__ */ jsxs11("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx12("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsxs11("div", { className: "mx-auto max-w-5xl px-6 py-5", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs11("div", { children: [
          /* @__PURE__ */ jsx12("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: "My Goals" }),
          /* @__PURE__ */ jsxs11("p", { className: "mt-0.5 text-sm text-gray-500", children: [
            longTermGoals.length + shortTermGoals.length,
            " goals \xB7 ",
            totalCompleted,
            " completed"
          ] })
        ] }),
        /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx12(
            Link5,
            {
              to: "/goals/long-term/new",
              className: "hidden sm:inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-all",
              children: "+ Long-term"
            }
          ),
          /* @__PURE__ */ jsx12(
            Link5,
            {
              to: "/goals/short-term/new",
              className: "inline-flex items-center gap-1.5 rounded-full bg-gray-900 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-gray-900/20 hover:bg-gray-800 hover:-translate-y-0.5 transition-all",
              children: "+ New Goal"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx12("div", { className: "mt-5 flex gap-1 rounded-xl bg-gray-100/80 p-1 w-fit", children: [
        { id: "long-term", label: "\u{1F3AF} Long-term", count: longTermGoals.length, activeClasses: "bg-blue-100 text-blue-700" },
        { id: "short-term", label: "\u26A1 Short-term", count: shortTermGoals.length, activeClasses: "bg-emerald-100 text-emerald-700" }
      ].map((tab) => /* @__PURE__ */ jsxs11(
        "button",
        {
          onClick: () => setActiveTab(tab.id),
          className: `flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-800"}`,
          children: [
            tab.label,
            /* @__PURE__ */ jsx12("span", { className: `rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === tab.id ? tab.activeClasses : "bg-gray-200 text-gray-500"}`, children: tab.count })
          ]
        },
        tab.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs11("div", { className: "mx-auto max-w-5xl px-6 py-8 pb-28 lg:pb-8", children: [
      activeTab === "long-term" && /* @__PURE__ */ jsx12("div", { className: "space-y-4", children: longTermGoals.length === 0 ? /* @__PURE__ */ jsx12(
        EmptyState,
        {
          icon: "\u{1F3AF}",
          title: "No long-term goals yet",
          description: "Define where you want to be in 3, 6, or 12 months. Break big ambitions into achievable milestones.",
          ctaLabel: "Create your first goal",
          ctaTo: "/goals/long-term/new",
          gradient: "from-blue-600 to-indigo-600",
          shadow: "shadow-blue-500/25"
        }
      ) : longTermGoals.map((goal) => {
        let cat = categoryConfig2[goal.category] ?? { color: "text-gray-700", bg: "bg-gray-100", icon: "\u{1F4CC}" }, pri = priorityConfig3[goal.priority] ?? priorityConfig3.low, due = getDaysUntil(goal.target_date, now), prog = Math.min(100, goal.current_progress_percentage ?? 0), R = 26, circ = 2 * Math.PI * R, dash = prog / 100 * circ, isCompleted = goal.status === "completed", isUrgent = due?.urgent && !isCompleted;
        return /* @__PURE__ */ jsxs11(
          "div",
          {
            className: `rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isUrgent ? "border-red-200" : "border-gray-100 hover:border-blue-100"}`,
            children: [
              isCompleted && /* @__PURE__ */ jsx12("div", { className: "h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" }),
              isUrgent && /* @__PURE__ */ jsx12("div", { className: "h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" }),
              /* @__PURE__ */ jsxs11("div", { className: "p-6", children: [
                /* @__PURE__ */ jsxs11("div", { className: "flex items-start gap-5", children: [
                  /* @__PURE__ */ jsxs11("div", { className: "relative shrink-0 flex flex-col items-center gap-1", children: [
                    /* @__PURE__ */ jsxs11("svg", { width: "68", height: "68", viewBox: "0 0 68 68", children: [
                      /* @__PURE__ */ jsx12("circle", { cx: "34", cy: "34", r: R, fill: "none", stroke: "#f3f4f6", strokeWidth: "6" }),
                      /* @__PURE__ */ jsx12(
                        "circle",
                        {
                          cx: "34",
                          cy: "34",
                          r: R,
                          fill: "none",
                          stroke: isCompleted ? "#10b981" : prog >= 60 ? "#6366f1" : "#3b82f6",
                          strokeWidth: "6",
                          strokeLinecap: "round",
                          strokeDasharray: `${dash} ${circ}`,
                          style: { transform: "rotate(-90deg)", transformOrigin: "34px 34px", transition: "stroke-dasharray 0.7s ease" }
                        }
                      ),
                      /* @__PURE__ */ jsxs11(
                        "text",
                        {
                          x: "34",
                          y: "37",
                          textAnchor: "middle",
                          fontSize: "13",
                          fontWeight: "700",
                          fill: isCompleted ? "#059669" : "#374151",
                          children: [
                            prog,
                            "%"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx12("span", { className: "text-xs font-semibold text-gray-400", children: "done" })
                  ] }),
                  /* @__PURE__ */ jsxs11("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsxs11("span", { className: `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${cat.bg} ${cat.color}`, children: [
                        cat.icon,
                        " ",
                        goal.category ?? "general"
                      ] }),
                      /* @__PURE__ */ jsxs11("span", { className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold bg-gray-100 ${pri.text}`, children: [
                        /* @__PURE__ */ jsx12("span", { className: `h-1.5 w-1.5 rounded-full ${pri.dot}` }),
                        pri.label
                      ] }),
                      isCompleted && /* @__PURE__ */ jsx12("span", { className: "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700", children: "\u2713 Completed" }),
                      due && !isCompleted && /* @__PURE__ */ jsxs11("span", { className: `text-xs font-bold rounded-full px-2.5 py-1 ${due.urgent ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"}`, children: [
                        due.urgent ? "\u26A0\uFE0F" : "\u{1F5D3}",
                        " ",
                        due.label
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx12("h3", { className: "mt-2 text-base font-bold text-gray-900 leading-snug", children: goal.title }),
                    /* @__PURE__ */ jsxs11("div", { className: "mt-4", children: [
                      /* @__PURE__ */ jsx12("div", { className: "h-2.5 w-full rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx12(
                        "div",
                        {
                          className: `h-full rounded-full transition-all duration-700 ${isCompleted ? "bg-gradient-to-r from-emerald-400 to-teal-500" : prog >= 60 ? "bg-gradient-to-r from-indigo-500 to-blue-500" : "bg-gradient-to-r from-blue-400 to-indigo-400"}`,
                          style: { width: `${prog}%` }
                        }
                      ) }),
                      prog === 0 && /* @__PURE__ */ jsx12("p", { className: "mt-1.5 text-xs text-gray-400", children: "No progress yet \u2014 open goal to update" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx12("div", { className: "mt-5", children: /* @__PURE__ */ jsxs11(
                  Link5,
                  {
                    to: `/goals/long-term/${goal._id}`,
                    className: `flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition-all ${isCompleted ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:opacity-90"}`,
                    children: [
                      isCompleted ? "\u{1F3C6} View Achievement" : prog === 0 ? "\u{1F680} Start Goal" : "\u{1F4C8} Update Progress",
                      /* @__PURE__ */ jsx12("span", { children: "\u2192" })
                    ]
                  }
                ) })
              ] })
            ]
          },
          goal._id
        );
      }) }),
      activeTab === "short-term" && /* @__PURE__ */ jsx12("div", { className: "space-y-4", children: shortTermGoals.length === 0 ? /* @__PURE__ */ jsx12(
        EmptyState,
        {
          icon: "\u26A1",
          title: "No short-term goals yet",
          description: "Break your big goals into weekly or monthly sprints. Small wins build unstoppable momentum.",
          ctaLabel: "Create your first sprint",
          ctaTo: "/goals/short-term/new",
          gradient: "from-emerald-500 to-teal-600",
          shadow: "shadow-emerald-500/25"
        }
      ) : shortTermGoals.map((goal) => {
        let milestones = goal.milestones ?? [], done = milestones.filter((m) => m.completed).length, total = milestones.length, milestonePct = total > 0 ? Math.round(done / total * 100) : 0, startMs = goal.start_date ? new Date(goal.start_date).getTime() : 0, endMs = goal.end_date ? new Date(goal.end_date).getTime() : 0, spanMs = endMs - startMs, timePct = now && spanMs > 0 ? Math.min(100, Math.max(0, Math.round((now - startMs) / spanMs * 100))) : 0, daysTotal = spanMs > 0 ? Math.ceil(spanMs / 864e5) : 0, daysElapsed = now && startMs ? Math.max(0, Math.ceil((now - startMs) / 864e5)) : 0, daysLeft = now && endMs ? Math.max(0, Math.ceil((endMs - now) / 864e5)) : daysTotal, isBehind = timePct > 0 && milestonePct < timePct - 15, isOnTrack = milestonePct >= timePct - 15, isDone = goal.status === "completed", accentColor = isDone ? "emerald" : isBehind ? "amber" : "emerald", R = 26, circ = 2 * Math.PI * R, dash = milestonePct / 100 * circ, nextMilestone = milestones.find((m) => !m.completed);
        return /* @__PURE__ */ jsxs11(
          "div",
          {
            className: `rounded-2xl bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isBehind ? "border-amber-200" : "border-gray-100 hover:border-emerald-100"}`,
            children: [
              isBehind && /* @__PURE__ */ jsx12("div", { className: "h-1 w-full bg-gradient-to-r from-amber-400 to-orange-400" }),
              isDone && /* @__PURE__ */ jsx12("div", { className: "h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500" }),
              /* @__PURE__ */ jsxs11("div", { className: "p-6", children: [
                /* @__PURE__ */ jsxs11("div", { className: "flex items-start gap-5", children: [
                  /* @__PURE__ */ jsxs11("div", { className: "relative shrink-0 flex flex-col items-center gap-1", children: [
                    /* @__PURE__ */ jsxs11("svg", { width: "68", height: "68", viewBox: "0 0 68 68", children: [
                      /* @__PURE__ */ jsx12("circle", { cx: "34", cy: "34", r: R, fill: "none", stroke: "#f3f4f6", strokeWidth: "6" }),
                      /* @__PURE__ */ jsx12(
                        "circle",
                        {
                          cx: "34",
                          cy: "34",
                          r: R,
                          fill: "none",
                          stroke: isDone ? "#10b981" : isBehind ? "#f59e0b" : "#10b981",
                          strokeWidth: "6",
                          strokeLinecap: "round",
                          strokeDasharray: `${dash} ${circ}`,
                          strokeDashoffset: circ / 4,
                          style: { transform: "rotate(-90deg)", transformOrigin: "34px 34px", transition: "stroke-dasharray 0.7s ease" }
                        }
                      ),
                      /* @__PURE__ */ jsxs11(
                        "text",
                        {
                          x: "34",
                          y: "37",
                          textAnchor: "middle",
                          fontSize: "13",
                          fontWeight: "700",
                          fill: isDone ? "#059669" : isBehind ? "#d97706" : "#374151",
                          children: [
                            milestonePct,
                            "%"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs11("span", { className: "text-xs font-semibold text-gray-400", children: [
                      done,
                      "/",
                      total
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs11("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxs11("div", { className: "flex flex-wrap items-center gap-2", children: [
                      /* @__PURE__ */ jsx12("span", { className: `rounded-full px-2.5 py-1 text-xs font-semibold ${isDone ? "bg-emerald-100 text-emerald-700" : isBehind ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`, children: isDone ? "\u2713 Completed" : isBehind ? "\u26A0\uFE0F Behind" : "\u26A1 Active" }),
                      daysLeft > 0 && !isDone && /* @__PURE__ */ jsxs11("span", { className: `text-xs font-bold rounded-full px-2.5 py-1 ${daysLeft <= 3 ? "bg-red-100 text-red-700" : daysLeft <= 7 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`, children: [
                        "\u{1F5D3} ",
                        daysLeft,
                        "d left"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx12("h3", { className: "mt-2 text-base font-bold text-gray-900 leading-snug", children: goal.title })
                  ] })
                ] }),
                daysTotal > 0 && /* @__PURE__ */ jsxs11("div", { className: "mt-5 space-y-2.5", children: [
                  /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx12("span", { className: "w-20 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0", children: "Time" }),
                    /* @__PURE__ */ jsx12("div", { className: "flex-1 h-2 rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx12(
                      "div",
                      {
                        className: "h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 transition-all duration-700",
                        style: { width: `${timePct}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxs11("span", { className: "w-16 text-right text-xs font-semibold text-gray-500", children: [
                      daysElapsed,
                      "/",
                      daysTotal,
                      "d"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx12("span", { className: "w-20 text-xs font-semibold text-gray-400 uppercase tracking-wide shrink-0", children: "Progress" }),
                    /* @__PURE__ */ jsx12("div", { className: "flex-1 h-2 rounded-full bg-gray-100 overflow-hidden", children: /* @__PURE__ */ jsx12(
                      "div",
                      {
                        className: `h-full rounded-full transition-all duration-700 ${isDone ? "bg-gradient-to-r from-emerald-400 to-teal-500" : isBehind ? "bg-gradient-to-r from-amber-400 to-orange-400" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`,
                        style: { width: `${milestonePct}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxs11("span", { className: "w-16 text-right text-xs font-semibold text-gray-500", children: [
                      done,
                      "/",
                      total
                    ] })
                  ] }),
                  isBehind && /* @__PURE__ */ jsxs11("p", { className: "text-xs text-amber-600 font-medium pl-[92px]", children: [
                    "You're ",
                    timePct - milestonePct,
                    "% behind schedule \u2014 start now to catch up!"
                  ] })
                ] }),
                nextMilestone && !isDone && /* @__PURE__ */ jsxs11("div", { className: "mt-5", children: [
                  /* @__PURE__ */ jsx12("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400 mb-2", children: "\u25B6 Next Up" }),
                  /* @__PURE__ */ jsxs11(
                    Link5,
                    {
                      to: `/goals/short-term/${goal._id}`,
                      className: `flex items-start gap-3 rounded-xl border px-4 py-3 transition-all group/next ${isBehind ? "border-amber-200 bg-amber-50 hover:bg-amber-100" : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"}`,
                      children: [
                        /* @__PURE__ */ jsx12("div", { className: `mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${isBehind ? "border-amber-400" : "border-emerald-400"}` }),
                        /* @__PURE__ */ jsx12("span", { className: "flex-1 text-sm font-semibold text-gray-800 leading-snug", children: nextMilestone.title }),
                        /* @__PURE__ */ jsx12("span", { className: `shrink-0 text-xs font-bold transition-transform group-hover/next:translate-x-0.5 ${isBehind ? "text-amber-600" : "text-emerald-600"}`, children: "\u2192" })
                      ]
                    }
                  )
                ] }),
                total > 0 && /* @__PURE__ */ jsx12("div", { className: "mt-4 space-y-1.5", children: milestones.map((m, idx) => m.id === nextMilestone?.id ? null : /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsx12("div", { className: `flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.completed ? "bg-emerald-500 text-white" : "border border-gray-300 text-gray-300"}`, children: m.completed ? "\u2713" : "" }),
                  /* @__PURE__ */ jsx12("span", { className: `text-sm leading-snug ${m.completed ? "line-through text-gray-400" : "text-gray-500"}`, children: m.title })
                ] }, m.id)) }),
                /* @__PURE__ */ jsx12("div", { className: "mt-5", children: /* @__PURE__ */ jsxs11(
                  Link5,
                  {
                    to: `/goals/short-term/${goal._id}`,
                    className: `flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-bold transition-all ${isDone ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : isBehind ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 hover:opacity-90" : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/25 hover:opacity-90"}`,
                    children: [
                      isDone ? "\u{1F3C6} View Achievement" : isBehind ? "\u{1F525} Catch Up Now" : "\u26A1 Continue Sprint",
                      /* @__PURE__ */ jsx12("span", { children: "\u2192" })
                    ]
                  }
                ) })
              ] })
            ]
          },
          goal._id
        );
      }) })
    ] })
  ] });
}

// app/routes/auth.logout.tsx
var auth_logout_exports = {};
__export(auth_logout_exports, {
  action: () => action12,
  loader: () => loader9
});
var action12 = async ({ request }) => {
  let { logout: logout2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports));
  return logout2(request);
}, loader9 = async () => {
  let { redirect: redirect3 } = await import("@remix-run/node");
  return redirect3("/");
};

// app/routes/auth.login.tsx
var auth_login_exports = {};
__export(auth_login_exports, {
  action: () => action13,
  default: () => LoginPage,
  meta: () => meta12
});
import { Form as Form5, Link as Link6, useActionData as useActionData3, useNavigation as useNavigation5 } from "@remix-run/react";
import { useState as useState9 } from "react";
import { jsx as jsx13, jsxs as jsxs12 } from "react/jsx-runtime";
var meta12 = () => [
  { title: "Login - Goal Tracker" }
], action13 = async ({ request }) => {
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
  let actionData = useActionData3(), navigation = useNavigation5(), [showPassword, setShowPassword] = useState9(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxs12("div", { className: "flex min-h-screen", children: [
    /* @__PURE__ */ jsxs12("div", { className: "hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs12("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsx13("div", { className: "absolute top-20 left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" }),
        /* @__PURE__ */ jsx13("div", { className: "absolute bottom-20 right-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "relative z-10 flex flex-col justify-center px-16", children: [
        /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-3 mb-12", children: [
          /* @__PURE__ */ jsx13("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-white font-bold text-lg", children: "GT" }),
          /* @__PURE__ */ jsx13("span", { className: "text-2xl font-bold text-white", children: "Goal Tracker" })
        ] }),
        /* @__PURE__ */ jsxs12("h2", { className: "text-4xl font-extrabold text-white leading-tight", children: [
          "Welcome back.",
          /* @__PURE__ */ jsx13("br", {}),
          /* @__PURE__ */ jsx13("span", { className: "text-blue-200", children: "Let's crush your goals." })
        ] }),
        /* @__PURE__ */ jsx13("p", { className: "mt-6 text-lg text-blue-100/80 max-w-md", children: "Track your progress, build streaks, and unlock achievements with science-backed productivity tools." }),
        /* @__PURE__ */ jsxs12("div", { className: "mt-12 flex gap-8", children: [
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx13("p", { className: "text-3xl font-bold text-white", children: "73%" }),
            /* @__PURE__ */ jsx13("p", { className: "text-sm text-blue-200/70", children: "Higher completion" })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx13("p", { className: "text-3xl font-bold text-white", children: "2.4x" }),
            /* @__PURE__ */ jsx13("p", { className: "text-sm text-blue-200/70", children: "Faster goals" })
          ] }),
          /* @__PURE__ */ jsxs12("div", { children: [
            /* @__PURE__ */ jsx13("p", { className: "text-3xl font-bold text-white", children: "89%" }),
            /* @__PURE__ */ jsx13("p", { className: "text-sm text-blue-200/70", children: "Keep streaks" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx13("div", { className: "flex w-full items-center justify-center px-6 lg:w-1/2 bg-white", children: /* @__PURE__ */ jsxs12("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsx13("div", { className: "mb-8 lg:hidden", children: /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx13("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }) }),
      /* @__PURE__ */ jsx13("h1", { className: "text-3xl font-extrabold text-gray-900", children: "Sign in" }),
      /* @__PURE__ */ jsxs12("p", { className: "mt-2 text-sm text-gray-500", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsx13(Link6, { to: "/auth/register", className: "font-semibold text-blue-600 hover:text-blue-700 transition", children: "Create one free" })
      ] }),
      /* @__PURE__ */ jsxs12(Form5, { method: "post", className: "mt-8 space-y-5", children: [
        actionData?.error && /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700", children: [
          /* @__PURE__ */ jsx13("span", { className: "text-lg", children: "\u26A0\uFE0F" }),
          actionData.error
        ] }),
        /* @__PURE__ */ jsxs12("div", { children: [
          /* @__PURE__ */ jsx13("label", { htmlFor: "email", className: "block text-sm font-semibold text-gray-700", children: "Email address" }),
          /* @__PURE__ */ jsx13(
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
        /* @__PURE__ */ jsxs12("div", { children: [
          /* @__PURE__ */ jsx13("label", { htmlFor: "password", className: "block text-sm font-semibold text-gray-700", children: "Password" }),
          /* @__PURE__ */ jsxs12("div", { className: "relative", children: [
            /* @__PURE__ */ jsx13(
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
            /* @__PURE__ */ jsx13(
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
        /* @__PURE__ */ jsx13(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200",
            children: isLoading ? /* @__PURE__ */ jsxs12("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxs12("svg", { className: "h-4 w-4 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx13("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx13("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }),
              "Signing in..."
            ] }) : "Sign in"
          }
        )
      ] }),
      /* @__PURE__ */ jsx13("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsx13(Link6, { to: "/", className: "text-sm text-gray-400 hover:text-gray-600 transition", children: "\u2190 Back to home" }) })
    ] }) })
  ] });
}

// app/routes/dashboard.tsx
var dashboard_exports = {};
__export(dashboard_exports, {
  default: () => DashboardLayout,
  loader: () => loader10
});
import { Outlet as Outlet2, Link as Link7, useLocation, Form as Form6 } from "@remix-run/react";
import { jsx as jsx14, jsxs as jsxs13 } from "react/jsx-runtime";
var loader10 = async ({ request }) => {
  let { getUserId: getUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), userId = await getUserId2(request);
  if (!userId) {
    let { redirect: redirect3 } = await import("@remix-run/node");
    return redirect3("/auth/login");
  }
  return { userId };
}, navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "\u{1F4CA}" },
  { to: "/goals", label: "Goals", icon: "\u{1F3AF}" },
  { to: "/analytics", label: "Analytics", icon: "\u{1F4C8}" },
  { to: "/gamification", label: "Rewards", icon: "\u{1F3C6}" }
];
function DashboardLayout() {
  let location = useLocation(), isActive = (to) => to === "/dashboard" ? location.pathname === to : location.pathname.startsWith(to);
  return /* @__PURE__ */ jsxs13("div", { className: "flex min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsxs13("aside", { className: "fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-gray-100 bg-white lg:flex flex-col shadow-sm", children: [
      /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-3 border-b border-gray-100 px-6 py-5", children: [
        /* @__PURE__ */ jsx14("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/20", children: "GT" }),
        /* @__PURE__ */ jsx14("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsxs13("nav", { className: "flex-1 px-3 py-5 space-y-1", children: [
        /* @__PURE__ */ jsx14("p", { className: "mb-3 px-3 text-xs font-bold uppercase tracking-widest text-gray-400", children: "Navigation" }),
        navItems.map((item) => {
          let active = isActive(item.to);
          return /* @__PURE__ */ jsxs13(
            Link7,
            {
              to: item.to,
              className: `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${active ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`,
              children: [
                /* @__PURE__ */ jsx14("span", { className: `absolute left-0 h-8 w-1 rounded-r-full bg-blue-600 transition-all duration-200 ${active ? "opacity-100" : "opacity-0"}`, style: { position: "relative", width: "3px", height: "20px", borderRadius: "2px", background: active ? "#2563EB" : "transparent", flexShrink: 0 } }),
                /* @__PURE__ */ jsx14("span", { className: "text-lg w-6 text-center", children: item.icon }),
                /* @__PURE__ */ jsx14("span", { className: "flex-1", children: item.label }),
                active && /* @__PURE__ */ jsx14("span", { className: "h-2 w-2 rounded-full bg-blue-600 shrink-0" })
              ]
            },
            item.to
          );
        })
      ] }),
      /* @__PURE__ */ jsx14("div", { className: "border-t border-gray-100 p-4", children: /* @__PURE__ */ jsx14(Form6, { method: "post", action: "/auth/logout", children: /* @__PURE__ */ jsxs13(
        "button",
        {
          type: "submit",
          className: "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200",
          children: [
            /* @__PURE__ */ jsx14("span", { className: "text-lg w-6 text-center", children: "\u{1F6AA}" }),
            "Sign Out"
          ]
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsx14("div", { className: "fixed top-0 left-0 right-0 z-30 flex items-center border-b border-gray-100 bg-white/90 backdrop-blur-md px-5 py-4 lg:hidden", children: /* @__PURE__ */ jsxs13("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx14("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs shadow", children: "GT" }),
      /* @__PURE__ */ jsx14("span", { className: "text-lg font-bold text-gray-900", children: "Goal Tracker" })
    ] }) }),
    /* @__PURE__ */ jsx14("main", { className: "flex-1 lg:ml-64", children: /* @__PURE__ */ jsx14("div", { className: "pt-[57px] lg:pt-0", children: /* @__PURE__ */ jsx14(Outlet2, {}) }) }),
    /* @__PURE__ */ jsx14("nav", { className: "fixed bottom-0 left-0 right-0 z-30 border-t border-gray-100 bg-white/95 backdrop-blur-md lg:hidden", children: /* @__PURE__ */ jsx14("div", { className: "flex items-stretch", children: navItems.map((item) => {
      let active = isActive(item.to);
      return /* @__PURE__ */ jsxs13(
        Link7,
        {
          to: item.to,
          className: `flex flex-1 flex-col items-center gap-1 py-3 transition-colors ${active ? "text-blue-600" : "text-gray-400 hover:text-gray-700"}`,
          children: [
            active && /* @__PURE__ */ jsx14("span", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-blue-600", style: { position: "absolute", top: 0 } }),
            /* @__PURE__ */ jsx14("span", { className: "text-xl", children: item.icon }),
            /* @__PURE__ */ jsx14("span", { className: `text-xs font-semibold ${active ? "text-blue-600" : "text-gray-400"}`, children: item.label })
          ]
        },
        item.to
      );
    }) }) })
  ] });
}

// app/routes/tasks.new.tsx
var tasks_new_exports = {};
__export(tasks_new_exports, {
  action: () => action14,
  default: () => NewTaskPage,
  meta: () => meta13
});
import { Form as Form7, Link as Link8, useFetcher as useFetcher6, useNavigation as useNavigation6 } from "@remix-run/react";
import { json as json13, redirect as redirect2 } from "@remix-run/node";
import { useState as useState10, useRef, useEffect as useEffect7 } from "react";
import { Fragment as Fragment3, jsx as jsx15, jsxs as jsxs14 } from "react/jsx-runtime";
var meta13 = () => [{ title: "New Task - Goal Tracker" }], action14 = async ({ request }) => {
  let { connectDB: connectDB2 } = await init_db_server().then(() => db_server_exports), { requireUserId: requireUserId2 } = await Promise.resolve().then(() => (init_auth_server(), auth_server_exports)), { DailyTask: DailyTask2 } = await Promise.resolve().then(() => (init_Tasks(), Tasks_exports));
  await connectDB2();
  let userId = await requireUserId2(request), formData = await request.formData(), title = formData.get("title")?.trim();
  if (!title)
    return json13({ error: "Title is required" }, { status: 400 });
  let description = formData.get("description")?.trim() ?? "", difficulty_level = Math.min(5, Math.max(1, Number(formData.get("difficulty_level")) || 3)), due_date_str = formData.get("due_date"), tags = (formData.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean), taskCount = await DailyTask2.countDocuments({ user_id: userId, status: { $ne: "completed" } });
  return await DailyTask2.create({
    user_id: userId,
    title,
    description,
    difficulty_level,
    due_date: due_date_str ? new Date(due_date_str) : /* @__PURE__ */ new Date(),
    tags,
    status: "pending",
    sort_order: taskCount
  }), redirect2("/dashboard");
}, difficultyMeta = [
  null,
  { emoji: "\u{1F60C}", label: "Trivial", color: "from-gray-400 to-gray-500" },
  { emoji: "\u{1F642}", label: "Easy", color: "from-emerald-400 to-teal-500" },
  { emoji: "\u{1F914}", label: "Medium", color: "from-blue-400 to-indigo-500" },
  { emoji: "\u{1F4AA}", label: "Hard", color: "from-orange-400 to-red-500" },
  { emoji: "\u{1F525}", label: "Very Hard", color: "from-red-500 to-rose-700" }
];
function formatDate(dateStr) {
  if (!dateStr)
    return "Today";
  try {
    return (/* @__PURE__ */ new Date(dateStr + "T12:00:00")).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  } catch {
    return dateStr;
  }
}
function ThinkingDots2() {
  return /* @__PURE__ */ jsx15("span", { className: "flex items-center gap-[3px]", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx15(
    "span",
    {
      className: "block h-1.5 w-1.5 rounded-full bg-current animate-bounce",
      style: { animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }
    },
    i
  )) });
}
function ThinkingPanel() {
  let steps = [
    "Analyzing your task description\u2026",
    "Estimating difficulty level\u2026",
    "Picking the best deadline\u2026",
    "Selecting relevant tags\u2026",
    "Crafting a clear title\u2026"
  ], [step, setStep] = useState10(0);
  return useEffect7(() => {
    let t = setInterval(() => setStep((s) => (s + 1) % steps.length), 650);
    return () => clearInterval(t);
  }, []), /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-4 py-1", children: [
    /* @__PURE__ */ jsxs14("div", { className: "relative flex h-12 w-12 shrink-0 items-center justify-center", children: [
      /* @__PURE__ */ jsx15("span", { className: "absolute inset-0 rounded-full bg-violet-300/40 animate-ping" }),
      /* @__PURE__ */ jsx15("span", { className: "absolute inset-1 rounded-full bg-violet-300/30 animate-pulse" }),
      /* @__PURE__ */ jsx15("span", { className: "relative z-10 text-2xl select-none", children: "\u{1F9E0}" })
    ] }),
    /* @__PURE__ */ jsxs14("div", { children: [
      /* @__PURE__ */ jsx15("p", { className: "text-sm font-semibold text-gray-800", children: steps[step] }),
      /* @__PURE__ */ jsx15("p", { className: "mt-0.5 text-xs text-gray-400", children: "Powered by Gemini AI" })
    ] })
  ] });
}
function FieldReveal({
  show,
  label,
  children
}) {
  return /* @__PURE__ */ jsxs14(
    "div",
    {
      className: "flex items-start gap-3 transition-all duration-300",
      style: { opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(6px)" },
      children: [
        /* @__PURE__ */ jsx15("span", { className: "mt-0.5 w-20 shrink-0 text-[10px] font-bold uppercase tracking-widest text-gray-400", children: label }),
        /* @__PURE__ */ jsx15("div", { className: "flex-1 min-w-0", children })
      ]
    }
  );
}
function NewTaskPage() {
  let aiFetcher = useFetcher6(), navigation = useNavigation6(), textareaRef = useRef(null), [phase, setPhase] = useState10("idle"), [rawInput, setRawInput] = useState10(""), [revealStep, setRevealStep] = useState10(0), [fields, setFields] = useState10({
    title: "",
    description: "",
    difficulty_level: 3,
    due_date: "",
    tags: ""
  }), isSubmitting = navigation.state === "submitting", isThinking = phase === "thinking" || aiFetcher.state === "submitting";
  useEffect7(() => {
    if (aiFetcher.data?.success) {
      let d = aiFetcher.data.data;
      setFields({
        title: d.title ?? "",
        description: d.description ?? "",
        difficulty_level: d.difficulty_level ?? 3,
        due_date: d.due_date ?? "",
        tags: Array.isArray(d.tags) ? d.tags.join(", ") : d.tags ?? ""
      }), setPhase("filled"), setRevealStep(0);
    } else
      aiFetcher.data?.error && setPhase("idle");
  }, [aiFetcher.data]), useEffect7(() => {
    if (phase === "filled" && revealStep < 5) {
      let t = setTimeout(() => setRevealStep((s) => s + 1), 120);
      return () => clearTimeout(t);
    }
  }, [phase, revealStep]);
  let handleGenerate = () => {
    if (rawInput.trim().length < 5 || isThinking)
      return;
    setPhase("thinking");
    let fd = new FormData();
    fd.append("description", rawInput), aiFetcher.submit(fd, { method: "post", action: "/api/generate-task" });
  }, dm = difficultyMeta[fields.difficulty_level];
  return /* @__PURE__ */ jsxs14("div", { className: "min-h-screen bg-gray-50/30", children: [
    /* @__PURE__ */ jsx15("div", { className: "border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10", children: /* @__PURE__ */ jsx15("div", { className: "mx-auto max-w-2xl px-6 py-5", children: /* @__PURE__ */ jsxs14("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx15(
        Link8,
        {
          to: "/dashboard",
          className: "flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-all",
          children: "\u2190"
        }
      ),
      /* @__PURE__ */ jsxs14("div", { children: [
        /* @__PURE__ */ jsx15("h1", { className: "text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent", children: "New Task" }),
        /* @__PURE__ */ jsx15("p", { className: "mt-0.5 text-sm text-gray-500", children: "Describe it in plain English \u2014 AI structures it" })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs14("div", { className: "mx-auto max-w-2xl px-6 py-8 pb-28 lg:pb-8 space-y-5", children: [
      /* @__PURE__ */ jsxs14("div", { className: `rounded-2xl border bg-white shadow-sm transition-all duration-500 overflow-hidden ${phase === "filled" ? "border-violet-200 shadow-violet-100/60" : phase === "thinking" ? "border-violet-200" : "border-gray-100"}`, children: [
        /* @__PURE__ */ jsxs14("div", { className: "p-6", children: [
          /* @__PURE__ */ jsxs14("div", { className: "flex items-start gap-3 mb-4", children: [
            /* @__PURE__ */ jsx15("div", { className: `flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white text-xl shadow-md transition-all duration-300 ${phase === "filled" ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-400/30" : "bg-gradient-to-br from-violet-500 to-purple-600 shadow-violet-400/30"}`, children: phase === "filled" ? "\u2713" : "\u2728" }),
            /* @__PURE__ */ jsxs14("div", { children: [
              /* @__PURE__ */ jsx15("p", { className: "font-bold text-gray-900", children: phase === "filled" ? "AI structured your task" : "Describe your task" }),
              /* @__PURE__ */ jsx15("p", { className: "text-xs text-gray-500", children: phase === "filled" ? "Review below, edit any field, then save" : "Write freely \u2014 AI extracts title, difficulty, deadline & tags" })
            ] })
          ] }),
          /* @__PURE__ */ jsx15(
            "textarea",
            {
              ref: textareaRef,
              value: rawInput,
              onChange: (e) => setRawInput(e.target.value),
              onKeyDown: (e) => {
                e.key === "Enter" && (e.metaKey || e.ctrlKey) && handleGenerate();
              },
              disabled: isThinking,
              placeholder: `e.g. "review last quarter's sales data and prepare a 5-slide summary for the Monday board meeting"`,
              rows: 3,
              className: "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-400/20 disabled:opacity-60 transition-all"
            }
          ),
          /* @__PURE__ */ jsxs14("div", { className: "mt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsx15("span", { className: "text-xs text-gray-400", children: rawInput.length > 0 ? `${rawInput.length} chars \xB7 Ctrl+Enter to generate` : "Tip: the more detail you give, the better the result" }),
            /* @__PURE__ */ jsx15(
              "button",
              {
                type: "button",
                onClick: handleGenerate,
                disabled: rawInput.trim().length < 5 || isThinking,
                className: `flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${rawInput.trim().length < 5 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : isThinking ? "bg-violet-100 text-violet-600 cursor-wait" : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:scale-[1.03] hover:shadow-violet-500/40 active:scale-100"}`,
                children: isThinking ? /* @__PURE__ */ jsxs14(Fragment3, { children: [
                  /* @__PURE__ */ jsx15(ThinkingDots2, {}),
                  " Thinking"
                ] }) : /* @__PURE__ */ jsx15(Fragment3, { children: "\u2728 Generate with AI" })
              }
            )
          ] }),
          aiFetcher.data?.error && /* @__PURE__ */ jsx15("p", { className: "mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700", children: aiFetcher.data.error })
        ] }),
        phase === "thinking" && /* @__PURE__ */ jsx15("div", { className: "border-t border-violet-100 bg-violet-50/40 px-6 py-5", children: /* @__PURE__ */ jsx15(ThinkingPanel, {}) }),
        phase === "filled" && /* @__PURE__ */ jsxs14("div", { className: "border-t border-violet-100 bg-violet-50/30 px-6 py-5", children: [
          /* @__PURE__ */ jsxs14("div", { className: "space-y-3.5", children: [
            /* @__PURE__ */ jsx15(FieldReveal, { show: revealStep >= 1, label: "Title", children: /* @__PURE__ */ jsx15("span", { className: "text-sm font-bold text-gray-900", children: fields.title }) }),
            /* @__PURE__ */ jsx15(FieldReveal, { show: revealStep >= 2, label: "Description", children: /* @__PURE__ */ jsx15("span", { className: "text-sm text-gray-600 leading-relaxed", children: fields.description }) }),
            /* @__PURE__ */ jsx15(FieldReveal, { show: revealStep >= 3, label: "Difficulty", children: dm && /* @__PURE__ */ jsxs14("span", { className: "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700", children: [
              dm.emoji,
              " ",
              dm.label
            ] }) }),
            /* @__PURE__ */ jsx15(FieldReveal, { show: revealStep >= 4, label: "Due Date", children: /* @__PURE__ */ jsxs14("span", { className: "inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700", children: [
              "\u{1F5D3} ",
              formatDate(fields.due_date)
            ] }) }),
            /* @__PURE__ */ jsx15(FieldReveal, { show: revealStep >= 5, label: "Tags", children: /* @__PURE__ */ jsx15("div", { className: "flex flex-wrap gap-1.5", children: fields.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => /* @__PURE__ */ jsx15("span", { className: "rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700", children: tag }, tag)) }) })
          ] }),
          /* @__PURE__ */ jsx15(
            "button",
            {
              type: "button",
              onClick: () => {
                setPhase("idle"), setRevealStep(0);
              },
              className: "mt-4 text-xs text-gray-400 hover:text-violet-600 transition-colors",
              children: "\u21BA Re-generate with different description"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs14(Form7, { method: "post", className: "space-y-5", children: [
        /* @__PURE__ */ jsxs14("div", { className: "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5", children: [
          /* @__PURE__ */ jsx15("p", { className: "text-xs font-bold uppercase tracking-widest text-gray-400", children: phase === "filled" ? "Review & Edit Fields" : "Fill in Manually" }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: [
              "Task Title ",
              /* @__PURE__ */ jsx15("span", { className: "text-red-400", children: "*" })
            ] }),
            /* @__PURE__ */ jsx15(
              "input",
              {
                type: "text",
                name: "title",
                value: fields.title,
                onChange: (e) => setFields((f) => ({ ...f, title: e.target.value })),
                required: !0,
                placeholder: "What needs to be done?",
                className: "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: [
              "Description ",
              /* @__PURE__ */ jsx15("span", { className: "text-gray-400 font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsx15(
              "textarea",
              {
                name: "description",
                value: fields.description,
                onChange: (e) => setFields((f) => ({ ...f, description: e.target.value })),
                placeholder: "Add context, steps, or notes\u2026",
                rows: 3,
                className: "block w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs14("div", { children: [
            /* @__PURE__ */ jsxs14("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: [
              "Difficulty",
              dm && /* @__PURE__ */ jsxs14("span", { className: "ml-2 font-normal text-gray-500", children: [
                "\u2014 ",
                dm.emoji,
                " ",
                dm.label
              ] })
            ] }),
            /* @__PURE__ */ jsx15("input", { type: "hidden", name: "difficulty_level", value: fields.difficulty_level }),
            /* @__PURE__ */ jsx15("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((n) => {
              let meta15 = difficultyMeta[n], active = fields.difficulty_level === n;
              return /* @__PURE__ */ jsxs14(
                "button",
                {
                  type: "button",
                  onClick: () => setFields((f) => ({ ...f, difficulty_level: n })),
                  title: meta15.label,
                  className: `flex-1 flex flex-col items-center gap-1 rounded-xl py-3 text-sm transition-all duration-200 ${active ? `bg-gradient-to-b ${meta15.color} text-white shadow-md scale-105` : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`,
                  children: [
                    /* @__PURE__ */ jsx15("span", { className: "text-lg", children: meta15.emoji }),
                    /* @__PURE__ */ jsx15("span", { className: "text-xs font-bold", children: n })
                  ]
                },
                n
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxs14("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs14("div", { children: [
              /* @__PURE__ */ jsx15("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: "Due Date" }),
              /* @__PURE__ */ jsx15(
                "input",
                {
                  type: "date",
                  name: "due_date",
                  value: fields.due_date,
                  onChange: (e) => setFields((f) => ({ ...f, due_date: e.target.value })),
                  className: "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs14("div", { children: [
              /* @__PURE__ */ jsxs14("label", { className: "block text-sm font-semibold text-gray-700 mb-1.5", children: [
                "Tags ",
                /* @__PURE__ */ jsx15("span", { className: "text-gray-400 font-normal", children: "comma-separated" })
              ] }),
              /* @__PURE__ */ jsx15(
                "input",
                {
                  type: "text",
                  name: "tags",
                  value: fields.tags,
                  onChange: (e) => setFields((f) => ({ ...f, tags: e.target.value })),
                  placeholder: "work, urgent, planning\u2026",
                  className: "block w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx15(
          "button",
          {
            type: "submit",
            disabled: !fields.title.trim() || isSubmitting,
            className: "w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed transition-all duration-200",
            children: isSubmitting ? /* @__PURE__ */ jsxs14("span", { className: "flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsxs14("svg", { className: "h-5 w-5 animate-spin", viewBox: "0 0 24 24", fill: "none", children: [
                /* @__PURE__ */ jsx15("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                /* @__PURE__ */ jsx15("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" })
              ] }),
              "Creating task\u2026"
            ] }) : "\u2713 Create Task"
          }
        )
      ] })
    ] })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta14
});
import { Link as Link9 } from "@remix-run/react";
import { jsx as jsx16, jsxs as jsxs15 } from "react/jsx-runtime";
var meta14 = () => [
  { title: "Goal Tracker \u2014 Master Your Goals with Science" },
  {
    name: "description",
    content: "Psychology-driven goal tracking with energy-emotion insights, SMART frameworks, and gamification to supercharge your productivity."
  }
];
function Index() {
  return /* @__PURE__ */ jsxs15("div", { className: "min-h-screen bg-white", children: [
    /* @__PURE__ */ jsx16("nav", { className: "fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl", children: /* @__PURE__ */ jsxs15("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4", children: [
      /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx16("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm", children: "GT" }),
        /* @__PURE__ */ jsx16("span", { className: "text-xl font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "hidden md:flex items-center gap-8", children: [
        /* @__PURE__ */ jsx16("a", { href: "#features", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "Features" }),
        /* @__PURE__ */ jsx16("a", { href: "#how-it-works", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "How It Works" }),
        /* @__PURE__ */ jsx16("a", { href: "#stats", className: "text-sm font-medium text-gray-600 hover:text-gray-900 transition", children: "Results" })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx16(
          Link9,
          {
            to: "/auth/login",
            className: "text-sm font-semibold text-gray-700 hover:text-gray-900 transition px-4 py-2",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsx16(
          Link9,
          {
            to: "/auth/register",
            className: "rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-200",
            children: "Get Started Free"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs15("section", { className: "relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32", children: [
      /* @__PURE__ */ jsxs15("div", { className: "absolute inset-0 -z-10", children: [
        /* @__PURE__ */ jsx16("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/60 blur-3xl" }),
        /* @__PURE__ */ jsx16("div", { className: "absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-purple-100/40 to-pink-100/40 blur-3xl" }),
        /* @__PURE__ */ jsx16("div", { className: "absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-emerald-100/30 to-cyan-100/30 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "mx-auto max-w-7xl px-6 text-center", children: [
        /* @__PURE__ */ jsxs15("div", { className: "inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-8", children: [
          /* @__PURE__ */ jsxs15("span", { className: "relative flex h-2 w-2", children: [
            /* @__PURE__ */ jsx16("span", { className: "absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" }),
            /* @__PURE__ */ jsx16("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-blue-600" })
          ] }),
          "Psychology-Powered Productivity"
        ] }),
        /* @__PURE__ */ jsxs15("h1", { className: "mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 md:text-7xl", children: [
          "Goals that actually",
          /* @__PURE__ */ jsx16("span", { className: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent", children: " get done" })
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed", children: "Stop setting goals that fade away. Our science-backed system uses energy-emotion tracking, SMART frameworks, and gamification to turn your ambitions into achievements." }),
        /* @__PURE__ */ jsxs15("div", { className: "mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center", children: [
          /* @__PURE__ */ jsxs15(
            Link9,
            {
              to: "/auth/register",
              className: "group relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300",
              children: [
                "Start Tracking Free",
                /* @__PURE__ */ jsx16("svg", { className: "h-5 w-5 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx16("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx16(
            Link9,
            {
              to: "/auth/login",
              className: "inline-flex items-center gap-2 rounded-full border-2 border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200",
              children: "Sign In"
            }
          )
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "mt-4 text-sm text-gray-500", children: "No credit card required \xB7 Free forever for individuals" })
      ] })
    ] }),
    /* @__PURE__ */ jsx16("section", { id: "features", className: "py-24 bg-gray-50/50", children: /* @__PURE__ */ jsxs15("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs15("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx16("p", { className: "text-sm font-semibold uppercase tracking-widest text-blue-600", children: "Features" }),
        /* @__PURE__ */ jsxs15("h2", { className: "mt-3 text-4xl font-bold text-gray-900 md:text-5xl", children: [
          "Everything you need to ",
          /* @__PURE__ */ jsx16("span", { className: "text-blue-600", children: "succeed" })
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "mx-auto mt-4 max-w-2xl text-lg text-gray-600", children: "Built on proven psychological principles to help you form better habits and achieve more." })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-2xl shadow-lg shadow-orange-500/20", children: "\u26A1" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Energy & Emotion Tracking" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Map your energy and mood patterns throughout the day. Schedule tasks when you're at peak performance for maximum output." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg shadow-blue-500/20", children: "\u{1F3AF}" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "SMART Goal Framework" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Break down big ambitions into Specific, Measurable, Achievable, Relevant, and Time-bound milestones that drive real progress." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-white text-2xl shadow-lg shadow-emerald-500/20", children: "\u{1F3C6}" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Gamification & Rewards" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Earn points, unlock achievements, and climb leaderboards. Scientifically designed rewards that reinforce positive habits." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 text-white text-2xl shadow-lg shadow-purple-500/20", children: "\u{1F9E0}" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Psychology Insights" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Get personalized insights into your productivity patterns, procrastination triggers, and optimal work windows." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 text-white text-2xl shadow-lg shadow-rose-500/20", children: "\u{1F4CA}" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Rich Analytics" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Visualize your progress with beautiful charts. Track completion rates, streak patterns, and mood correlations over time." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "group rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300", children: [
          /* @__PURE__ */ jsx16("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-2xl shadow-lg shadow-cyan-500/20", children: "\u{1F525}" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Streak Building" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600 leading-relaxed", children: "Build momentum with daily streaks. Our algorithm adapts difficulty to keep you in the flow state \u2014 not too easy, not too hard." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx16("section", { id: "how-it-works", className: "py-24", children: /* @__PURE__ */ jsxs15("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs15("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx16("p", { className: "text-sm font-semibold uppercase tracking-widest text-blue-600", children: "How it works" }),
        /* @__PURE__ */ jsxs15("h2", { className: "mt-3 text-4xl font-bold text-gray-900 md:text-5xl", children: [
          "Three steps to ",
          /* @__PURE__ */ jsx16("span", { className: "text-blue-600", children: "better habits" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-1 gap-12 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs15("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx16("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20", children: "1" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Set Your Goals" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600", children: "Define long-term visions and break them into actionable short-term goals using our SMART framework wizard." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx16("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-indigo-500/20", children: "2" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Track Daily" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600", children: "Complete daily tasks, log your mood and energy, and watch your streaks grow. The app learns your optimal schedule." })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "relative text-center", children: [
          /* @__PURE__ */ jsx16("div", { className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white shadow-xl shadow-purple-500/20", children: "3" }),
          /* @__PURE__ */ jsx16("h3", { className: "mt-6 text-xl font-bold text-gray-900", children: "Level Up" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-3 text-gray-600", children: "Earn rewards, unlock achievements, and see your productivity soar with data-driven insights and personalized coaching." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx16("section", { id: "stats", className: "py-24 bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-white", children: /* @__PURE__ */ jsxs15("div", { className: "mx-auto max-w-7xl px-6", children: [
      /* @__PURE__ */ jsxs15("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsxs15("h2", { className: "text-4xl font-bold md:text-5xl", children: [
          "Built for ",
          /* @__PURE__ */ jsx16("span", { className: "bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent", children: "results" })
        ] }),
        /* @__PURE__ */ jsx16("p", { className: "mt-4 text-lg text-blue-200/70", children: "The science of habit formation, powered by technology." })
      ] }),
      /* @__PURE__ */ jsxs15("div", { className: "grid grid-cols-2 gap-8 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxs15("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx16("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent", children: "73%" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-2 text-sm text-blue-200/60", children: "Higher completion rate" })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx16("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent", children: "2.4x" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-2 text-sm text-blue-200/60", children: "Faster goal achievement" })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx16("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent", children: "89%" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-2 text-sm text-blue-200/60", children: "Users maintain streaks" })
        ] }),
        /* @__PURE__ */ jsxs15("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx16("p", { className: "text-5xl font-extrabold bg-gradient-to-r from-amber-400 to-orange-300 bg-clip-text text-transparent", children: "47d" }),
          /* @__PURE__ */ jsx16("p", { className: "mt-2 text-sm text-blue-200/60", children: "Average streak length" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx16("section", { className: "py-24", children: /* @__PURE__ */ jsxs15("div", { className: "mx-auto max-w-4xl px-6 text-center", children: [
      /* @__PURE__ */ jsxs15("h2", { className: "text-4xl font-bold text-gray-900 md:text-5xl", children: [
        "Ready to achieve ",
        /* @__PURE__ */ jsx16("span", { className: "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent", children: "your goals" }),
        "?"
      ] }),
      /* @__PURE__ */ jsx16("p", { className: "mx-auto mt-6 max-w-2xl text-lg text-gray-600", children: "Join thousands of high achievers who use Goal Tracker to build better habits, track their progress, and unlock their potential." }),
      /* @__PURE__ */ jsx16("div", { className: "mt-10", children: /* @__PURE__ */ jsxs15(
        Link9,
        {
          to: "/auth/register",
          className: "group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300",
          children: [
            "Get Started \u2014 It's Free",
            /* @__PURE__ */ jsx16("svg", { className: "h-5 w-5 transition-transform group-hover:translate-x-1", fill: "none", viewBox: "0 0 24 24", strokeWidth: 2, stroke: "currentColor", children: /* @__PURE__ */ jsx16("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" }) })
          ]
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx16("footer", { className: "border-t border-gray-100 bg-gray-50 py-12", children: /* @__PURE__ */ jsx16("div", { className: "mx-auto max-w-7xl px-6", children: /* @__PURE__ */ jsxs15("div", { className: "flex flex-col items-center justify-between gap-6 md:flex-row", children: [
      /* @__PURE__ */ jsxs15("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx16("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-xs", children: "GT" }),
        /* @__PURE__ */ jsx16("span", { className: "text-lg font-bold text-gray-900", children: "Goal Tracker" })
      ] }),
      /* @__PURE__ */ jsxs15("p", { className: "text-sm text-gray-500", children: [
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
import { jsx as jsx17 } from "react/jsx-runtime";
function AuthLayout() {
  return /* @__PURE__ */ jsx17(Outlet3, {});
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-RJQYT24D.js", imports: ["/build/_shared/chunk-AOAPHHAE.js", "/build/_shared/chunk-2QEWK57A.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-3I4S7LRH.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-SVOKK25M.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/analytics._index": { id: "routes/analytics._index", parentId: "root", path: "analytics", index: !0, caseSensitive: void 0, module: "/build/routes/analytics._index-RPUKT4FZ.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.daily-brief": { id: "routes/api.daily-brief", parentId: "root", path: "api/daily-brief", index: void 0, caseSensitive: void 0, module: "/build/routes/api.daily-brief-DEQSSRGU.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.generate-goal": { id: "routes/api.generate-goal", parentId: "root", path: "api/generate-goal", index: void 0, caseSensitive: void 0, module: "/build/routes/api.generate-goal-PMPLF5CY.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.generate-goal-tasks": { id: "routes/api.generate-goal-tasks", parentId: "root", path: "api/generate-goal-tasks", index: void 0, caseSensitive: void 0, module: "/build/routes/api.generate-goal-tasks-YQZWNWCQ.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/api.generate-task": { id: "routes/api.generate-task", parentId: "root", path: "api/generate-task", index: void 0, caseSensitive: void 0, module: "/build/routes/api.generate-task-FH732ANY.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-75I6IVAL.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.login": { id: "routes/auth.login", parentId: "routes/auth", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.login-TXYHVVEK.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.logout": { id: "routes/auth.logout", parentId: "routes/auth", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.logout-RT7NNDUM.js", imports: void 0, hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.register": { id: "routes/auth.register", parentId: "routes/auth", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.register-OAHWLT7K.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard": { id: "routes/dashboard", parentId: "root", path: "dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/dashboard-GSZCCETF.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "routes/dashboard", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-HLBWAJJL.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/gamification._index": { id: "routes/gamification._index", parentId: "root", path: "gamification", index: !0, caseSensitive: void 0, module: "/build/routes/gamification._index-OPVFVPYJ.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals._index": { id: "routes/goals._index", parentId: "root", path: "goals", index: !0, caseSensitive: void 0, module: "/build/routes/goals._index-SNXWHFIP.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.long-term.$id": { id: "routes/goals.long-term.$id", parentId: "root", path: "goals/long-term/:id", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.long-term.$id-WO7D2QUD.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.long-term.new": { id: "routes/goals.long-term.new", parentId: "root", path: "goals/long-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.long-term.new-C7ENCHCK.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.short-term.$id": { id: "routes/goals.short-term.$id", parentId: "root", path: "goals/short-term/:id", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.short-term.$id-FR5DTBNR.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.short-term.new": { id: "routes/goals.short-term.new", parentId: "root", path: "goals/short-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.short-term.new-6M4GRSID.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/tasks.complete.$taskId": { id: "routes/tasks.complete.$taskId", parentId: "root", path: "tasks/complete/:taskId", index: void 0, caseSensitive: void 0, module: "/build/routes/tasks.complete.$taskId-3IUJE7KO.js", imports: void 0, hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/tasks.new": { id: "routes/tasks.new", parentId: "root", path: "tasks/new", index: void 0, caseSensitive: void 0, module: "/build/routes/tasks.new-KF2X4BVB.js", imports: ["/build/_shared/chunk-64YSLDFA.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "1ba0f8f3", hmr: void 0, url: "/build/manifest-1BA0F8F3.js" };

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
  "routes/api.generate-goal-tasks": {
    id: "routes/api.generate-goal-tasks",
    parentId: "root",
    path: "api/generate-goal-tasks",
    index: void 0,
    caseSensitive: void 0,
    module: api_generate_goal_tasks_exports
  },
  "routes/tasks.complete.$taskId": {
    id: "routes/tasks.complete.$taskId",
    parentId: "root",
    path: "tasks/complete/:taskId",
    index: void 0,
    caseSensitive: void 0,
    module: tasks_complete_taskId_exports
  },
  "routes/goals.short-term.$id": {
    id: "routes/goals.short-term.$id",
    parentId: "root",
    path: "goals/short-term/:id",
    index: void 0,
    caseSensitive: void 0,
    module: goals_short_term_id_exports
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
  "routes/goals.long-term.$id": {
    id: "routes/goals.long-term.$id",
    parentId: "root",
    path: "goals/long-term/:id",
    index: void 0,
    caseSensitive: void 0,
    module: goals_long_term_id_exports
  },
  "routes/goals.long-term.new": {
    id: "routes/goals.long-term.new",
    parentId: "root",
    path: "goals/long-term/new",
    index: void 0,
    caseSensitive: void 0,
    module: goals_long_term_new_exports
  },
  "routes/api.generate-goal": {
    id: "routes/api.generate-goal",
    parentId: "root",
    path: "api/generate-goal",
    index: void 0,
    caseSensitive: void 0,
    module: api_generate_goal_exports
  },
  "routes/api.generate-task": {
    id: "routes/api.generate-task",
    parentId: "root",
    path: "api/generate-task",
    index: void 0,
    caseSensitive: void 0,
    module: api_generate_task_exports
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
  "routes/api.daily-brief": {
    id: "routes/api.daily-brief",
    parentId: "root",
    path: "api/daily-brief",
    index: void 0,
    caseSensitive: void 0,
    module: api_daily_brief_exports
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
  "routes/tasks.new": {
    id: "routes/tasks.new",
    parentId: "root",
    path: "tasks/new",
    index: void 0,
    caseSensitive: void 0,
    module: tasks_new_exports
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
