import "/build/_shared/chunk-DJPMYOIT.js";
import "/build/_shared/chunk-XDREJOWK.js";
import {
  require_auth
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
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

// app/routes/analytics._index.tsx
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\analytics._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\analytics._index.tsx"
  );
  import.meta.hot.lastModified = "1772368577117.794";
}
var meta = () => [{
  title: "Analytics - Goal Tracker"
}];
function AnalyticsPage() {
  _s();
  const data = useLoaderData();
  const {
    stats,
    dailyData,
    categoryBreakdown,
    insights
  } = data;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Analytics" }, void 0, false, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 169,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Insights into your goal-setting progress" }, void 0, false, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 170,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 168,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 167,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "This Week" }, void 0, false, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 177,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "Tasks Completed" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 180,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-blue-600", children: [
              stats.thisWeek.tasksCompleted,
              "/",
              stats.thisWeek.tasksTotal
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 181,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: [
              Math.round(stats.thisWeek.tasksCompleted / stats.thisWeek.tasksTotal * 100),
              "%"
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 184,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 179,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "Avg Mood" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 190,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-green-600", children: stats.thisWeek.averageMood.toFixed(1) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 191,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "/10" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 192,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 189,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "Avg Energy" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 196,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-purple-600", children: stats.thisWeek.averageEnergy.toFixed(1) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 197,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "/10" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 198,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "Flow States" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 202,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-cyan-600", children: stats.thisWeek.flowStateSessions }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 203,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "sessions" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 204,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 201,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "Points Earned" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 208,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-yellow-600", children: stats.thisWeek.totalPoints }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 209,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "this week" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 210,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 207,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-4 shadow-sm", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: "This Month" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 214,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-2xl font-bold text-orange-600", children: stats.thisMonth.totalPoints }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 215,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "points" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 216,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 213,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 178,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 176,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Weekly Overview" }, void 0, false, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 223,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "space-y-4", children: dailyData.map((day) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-sm mb-1", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: day.date }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 228,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium text-gray-900", children: [
              day.tasks,
              " tasks"
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 229,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 227,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex-1", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-2 rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-blue-600", style: {
              width: `${day.tasks / 7 * 100}%`
            } }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 234,
              columnNumber: 25
            }, this) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 233,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 232,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "w-16 text-xs", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-600", children: [
              "\u{1F610} ",
              day.mood,
              " \u{1F4AA} ",
              day.energy
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 240,
              columnNumber: 23
            }, this) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 239,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 231,
            columnNumber: 19
          }, this)
        ] }, day.date, true, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 226,
          columnNumber: 37
        }, this)) }, void 0, false, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 225,
          columnNumber: 13
        }, this) }, void 0, false, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 224,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 222,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Tasks by Category" }, void 0, false, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 251,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 space-y-4", children: categoryBreakdown.map((cat) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between text-sm mb-1", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-gray-700", children: cat.category }, void 0, false, {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 255,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-medium text-gray-900", children: [
                cat.count,
                " tasks"
              ] }, void 0, true, {
                fileName: "app/routes/analytics._index.tsx",
                lineNumber: 256,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 254,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-3 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500", style: {
              width: `${cat.percentage}%`
            } }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 259,
              columnNumber: 21
            }, this) }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 258,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: [
              cat.percentage,
              "% of total"
            ] }, void 0, true, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 263,
              columnNumber: 19
            }, this)
          ] }, cat.category, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 253,
            columnNumber: 45
          }, this)) }, void 0, false, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 252,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 250,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Insights" }, void 0, false, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 270,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 space-y-4", children: insights.map((insight, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `rounded-lg p-4 text-sm ${insight.type === "positive" ? "bg-green-50 text-green-800 border border-green-200" : insight.type === "attention" ? "bg-yellow-50 text-yellow-800 border border-yellow-200" : "bg-blue-50 text-blue-800 border border-blue-200"}`, children: insight.text }, i, false, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 272,
            columnNumber: 45
          }, this)) }, void 0, false, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 271,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 269,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 249,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "All-Time Statistics" }, void 0, false, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 281,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 grid grid-cols-2 gap-4 md:grid-cols-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Total Tasks" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 284,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-blue-600", children: stats.allTime.tasksCompleted }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 285,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 283,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Goals Completed" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 288,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-green-600", children: stats.allTime.goalsCompleted }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 289,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 287,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Best Streak" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 292,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-orange-600", children: stats.allTime.streakBest }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 293,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 291,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "Total Points" }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 296,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-3xl font-bold text-purple-600", children: stats.allTime.totalPoints }, void 0, false, {
              fileName: "app/routes/analytics._index.tsx",
              lineNumber: 297,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/analytics._index.tsx",
            lineNumber: 295,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/analytics._index.tsx",
          lineNumber: 282,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/analytics._index.tsx",
        lineNumber: 280,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/analytics._index.tsx",
      lineNumber: 174,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/analytics._index.tsx",
    lineNumber: 166,
    columnNumber: 10
  }, this);
}
_s(AnalyticsPage, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = AnalyticsPage;
var _c;
$RefreshReg$(_c, "AnalyticsPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AnalyticsPage as default,
  meta
};
//# sourceMappingURL=/build/routes/analytics._index-DDWYCQLT.js.map
