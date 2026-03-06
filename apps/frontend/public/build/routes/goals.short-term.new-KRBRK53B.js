import "/build/_shared/chunk-QEVVQF4B.js";
import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
import {
  require_auth
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
  Form,
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

// app/routes/goals.short-term.new.tsx
var import_react2 = __toESM(require_react(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_node = __toESM(require_node(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\goals.short-term.new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\goals.short-term.new.tsx"
  );
  import.meta.hot.lastModified = "1772368073009.054";
}
var meta = () => [{
  title: "Create Short-term Goal - Goal Tracker"
}];
function CreateShortTermGoal() {
  _s();
  const navigation = useNavigation();
  const [milestones, setMilestones] = (0, import_react2.useState)(["", "", ""]);
  const isLoading = navigation.state === "submitting";
  const addMilestone = () => {
    if (milestones.length < 5) {
      setMilestones([...milestones, ""]);
    }
  };
  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };
  const updateMilestone = (index, value) => {
    const newMilestones = [...milestones];
    newMilestones[index] = value;
    setMilestones(newMilestones);
  };
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Short-term Goal" }, void 0, false, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 101,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Break down your long-term vision into actionable milestones" }, void 0, false, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 102,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 100,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 99,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 110,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "title", name: "title", required: true, placeholder: "e.g., Complete Spanish Level 1 Course", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 113,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 109,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 117,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "priority", name: "priority", defaultValue: "medium", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "low", children: "Low" }, void 0, false, {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 121,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "medium", children: "Medium" }, void 0, false, {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 122,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "high", children: "High" }, void 0, false, {
              fileName: "app/routes/goals.short-term.new.tsx",
              lineNumber: 123,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 120,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 116,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 108,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 129,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "description", name: "description", required: true, rows: 4, placeholder: "What are you committing to achieve?", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 132,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 128,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "start_date", className: "block text-sm font-medium text-gray-700", children: "Start Date *" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 137,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "date", id: "start_date", name: "start_date", required: true, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 140,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 136,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "end_date", className: "block text-sm font-medium text-gray-700", children: "End Date *" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 144,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "date", id: "end_date", name: "end_date", required: true, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 147,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 143,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 135,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "long_term_goal_id", className: "block text-sm font-medium text-gray-700", children: "Link to Long-term Goal (Optional)" }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 152,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "long_term_goal_id", name: "long_term_goal_id", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "No long-term goal" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 156,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "goal-1", children: "Learn Spanish fluently" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 157,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "goal-2", children: "Build a successful business" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 158,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 155,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 151,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: "Milestones" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 164,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: addMilestone, disabled: milestones.length >= 5, className: "text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400", children: "Add Milestone" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 165,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 163,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 space-y-3", children: milestones.map((milestone, index) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", name: `milestone_${index}`, value: milestone, onChange: (e) => updateMilestone(index, e.target.value), placeholder: `Milestone ${index + 1}`, className: "flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 172,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => removeMilestone(index), className: "rounded-md border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50 transition", children: "Remove" }, void 0, false, {
            fileName: "app/routes/goals.short-term.new.tsx",
            lineNumber: 173,
            columnNumber: 19
          }, this)
        ] }, index, true, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 171,
          columnNumber: 53
        }, this)) }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 170,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 162,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => window.history.back(), className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition", children: "Cancel" }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 181,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition", children: isLoading ? "Creating..." : "Create Goal" }, void 0, false, {
          fileName: "app/routes/goals.short-term.new.tsx",
          lineNumber: 184,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.short-term.new.tsx",
        lineNumber: 180,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 107,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/goals.short-term.new.tsx",
      lineNumber: 106,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/goals.short-term.new.tsx",
    lineNumber: 98,
    columnNumber: 10
  }, this);
}
_s(CreateShortTermGoal, "QHP6/sjoMv/A90aheAM0HHyuOqI=", false, function() {
  return [useNavigation];
});
_c = CreateShortTermGoal;
var _c;
$RefreshReg$(_c, "CreateShortTermGoal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  CreateShortTermGoal as default,
  meta
};
//# sourceMappingURL=/build/routes/goals.short-term.new-KRBRK53B.js.map
