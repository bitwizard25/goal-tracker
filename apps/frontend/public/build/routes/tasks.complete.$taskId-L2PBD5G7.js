import {
  require_node
} from "/build/_shared/chunk-NBEH4DGX.js";
import "/build/_shared/chunk-DJPMYOIT.js";
import "/build/_shared/chunk-XDREJOWK.js";
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

// app/routes/tasks.complete.$taskId.tsx
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
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\tasks.complete.$taskId.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
var _s = $RefreshSig$();
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\tasks.complete.$taskId.tsx"
  );
  import.meta.hot.lastModified = "1772368585452.2246";
}
var meta = () => [{
  title: "Complete Task - Goal Tracker"
}];
function CompleteTaskPage() {
  _s();
  const navigation = useNavigation();
  const [moodBefore, setMoodBefore] = (0, import_react2.useState)(5);
  const [moodAfter, setMoodAfter] = (0, import_react2.useState)(7);
  const [energyBefore, setEnergyBefore] = (0, import_react2.useState)(5);
  const [energyAfter, setEnergyAfter] = (0, import_react2.useState)(7);
  const [effort, setEffort] = (0, import_react2.useState)(3);
  const [time, setTime] = (0, import_react2.useState)("30");
  const [flowState, setFlowState] = (0, import_react2.useState)(false);
  const isLoading = navigation.state === "submitting";
  const moodImprovement = moodAfter - moodBefore;
  const energyChange = energyAfter - energyBefore;
  const estimatedPoints = Math.round((30 * effort + moodImprovement * 10 + energyChange * 5 + (flowState ? 50 : 0)) / 10);
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "min-h-screen bg-gradient-to-b from-blue-50 to-gray-50", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("header", { className: "border-b border-gray-200 bg-white", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "text-2xl font-bold text-gray-900", children: "Complete Task" }, void 0, false, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 114,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-1 text-sm text-gray-600", children: "Track how you felt during this task" }, void 0, false, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 115,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 113,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 112,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("main", { className: "mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Form, { method: "post", className: "space-y-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your mood before starting? ",
          moodBefore,
          "/10"
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 123,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", name: "mood_before", min: "1", max: "10", value: moodBefore, onChange: (e) => setMoodBefore(parseInt(e.target.value)), className: "w-full" }, void 0, false, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 127,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F622} Terrible" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 129,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F610} Neutral" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 130,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F604} Amazing" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 131,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 128,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 126,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 122,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your mood now? ",
          moodAfter,
          "/10"
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 138,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", name: "mood_after", min: "1", max: "10", value: moodAfter, onChange: (e) => setMoodAfter(parseInt(e.target.value)), className: "w-full" }, void 0, false, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 142,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F622} Terrible" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 144,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F610} Neutral" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 145,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1F604} Amazing" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 146,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 143,
            columnNumber: 15
          }, this),
          moodImprovement !== 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm font-medium text-green-600", children: [
            moodImprovement > 0 ? "+" : "",
            moodImprovement,
            " mood change"
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 148,
            columnNumber: 41
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 141,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 137,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How was your energy before? ",
          energyBefore,
          "/10"
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 156,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", name: "energy_before", min: "1", max: "10", value: energyBefore, onChange: (e) => setEnergyBefore(parseInt(e.target.value)), className: "w-full" }, void 0, false, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 160,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1FAAB} Exhausted" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 162,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u26A1 Energized" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 163,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 161,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 159,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 155,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How is your energy now? ",
          energyAfter,
          "/10"
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 170,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4", children: [
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "range", name: "energy_after", min: "1", max: "10", value: energyAfter, onChange: (e) => setEnergyAfter(parseInt(e.target.value)), className: "w-full" }, void 0, false, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 174,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-2 flex justify-between text-xs text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u{1FAAB} Exhausted" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 176,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { children: "\u26A1 Energized" }, void 0, false, {
              fileName: "app/routes/tasks.complete.$taskId.tsx",
              lineNumber: 177,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 175,
            columnNumber: 15
          }, this),
          energyChange !== 0 && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "mt-2 text-sm font-medium text-blue-600", children: [
            energyChange > 0 ? "+" : "",
            energyChange,
            " energy change"
          ] }, void 0, true, {
            fileName: "app/routes/tasks.complete.$taskId.tsx",
            lineNumber: 179,
            columnNumber: 38
          }, this)
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 173,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 169,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { className: "block text-sm font-medium text-gray-700", children: [
          "How much effort did this task require? ",
          effort,
          "/5"
        ] }, void 0, true, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 187,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "mt-4 flex gap-2", children: [1, 2, 3, 4, 5].map((level) => /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "button", onClick: () => setEffort(level), className: `flex-1 rounded-md py-2 font-medium transition ${effort === level ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`, children: ["\u{1F7E2}", "\u{1F7E1}", "\u{1F7E0}", "\u{1F534}", "\u{1F534}"][level - 1] }, level, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 191,
          columnNumber: 45
        }, this)) }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 190,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 186,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "completion_time_minutes", className: "block text-sm font-medium text-gray-700", children: "How long did it take? (minutes)" }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 199,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "number", id: "completion_time_minutes", name: "completion_time_minutes", value: time, onChange: (e) => setTime(e.target.value), min: "1", className: "mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 202,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 198,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "flex items-center gap-3 rounded-lg bg-blue-50 p-4", children: [
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("input", { type: "checkbox", id: "flow_state_detected", name: "flow_state_detected", checked: flowState, onChange: (e) => setFlowState(e.target.checked), className: "h-4 w-4 rounded border-gray-300" }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 207,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("label", { htmlFor: "flow_state_detected", className: "flex-1 text-sm font-medium text-gray-700", children: "I was in a flow state (fully immersed and focused)" }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 208,
          columnNumber: 13
        }, this),
        flowState && /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "text-xl", children: "\u{1F30A}" }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 211,
          columnNumber: 27
        }, this)
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 206,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("div", { className: "rounded-lg border border-green-200 bg-green-50 p-4", children: /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("p", { className: "text-sm text-green-800", children: [
        "You'll earn approximately ",
        /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("span", { className: "font-bold text-green-900", children: estimatedPoints }, void 0, false, {
          fileName: "app/routes/tasks.complete.$taskId.tsx",
          lineNumber: 217,
          columnNumber: 41
        }, this),
        " points for completing this task!"
      ] }, void 0, true, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 216,
        columnNumber: 13
      }, this) }, void 0, false, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 215,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("button", { type: "submit", disabled: isLoading, className: "w-full rounded-md bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition text-lg", children: isLoading ? "Recording..." : "\u2713 Mark as Complete" }, void 0, false, {
        fileName: "app/routes/tasks.complete.$taskId.tsx",
        lineNumber: 222,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 120,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "app/routes/tasks.complete.$taskId.tsx",
      lineNumber: 119,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "app/routes/tasks.complete.$taskId.tsx",
    lineNumber: 111,
    columnNumber: 10
  }, this);
}
_s(CompleteTaskPage, "3rbu8mkhudWwcymdP+YgcmO6sjE=", false, function() {
  return [useNavigation];
});
_c = CompleteTaskPage;
var _c;
$RefreshReg$(_c, "CompleteTaskPage");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  CompleteTaskPage as default,
  meta
};
//# sourceMappingURL=/build/routes/tasks.complete.$taskId-L2PBD5G7.js.map
