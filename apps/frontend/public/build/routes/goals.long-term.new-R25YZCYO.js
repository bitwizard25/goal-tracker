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

// app/routes/goals.long-term.new.tsx
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
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\goals.long-term.new.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\goals.long-term.new.tsx"
  );
  import.meta.hot.lastModified = "1772368043808.93";
}
var meta = () => [{
  title: "Create Long-term Goal - Goal Tracker"
}];
function CreateLongTermGoal() {
  _s();
  const navigation = useNavigation();
  const [activeStep, setActiveStep] = (0, import_react2.useState)("basic");
  const isLoading = navigation.state === "submitting";
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Create Long-term Goal" }, void 0, false, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 85,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Define your vision with the SMART framework" }, void 0, false, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 86,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 84,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 83,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveStep("basic"), className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "basic" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`, children: "Basic Info" }, void 0, false, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 94,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveStep("smart"), className: `px-4 py-2 rounded-lg font-medium transition ${activeStep === "smart" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`, children: "SMART Framework" }, void 0, false, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 97,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 93,
        columnNumber: 11
      }, this),
      activeStep === "basic" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "title", className: "block text-sm font-medium text-gray-700", children: "Goal Title *" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 105,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "text", id: "title", name: "title", required: true, placeholder: "e.g., Learn Spanish fluently", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 108,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 104,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-700", children: "Description *" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 112,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "description", name: "description", required: true, rows: 4, placeholder: "Describe your goal in detail...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 115,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 111,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-3", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "target_date", className: "block text-sm font-medium text-gray-700", children: "Target Date *" }, void 0, false, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 120,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "date", id: "target_date", name: "target_date", required: true, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 123,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 119,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "category", className: "block text-sm font-medium text-gray-700", children: "Category *" }, void 0, false, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 127,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "category", name: "category", required: true, className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "", children: "Select a category" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 131,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "health", children: "Health & Fitness" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 132,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "career", children: "Career" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 133,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "education", children: "Education" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 134,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "relationships", children: "Relationships" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 135,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "finance", children: "Finance" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 136,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "personal", children: "Personal Development" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 137,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 130,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 126,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "priority", className: "block text-sm font-medium text-gray-700", children: "Priority" }, void 0, false, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 142,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("select", { id: "priority", name: "priority", defaultValue: "medium", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "low", children: "Low" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 146,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "medium", children: "Medium" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 147,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("option", { value: "high", children: "High" }, void 0, false, {
                fileName: "app/routes/goals.long-term.new.tsx",
                lineNumber: 148,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/goals.long-term.new.tsx",
              lineNumber: 145,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 141,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 118,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveStep("smart"), className: "w-full rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition", children: "Next: SMART Framework" }, void 0, false, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 153,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 103,
        columnNumber: 38
      }, this),
      activeStep === "smart" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-6 rounded-lg border border-gray-200 bg-white p-6", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-md bg-blue-50 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-blue-800", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("strong", { children: "SMART Goals:" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 162,
            columnNumber: 19
          }, this),
          " Define your goal using Specific, Measurable, Achievable, Relevant, and Time-bound criteria."
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 161,
          columnNumber: 17
        }, this) }, void 0, false, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 160,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "specific", className: "block text-sm font-medium text-gray-700", children: "Specific - What exactly do you want to achieve?" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 167,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "specific", name: "specific", rows: 3, placeholder: "Be as specific as possible...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 170,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 166,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "measurable", className: "block text-sm font-medium text-gray-700", children: "Measurable - How will you measure progress?" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 174,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "measurable", name: "measurable", rows: 3, placeholder: "Define metrics and milestones...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 177,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 173,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "achievable", className: "block text-sm font-medium text-gray-700", children: "Achievable - Is this goal realistic?" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 181,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "achievable", name: "achievable", rows: 3, placeholder: "Explain why this goal is achievable...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 184,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 180,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "relevant", className: "block text-sm font-medium text-gray-700", children: "Relevant - Why does this matter to you?" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 188,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "relevant", name: "relevant", rows: 3, placeholder: "Connect to your values and larger vision...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 191,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 187,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "time_bound", className: "block text-sm font-medium text-gray-700", children: "Time-bound - What's your timeline?" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 195,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("textarea", { id: "time_bound", name: "time_bound", rows: 3, placeholder: "Define key dates and deadlines...", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 198,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 194,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setActiveStep("basic"), className: "flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 transition", children: "Back" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 202,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: "flex-1 rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition", children: isLoading ? "Creating..." : "Create Goal" }, void 0, false, {
            fileName: "app/routes/goals.long-term.new.tsx",
            lineNumber: 205,
            columnNumber: 17
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals.long-term.new.tsx",
          lineNumber: 201,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals.long-term.new.tsx",
        lineNumber: 159,
        columnNumber: 38
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 91,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/goals.long-term.new.tsx",
      lineNumber: 90,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/goals.long-term.new.tsx",
    lineNumber: 82,
    columnNumber: 10
  }, this);
}
_s(CreateLongTermGoal, "S+OmDbP9P6br55MXvKCDAbbPkrQ=", false, function() {
  return [useNavigation];
});
_c = CreateLongTermGoal;
var _c;
$RefreshReg$(_c, "CreateLongTermGoal");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  CreateLongTermGoal as default,
  meta
};
//# sourceMappingURL=/build/routes/goals.long-term.new-R25YZCYO.js.map
