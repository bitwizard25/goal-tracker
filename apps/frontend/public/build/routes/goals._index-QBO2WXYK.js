import "/build/_shared/chunk-QEVVQF4B.js";
import {
  require_auth
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
  Link,
  useLoaderData
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

// app/routes/goals._index.tsx
var import_react2 = __toESM(require_react(), 1);
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\goals._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\goals._index.tsx"
  );
  import.meta.hot.lastModified = "1772368018531.324";
}
var meta = () => [{
  title: "Goals - Goal Tracker"
}];
function GoalsPage() {
  _s();
  const {
    longTermGoals,
    shortTermGoals
  } = useLoaderData();
  const [activeTab, setActiveTab] = (0, import_react2.useState)("long-term");
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Goals" }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 58,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/goals/long-term/new", className: "rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700", children: "+ Long-term Goal" }, void 0, false, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 60,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/goals/short-term/new", className: "rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700", children: "+ Short-term Goal" }, void 0, false, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 63,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 59,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 57,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 56,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 55,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-4 border-b border-gray-200", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab("long-term"), className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "long-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`, children: [
          "Long-term Goals (",
          longTermGoals.length,
          ")"
        ] }, void 0, true, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 74,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { onClick: () => setActiveTab("short-term"), className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === "short-term" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600 hover:text-gray-900"}`, children: [
          "Short-term Goals (",
          shortTermGoals.length,
          ")"
        ] }, void 0, true, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 77,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 73,
        columnNumber: 9
      }, this),
      activeTab === "long-term" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 space-y-4", children: longTermGoals.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "No long-term goals yet. Create one to get started!" }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 85,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 84,
        columnNumber: 43
      }, this) : longTermGoals.map((goal) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 90,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "active" ? "bg-green-100 text-green-700" : goal.status === "completed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`, children: goal.status === "active" ? "Active" : "Completed" }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 91,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 89,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Progress" }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 99,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium text-gray-900", children: [
                  goal.current_progress_percentage,
                  "%"
                ] }, void 0, true, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 100,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 98,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-1 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-blue-600", style: {
                width: `${goal.current_progress_percentage}%`
              } }, void 0, false, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 103,
                columnNumber: 29
              }, this) }, void 0, false, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 102,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 97,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Category:" }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 111,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900 capitalize", children: goal.category }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 112,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 110,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Priority:" }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 115,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900 capitalize", children: goal.priority }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 116,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 114,
                columnNumber: 27
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: "Target:" }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 119,
                  columnNumber: 29
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900", children: new Date(goal.target_date).toLocaleDateString() }, void 0, false, {
                  fileName: "app/routes/goals._index.tsx",
                  lineNumber: 120,
                  columnNumber: 29
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 118,
                columnNumber: 27
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 109,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 96,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 88,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-4 flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/goals/long-term/${goal._id}`, className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50", children: "View" }, void 0, false, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 129,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50", children: "Edit" }, void 0, false, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 132,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 128,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 87,
        columnNumber: 19
      }, this) }, goal._id, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 86,
        columnNumber: 50
      }, this)) }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 83,
        columnNumber: 39
      }, this),
      activeTab === "short-term" && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 space-y-4", children: shortTermGoals.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-8 text-center", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-gray-600", children: "No short-term goals yet. Create one to get started!" }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 143,
        columnNumber: 17
      }, this) }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 142,
        columnNumber: 44
      }, this) : shortTermGoals.map((goal) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "text-lg font-semibold text-gray-900", children: goal.title }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 148,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${goal.status === "in_progress" ? "bg-yellow-100 text-yellow-700" : goal.status === "completed" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`, children: goal.status === "in_progress" ? "In Progress" : "Completed" }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 149,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 147,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h4", { className: "text-sm font-medium text-gray-900", children: "Milestones" }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 155,
              columnNumber: 25
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 space-y-2", children: goal.milestones?.map((milestone) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: milestone.completed, className: "h-4 w-4 rounded border-gray-300", readOnly: true }, void 0, false, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 158,
                columnNumber: 31
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: milestone.completed ? "line-through text-gray-400" : "text-gray-700", children: milestone.title }, void 0, false, {
                fileName: "app/routes/goals._index.tsx",
                lineNumber: 159,
                columnNumber: 31
              }, this)
            ] }, milestone.id, true, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 157,
              columnNumber: 62
            }, this)) }, void 0, false, {
              fileName: "app/routes/goals._index.tsx",
              lineNumber: 156,
              columnNumber: 25
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 154,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-3 text-sm text-gray-600", children: [
            "Due: ",
            new Date(goal.end_date).toLocaleDateString()
          ] }, void 0, true, {
            fileName: "app/routes/goals._index.tsx",
            lineNumber: 166,
            columnNumber: 23
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 146,
          columnNumber: 21
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "ml-4 flex gap-2", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: `/goals/short-term/${goal._id}`, className: "rounded-md border border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50", children: "View" }, void 0, false, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 172,
          columnNumber: 23
        }, this) }, void 0, false, {
          fileName: "app/routes/goals._index.tsx",
          lineNumber: 171,
          columnNumber: 21
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 145,
        columnNumber: 19
      }, this) }, goal._id, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 144,
        columnNumber: 51
      }, this)) }, void 0, false, {
        fileName: "app/routes/goals._index.tsx",
        lineNumber: 141,
        columnNumber: 40
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/goals._index.tsx",
      lineNumber: 71,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/goals._index.tsx",
    lineNumber: 54,
    columnNumber: 10
  }, this);
}
_s(GoalsPage, "2BaA72rnbQ8kIJ+02s7E+pSEH08=", false, function() {
  return [useLoaderData];
});
_c = GoalsPage;
var _c;
$RefreshReg$(_c, "GoalsPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  GoalsPage as default,
  meta
};
//# sourceMappingURL=/build/routes/goals._index-QBO2WXYK.js.map
