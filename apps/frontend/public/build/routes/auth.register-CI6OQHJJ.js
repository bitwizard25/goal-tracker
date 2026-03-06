import "/build/_shared/chunk-QRPT7QHS.js";
import "/build/_shared/chunk-XDREJOWK.js";
import {
  require_auth,
  require_browser_umd
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
  Form,
  Link,
  useActionData,
  useNavigation
} from "/build/_shared/chunk-23ZJGECJ.js";
import {
  createHotContext
} from "/build/_shared/chunk-HUMZIC5X.js";
import "/build/_shared/chunk-LHJ72VQC.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-SGRQVLUK.js";
import {
  require_react
} from "/build/_shared/chunk-TOPOK74T.js";
import "/build/_shared/chunk-VT56GUPO.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/routes/auth.register.tsx
var import_react2 = __toESM(require_react(), 1);

// app/models/Analytics.ts
var import_mongoose = __toESM(require_browser_umd(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\models\\Analytics.ts"
  );
  import.meta.hot.lastModified = "1772353506136.4785";
}
var userStatsSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    date: {
      type: Date,
      required: true
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
var UserStats = import_mongoose.default.model("UserStats", userStatsSchema);
var userPsychologyProfileSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true
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
);
var UserPsychologyProfile = import_mongoose.default.model(
  "UserPsychologyProfile",
  userPsychologyProfileSchema
);
var habitStackSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    trigger_task_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      ref: "DailyTask"
    },
    task_sequence: [
      {
        type: import_mongoose.default.Schema.Types.ObjectId,
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
var HabitStack = import_mongoose.default.model("HabitStack", habitStackSchema);
var energyMoodStateMatrixSchema = new import_mongoose.default.Schema(
  {
    user_id: {
      type: import_mongoose.default.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    date: {
      type: Date,
      required: true
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
var EnergyMoodStateMatrix = import_mongoose.default.model(
  "EnergyMoodStateMatrix",
  energyMoodStateMatrixSchema
);

// app/routes/auth.register.tsx
var import_auth2 = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\auth.register.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\auth.register.tsx"
  );
  import.meta.hot.lastModified = "1772367871365.5593";
}
var meta = () => [{
  title: "Register - Goal Tracker"
}];
function RegisterPage() {
  _s();
  const actionData = useActionData();
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = (0, import_react2.useState)(false);
  const [showConfirm, setShowConfirm] = (0, import_react2.useState)(false);
  const isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-full max-w-md space-y-8", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-4xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 106,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-gray-600", children: "Create your account to get started" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 107,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 105,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm", children: [
      actionData?.error && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-md bg-red-50 p-4 text-sm text-red-700", children: actionData.error }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 111,
        columnNumber: 33
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 116,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "email", id: "email", name: "email", required: true, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: "you@example.com" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 119,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 115,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password (min 8 characters)" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 123,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showPassword ? "text" : "password", id: "password", name: "password", required: true, minLength: 8, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 127,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700", children: showPassword ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 128,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 122,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-700", children: "Confirm Password" }, void 0, false, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 135,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: showConfirm ? "text" : "password", id: "confirmPassword", name: "confirmPassword", required: true, minLength: 8, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 139,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setShowConfirm(!showConfirm), className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700", children: showConfirm ? "\u{1F441}\uFE0F" : "\u{1F441}\uFE0F\u200D\u{1F5E8}\uFE0F" }, void 0, false, {
            fileName: "app/routes/auth.register.tsx",
            lineNumber: 140,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/auth.register.tsx",
          lineNumber: 138,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 134,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition", children: isLoading ? "Creating account..." : "Create account" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 146,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 110,
      columnNumber: 9
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-center text-sm text-gray-600", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/auth/login", className: "font-medium text-blue-600 hover:text-blue-700", children: "Sign in" }, void 0, false, {
        fileName: "app/routes/auth.register.tsx",
        lineNumber: 153,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/auth.register.tsx",
      lineNumber: 151,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/auth.register.tsx",
    lineNumber: 104,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "app/routes/auth.register.tsx",
    lineNumber: 103,
    columnNumber: 10
  }, this);
}
_s(RegisterPage, "oLYoD/vX7RsGk2d+0WGSMAIYY98=", false, function() {
  return [useActionData, useNavigation];
});
_c = RegisterPage;
var _c;
$RefreshReg$(_c, "RegisterPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  RegisterPage as default,
  meta
};
//# sourceMappingURL=/build/routes/auth.register-CI6OQHJJ.js.map
