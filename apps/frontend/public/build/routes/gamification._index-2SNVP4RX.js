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

// app/routes/gamification._index.tsx
var import_auth = __toESM(require_auth(), 1);
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\gamification._index.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\gamification._index.tsx"
  );
  import.meta.hot.lastModified = "1772368534892.865";
}
var meta = () => [{
  title: "Gamification - Goal Tracker"
}];
function GamificationPage() {
  _s();
  const data = useLoaderData();
  const {
    user,
    achievements,
    leaderboard,
    recentAchievements
  } = data;
  const levels = [{
    level: 1,
    minPoints: 0,
    name: "Novice",
    color: "bg-gray-500"
  }, {
    level: 2,
    minPoints: 100,
    name: "Beginner",
    color: "bg-green-500"
  }, {
    level: 3,
    minPoints: 250,
    name: "Intermediate",
    color: "bg-blue-500"
  }, {
    level: 4,
    minPoints: 500,
    name: "Advanced",
    color: "bg-purple-500"
  }, {
    level: 5,
    minPoints: 1e3,
    name: "Expert",
    color: "bg-yellow-500"
  }, {
    level: 6,
    minPoints: 1500,
    name: "Master",
    color: "bg-red-500"
  }, {
    level: 7,
    minPoints: 2e3,
    name: "Legend",
    color: "bg-pink-500"
  }];
  const currentLevel = levels.find((l) => l.level === user.current_level) || levels[0];
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Gamification" }, void 0, false, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 178,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Earn points, unlock achievements, and climb the leaderboard" }, void 0, false, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 179,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 177,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 176,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `rounded-lg ${currentLevel.color} p-6 text-white shadow-lg`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium opacity-90", children: "Current Level" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 188,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-4xl font-bold", children: user.current_level }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 189,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm opacity-90", children: currentLevel.name }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 190,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 187,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Total Points" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 195,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-4xl font-bold text-blue-600", children: user.total_points }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 196,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: [
            user.experience_percentage,
            "% to next level"
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 197,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 194,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Current Streak" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 202,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-4xl font-bold text-orange-600", children: user.streak_count }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 203,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "days" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 204,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 201,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm font-medium text-gray-600", children: "Best Streak" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 209,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-4xl font-bold text-green-600", children: user.streak_best }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 210,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-xs text-gray-500", children: "days" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 211,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 208,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 185,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8 rounded-lg bg-white border border-gray-200 p-6 shadow-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Experience Progress" }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 217,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm text-gray-600", children: [
              user.current_level,
              " \u2192 ",
              user.current_level + 1
            ] }, void 0, true, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 220,
              columnNumber: 15
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-sm font-medium text-gray-900", children: [
              user.experience_percentage,
              "%"
            ] }, void 0, true, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 223,
              columnNumber: 15
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 219,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 h-4 w-full rounded-full bg-gray-200", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500", style: {
            width: `${user.experience_percentage}%`
          } }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 226,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 225,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 218,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 216,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-8", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold text-gray-900", children: "Achievements" }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 235,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Unlock achievements by reaching milestones" }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 236,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", children: achievements.map((achievement) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `rounded-lg border p-4 transition ${achievement.unlocked ? "bg-white border-gray-200 shadow-sm hover:shadow-md" : "bg-gray-50 border-gray-200 opacity-60"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-3xl", children: achievement.icon }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 242,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h3", { className: "font-semibold text-gray-900", children: achievement.title }, void 0, false, {
                  fileName: "app/routes/gamification._index.tsx",
                  lineNumber: 244,
                  columnNumber: 23
                }, this),
                /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-gray-600", children: achievement.description }, void 0, false, {
                  fileName: "app/routes/gamification._index.tsx",
                  lineNumber: 245,
                  columnNumber: 23
                }, this)
              ] }, void 0, true, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 243,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 241,
              columnNumber: 19
            }, this),
            achievement.unlocked && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "inline-block h-6 w-6 rounded-full bg-green-100 text-center text-sm text-green-700", children: "\u2713" }, void 0, false, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 248,
              columnNumber: 44
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 240,
            columnNumber: 17
          }, this),
          achievement.unlocked && achievement.date && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-xs text-gray-500", children: [
            "Unlocked ",
            new Date(achievement.date).toLocaleDateString()
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 252,
            columnNumber: 62
          }, this)
        ] }, achievement.id, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 239,
          columnNumber: 46
        }, this)) }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 238,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 234,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold text-gray-900", children: "Global Leaderboard" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 262,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("table", { className: "w-full", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("thead", { className: "border-b border-gray-200 bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Rank" }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 267,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "User" }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 268,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Points" }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 269,
                columnNumber: 21
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Streak" }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 270,
                columnNumber: 21
              }, this)
            ] }, void 0, true, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 266,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 265,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tbody", { className: "divide-y divide-gray-200", children: leaderboard.map((entry) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("tr", { className: entry.username === "You" ? "bg-blue-50" : "", children: [
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 text-sm font-semibold text-gray-900", children: entry.rank === 1 ? "\u{1F947}" : entry.rank === 2 ? "\u{1F948}" : entry.rank === 3 ? "\u{1F949}" : `#${entry.rank}` }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 275,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 text-sm font-medium text-gray-900", children: entry.username }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 278,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 text-sm text-gray-600", children: entry.points.toLocaleString() }, void 0, false, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 279,
                columnNumber: 23
              }, this),
              /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("td", { className: "px-6 py-4 text-sm text-gray-600", children: [
                entry.streak,
                " days"
              ] }, void 0, true, {
                fileName: "app/routes/gamification._index.tsx",
                lineNumber: 280,
                columnNumber: 23
              }, this)
            ] }, entry.rank, true, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 274,
              columnNumber: 45
            }, this)) }, void 0, false, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 273,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 264,
            columnNumber: 15
          }, this) }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 263,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 261,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-xl font-bold text-gray-900", children: "Recent Unlocks" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 289,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 space-y-4", children: recentAchievements.length === 0 ? /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-gray-600", children: "No recent achievements yet!" }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 291,
            columnNumber: 50
          }, this) : recentAchievements.map((achievement, i) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "font-semibold text-green-900", children: achievement.title }, void 0, false, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 292,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-xs text-green-700", children: new Date(achievement.date).toLocaleDateString() }, void 0, false, {
              fileName: "app/routes/gamification._index.tsx",
              lineNumber: 293,
              columnNumber: 21
            }, this)
          ] }, i, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 291,
            columnNumber: 164
          }, this)) }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 290,
            columnNumber: 13
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 288,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 260,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h2", { className: "text-lg font-semibold text-gray-900", children: "Level Progression" }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 303,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4", children: levels.map((level) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: `rounded-lg p-4 ${level.level <= user.current_level ? `${level.color} text-white` : "bg-gray-100 text-gray-700"}`, children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-2xl font-bold", children: [
            "Level ",
            level.level
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 306,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm font-medium", children: level.name }, void 0, false, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 307,
            columnNumber: 17
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-xs opacity-90", children: [
            level.minPoints,
            "+ points"
          ] }, void 0, true, {
            fileName: "app/routes/gamification._index.tsx",
            lineNumber: 308,
            columnNumber: 17
          }, this)
        ] }, level.level, true, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 305,
          columnNumber: 34
        }, this)) }, void 0, false, {
          fileName: "app/routes/gamification._index.tsx",
          lineNumber: 304,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/gamification._index.tsx",
        lineNumber: 302,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/gamification._index.tsx",
      lineNumber: 183,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/gamification._index.tsx",
    lineNumber: 175,
    columnNumber: 10
  }, this);
}
_s(GamificationPage, "5thj+e1edPyRpKif1JmVRC6KArE=", false, function() {
  return [useLoaderData];
});
_c = GamificationPage;
var _c;
$RefreshReg$(_c, "GamificationPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  GamificationPage as default,
  meta
};
//# sourceMappingURL=/build/routes/gamification._index-2SNVP4RX.js.map
