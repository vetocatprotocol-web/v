(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/app/08b5e_next_dist_shared_lib_lazy-dynamic_5be4e0._.js", {

"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/no-ssr-error.js (ecmascript, app)": (function({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports }) { !function() {

// This has to be a shared module which is shared between client component error boundary and dynamic component
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "NEXT_DYNAMIC_NO_SSR_CODE", {
    enumerable: true,
    get: function() {
        return NEXT_DYNAMIC_NO_SSR_CODE;
    }
});
const NEXT_DYNAMIC_NO_SSR_CODE = "NEXT_DYNAMIC_NO_SSR_CODE"; //# sourceMappingURL=no-ssr-error.js.map

}.call(this) }),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-no-ssr.js (ecmascript, app)": (function({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, k: __turbopack_refresh__, m: module, e: exports }) { !function() {

"use client";
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    suspense: null,
    NoSSR: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    suspense: function() {
        return suspense;
    },
    NoSSR: function() {
        return NoSSR;
    }
});
const _nossrerror = __turbopack_require__("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/no-ssr-error.js (ecmascript, app)");
function suspense() {
    const error = new Error(_nossrerror.NEXT_DYNAMIC_NO_SSR_CODE);
    error.digest = _nossrerror.NEXT_DYNAMIC_NO_SSR_CODE;
    throw error;
}
function NoSSR(param) {
    let { children } = param;
    if (typeof window === "undefined") {
        suspense();
    }
    return children;
} //# sourceMappingURL=dynamic-no-ssr.js.map

}.call(this) }),
}]);

//# sourceMappingURL=08b5e_next_dist_shared_lib_lazy-dynamic_5be4e0._.js.map