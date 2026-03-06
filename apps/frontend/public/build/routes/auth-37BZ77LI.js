import {
  Outlet
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

// app/routes/auth.tsx
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
if (!window.$RefreshReg$ || !window.$RefreshSig$ || !window.$RefreshRuntime$) {
  console.warn("remix:hmr: React Fast Refresh only works when the Remix compiler is running in development mode.");
} else {
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = (type, id) => {
    window.$RefreshRuntime$.register(type, '"app\\\\routes\\\\auth.tsx"' + id);
  };
  window.$RefreshSig$ = window.$RefreshRuntime$.createSignatureFunctionForTransform;
}
var prevRefreshReg;
var prevRefreshSig;
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\auth.tsx"
  );
  import.meta.hot.lastModified = "1772353506347.5454";
}
function AuthLayout() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)(Outlet, {}, void 0, false, {
    fileName: "app/routes/auth.tsx",
    lineNumber: 23,
    columnNumber: 10
  }, this);
}
_c = AuthLayout;
var _c;
$RefreshReg$(_c, "AuthLayout");
window.$RefreshReg$ = prevRefreshReg;
window.$RefreshSig$ = prevRefreshSig;
export {
  AuthLayout as default
};
//# sourceMappingURL=/build/routes/auth-37BZ77LI.js.map
