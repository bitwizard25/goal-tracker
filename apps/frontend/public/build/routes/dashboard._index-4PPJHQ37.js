import "/build/_shared/chunk-XDREJOWK.js";
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
import "/build/_shared/chunk-TOPOK74T.js";
import "/build/_shared/chunk-VT56GUPO.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/routes/dashboard._index.tsx
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\dashboard._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\dashboard._index.tsx"
  );
  import.meta.hot.lastModified = "1772367914953.3958";
}
var meta = () => [{
  title: "Dashboard - Goal Tracker"
}];
function DashboardPage() {
  _s();
  const data = useLoaderData();
  const {
    user,
    stats,
    recentTasks
  } = data;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Goal Tracker" }, void 0, false, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 68,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: user.email }, void 0, false, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 70,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { className: "rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700", children: "Logout" }, void 0, false, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 71,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 69,
        columnNumber: 13
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 67,
      columnNumber: 11
    }, this) }, void 0, false, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 66,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 65,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Total Points" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 84,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-blue-600", children: user.total_points }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 85,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 83,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Current Level" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 88,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-green-600", children: user.current_level }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 89,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 87,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Streak" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 92,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-orange-600", children: [
            user.streak_count,
            " days"
          ] }, void 0, true, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 93,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 91,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Tasks Today" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 96,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-purple-600", children: [
            stats.tasks_completed_today,
            "/",
            stats.tasks_today
          ] }, void 0, true, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 97,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 95,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 82,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 grid grid-cols-1 gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Energy Level" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 106,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: "Current" }, void 0, false, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 109,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold text-blue-600", children: [
                stats.energy_average,
                "/10"
              ] }, void 0, true, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 110,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 108,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-blue-600", style: {
              width: `${stats.energy_average / 10 * 100}%`
            } }, void 0, false, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 113,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 112,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 107,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 105,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Mood" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 121,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: "Current" }, void 0, false, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 124,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-2xl font-bold text-green-600", children: [
                stats.mood_average,
                "/10"
              ] }, void 0, true, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 125,
                columnNumber: 17
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 123,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 h-2 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-green-600", style: {
              width: `${stats.mood_average / 10 * 100}%`
            } }, void 0, false, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 128,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 127,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 122,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 120,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 104,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Today's Tasks" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 139,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/tasks/new", className: "text-sm text-blue-600 hover:text-blue-700", children: "Add Task" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 140,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 138,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 space-y-2", children: recentTasks.map((task) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", checked: task.status === "completed", className: "h-4 w-4 rounded border-gray-300", readOnly: true }, void 0, false, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 148,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-medium text-gray-900", children: task.title }, void 0, false, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 150,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-500", children: [
                "Difficulty: ",
                ["Easy", "Medium", "Hard", "Very Hard", "Extreme"][task.difficulty - 1]
              ] }, void 0, true, {
                fileName: "app/routes/dashboard._index.tsx",
                lineNumber: 151,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/dashboard._index.tsx",
              lineNumber: 149,
              columnNumber: 19
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 147,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: `rounded-full px-3 py-1 text-xs font-medium ${task.status === "completed" ? "bg-green-100 text-green-700" : task.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`, children: task.status === "completed" ? "Done" : task.status === "in_progress" ? "In Progress" : "Pending" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 156,
            columnNumber: 17
          }, this)
        ] }, task.id, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 146,
          columnNumber: 38
        }, this)) }, void 0, false, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 145,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 137,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-12 grid grid-cols-1 gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/goals/long-term/new", className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl", children: "\u{1F3AF}" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 166,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 font-semibold text-gray-900", children: "Create Long-term Goal" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 167,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Build your vision for the future" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 168,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/goals/short-term/new", className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl", children: "\u{1F4C5}" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 172,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 font-semibold text-gray-900", children: "Create Short-term Goal" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 173,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Set milestones for progress" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 174,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 171,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Link, { to: "/analytics", className: "rounded-lg border border-gray-200 bg-white p-6 text-center hover:shadow-md transition", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl", children: "\u{1F4CA}" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 178,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "mt-2 font-semibold text-gray-900", children: "View Analytics" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Track your progress and insights" }, void 0, false, {
            fileName: "app/routes/dashboard._index.tsx",
            lineNumber: 180,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/dashboard._index.tsx",
          lineNumber: 177,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/dashboard._index.tsx",
        lineNumber: 164,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/dashboard._index.tsx",
      lineNumber: 80,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/dashboard._index.tsx",
    lineNumber: 63,
    columnNumber: 10
  }, this);
}
_s(DashboardPage, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = DashboardPage;
var _c;
$RefreshReg$(_c, "DashboardPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  DashboardPage as default,
  meta
};
//# sourceMappingURL=/build/routes/dashboard._index-4PPJHQ37.js.map
