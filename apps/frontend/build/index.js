var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
};

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
import { jsxDEV } from "react/jsx-dev-runtime";
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
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 41,
          columnNumber: 7
        },
        this
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
      /* @__PURE__ */ jsxDEV(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        },
        void 0,
        !1,
        {
          fileName: "app/entry.server.tsx",
          lineNumber: 88,
          columnNumber: 7
        },
        this
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

// app/lib/db.server.ts
import mongoose from "mongoose";
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/goal-tracker", isConnected = !1, connectDB = async () => {
  if (!isConnected)
    try {
      isConnected = (await mongoose.connect(MONGODB_URI)).connections[0].readyState === 1, console.log("MongoDB Connected");
    } catch (error) {
      console.error("MongoDB connection error:", error), process.exit(1);
    }
};

// app/root.tsx
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var loader = async () => (await connectDB(), null), links = () => [], meta = () => [
  { charset: "utf-8" },
  { name: "viewport", content: "width=device-width,initial-scale=1" },
  { title: "Goal Tracker - Psychological Goal Management" },
  {
    name: "description",
    content: "Advanced goal tracking with energy-emotion tracking, habit formation, and gamification."
  }
];
function Root() {
  return /* @__PURE__ */ jsxDEV2("html", { lang: "en", children: [
    /* @__PURE__ */ jsxDEV2("head", { children: [
      /* @__PURE__ */ jsxDEV2(Meta, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 34,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Links, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 35,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 33,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV2("body", { className: "bg-background text-foreground", children: [
      /* @__PURE__ */ jsxDEV2(Outlet, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(ScrollRestoration, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 39,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV2(Scripts, {}, void 0, !1, {
        fileName: "app/root.tsx",
        lineNumber: 40,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/root.tsx",
      lineNumber: 37,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/root.tsx",
    lineNumber: 32,
    columnNumber: 5
  }, this);
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

// app/services/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";
var { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: !0,
    maxAge: 60 * 60 * 24 * 7,
    // 7 days
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"],
    secure: !1
  }
});

// app/models/User.ts
import mongoose2 from "mongoose";
var userSchema = new mongoose2.Schema(
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
);
userSchema.index({ email: 1 });
var User = mongoose2.model("User", userSchema);

// app/services/auth.server.ts
import { redirect } from "@remix-run/node";
async function getUserId(request) {
  return (await getSession(request.headers.get("Cookie"))).get("userId");
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request.headers.get("Cookie"));
  return session.set("userId", userId), redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}

// app/models/Tasks.ts
import mongoose3 from "mongoose";
var dailyTaskSchema = new mongoose3.Schema(
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
var DailyTask = mongoose3.model("DailyTask", dailyTaskSchema), taskCompletionSchema = new mongoose3.Schema(
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
var TaskCompletion = mongoose3.model("TaskCompletion", taskCompletionSchema);

// app/routes/tasks.complete.$taskId.tsx
import { redirect as redirect2 } from "@remix-run/node";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
var meta2 = () => [
  { title: "Complete Task - Goal Tracker" }
], action = async ({ request, params }) => {
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId(request), formData = await request.formData(), taskId = params.taskId;
  try {
    let task = await DailyTask.findOne({ _id: taskId, user_id: userId });
    if (!task)
      return { error: "Task not found" };
    if (task.status === "completed")
      return { error: "Task already completed" };
    let mood_before = parseInt(formData.get("mood_before")), mood_after = parseInt(formData.get("mood_after")), energy_before = parseInt(formData.get("energy_before")), energy_after = parseInt(formData.get("energy_after")), effort_rating = parseInt(formData.get("effort_rating")), completion_time_minutes = parseInt(formData.get("completion_time_minutes")), flow_state_detected = formData.get("flow_state_detected") === "on", moodImprovement = mood_after - mood_before, energyChange = energy_after - energy_before, points_earned = Math.round(
      (30 * effort_rating + moodImprovement * 10 + energyChange * 5 + (flow_state_detected ? 50 : 0)) / 10
    );
    task.status = "completed", task.completed_at = /* @__PURE__ */ new Date(), task.actual_duration = completion_time_minutes, await task.save();
    let user = await User.findById(userId);
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
  return /* @__PURE__ */ jsxDEV3("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ jsxDEV3("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV3("div", { className: "mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV3("h1", { className: "text-2xl font-bold text-gray-900", children: "Complete Task" }, void 0, !1, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 99,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("p", { className: "mt-1 text-sm text-gray-600", children: "Track how you felt during this task" }, void 0, !1, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 98,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 97,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV3("main", { className: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV3(Form, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your mood before starting? ",
          moodBefore,
          "/10"
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 108,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "range",
              name: "mood_before",
              min: "1",
              max: "10",
              value: moodBefore,
              onChange: (e) => setMoodBefore(parseInt(e.target.value)),
              className: "w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 112,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV3("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F622} Terrible" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 122,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F610} Neutral" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 123,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F604} Amazing" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 124,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 121,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 111,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 107,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your mood now? ",
          moodAfter,
          "/10"
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 131,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "range",
              name: "mood_after",
              min: "1",
              max: "10",
              value: moodAfter,
              onChange: (e) => setMoodAfter(parseInt(e.target.value)),
              className: "w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 135,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV3("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F622} Terrible" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 145,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F610} Neutral" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 146,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1F604} Amazing" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 147,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 144,
            columnNumber: 15
          }, this),
          moodImprovement !== 0 && /* @__PURE__ */ jsxDEV3("p", { className: "mt-2 text-sm font-medium text-green-600", children: [
            moodImprovement > 0 ? "+" : "",
            moodImprovement,
            " mood change"
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 150,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 134,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 130,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your energy before? ",
          energyBefore,
          "/10"
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "range",
              name: "energy_before",
              min: "1",
              max: "10",
              value: energyBefore,
              onChange: (e) => setEnergyBefore(parseInt(e.target.value)),
              className: "w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 163,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV3("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1FAAB} Exhausted" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 173,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u26A1 Energized" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 174,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 172,
            columnNumber: 15
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 162,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 158,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your energy now? ",
          energyAfter,
          "/10"
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 181,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV3(
            "input",
            {
              type: "range",
              name: "energy_after",
              min: "1",
              max: "10",
              value: energyAfter,
              onChange: (e) => setEnergyAfter(parseInt(e.target.value)),
              className: "w-full"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 185,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV3("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ jsxDEV3("span", { children: "\u{1FAAB} Exhausted" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 195,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV3("span", { children: "\u26A1 Energized" }, void 0, !1, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 196,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 194,
            columnNumber: 15
          }, this),
          energyChange !== 0 && /* @__PURE__ */ jsxDEV3("p", { className: "mt-2 text-sm font-medium text-blue-600", children: [
            energyChange > 0 ? "+" : "",
            energyChange,
            " energy change"
          ] }, void 0, !0, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 199,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 184,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 180,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How much effort did this task require? ",
          effort,
          "/5"
        ] }, void 0, !0, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3("div", { className: "mt-4 flex gap-2", children: [1, 2, 3, 4, 5].map((level) => /* @__PURE__ */ jsxDEV3(
          "button",
          {
            type: "button",
            onClick: () => setEffort(level),
            className: `flex-1 rounded-md py-2 font-medium transition ${effort === level ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`,
            children: ["\u{1F7E2}", "\u{1F7E1}", "\u{1F7E0}", "\u{1F534}", "\u{1F534}"][level - 1]
          },
          level,
          !1,
          {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 213,
            columnNumber: 17
          },
          this
        )) }, void 0, !1, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 211,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 207,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { children: [
        /* @__PURE__ */ jsxDEV3("label", { htmlFor: "completion_time_minutes", className: "block text-sm font-medium text-gray-700", children: "How long did it take? (minutes)" }, void 0, !1, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 230,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV3(
          "input",
          {
            type: "number",
            id: "completion_time_minutes",
            name: "completion_time_minutes",
            value: time,
            onChange: (e) => setTime(e.target.value),
            min: "1",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 233,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 229,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "flex items-center gap-3 rounded-lg bg-blue-50 p-4", children: [
        /* @__PURE__ */ jsxDEV3(
          "input",
          {
            type: "checkbox",
            id: "flow_state_detected",
            name: "flow_state_detected",
            checked: flowState,
            onChange: (e) => setFlowState(e.target.checked),
            className: "h-4 w-4 rounded border-gray-300"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 246,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV3("label", { htmlFor: "flow_state_detected", className: "flex-1 text-sm font-medium text-gray-700", children: "I was in a flow state (fully immersed and focused)" }, void 0, !1, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 254,
          columnNumber: 13
        }, this),
        flowState && /* @__PURE__ */ jsxDEV3("span", { className: "text-xl", children: "\u{1F30A}" }, void 0, !1, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 257,
          columnNumber: 27
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 245,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: /* @__PURE__ */ jsxDEV3("p", { className: "text-sm text-green-800", children: [
        "You'll earn approximately ",
        /* @__PURE__ */ jsxDEV3("span", { className: "font-bold text-green-900", children: estimatedPoints }, void 0, !1, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 263,
          columnNumber: 41
        }, this),
        " points for completing this task!"
      ] }, void 0, !0, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 262,
        columnNumber: 13
      }, this) }, void 0, !1, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 261,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV3(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg",
          children: isLoading ? "Recording..." : "\u2713 Mark as Complete"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 268,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 105,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 104,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/tasks.complete.$taskId.tsx",
    lineNumber: 96,
    columnNumber: 5
  }, this);
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

// app/models/Goals.ts
import mongoose4 from "mongoose";
var longTermGoalSchema = new mongoose4.Schema(
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
var LongTermGoal = mongoose4.model("LongTermGoal", longTermGoalSchema), shortTermGoalSchema = new mongoose4.Schema(
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
var ShortTermGoal = mongoose4.model("ShortTermGoal", shortTermGoalSchema);

// app/routes/goals.short-term.new.tsx
import { redirect as redirect3 } from "@remix-run/node";
import { jsxDEV as jsxDEV4 } from "react/jsx-dev-runtime";
var meta3 = () => [
  { title: "Create Short-term Goal - Goal Tracker" }
], action2 = async ({ request }) => {
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), start_date = formData.get("start_date"), end_date = formData.get("end_date"), priority = formData.get("priority"), long_term_goal_id = formData.get("long_term_goal_id");
  if (!title || !description || !start_date || !end_date)
    return { error: "Missing required fields" };
  let milestones = [];
  for (let i = 0; i < 5; i++) {
    let milestone = formData.get(`milestone_${i}`);
    milestone && typeof milestone == "string" && milestone.trim() !== "" && milestones.push({ title: milestone, completed: !1 });
  }
  try {
    return await new ShortTermGoal({
      user_id: userId,
      title,
      description,
      start_date: new Date(start_date),
      end_date: new Date(end_date),
      priority: priority || "medium",
      long_term_goal_id: long_term_goal_id || void 0,
      milestones,
      status: "in_progress"
    }).save(), redirect3("/goals");
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
  return /* @__PURE__ */ jsxDEV4("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV4("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV4("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV4("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Short-term Goal" }, void 0, !1, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 87,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("p", { className: "mt-1 text-sm text-gray-600", children: "Break down your long-term vision into actionable milestones" }, void 0, !1, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 88,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 86,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 85,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV4("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV4(Form2, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6", children: [
      /* @__PURE__ */ jsxDEV4("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxDEV4("div", { children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }, void 0, !1, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 96,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "input",
            {
              type: "text",
              id: "title",
              name: "title",
              required: !0,
              placeholder: "e.g., Complete Spanish Level 1 Course",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 99,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 95,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }, void 0, !1, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 110,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "select",
            {
              id: "priority",
              name: "priority",
              defaultValue: "medium",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              children: [
                /* @__PURE__ */ jsxDEV4("option", { value: "low", children: "Low" }, void 0, !1, {
                  fileName: "app/routes/goals.short-term.new.tsx",
                  lineNumber: 119,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV4("option", { value: "medium", children: "Medium" }, void 0, !1, {
                  fileName: "app/routes/goals.short-term.new.tsx",
                  lineNumber: 120,
                  columnNumber: 17
                }, this),
                /* @__PURE__ */ jsxDEV4("option", { value: "high", children: "High" }, void 0, !1, {
                  fileName: "app/routes/goals.short-term.new.tsx",
                  lineNumber: 121,
                  columnNumber: 17
                }, this)
              ]
            },
            void 0,
            !0,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 113,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 109,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 94,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { children: [
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }, void 0, !1, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 127,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4(
          "textarea",
          {
            id: "description",
            name: "description",
            required: !0,
            rows: 4,
            placeholder: "What are you committing to achieve?",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 130,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 126,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxDEV4("div", { children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "start_date", className: "block text-sm font-medium text-gray-700", children: "Start Date *" }, void 0, !1, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 142,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "input",
            {
              type: "date",
              id: "start_date",
              name: "start_date",
              required: !0,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 145,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 141,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { children: [
          /* @__PURE__ */ jsxDEV4("label", { htmlFor: "end_date", className: "block text-sm font-medium text-gray-700", children: "End Date *" }, void 0, !1, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 155,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "input",
            {
              type: "date",
              id: "end_date",
              name: "end_date",
              required: !0,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 158,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 154,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 140,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { children: [
        /* @__PURE__ */ jsxDEV4("label", { htmlFor: "long_term_goal_id", className: "block text-sm font-medium text-gray-700", children: "Link to Long-term Goal (Optional)" }, void 0, !1, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 169,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4(
          "select",
          {
            id: "long_term_goal_id",
            name: "long_term_goal_id",
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            children: [
              /* @__PURE__ */ jsxDEV4("option", { value: "", children: "No long-term goal" }, void 0, !1, {
                fileName: "app/routes/goals.short-term.new.tsx",
                lineNumber: 177,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV4("option", { value: "goal-1", children: "Learn Spanish fluently" }, void 0, !1, {
                fileName: "app/routes/goals.short-term.new.tsx",
                lineNumber: 178,
                columnNumber: 15
              }, this),
              /* @__PURE__ */ jsxDEV4("option", { value: "goal-2", children: "Build a successful business" }, void 0, !1, {
                fileName: "app/routes/goals.short-term.new.tsx",
                lineNumber: 179,
                columnNumber: 15
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 172,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 168,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { children: [
        /* @__PURE__ */ jsxDEV4("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV4("label", { className: "block text-sm font-medium text-gray-700", children: "Milestones" }, void 0, !1, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 185,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV4(
            "button",
            {
              type: "button",
              onClick: addMilestone,
              disabled: milestones.length >= 5,
              className: "text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400",
              children: "Add Milestone"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 186,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 184,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV4("div", { className: "mt-4 space-y-3", children: milestones.map((milestone, index) => /* @__PURE__ */ jsxDEV4("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxDEV4(
            "input",
            {
              type: "text",
              name: `milestone_${index}`,
              value: milestone,
              onChange: (e) => updateMilestone(index, e.target.value),
              placeholder: `Milestone ${index + 1}`,
              className: "flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 199,
              columnNumber: 19
            },
            this
          ),
          /* @__PURE__ */ jsxDEV4(
            "button",
            {
              type: "button",
              onClick: () => removeMilestone(index),
              className: "rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 transition",
              children: "Remove"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 207,
              columnNumber: 19
            },
            this
          )
        ] }, index, !0, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 198,
          columnNumber: 17
        }, this)) }, void 0, !1, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 196,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 183,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV4("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxDEV4(
          "button",
          {
            type: "button",
            onClick: () => window.history.back(),
            className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition",
            children: "Cancel"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 220,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV4(
          "button",
          {
            type: "submit",
            disabled: isLoading,
            className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
            children: isLoading ? "Creating..." : "Create Goal"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 227,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 219,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 93,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 92,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/goals.short-term.new.tsx",
    lineNumber: 84,
    columnNumber: 5
  }, this);
}

// app/routes/gamification._index.tsx
var gamification_index_exports = {};
__export(gamification_index_exports, {
  default: () => GamificationPage,
  loader: () => loader2,
  meta: () => meta4
});
import { useLoaderData } from "@remix-run/react";
import { jsxDEV as jsxDEV5 } from "react/jsx-dev-runtime";
var meta4 = () => [
  { title: "Gamification - Goal Tracker" }
], loader2 = async ({ request }) => {
  let userId = await requireUserId(request), user = await User.findById(userId).lean();
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
  return /* @__PURE__ */ jsxDEV5("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ jsxDEV5("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV5("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV5("h1", { className: "text-2xl font-bold text-gray-900", children: "Gamification" }, void 0, !1, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 117,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-sm text-gray-600", children: "Earn points, unlock achievements, and climb the leaderboard" }, void 0, !1, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 118,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 116,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 115,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV5("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV5("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxDEV5("div", { className: `rounded-lg ${currentLevel.color} p-6 text-white shadow-lg`, children: [
          /* @__PURE__ */ jsxDEV5("p", { className: "text-sm font-medium opacity-90", children: "Current Level" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 127,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-4xl font-bold", children: user.current_level }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 128,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-sm opacity-90", children: currentLevel.name }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 129,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 126,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV5("p", { className: "text-sm font-medium text-gray-600", children: "Total Points" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 134,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-4xl font-bold text-blue-600", children: user.total_points }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-xs text-gray-500", children: [
            user.experience_percentage,
            "% to next level"
          ] }, void 0, !0, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 136,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 133,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV5("p", { className: "text-sm font-medium text-gray-600", children: "Current Streak" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 141,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-4xl font-bold text-orange-600", children: user.streak_count }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 142,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-xs text-gray-500", children: "days" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 143,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 140,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV5("p", { className: "text-sm font-medium text-gray-600", children: "Best Streak" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 148,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-4xl font-bold text-green-600", children: user.streak_best }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 149,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-xs text-gray-500", children: "days" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 150,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 147,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 124,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "mt-8 rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-lg font-semibold text-gray-900", children: "Experience Progress" }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 156,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "mt-4", children: [
          /* @__PURE__ */ jsxDEV5("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxDEV5("span", { className: "text-sm text-gray-600", children: [
              user.current_level,
              " \u2192 ",
              user.current_level + 1
            ] }, void 0, !0, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 159,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV5("span", { className: "text-sm font-medium text-gray-900", children: [
              user.experience_percentage,
              "%"
            ] }, void 0, !0, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 162,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 158,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("div", { className: "mt-2 h-4 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV5(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
              style: { width: `${user.experience_percentage}%` }
            },
            void 0,
            !1,
            {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 165,
              columnNumber: 15
            },
            this
          ) }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 164,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 157,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 155,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-bold text-gray-900", children: "Achievements" }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 175,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-sm text-gray-600", children: "Unlock achievements by reaching milestones" }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 176,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: achievements.map((achievement) => /* @__PURE__ */ jsxDEV5(
          "div",
          {
            className: `rounded-lg border p-4 transition ${achievement.unlocked ? "bg-white border-gray-200 shadow-sm hover:shadow-md" : "bg-gray-50 border-gray-200 opacity-60"}`,
            children: [
              /* @__PURE__ */ jsxDEV5("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxDEV5("div", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsxDEV5("span", { className: "text-3xl", children: achievement.icon }, void 0, !1, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 189,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV5("div", { children: [
                    /* @__PURE__ */ jsxDEV5("h3", { className: "font-semibold text-gray-900", children: achievement.title }, void 0, !1, {
                      fileName: "app/routes/gamification._index.tsx",
                      lineNumber: 191,
                      columnNumber: 23
                    }, this),
                    /* @__PURE__ */ jsxDEV5("p", { className: "text-xs text-gray-600", children: achievement.description }, void 0, !1, {
                      fileName: "app/routes/gamification._index.tsx",
                      lineNumber: 192,
                      columnNumber: 23
                    }, this)
                  ] }, void 0, !0, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 190,
                    columnNumber: 21
                  }, this)
                ] }, void 0, !0, {
                  fileName: "app/routes/gamification._index.tsx",
                  lineNumber: 188,
                  columnNumber: 19
                }, this),
                achievement.unlocked && /* @__PURE__ */ jsxDEV5("span", { className: "inline-block h-6 w-6 rounded-full bg-green-100 text-center text-sm text-green-700", children: "\u2713" }, void 0, !1, {
                  fileName: "app/routes/gamification._index.tsx",
                  lineNumber: 196,
                  columnNumber: 21
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 187,
                columnNumber: 17
              }, this),
              achievement.unlocked && achievement.date && /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-xs text-gray-500", children: [
                "Unlocked ",
                new Date(achievement.date).toLocaleDateString()
              ] }, void 0, !0, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 202,
                columnNumber: 19
              }, this)
            ]
          },
          achievement.id,
          !0,
          {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 180,
            columnNumber: 15
          },
          this
        )) }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 178,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 174,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxDEV5("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-bold text-gray-900", children: "Global Leaderboard" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 214,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("div", { className: "mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxDEV5("table", { className: "w-full", children: [
            /* @__PURE__ */ jsxDEV5("thead", { className: "border-b border-gray-200 bg-gray-50", children: /* @__PURE__ */ jsxDEV5("tr", { children: [
              /* @__PURE__ */ jsxDEV5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Rank" }, void 0, !1, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 219,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "User" }, void 0, !1, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 220,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Points" }, void 0, !1, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 221,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV5("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Streak" }, void 0, !1, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 222,
                columnNumber: 21
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 218,
              columnNumber: 19
            }, this) }, void 0, !1, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 217,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV5("tbody", { className: "divide-y divide-gray-200", children: leaderboard.map((entry2) => /* @__PURE__ */ jsxDEV5(
              "tr",
              {
                className: entry2.username === "You" ? "bg-blue-50" : "",
                children: [
                  /* @__PURE__ */ jsxDEV5("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900", children: entry2.rank === 1 ? "\u{1F947}" : entry2.rank === 2 ? "\u{1F948}" : entry2.rank === 3 ? "\u{1F949}" : `#${entry2.rank}` }, void 0, !1, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 231,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV5("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: entry2.username }, void 0, !1, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 234,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV5("td", { className: "px-6 py-4 text-sm text-gray-600", children: entry2.points.toLocaleString() }, void 0, !1, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 235,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV5("td", { className: "px-6 py-4 text-sm text-gray-600", children: [
                    entry2.streak,
                    " days"
                  ] }, void 0, !0, {
                    fileName: "app/routes/gamification._index.tsx",
                    lineNumber: 236,
                    columnNumber: 23
                  }, this)
                ]
              },
              entry2.rank,
              !0,
              {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 227,
                columnNumber: 21
              },
              this
            )) }, void 0, !1, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 225,
              columnNumber: 17
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 216,
            columnNumber: 15
          }, this) }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 215,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 213,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { children: [
          /* @__PURE__ */ jsxDEV5("h2", { className: "text-xl font-bold text-gray-900", children: "Recent Unlocks" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 246,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV5("div", { className: "mt-6 space-y-4", children: recentAchievements.length === 0 ? /* @__PURE__ */ jsxDEV5("p", { className: "text-sm text-gray-600", children: "No recent achievements yet!" }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 249,
            columnNumber: 17
          }, this) : recentAchievements.map((achievement, i) => /* @__PURE__ */ jsxDEV5("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: [
            /* @__PURE__ */ jsxDEV5("p", { className: "font-semibold text-green-900", children: achievement.title }, void 0, !1, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 253,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV5("p", { className: "text-xs text-green-700", children: new Date(achievement.date).toLocaleDateString() }, void 0, !1, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 254,
              columnNumber: 21
            }, this)
          ] }, i, !0, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 252,
            columnNumber: 19
          }, this)) }, void 0, !1, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 247,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 245,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 212,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV5("div", { className: "mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV5("h2", { className: "text-lg font-semibold text-gray-900", children: "Level Progression" }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 266,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV5("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: levels.map((level) => /* @__PURE__ */ jsxDEV5(
          "div",
          {
            className: `rounded-lg p-4 ${level.level <= user.current_level ? `${level.color} text-white` : "bg-gray-100 text-gray-700"}`,
            children: [
              /* @__PURE__ */ jsxDEV5("p", { className: "text-2xl font-bold", children: [
                "Level ",
                level.level
              ] }, void 0, !0, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 276,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV5("p", { className: "mt-1 text-sm font-medium", children: level.name }, void 0, !1, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 277,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV5("p", { className: "mt-2 text-xs opacity-90", children: [
                level.minPoints,
                "+ points"
              ] }, void 0, !0, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 278,
                columnNumber: 17
              }, this)
            ]
          },
          level.level,
          !0,
          {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 269,
            columnNumber: 15
          },
          this
        )) }, void 0, !1, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 267,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 265,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 122,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/gamification._index.tsx",
    lineNumber: 114,
    columnNumber: 5
  }, this);
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
import { redirect as redirect4 } from "@remix-run/node";
import { jsxDEV as jsxDEV6 } from "react/jsx-dev-runtime";
var meta5 = () => [
  { title: "Create Long-term Goal - Goal Tracker" }
], action3 = async ({ request }) => {
  if (request.method !== "POST")
    return null;
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), description = formData.get("description"), target_date = formData.get("target_date"), category = formData.get("category"), priority = formData.get("priority");
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
    return await new LongTermGoal({
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
    }).save(), redirect4("/goals");
  } catch (error) {
    return console.error("Create long-term goal error:", error), { error: "An error occurred creating the goal" };
  }
};
function CreateLongTermGoal() {
  let navigation = useNavigation3(), [activeStep, setActiveStep] = useState3("basic"), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxDEV6("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV6("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV6("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV6("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Long-term Goal" }, void 0, !1, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 71,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV6("p", { className: "mt-1 text-sm text-gray-600", children: "Define your vision with the SMART framework" }, void 0, !1, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 70,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 69,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV6("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV6(Form3, { method: "post", className: "space-y-8", children: [
      /* @__PURE__ */ jsxDEV6("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxDEV6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("basic"),
            className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "basic" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
            children: "Basic Info"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 80,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("smart"),
            className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "smart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`,
            children: "SMART Framework"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 90,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 79,
        columnNumber: 11
      }, this),
      activeStep === "basic" && /* @__PURE__ */ jsxDEV6("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 106,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "input",
            {
              type: "text",
              id: "title",
              name: "title",
              required: !0,
              placeholder: "e.g., Learn Spanish fluently",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 109,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 105,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 120,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "description",
              name: "description",
              required: !0,
              rows: 4,
              placeholder: "Describe your goal in detail...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 123,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 119,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
          /* @__PURE__ */ jsxDEV6("div", { children: [
            /* @__PURE__ */ jsxDEV6("label", { htmlFor: "target_date", className: "block text-sm font-medium text-gray-700", children: "Target Date *" }, void 0, !1, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 135,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV6(
              "input",
              {
                type: "date",
                id: "target_date",
                name: "target_date",
                required: !0,
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 138,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 134,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("div", { children: [
            /* @__PURE__ */ jsxDEV6("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Category *" }, void 0, !1, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 148,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV6(
              "select",
              {
                id: "category",
                name: "category",
                required: !0,
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsxDEV6("option", { value: "", children: "Select a category" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 157,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "health", children: "Health & Fitness" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 158,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "career", children: "Career" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 159,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "education", children: "Education" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 160,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "relationships", children: "Relationships" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 161,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "finance", children: "Finance" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 162,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "personal", children: "Personal Development" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 163,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              !0,
              {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 151,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 147,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6("div", { children: [
            /* @__PURE__ */ jsxDEV6("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }, void 0, !1, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 168,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV6(
              "select",
              {
                id: "priority",
                name: "priority",
                defaultValue: "medium",
                className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
                children: [
                  /* @__PURE__ */ jsxDEV6("option", { value: "low", children: "Low" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 177,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "medium", children: "Medium" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 178,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV6("option", { value: "high", children: "High" }, void 0, !1, {
                    fileName: "app/routes/goals.long-term.new.tsx",
                    lineNumber: 179,
                    columnNumber: 21
                  }, this)
                ]
              },
              void 0,
              !0,
              {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 171,
                columnNumber: 19
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 167,
            columnNumber: 17
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 133,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6(
          "button",
          {
            type: "button",
            onClick: () => setActiveStep("smart"),
            className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition",
            children: "Next: SMART Framework"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 184,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 104,
        columnNumber: 13
      }, this),
      activeStep === "smart" && /* @__PURE__ */ jsxDEV6("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxDEV6("div", { className: "rounded-md bg-blue-50 p-4", children: /* @__PURE__ */ jsxDEV6("p", { className: "text-sm text-blue-800", children: [
          /* @__PURE__ */ jsxDEV6("strong", { children: "SMART Goals:" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 199,
            columnNumber: 19
          }, this),
          " Define your goal using Specific, Measurable, Achievable, Relevant, and Time-bound criteria."
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 198,
          columnNumber: 17
        }, this) }, void 0, !1, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 197,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "specific", className: "block text-sm font-medium text-gray-700", children: "Specific - What exactly do you want to achieve?" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 204,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "specific",
              name: "specific",
              rows: 3,
              placeholder: "Be as specific as possible...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 207,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 203,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "measurable", className: "block text-sm font-medium text-gray-700", children: "Measurable - How will you measure progress?" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 217,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "measurable",
              name: "measurable",
              rows: 3,
              placeholder: "Define metrics and milestones...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 220,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 216,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "achievable", className: "block text-sm font-medium text-gray-700", children: "Achievable - Is this goal realistic?" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 230,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "achievable",
              name: "achievable",
              rows: 3,
              placeholder: "Explain why this goal is achievable...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 233,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 229,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "relevant", className: "block text-sm font-medium text-gray-700", children: "Relevant - Why does this matter to you?" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 243,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "relevant",
              name: "relevant",
              rows: 3,
              placeholder: "Connect to your values and larger vision...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 246,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 242,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { children: [
          /* @__PURE__ */ jsxDEV6("label", { htmlFor: "time_bound", className: "block text-sm font-medium text-gray-700", children: "Time-bound - What's your timeline?" }, void 0, !1, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 256,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ jsxDEV6(
            "textarea",
            {
              id: "time_bound",
              name: "time_bound",
              rows: 3,
              placeholder: "Define key dates and deadlines...",
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 259,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 255,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV6("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ jsxDEV6(
            "button",
            {
              type: "button",
              onClick: () => setActiveStep("basic"),
              className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition",
              children: "Back"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 269,
              columnNumber: 17
            },
            this
          ),
          /* @__PURE__ */ jsxDEV6(
            "button",
            {
              type: "submit",
              disabled: isLoading,
              className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
              children: isLoading ? "Creating..." : "Create Goal"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 276,
              columnNumber: 17
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 268,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 196,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 77,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 76,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/goals.long-term.new.tsx",
    lineNumber: 68,
    columnNumber: 5
  }, this);
}

// app/routes/analytics._index.tsx
var analytics_index_exports = {};
__export(analytics_index_exports, {
  default: () => AnalyticsPage,
  loader: () => loader3,
  meta: () => meta6
});
import { useLoaderData as useLoaderData2 } from "@remix-run/react";
import { jsxDEV as jsxDEV7 } from "react/jsx-dev-runtime";
var meta6 = () => [
  { title: "Analytics - Goal Tracker" }
], loader3 = async ({ request }) => {
  let userId = await requireUserId(request), now = /* @__PURE__ */ new Date(), startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()), startOfWeek.setHours(0, 0, 0, 0);
  let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);
  let user = await User.findById(userId).lean(), weekTasks = await DailyTask.find({
    user_id: userId,
    created_at: { $gte: startOfWeek }
  }).lean(), weekTasksCompleted = weekTasks.filter((t) => t.status === "completed"), monthTasks = await DailyTask.find({
    user_id: userId,
    created_at: { $gte: startOfMonth }
  }).lean(), monthTasksCompleted = monthTasks.filter((t) => t.status === "completed"), totalTasksCompleted = await DailyTask.countDocuments({
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
  return /* @__PURE__ */ jsxDEV7("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV7("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV7("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV7("h1", { className: "text-2xl font-bold text-gray-900", children: "Analytics" }, void 0, !1, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 109,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-sm text-gray-600", children: "Insights into your goal-setting progress" }, void 0, !1, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 110,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 108,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 107,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV7("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV7("div", { children: [
        /* @__PURE__ */ jsxDEV7("h2", { className: "text-lg font-semibold text-gray-900", children: "This Week" }, void 0, !1, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 117,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6", children: [
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "Tasks Completed" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 120,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-blue-600", children: [
              stats.thisWeek.tasksCompleted,
              "/",
              stats.thisWeek.tasksTotal
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 121,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: [
              Math.round(stats.thisWeek.tasksCompleted / stats.thisWeek.tasksTotal * 100),
              "%"
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 124,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 119,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "Avg Mood" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 130,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-green-600", children: stats.thisWeek.averageMood.toFixed(1) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 131,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: "/10" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 132,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 129,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "Avg Energy" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 136,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-purple-600", children: stats.thisWeek.averageEnergy.toFixed(1) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 137,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: "/10" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 138,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 135,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "Flow States" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 142,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-cyan-600", children: stats.thisWeek.flowStateSessions }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 143,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: "sessions" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 144,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 141,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "Points Earned" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 148,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-yellow-600", children: stats.thisWeek.totalPoints }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 149,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: "this week" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 150,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 147,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-xs text-gray-600", children: "This Month" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 154,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-2xl font-bold text-orange-600", children: stats.thisMonth.totalPoints }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 155,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: "points" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 156,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 153,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 116,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7("div", { className: "mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV7("h2", { className: "text-lg font-semibold text-gray-900", children: "Weekly Overview" }, void 0, !1, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 163,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "mt-6", children: /* @__PURE__ */ jsxDEV7("div", { className: "space-y-4", children: dailyData.map((day) => /* @__PURE__ */ jsxDEV7("div", { children: [
          /* @__PURE__ */ jsxDEV7("div", { className: "flex items-center justify-between text-sm mb-1", children: [
            /* @__PURE__ */ jsxDEV7("span", { className: "text-gray-600", children: day.date }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 169,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV7("span", { className: "font-medium text-gray-900", children: [
              day.tasks,
              " tasks"
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 170,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 168,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxDEV7("div", { className: "flex-1", children: /* @__PURE__ */ jsxDEV7("div", { className: "h-2 rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV7(
              "div",
              {
                className: "h-full rounded-full bg-blue-600",
                style: { width: `${day.tasks / 7 * 100}%` }
              },
              void 0,
              !1,
              {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 175,
                columnNumber: 25
              },
              this
            ) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 174,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 173,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV7("div", { className: "w-16 text-xs", children: /* @__PURE__ */ jsxDEV7("span", { className: "text-gray-600", children: [
              "\u{1F610} ",
              day.mood,
              " \u{1F4AA} ",
              day.energy
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 182,
              columnNumber: 23
            }, this) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 181,
              columnNumber: 21
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 172,
            columnNumber: 19
          }, this)
        ] }, day.date, !0, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 167,
          columnNumber: 17
        }, this)) }, void 0, !1, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 165,
          columnNumber: 13
        }, this) }, void 0, !1, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 164,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 162,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7("div", { className: "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ jsxDEV7("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2", children: [
          /* @__PURE__ */ jsxDEV7("h2", { className: "text-lg font-semibold text-gray-900", children: "Tasks by Category" }, void 0, !1, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 194,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "mt-6 space-y-4", children: categoryBreakdown.map((cat) => /* @__PURE__ */ jsxDEV7("div", { children: [
            /* @__PURE__ */ jsxDEV7("div", { className: "flex items-center justify-between text-sm mb-1", children: [
              /* @__PURE__ */ jsxDEV7("span", { className: "text-gray-700", children: cat.category }, void 0, !1, {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 199,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ jsxDEV7("span", { className: "font-medium text-gray-900", children: [
                cat.count,
                " tasks"
              ] }, void 0, !0, {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 200,
                columnNumber: 21
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 198,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV7("div", { className: "h-3 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV7(
              "div",
              {
                className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500",
                style: { width: `${cat.percentage}%` }
              },
              void 0,
              !1,
              {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 203,
                columnNumber: 21
              },
              this
            ) }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 202,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-1 text-xs text-gray-500", children: [
              cat.percentage,
              "% of total"
            ] }, void 0, !0, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 208,
              columnNumber: 19
            }, this)
          ] }, cat.category, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 197,
            columnNumber: 17
          }, this)) }, void 0, !1, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 193,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { children: [
          /* @__PURE__ */ jsxDEV7("h2", { className: "text-lg font-semibold text-gray-900", children: "Insights" }, void 0, !1, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 216,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { className: "mt-6 space-y-4", children: insights.map((insight, i) => /* @__PURE__ */ jsxDEV7(
            "div",
            {
              className: `rounded-lg p-4 text-sm ${insight.type === "positive" ? "bg-green-50 text-green-800 border border-green-200" : insight.type === "attention" ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`,
              children: insight.text
            },
            i,
            !1,
            {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 219,
              columnNumber: 17
            },
            this
          )) }, void 0, !1, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 217,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 215,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 192,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV7("div", { className: "mt-8 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxDEV7("h2", { className: "text-lg font-semibold text-gray-900", children: "All-Time Statistics" }, void 0, !1, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 237,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV7("div", { className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ jsxDEV7("div", { children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-sm text-gray-600", children: "Total Tasks" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 240,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-2 text-3xl font-bold text-blue-600", children: stats.allTime.tasksCompleted }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 241,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 239,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-sm text-gray-600", children: "Goals Completed" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 244,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-2 text-3xl font-bold text-green-600", children: stats.allTime.goalsCompleted }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 245,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 243,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-sm text-gray-600", children: "Best Streak" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 248,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-2 text-3xl font-bold text-orange-600", children: stats.allTime.streakBest }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 249,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 247,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV7("div", { children: [
            /* @__PURE__ */ jsxDEV7("p", { className: "text-sm text-gray-600", children: "Total Points" }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 252,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV7("p", { className: "mt-2 text-3xl font-bold text-purple-600", children: stats.allTime.totalPoints }, void 0, !1, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 253,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 251,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 238,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 236,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 114,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/analytics._index.tsx",
    lineNumber: 106,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard._index.tsx
var dashboard_index_exports = {};
__export(dashboard_index_exports, {
  default: () => DashboardPage,
  loader: () => loader4,
  meta: () => meta7
});
import { useLoaderData as useLoaderData3, Link } from "@remix-run/react";
import { jsxDEV as jsxDEV8 } from "react/jsx-dev-runtime";
var meta7 = () => [
  { title: "Dashboard - Goal Tracker" }
], loader4 = async ({ request }) => {
  let userId = await requireUserId(request), user = await User.findById(userId).select("-password_hash").lean();
  if (!user)
    throw new Response("Not Found", { status: 404 });
  return {
    user: {
      email: user.email,
      total_points: user.total_points,
      current_level: user.current_level,
      streak_count: user.streak_count
    },
    stats: {
      tasks_today: 0,
      tasks_completed_today: 0,
      mood_average: 7,
      // Mocked for now until Analytics are implemented
      energy_average: 6
      // Mocked for now
    },
    recentTasks: []
    // Mocked for now until Tasks are migrated
  };
};
function DashboardPage() {
  let data = useLoaderData3(), { user, stats, recentTasks } = data;
  return /* @__PURE__ */ jsxDEV8("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV8("header", { className: "border-b border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ jsxDEV8("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV8("h1", { className: "text-2xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, !1, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 46,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxDEV8("span", { className: "text-sm text-gray-600", children: user.email }, void 0, !1, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 48,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV8("button", { className: "rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700", children: "Logout" }, void 0, !1, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 49,
          columnNumber: 15
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 47,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 45,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 44,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 43,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV8("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV8("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("p", { className: "text-sm text-gray-600", children: "Total Points" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 62,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { className: "mt-2 text-3xl font-bold text-blue-600", children: user.total_points }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 63,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 61,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("p", { className: "text-sm text-gray-600", children: "Current Level" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 66,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { className: "mt-2 text-3xl font-bold text-green-600", children: user.current_level }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 67,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 65,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("p", { className: "text-sm text-gray-600", children: "Streak" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 70,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { className: "mt-2 text-3xl font-bold text-orange-600", children: [
            user.streak_count,
            " days"
          ] }, void 0, !0, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 71,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 69,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("p", { className: "text-sm text-gray-600", children: "Tasks Today" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 74,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("p", { className: "mt-2 text-3xl font-bold text-purple-600", children: [
            stats.tasks_completed_today,
            "/",
            stats.tasks_today
          ] }, void 0, !0, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 75,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 73,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("h2", { className: "text-lg font-semibold text-gray-900", children: "Energy Level" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 84,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV8("span", { className: "text-sm text-gray-600", children: "Current" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 87,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV8("span", { className: "text-2xl font-bold text-blue-600", children: [
                stats.energy_average,
                "/10"
              ] }, void 0, !0, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 88,
                columnNumber: 17
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 86,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV8("div", { className: "mt-4 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV8(
              "div",
              {
                className: "h-full rounded-full bg-blue-600",
                style: { width: `${stats.energy_average / 10 * 100}%` }
              },
              void 0,
              !1,
              {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 91,
                columnNumber: 17
              },
              this
            ) }, void 0, !1, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 90,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 85,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ jsxDEV8("h2", { className: "text-lg font-semibold text-gray-900", children: "Mood" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 100,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxDEV8("span", { className: "text-sm text-gray-600", children: "Current" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 103,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV8("span", { className: "text-2xl font-bold text-green-600", children: [
                stats.mood_average,
                "/10"
              ] }, void 0, !0, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 104,
                columnNumber: 17
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 102,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ jsxDEV8("div", { className: "mt-4 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV8(
              "div",
              {
                className: "h-full rounded-full bg-green-600",
                style: { width: `${stats.mood_average / 10 * 100}%` }
              },
              void 0,
              !1,
              {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 107,
                columnNumber: 17
              },
              this
            ) }, void 0, !1, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 106,
              columnNumber: 15
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 101,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 99,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 82,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mt-8", children: [
        /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxDEV8("h2", { className: "text-lg font-semibold text-gray-900", children: "Today's Tasks" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 119,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV8(Link, { to: "/tasks/new", className: "text-sm text-blue-600 hover:text-blue-700", children: "Add Task" }, void 0, !1, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 120,
            columnNumber: 13
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 118,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV8("div", { className: "mt-4 space-y-2", children: recentTasks.map((task) => /* @__PURE__ */ jsxDEV8(
          "div",
          {
            className: "flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm",
            children: [
              /* @__PURE__ */ jsxDEV8("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxDEV8(
                  "input",
                  {
                    type: "checkbox",
                    checked: task.status === "completed",
                    className: "h-4 w-4 rounded border-gray-300",
                    readOnly: !0
                  },
                  void 0,
                  !1,
                  {
                    fileName: "app/routes/dashboard._index.tsx",
                    lineNumber: 132,
                    columnNumber: 19
                  },
                  this
                ),
                /* @__PURE__ */ jsxDEV8("div", { children: [
                  /* @__PURE__ */ jsxDEV8("p", { className: "font-medium text-gray-900", children: task.title }, void 0, !1, {
                    fileName: "app/routes/dashboard._index.tsx",
                    lineNumber: 139,
                    columnNumber: 21
                  }, this),
                  /* @__PURE__ */ jsxDEV8("p", { className: "text-xs text-gray-500", children: [
                    "Difficulty: ",
                    ["Easy", "Medium", "Hard", "Very Hard", "Extreme"][task.difficulty - 1]
                  ] }, void 0, !0, {
                    fileName: "app/routes/dashboard._index.tsx",
                    lineNumber: 140,
                    columnNumber: 21
                  }, this)
                ] }, void 0, !0, {
                  fileName: "app/routes/dashboard._index.tsx",
                  lineNumber: 138,
                  columnNumber: 19
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 131,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV8(
                "span",
                {
                  className: `rounded-full px-3 py-1 text-xs font-medium ${task.status === "completed" ? "bg-green-100 text-green-700" : task.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
                  children: task.status === "completed" ? "Done" : task.status === "in_progress" ? "In Progress" : "Pending"
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/dashboard._index.tsx",
                  lineNumber: 145,
                  columnNumber: 17
                },
                this
              )
            ]
          },
          task.id,
          !0,
          {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 127,
            columnNumber: 15
          },
          this
        )) }, void 0, !1, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 125,
          columnNumber: 11
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 117,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV8("div", { className: "mt-12 grid grid-cols-1 gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxDEV8(
          Link,
          {
            to: "/goals/long-term/new",
            className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition",
            children: [
              /* @__PURE__ */ jsxDEV8("p", { className: "text-2xl", children: "\u{1F3AF}" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 166,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("h3", { className: "mt-2 font-semibold text-gray-900", children: "Create Long-term Goal" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 167,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("p", { className: "mt-1 text-sm text-gray-600", children: "Build your vision for the future" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 168,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 162,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV8(
          Link,
          {
            to: "/goals/short-term/new",
            className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition",
            children: [
              /* @__PURE__ */ jsxDEV8("p", { className: "text-2xl", children: "\u{1F4C5}" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 175,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("h3", { className: "mt-2 font-semibold text-gray-900", children: "Create Short-term Goal" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 176,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("p", { className: "mt-1 text-sm text-gray-600", children: "Set milestones for progress" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 177,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 171,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV8(
          Link,
          {
            to: "/analytics",
            className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition",
            children: [
              /* @__PURE__ */ jsxDEV8("p", { className: "text-2xl", children: "\u{1F4CA}" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 184,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("h3", { className: "mt-2 font-semibold text-gray-900", children: "View Analytics" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 185,
                columnNumber: 13
              }, this),
              /* @__PURE__ */ jsxDEV8("p", { className: "mt-1 text-sm text-gray-600", children: "Track your progress and insights" }, void 0, !1, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 186,
                columnNumber: 13
              }, this)
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 180,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 161,
        columnNumber: 9
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 58,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/dashboard._index.tsx",
    lineNumber: 41,
    columnNumber: 5
  }, this);
}

// app/routes/auth.register.tsx
var auth_register_exports = {};
__export(auth_register_exports, {
  action: () => action4,
  default: () => RegisterPage,
  meta: () => meta8
});
import { Form as Form4, Link as Link2, useActionData, useNavigation as useNavigation4 } from "@remix-run/react";
import { useState as useState4 } from "react";

// app/models/Analytics.ts
import mongoose5 from "mongoose";
var userStatsSchema = new mongoose5.Schema(
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
var UserStats = mongoose5.model("UserStats", userStatsSchema), userPsychologyProfileSchema = new mongoose5.Schema(
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
), UserPsychologyProfile = mongoose5.model(
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
var HabitStack = mongoose5.model("HabitStack", habitStackSchema), energyMoodStateMatrixSchema = new mongoose5.Schema(
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
var EnergyMoodStateMatrix = mongoose5.model(
  "EnergyMoodStateMatrix",
  energyMoodStateMatrixSchema
);

// app/utils/auth.ts
import bcryptjs from "bcryptjs";
var SALT_ROUNDS = 10;
async function hashPassword(password) {
  return bcryptjs.hash(password, SALT_ROUNDS);
}
async function verifyPassword(password, hash) {
  return bcryptjs.compare(password, hash);
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

// app/routes/auth.register.tsx
import { jsxDEV as jsxDEV9 } from "react/jsx-dev-runtime";
var meta8 = () => [
  { title: "Register - Goal Tracker" }
], action4 = async ({ request }) => {
  if (request.method !== "POST")
    return null;
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), confirmPassword = formData.get("confirmPassword");
  if (password !== confirmPassword)
    return { error: "Passwords do not match" };
  if (!isValidEmail(email))
    return { error: "Invalid email format" };
  let passwordStrength = validatePasswordStrength(password);
  if (!passwordStrength.valid)
    return { error: "Password is too weak", feedback: passwordStrength.feedback };
  try {
    if (await User.findOne({ email: email.toLowerCase() }))
      return { error: "Email already registered" };
    let password_hash = await hashPassword(password), user = new User({
      email: email.toLowerCase(),
      password_hash,
      total_points: 0,
      current_level: 1,
      streak_count: 0
    });
    return await user.save(), await new UserPsychologyProfile({
      user_id: user._id,
      chronotype: "afternoon",
      emotional_baseline: 5,
      energy_baseline: 5
    }).save(), createUserSession({
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
  let actionData = useActionData(), navigation = useNavigation4(), [showPassword, setShowPassword] = useState4(!1), [showConfirm, setShowConfirm] = useState4(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxDEV9("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4", children: /* @__PURE__ */ jsxDEV9("div", { className: "w-full max-w-md space-y-8", children: [
    /* @__PURE__ */ jsxDEV9("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV9("h1", { className: "text-4xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, !1, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 89,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV9("p", { className: "mt-2 text-gray-600", children: "Create your account to get started" }, void 0, !1, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 90,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 88,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV9(Form4, { method: "post", className: "space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm", children: [
      actionData?.error && /* @__PURE__ */ jsxDEV9("div", { className: "rounded-md bg-red-50 p-4 text-sm text-red-700", children: actionData.error }, void 0, !1, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 95,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { children: [
        /* @__PURE__ */ jsxDEV9("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }, void 0, !1, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 101,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV9(
          "input",
          {
            type: "email",
            id: "email",
            name: "email",
            required: !0,
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            placeholder: "you@example.com"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 104,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 100,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { children: [
        /* @__PURE__ */ jsxDEV9("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password (min 8 characters)" }, void 0, !1, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 115,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV9("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV9(
            "input",
            {
              type: showPassword ? "text" : "password",
              id: "password",
              name: "password",
              required: !0,
              minLength: 8,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 119,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV9(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
              children: showPassword ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 128,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 118,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 114,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV9("div", { children: [
        /* @__PURE__ */ jsxDEV9("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }, void 0, !1, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 139,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV9("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV9(
            "input",
            {
              type: showConfirm ? "text" : "password",
              id: "confirmPassword",
              name: "confirmPassword",
              required: !0,
              minLength: 8,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 143,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV9(
            "button",
            {
              type: "button",
              onClick: () => setShowConfirm(!showConfirm),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
              children: showConfirm ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.register.tsx",
              lineNumber: 152,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 142,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 138,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV9(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
          children: isLoading ? "Creating account..." : "Create account"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 162,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 93,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV9("p", { className: "text-center text-sm text-gray-600", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ jsxDEV9(Link2, { to: "/auth/login", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign in" }, void 0, !1, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 173,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 171,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.register.tsx",
    lineNumber: 87,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.register.tsx",
    lineNumber: 86,
    columnNumber: 5
  }, this);
}

// app/routes/goals._index.tsx
var goals_index_exports = {};
__export(goals_index_exports, {
  default: () => GoalsPage,
  loader: () => loader5,
  meta: () => meta9
});
import { useLoaderData as useLoaderData4, Link as Link3 } from "@remix-run/react";
import { useState as useState5 } from "react";
import { jsxDEV as jsxDEV10 } from "react/jsx-dev-runtime";
var meta9 = () => [
  { title: "Goals - Goal Tracker" }
], loader5 = async ({ request }) => {
  let userId = await requireUserId(request), [longTermGoals, shortTermGoals] = await Promise.all([
    LongTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean(),
    ShortTermGoal.find({ user_id: userId }).sort({ created_at: -1 }).lean()
  ]);
  return {
    longTermGoals,
    shortTermGoals
  };
};
function GoalsPage() {
  let { longTermGoals, shortTermGoals } = useLoaderData4(), [activeTab, setActiveTab] = useState5("long-term");
  return /* @__PURE__ */ jsxDEV10("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsxDEV10("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ jsxDEV10("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxDEV10("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxDEV10("h1", { className: "text-2xl font-bold text-gray-900", children: "Goals" }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 35,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV10("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxDEV10(
          Link3,
          {
            to: "/goals/long-term/new",
            className: "rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700",
            children: "+ Long-term Goal"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 37,
            columnNumber: 15
          },
          this
        ),
        /* @__PURE__ */ jsxDEV10(
          Link3,
          {
            to: "/goals/short-term/new",
            className: "rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700",
            children: "+ Short-term Goal"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 43,
            columnNumber: 15
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 36,
        columnNumber: 13
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 34,
      columnNumber: 11
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 33,
      columnNumber: 9
    }, this) }, void 0, !1, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 32,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV10("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxDEV10("div", { className: "flex gap-4 border-b border-gray-200", children: [
        /* @__PURE__ */ jsxDEV10(
          "button",
          {
            onClick: () => setActiveTab("long-term"),
            className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "long-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
            children: [
              "Long-term Goals (",
              longTermGoals.length,
              ")"
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 57,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV10(
          "button",
          {
            onClick: () => setActiveTab("short-term"),
            className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "short-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`,
            children: [
              "Short-term Goals (",
              shortTermGoals.length,
              ")"
            ]
          },
          void 0,
          !0,
          {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 66,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 56,
        columnNumber: 9
      }, this),
      activeTab === "long-term" && /* @__PURE__ */ jsxDEV10("div", { className: "mt-8 space-y-4", children: longTermGoals.length === 0 ? /* @__PURE__ */ jsxDEV10("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ jsxDEV10("p", { className: "text-gray-600", children: "No long-term goals yet. Create one to get started!" }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 82,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 81,
        columnNumber: 15
      }, this) : longTermGoals.map((goal) => /* @__PURE__ */ jsxDEV10("div", { className: "rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition", children: /* @__PURE__ */ jsxDEV10("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxDEV10("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxDEV10("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxDEV10("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }, void 0, !1, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 90,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV10(
              "span",
              {
                className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "active" ? "bg-green-100 text-green-700" : goal.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`,
                children: goal.status === "active" ? "Active" : "Completed"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 91,
                columnNumber: 25
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 89,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV10("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ jsxDEV10("div", { children: [
              /* @__PURE__ */ jsxDEV10("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ jsxDEV10("span", { className: "text-gray-600", children: "Progress" }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 106,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV10("span", { className: "font-medium text-gray-900", children: [
                  goal.current_progress_percentage,
                  "%"
                ] }, void 0, !0, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 107,
                  columnNumber: 29
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 105,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV10("div", { className: "mt-1 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ jsxDEV10(
                "div",
                {
                  className: "h-full rounded-full bg-blue-600",
                  style: { width: `${goal.current_progress_percentage}%` }
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 110,
                  columnNumber: 29
                },
                this
              ) }, void 0, !1, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 109,
                columnNumber: 27
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 104,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV10("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxDEV10("div", { children: [
                /* @__PURE__ */ jsxDEV10("span", { className: "text-gray-600", children: "Category:" }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 119,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV10("p", { className: "font-medium text-gray-900 capitalize", children: goal.category }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 120,
                  columnNumber: 29
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 118,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV10("div", { children: [
                /* @__PURE__ */ jsxDEV10("span", { className: "text-gray-600", children: "Priority:" }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 123,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV10("p", { className: "font-medium text-gray-900 capitalize", children: goal.priority }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 124,
                  columnNumber: 29
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 122,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ jsxDEV10("div", { children: [
                /* @__PURE__ */ jsxDEV10("span", { className: "text-gray-600", children: "Target:" }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 127,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ jsxDEV10("p", { className: "font-medium text-gray-900", children: new Date(goal.target_date).toLocaleDateString() }, void 0, !1, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 128,
                  columnNumber: 29
                }, this)
              ] }, void 0, !0, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 126,
                columnNumber: 27
              }, this)
            ] }, void 0, !0, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 117,
              columnNumber: 25
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 103,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 88,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV10("div", { className: "ml-4 flex gap-2", children: [
          /* @__PURE__ */ jsxDEV10(
            Link3,
            {
              to: `/goals/long-term/${goal._id}`,
              className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50",
              children: "View"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 137,
              columnNumber: 23
            },
            this
          ),
          /* @__PURE__ */ jsxDEV10("button", { className: "rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50", children: "Edit" }, void 0, !1, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 143,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 136,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 87,
        columnNumber: 19
      }, this) }, goal._id, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 86,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 79,
        columnNumber: 11
      }, this),
      activeTab === "short-term" && /* @__PURE__ */ jsxDEV10("div", { className: "mt-8 space-y-4", children: shortTermGoals.length === 0 ? /* @__PURE__ */ jsxDEV10("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ jsxDEV10("p", { className: "text-gray-600", children: "No short-term goals yet. Create one to get started!" }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 159,
        columnNumber: 17
      }, this) }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 158,
        columnNumber: 15
      }, this) : shortTermGoals.map((goal) => /* @__PURE__ */ jsxDEV10("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: /* @__PURE__ */ jsxDEV10("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ jsxDEV10("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxDEV10("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxDEV10("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }, void 0, !1, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 167,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV10(
              "span",
              {
                className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : goal.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`,
                children: goal.status === "in_progress" ? "In Progress" : "Completed"
              },
              void 0,
              !1,
              {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 168,
                columnNumber: 25
              },
              this
            )
          ] }, void 0, !0, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 166,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV10("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxDEV10("h4", { className: "text-sm font-medium text-gray-900", children: "Milestones" }, void 0, !1, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 181,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ jsxDEV10("div", { className: "mt-2 space-y-2", children: goal.milestones?.map((milestone) => /* @__PURE__ */ jsxDEV10("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxDEV10(
                "input",
                {
                  type: "checkbox",
                  checked: milestone.completed,
                  className: "h-4 w-4 rounded border-gray-300",
                  readOnly: !0
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 185,
                  columnNumber: 31
                },
                this
              ),
              /* @__PURE__ */ jsxDEV10(
                "span",
                {
                  className: milestone.completed ? "line-through text-gray-400" : "text-gray-700",
                  children: milestone.title
                },
                void 0,
                !1,
                {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 191,
                  columnNumber: 31
                },
                this
              )
            ] }, milestone.id, !0, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 184,
              columnNumber: 29
            }, this)) }, void 0, !1, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 182,
              columnNumber: 25
            }, this)
          ] }, void 0, !0, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 180,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV10("p", { className: "mt-3 text-sm text-gray-600", children: [
            "Due: ",
            new Date(goal.end_date).toLocaleDateString()
          ] }, void 0, !0, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 203,
            columnNumber: 23
          }, this)
        ] }, void 0, !0, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 165,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ jsxDEV10("div", { className: "ml-4 flex gap-2", children: /* @__PURE__ */ jsxDEV10(
          Link3,
          {
            to: `/goals/short-term/${goal._id}`,
            className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50",
            children: "View"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 209,
            columnNumber: 23
          },
          this
        ) }, void 0, !1, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 208,
          columnNumber: 21
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 164,
        columnNumber: 19
      }, this) }, goal._id, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 163,
        columnNumber: 17
      }, this)) }, void 0, !1, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 156,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 54,
      columnNumber: 7
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/goals._index.tsx",
    lineNumber: 31,
    columnNumber: 5
  }, this);
}

// app/routes/auth.login.tsx
var auth_login_exports = {};
__export(auth_login_exports, {
  action: () => action5,
  default: () => LoginPage,
  meta: () => meta10
});
import { Form as Form5, Link as Link4, useActionData as useActionData2, useNavigation as useNavigation5 } from "@remix-run/react";
import { useState as useState6 } from "react";
import { jsxDEV as jsxDEV11 } from "react/jsx-dev-runtime";
var meta10 = () => [
  { title: "Login - Goal Tracker" }
], action5 = async ({ request }) => {
  if (request.method !== "POST")
    return null;
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password");
  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    return user ? await verifyPassword(password, user.password_hash) ? (user.last_login = /* @__PURE__ */ new Date(), await user.save(), createUserSession({
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
  let actionData = useActionData2(), navigation = useNavigation5(), [showPassword, setShowPassword] = useState6(!1), isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ jsxDEV11("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4", children: /* @__PURE__ */ jsxDEV11("div", { className: "w-full max-w-md space-y-8", children: [
    /* @__PURE__ */ jsxDEV11("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxDEV11("h1", { className: "text-4xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, !1, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 61,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV11("p", { className: "mt-2 text-gray-600", children: "Track your goals with psychology-based insights" }, void 0, !1, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 62,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.login.tsx",
      lineNumber: 60,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV11(Form5, { method: "post", className: "space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm", children: [
      actionData?.error && /* @__PURE__ */ jsxDEV11("div", { className: "rounded-md bg-red-50 p-4 text-sm text-red-700", children: actionData.error }, void 0, !1, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 67,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV11("div", { children: [
        /* @__PURE__ */ jsxDEV11("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }, void 0, !1, {
          fileName: "app/routes/auth.login.tsx",
          lineNumber: 73,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV11(
          "input",
          {
            type: "email",
            id: "email",
            name: "email",
            required: !0,
            className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
            placeholder: "you@example.com"
          },
          void 0,
          !1,
          {
            fileName: "app/routes/auth.login.tsx",
            lineNumber: 76,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, !0, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 72,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV11("div", { children: [
        /* @__PURE__ */ jsxDEV11("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }, void 0, !1, {
          fileName: "app/routes/auth.login.tsx",
          lineNumber: 87,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV11("div", { className: "relative", children: [
          /* @__PURE__ */ jsxDEV11(
            "input",
            {
              type: showPassword ? "text" : "password",
              id: "password",
              name: "password",
              required: !0,
              className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.login.tsx",
              lineNumber: 91,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV11(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700",
              children: showPassword ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F"
            },
            void 0,
            !1,
            {
              fileName: "app/routes/auth.login.tsx",
              lineNumber: 99,
              columnNumber: 15
            },
            this
          )
        ] }, void 0, !0, {
          fileName: "app/routes/auth.login.tsx",
          lineNumber: 90,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 86,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV11(
        "button",
        {
          type: "submit",
          disabled: isLoading,
          className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition",
          children: isLoading ? "Signing in..." : "Sign in"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/auth.login.tsx",
          lineNumber: 109,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/auth.login.tsx",
      lineNumber: 65,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV11("p", { className: "text-center text-sm text-gray-600", children: [
      "Don't have an account?",
      " ",
      /* @__PURE__ */ jsxDEV11(Link4, { to: "/auth/register", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign up" }, void 0, !1, {
        fileName: "app/routes/auth.login.tsx",
        lineNumber: 120,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/auth.login.tsx",
      lineNumber: 118,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/auth.login.tsx",
    lineNumber: 59,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/auth.login.tsx",
    lineNumber: 58,
    columnNumber: 5
  }, this);
}

// app/routes/dashboard.tsx
var dashboard_exports = {};
__export(dashboard_exports, {
  default: () => DashboardLayout,
  loader: () => loader6
});
import { Outlet as Outlet2 } from "@remix-run/react";
import { jsxDEV as jsxDEV12 } from "react/jsx-dev-runtime";
var loader6 = async ({ request: _request }) => null;
function DashboardLayout() {
  return /* @__PURE__ */ jsxDEV12(Outlet2, {}, void 0, !1, {
    fileName: "app/routes/dashboard.tsx",
    lineNumber: 12,
    columnNumber: 10
  }, this);
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta11
});
import { Link as Link5 } from "@remix-run/react";
import { jsxDEV as jsxDEV13 } from "react/jsx-dev-runtime";
var meta11 = () => [
  { title: "Goal Tracker - Home" },
  {
    name: "description",
    content: "Advanced goal tracking with psychological-based habit formation"
  }
];
function Index() {
  return /* @__PURE__ */ jsxDEV13("div", { className: "flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white", children: /* @__PURE__ */ jsxDEV13("div", { className: "w-full max-w-2xl space-y-8 px-4 text-center", children: [
    /* @__PURE__ */ jsxDEV13("h1", { className: "text-5xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 16,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV13("p", { className: "text-xl text-gray-600", children: "Master your goals with psychological-based habit formation, energy-emotion tracking, and intelligent gamification." }, void 0, !1, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 19,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV13("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxDEV13(
        Link5,
        {
          to: "/auth/login",
          className: "inline-block rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700 transition",
          children: "Login"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 24,
          columnNumber: 11
        },
        this
      ),
      /* @__PURE__ */ jsxDEV13(
        Link5,
        {
          to: "/auth/register",
          className: "ml-4 inline-block rounded-lg border-2 border-blue-600 px-8 py-3 font-semibold text-blue-600 hover:bg-blue-50 transition",
          children: "Register"
        },
        void 0,
        !1,
        {
          fileName: "app/routes/_index.tsx",
          lineNumber: 30,
          columnNumber: 11
        },
        this
      )
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 23,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ jsxDEV13("div", { className: "mt-12 grid grid-cols-1 gap-6 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxDEV13("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxDEV13("h3", { className: "font-semibold text-gray-900", children: "Energy & Emotion Tracking" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 40,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "mt-2 text-sm text-gray-600", children: "Monitor your energy levels and emotional states throughout the day for optimal task timing." }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 41,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 39,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV13("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxDEV13("h3", { className: "font-semibold text-gray-900", children: "SMART Goals" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 46,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "mt-2 text-sm text-gray-600", children: "Create well-defined goals with psychological-based frameworks for maximum success." }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 47,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 45,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV13("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ jsxDEV13("h3", { className: "font-semibold text-gray-900", children: "Gamification & Rewards" }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 52,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV13("p", { className: "mt-2 text-sm text-gray-600", children: "Unlock achievements, build streaks, and level up your productivity with dynamic rewards." }, void 0, !1, {
          fileName: "app/routes/_index.tsx",
          lineNumber: 53,
          columnNumber: 13
        }, this)
      ] }, void 0, !0, {
        fileName: "app/routes/_index.tsx",
        lineNumber: 51,
        columnNumber: 11
      }, this)
    ] }, void 0, !0, {
      fileName: "app/routes/_index.tsx",
      lineNumber: 38,
      columnNumber: 9
    }, this)
  ] }, void 0, !0, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 15,
    columnNumber: 7
  }, this) }, void 0, !1, {
    fileName: "app/routes/_index.tsx",
    lineNumber: 14,
    columnNumber: 5
  }, this);
}

// app/routes/auth.tsx
var auth_exports = {};
__export(auth_exports, {
  default: () => AuthLayout
});
import { Outlet as Outlet3 } from "@remix-run/react";
import { jsxDEV as jsxDEV14 } from "react/jsx-dev-runtime";
function AuthLayout() {
  return /* @__PURE__ */ jsxDEV14(Outlet3, {}, void 0, !1, {
    fileName: "app/routes/auth.tsx",
    lineNumber: 4,
    columnNumber: 10
  }, this);
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { entry: { module: "/build/entry.client-GKZSEWU3.js", imports: ["/build/_shared/chunk-35ZIG3TO.js", "/build/_shared/chunk-23ZJGECJ.js", "/build/_shared/chunk-HUMZIC5X.js", "/build/_shared/chunk-LHJ72VQC.js", "/build/_shared/chunk-SGRQVLUK.js", "/build/_shared/chunk-TOPOK74T.js", "/build/_shared/chunk-VT56GUPO.js", "/build/_shared/chunk-PZDJHGND.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-W2CAS65W.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-JFEJQVU6.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/analytics._index": { id: "routes/analytics._index", parentId: "root", path: "analytics", index: !0, caseSensitive: void 0, module: "/build/routes/analytics._index-DDWYCQLT.js", imports: ["/build/_shared/chunk-DJPMYOIT.js", "/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth": { id: "routes/auth", parentId: "root", path: "auth", index: void 0, caseSensitive: void 0, module: "/build/routes/auth-37BZ77LI.js", imports: void 0, hasAction: !1, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.login": { id: "routes/auth.login", parentId: "routes/auth", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.login-NAP24XYG.js", imports: ["/build/_shared/chunk-QRPT7QHS.js", "/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/auth.register": { id: "routes/auth.register", parentId: "routes/auth", path: "register", index: void 0, caseSensitive: void 0, module: "/build/routes/auth.register-CI6OQHJJ.js", imports: ["/build/_shared/chunk-QRPT7QHS.js", "/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard": { id: "routes/dashboard", parentId: "root", path: "dashboard", index: void 0, caseSensitive: void 0, module: "/build/routes/dashboard-RBEVX2R4.js", imports: void 0, hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/dashboard._index": { id: "routes/dashboard._index", parentId: "routes/dashboard", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/dashboard._index-4PPJHQ37.js", imports: ["/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/gamification._index": { id: "routes/gamification._index", parentId: "root", path: "gamification", index: !0, caseSensitive: void 0, module: "/build/routes/gamification._index-2SNVP4RX.js", imports: ["/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals._index": { id: "routes/goals._index", parentId: "root", path: "goals", index: !0, caseSensitive: void 0, module: "/build/routes/goals._index-QBO2WXYK.js", imports: ["/build/_shared/chunk-QEVVQF4B.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !1, hasLoader: !0, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.long-term.new": { id: "routes/goals.long-term.new", parentId: "root", path: "goals/long-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.long-term.new-R25YZCYO.js", imports: ["/build/_shared/chunk-QEVVQF4B.js", "/build/_shared/chunk-NBEH4DGX.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/goals.short-term.new": { id: "routes/goals.short-term.new", parentId: "root", path: "goals/short-term/new", index: void 0, caseSensitive: void 0, module: "/build/routes/goals.short-term.new-KRBRK53B.js", imports: ["/build/_shared/chunk-QEVVQF4B.js", "/build/_shared/chunk-NBEH4DGX.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 }, "routes/tasks.complete.$taskId": { id: "routes/tasks.complete.$taskId", parentId: "root", path: "tasks/complete/:taskId", index: void 0, caseSensitive: void 0, module: "/build/routes/tasks.complete.$taskId-L2PBD5G7.js", imports: ["/build/_shared/chunk-NBEH4DGX.js", "/build/_shared/chunk-DJPMYOIT.js", "/build/_shared/chunk-XDREJOWK.js", "/build/_shared/chunk-FN4XIHTW.js"], hasAction: !0, hasLoader: !1, hasClientAction: !1, hasClientLoader: !1, hasErrorBoundary: !1 } }, version: "a8feb794", hmr: { runtime: "/build/_shared\\chunk-HUMZIC5X.js", timestamp: 1772370040145 }, url: "/build/manifest-A8FEB794.js" };

// server-entry-module:@remix-run/dev/server-build
var mode = "development", assetsBuildDirectory = "public/build", future = { v3_fetcherPersist: !0, v3_relativeSplatPath: !0, v3_throwAbortReason: !0, v3_routeConfig: !1, v3_singleFetch: !1, v3_lazyRouteDiscovery: !1, unstable_optimizeDeps: !1 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
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
    module: auth_exports
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
//# sourceMappingURL=index.js.map
