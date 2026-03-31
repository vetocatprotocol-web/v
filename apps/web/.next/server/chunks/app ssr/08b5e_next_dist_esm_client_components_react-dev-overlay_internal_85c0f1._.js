module.exports = {

"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parse-component-stack.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "parseComponentStack": ()=>parseComponentStack
});
function parseComponentStack(componentStack) {
    const componentStackFrames = [];
    for (const line of componentStack.trim().split("\n")){
        // Get component and file from the component stack line
        const match = /at ([^ ]+)( \((.*)\))?/.exec(line);
        if (match == null ? void 0 : match[1]) {
            const component = match[1];
            const webpackFile = match[3];
            // Stop parsing the component stack if we reach a Next.js component
            if (webpackFile == null ? void 0 : webpackFile.includes("next/dist")) {
                break;
            }
            const modulePath = webpackFile == null ? void 0 : webpackFile.replace(/^(webpack-internal:\/\/\/|file:\/\/)(\(.*\)\/)?/, "");
            var _modulePath_split;
            const [file, lineNumber, column] = (_modulePath_split = modulePath == null ? void 0 : modulePath.split(":")) != null ? _modulePath_split : [];
            componentStackFrames.push({
                component,
                file,
                lineNumber: lineNumber ? Number(lineNumber) : undefined,
                column: column ? Number(column) : undefined
            });
        }
    }
    return componentStackFrames;
} //# sourceMappingURL=parse-component-stack.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/get-socket-url.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "getSocketUrl": ()=>getSocketUrl
});
function getSocketProtocol(assetPrefix) {
    let protocol = window.location.protocol;
    try {
        // assetPrefix is a url
        protocol = new URL(assetPrefix).protocol;
    } catch (e) {}
    return protocol === "http:" ? "ws" : "wss";
}
function getSocketUrl(assetPrefix) {
    const { hostname, port } = window.location;
    const protocol = getSocketProtocol(assetPrefix);
    const normalizedAssetPrefix = assetPrefix.replace(/^\/+/, "");
    let url = protocol + "://" + hostname + ":" + port + (normalizedAssetPrefix ? "/" + normalizedAssetPrefix : "");
    if (normalizedAssetPrefix.startsWith("http")) {
        url = protocol + "://" + normalizedAssetPrefix.split("://")[1];
    }
    return url;
} //# sourceMappingURL=get-socket-url.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-websocket.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "useSendMessage": ()=>useSendMessage,
    "useTurbopack": ()=>useTurbopack,
    "useWebsocket": ()=>useWebsocket,
    "useWebsocketPing": ()=>useWebsocketPing
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/contexts/app-router-context.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$get$2d$socket$2d$url$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/get-socket-url.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
function useWebsocket(assetPrefix) {
    const webSocketRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useRef"]();
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useEffect"](()=>{
        if (webSocketRef.current) {
            return;
        }
        const url = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$get$2d$socket$2d$url$2e$js__$28$ecmascript$29$__["getSocketUrl"](assetPrefix);
        webSocketRef.current = new window.WebSocket("" + url + "/_next/webpack-hmr");
    }, [
        assetPrefix
    ]);
    return webSocketRef;
}
function useSendMessage(webSocketRef) {
    const sendMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useCallback"]((data)=>{
        const socket = webSocketRef.current;
        if (!socket || socket.readyState !== socket.OPEN) {
            return;
        }
        return socket.send(data);
    }, [
        webSocketRef
    ]);
    return sendMessage;
}
function useTurbopack(sendMessage) {
    const turbopackState = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useRef"]({
        init: false,
        // Until the dynamic import resolves, queue any turbopack messages which will be replayed.
        queue: [],
        callback: undefined
    });
    const processTurbopackMessage = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useCallback"]((msg)=>{
        var _msg_type;
        if ("type" in msg && ((_msg_type = msg.type) == null ? void 0 : _msg_type.startsWith("turbopack-"))) {
            const { callback, queue } = turbopackState.current;
            if (callback) {
                callback(msg);
            } else {
                queue.push(msg);
            }
            return true;
        }
        return false;
    }, []);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useEffect"](()=>{
        const { current: initCurrent } = turbopackState;
        // TODO(WEB-1589): only install if `process.turbopack` set.
        if (initCurrent.init) {
            return;
        }
        initCurrent.init = true;
        __turbopack_require__("[turbopack]/dev/client/hmr-client.ts (ecmascript, loader, app ssr)")(__turbopack_import__).then((param)=>{
            let { connect } = param;
            const { current } = turbopackState;
            connect({
                addMessageListener (cb) {
                    current.callback = cb;
                    // Replay all Turbopack messages before we were able to establish the HMR client.
                    for (const msg of current.queue){
                        cb(msg);
                    }
                    current.queue = undefined;
                },
                sendMessage
            });
        });
    }, [
        sendMessage
    ]);
    return processTurbopackMessage;
}
function useWebsocketPing(websocketRef) {
    const sendMessage = useSendMessage(websocketRef);
    const { tree } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useContext"](__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$contexts$2f$app$2d$router$2d$context$2e$js__$28$ecmascript$29$__["GlobalLayoutRouterContext"]);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useEffect"](()=>{
        // Taken from on-demand-entries-client.js
        const interval = setInterval(()=>{
            sendMessage(JSON.stringify({
                event: "ping",
                tree,
                appDirRoute: true
            }));
        }, 2500);
        return ()=>clearInterval(interval);
    }, [
        tree,
        sendMessage
    ]);
} //# sourceMappingURL=use-websocket.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/hydration-error-info.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "hydrationErrorComponentStack": ()=>hydrationErrorComponentStack,
    "hydrationErrorWarning": ()=>hydrationErrorWarning,
    "patchConsoleError": ()=>patchConsoleError
});
let hydrationErrorWarning;
let hydrationErrorComponentStack;
// https://github.com/facebook/react/blob/main/packages/react-dom/src/__tests__/ReactDOMHydrationDiff-test.js used as a reference
const knownHydrationWarnings = new Set([
    'Warning: Text content did not match. Server: "%s" Client: "%s"%s',
    "Warning: Expected server HTML to contain a matching <%s> in <%s>.%s",
    'Warning: Expected server HTML to contain a matching text node for "%s" in <%s>.%s',
    "Warning: Did not expect server HTML to contain a <%s> in <%s>.%s",
    'Warning: Did not expect server HTML to contain the text node "%s" in <%s>.%s'
]);
function patchConsoleError() {
    const prev = console.error;
    console.error = function(msg, serverContent, clientContent, componentStack) {
        if (knownHydrationWarnings.has(msg)) {
            hydrationErrorWarning = msg.replace("%s", serverContent).replace("%s", clientContent).replace("%s", "");
            hydrationErrorComponentStack = componentStack;
        }
        // @ts-expect-error argument is defined
        prev.apply(console, arguments);
    };
} //# sourceMappingURL=hydration-error-info.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-error-handler.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "RuntimeErrorHandler": ()=>RuntimeErrorHandler,
    "useErrorHandler": ()=>useErrorHandler
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/hydration-error-info.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/is-next-router-error.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
const RuntimeErrorHandler = {
    hadRuntimeError: false
};
function isHydrationError(error) {
    return error.message.match(/(hydration|content does not match|did not match)/i) != null;
}
if (typeof window !== "undefined") {
    try {
        // Increase the number of stack frames on the client
        Error.stackTraceLimit = 50;
    } catch (e) {}
}
const errorQueue = [];
const rejectionQueue = [];
const errorHandlers = [];
const rejectionHandlers = [];
if (typeof window !== "undefined") {
    // These event handlers must be added outside of the hook because there is no
    // guarantee that the hook will be alive in a mounted component in time to
    // when the errors occur.
    window.addEventListener("error", (ev)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$is$2d$next$2d$router$2d$error$2e$js__$28$ecmascript$29$__["isNextRouterError"](ev.error)) {
            ev.preventDefault();
            return;
        }
        const error = ev == null ? void 0 : ev.error;
        if (!error || !(error instanceof Error) || typeof error.stack !== "string") {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        if (isHydrationError(error) && !error.message.includes("https://nextjs.org/docs/messages/react-hydration-error")) {
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$28$ecmascript$29$__["hydrationErrorWarning"]) {
                // The patched console.error found hydration errors logged by React
                // Append the logged warning to the error message
                error.message += "\n\n" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$28$ecmascript$29$__["hydrationErrorWarning"];
            }
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$28$ecmascript$29$__["hydrationErrorComponentStack"]) {
                error._componentStack = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$hydration$2d$error$2d$info$2e$js__$28$ecmascript$29$__["hydrationErrorComponentStack"];
            }
            error.message += "\n\nSee more info here: https://nextjs.org/docs/messages/react-hydration-error";
        }
        const e = error;
        errorQueue.push(e);
        for (const handler of errorHandlers){
            handler(e);
        }
    });
    window.addEventListener("unhandledrejection", (ev)=>{
        const reason = ev == null ? void 0 : ev.reason;
        if (!reason || !(reason instanceof Error) || typeof reason.stack !== "string") {
            // A non-error was thrown, we don't have anything to show. :-(
            return;
        }
        const e = reason;
        rejectionQueue.push(e);
        for (const handler of rejectionHandlers){
            handler(e);
        }
    });
}
function useErrorHandler(handleOnUnhandledError, handleOnUnhandledRejection) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useEffect"](()=>{
        // Handle queued errors.
        errorQueue.forEach(handleOnUnhandledError);
        rejectionQueue.forEach(handleOnUnhandledRejection);
        // Listen to new errors.
        errorHandlers.push(handleOnUnhandledError);
        rejectionHandlers.push(handleOnUnhandledRejection);
        return ()=>{
            // Remove listeners.
            errorHandlers.splice(errorHandlers.indexOf(handleOnUnhandledError), 1);
            rejectionHandlers.splice(rejectionHandlers.indexOf(handleOnUnhandledRejection), 1);
        };
    }, [
        handleOnUnhandledError,
        handleOnUnhandledRejection
    ]);
} //# sourceMappingURL=use-error-handler.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/noop-template.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "noop": ()=>noop
});
function noop(strings) {
    for(var _len = arguments.length, keys = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        keys[_key - 1] = arguments[_key];
    }
    const lastIndex = strings.length - 1;
    return strings.slice(0, lastIndex).reduce((p, s, i)=>p + s + keys[i], "") + strings[lastIndex];
} //# sourceMappingURL=noop-template.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/use-open-in-editor.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "useOpenInEditor": ()=>useOpenInEditor
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function useOpenInEditor(param) {
    let { file, lineNumber, column } = param === void 0 ? {} : param;
    const openInEditor = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__["useCallback"](()=>{
        if (file == null || lineNumber == null || column == null) return;
        const params = new URLSearchParams();
        params.append("file", file);
        params.append("lineNumber", String(lineNumber));
        params.append("column", String(column));
        self.fetch((("TURBOPACK compile-time value", JSON.parse('""')) || "") + "/__nextjs_launch-editor?" + params.toString()).then(()=>{}, ()=>{
            console.error("There was an issue opening this code in your editor.");
        });
    }, [
        file,
        lineNumber,
        column
    ]);
    return openInEditor;
} //# sourceMappingURL=use-open-in-editor.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/stack-frame.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "getFrameSource": ()=>getFrameSource,
    "getOriginalStackFrame": ()=>getOriginalStackFrame,
    "getOriginalStackFrames": ()=>getOriginalStackFrames
});
function getOriginalStackFrame(source, type, errorMessage) {
    var _source_file, _source_file1;
    async function _getOriginalStackFrame() {
        var /* collapsed */ _source_file, _body_originalStackFrame_file, _body_originalStackFrame;
        const params = new URLSearchParams();
        params.append("isServer", String(type === "server"));
        params.append("isEdgeServer", String(type === "edge-server"));
        params.append("isAppDirectory", "true");
        params.append("errorMessage", errorMessage);
        for(const key in source){
            var _source_key;
            params.append(key, ((_source_key = source[key]) != null ? _source_key : "").toString());
        }
        const controller = new AbortController();
        const tm = setTimeout(()=>controller.abort(), 3000);
        const res = await self.fetch((("TURBOPACK compile-time value", JSON.parse('""')) || "") + "/__nextjs_original-stack-frame?" + params.toString(), {
            signal: controller.signal
        }).finally(()=>{
            clearTimeout(tm);
        });
        if (!res.ok || res.status === 204) {
            return Promise.reject(new Error(await res.text()));
        }
        const body = await res.json();
        var _ref;
        return {
            error: false,
            reason: null,
            external: false,
            expanded: !Boolean((_ref = ((_source_file = source.file) == null ? void 0 : _source_file.includes("node_modules")) || ((_body_originalStackFrame = body.originalStackFrame) == null ? void 0 : (_body_originalStackFrame_file = _body_originalStackFrame.file) == null ? void 0 : _body_originalStackFrame_file.includes("node_modules"))) != null ? _ref : true),
            sourceStackFrame: source,
            originalStackFrame: body.originalStackFrame,
            originalCodeFrame: body.originalCodeFrame || null,
            sourcePackage: body.sourcePackage
        };
    }
    if (!(((_source_file = source.file) == null ? void 0 : _source_file.startsWith("webpack-internal:")) || ((_source_file1 = source.file) == null ? void 0 : _source_file1.startsWith("file:")))) {
        return Promise.resolve({
            error: false,
            reason: null,
            external: true,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        });
    }
    var _err_message, _ref;
    return _getOriginalStackFrame().catch((err)=>({
            error: true,
            reason: (_ref = (_err_message = err == null ? void 0 : err.message) != null ? _err_message : err == null ? void 0 : err.toString()) != null ? _ref : "Unknown Error",
            external: false,
            expanded: false,
            sourceStackFrame: source,
            originalStackFrame: null,
            originalCodeFrame: null
        }));
}
function getOriginalStackFrames(frames, type, errorMessage) {
    return Promise.all(frames.map((frame)=>getOriginalStackFrame(frame, type, errorMessage)));
}
function getFrameSource(frame) {
    let str = "";
    try {
        var _globalThis_location;
        const u = new URL(frame.file);
        // Strip the origin for same-origin scripts.
        if (typeof globalThis !== "undefined" && ((_globalThis_location = globalThis.location) == null ? void 0 : _globalThis_location.origin) !== u.origin) {
            // URLs can be valid without an `origin`, so long as they have a
            // `protocol`. However, `origin` is preferred.
            if (u.origin === "null") {
                str += u.protocol;
            } else {
                str += u.origin;
            }
        }
        // Strip query string information as it's typically too verbose to be
        // meaningful.
        str += u.pathname;
        str += " ";
    } catch (e) {
        str += (frame.file || "(unknown)") + " ";
    }
    if (frame.lineNumber != null) {
        if (frame.column != null) {
            str += "(" + frame.lineNumber + ":" + frame.column + ") ";
        } else {
            str += "(" + frame.lineNumber + ") ";
        }
    }
    return str.slice(0, -1);
} //# sourceMappingURL=stack-frame.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/group-stack-frames-by-framework.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

/**
 * Get the origin framework of the stack frame by package name.
 */ __turbopack_esm__({
    "groupStackFramesByFramework": ()=>groupStackFramesByFramework
});
function getFramework(sourcePackage) {
    if (!sourcePackage) return undefined;
    if (/^(react|react-dom|react-is|react-refresh|react-server-dom-webpack|react-server-dom-turbopack|scheduler)$/.test(sourcePackage)) {
        return "react";
    } else if (sourcePackage === "next") {
        return "next";
    }
    return undefined;
}
function groupStackFramesByFramework(stackFrames) {
    const stackFramesGroupedByFramework = [];
    for (const stackFrame of stackFrames){
        const currentGroup = stackFramesGroupedByFramework[stackFramesGroupedByFramework.length - 1];
        const framework = getFramework(stackFrame.sourcePackage);
        if (currentGroup && currentGroup.framework === framework) {
            currentGroup.stackFrames.push(stackFrame);
        } else {
            stackFramesGroupedByFramework.push({
                framework: framework,
                stackFrames: [
                    stackFrame
                ]
            });
        }
    }
    return stackFramesGroupedByFramework;
} //# sourceMappingURL=group-stack-frames-by-framework.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/nodeStackFrames.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "decorateServerError": ()=>decorateServerError,
    "getErrorSource": ()=>getErrorSource,
    "getFilesystemFrame": ()=>getFilesystemFrame,
    "getServerError": ()=>getServerError
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/stacktrace-parser/stack-trace-parser.cjs.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function getFilesystemFrame(frame) {
    const f = {
        ...frame
    };
    if (typeof f.file === "string") {
        if (f.file.startsWith("/") || // Win32:
        /^[a-z]:\\/i.test(f.file) || // Win32 UNC:
        f.file.startsWith("\\\\")) {
            f.file = "file://" + f.file;
        }
    }
    return f;
}
const symbolError = Symbol("NextjsError");
function getErrorSource(error) {
    return error[symbolError] || null;
}
function decorateServerError(error, type) {
    Object.defineProperty(error, symbolError, {
        writable: false,
        enumerable: false,
        configurable: false,
        value: type
    });
}
function getServerError(error, type) {
    let n;
    try {
        throw new Error(error.message);
    } catch (e) {
        n = e;
    }
    n.name = error.name;
    try {
        n.stack = n.toString() + "\n" + __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$28$ecmascript$29$__["parse"](error.stack).map(getFilesystemFrame).map((f)=>{
            let str = "    at " + f.methodName;
            if (f.file) {
                let loc = f.file;
                if (f.lineNumber) {
                    loc += ":" + f.lineNumber;
                    if (f.column) {
                        loc += ":" + f.column;
                    }
                }
                str += " (" + loc + ")";
            }
            return str;
        }).join("\n");
    } catch (e) {
        n.stack = error.stack;
    }
    decorateServerError(n, type);
    return n;
} //# sourceMappingURL=nodeStackFrames.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/getErrorByType.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "getErrorByType": ()=>getErrorByType
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/error-overlay-reducer.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$nodeStackFrames$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/nodeStackFrames.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$stack$2d$frame$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/stack-frame.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
async function getErrorByType(ev) {
    const { id, event } = ev;
    switch(event.type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"]:
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__["ACTION_UNHANDLED_REJECTION"]:
            {
                const readyRuntimeError = {
                    id,
                    runtime: true,
                    error: event.reason,
                    frames: await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$stack$2d$frame$2e$js__$28$ecmascript$29$__["getOriginalStackFrames"](event.frames, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$nodeStackFrames$2e$js__$28$ecmascript$29$__["getErrorSource"](event.reason), event.reason.toString())
                };
                if (event.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"]) {
                    readyRuntimeError.componentStackFrames = event.componentStackFrames;
                }
                return readyRuntimeError;
            }
        default:
            {
                break;
            }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = event;
    throw new Error("type system invariant violation");
} //# sourceMappingURL=getErrorByType.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parseStack.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "parseStack": ()=>parseStack
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/stacktrace-parser/stack-trace-parser.cjs.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const regexNextStatic = /\/_next(\/static\/.+)/g;
function parseStack(stack) {
    const frames = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$stacktrace$2d$parser$2f$stack$2d$trace$2d$parser$2e$cjs$2e$js__$28$ecmascript$29$__["parse"](stack);
    return frames.map((frame)=>{
        try {
            const url = new URL(frame.file);
            const res = regexNextStatic.exec(url.pathname);
            if (res) {
                var _process_env___NEXT_DIST_DIR_replace, _process_env___NEXT_DIST_DIR;
                const distDir = (_process_env___NEXT_DIST_DIR = process.env.__NEXT_DIST_DIR) == null ? void 0 : (_process_env___NEXT_DIST_DIR_replace = _process_env___NEXT_DIST_DIR.replace(/\\/g, "/")) == null ? void 0 : _process_env___NEXT_DIST_DIR_replace.replace(/\/$/, "");
                if (distDir) {
                    frame.file = "file://" + distDir.concat(res.pop());
                }
            }
        } catch (e) {}
        return frame;
    });
} //# sourceMappingURL=parseStack.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/CssReset.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "CssReset": ()=>CssReset
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/noop-template.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function _templateObject() {
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__["_"]([
        "\n        :host {\n          all: initial;\n\n          /* the direction property is not reset by 'all' */\n          direction: ltr;\n        }\n\n        /*!\n         * Bootstrap Reboot v4.4.1 (https://getbootstrap.com/)\n         * Copyright 2011-2019 The Bootstrap Authors\n         * Copyright 2011-2019 Twitter, Inc.\n         * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n         * Forked from Normalize.css, licensed MIT (https://github.com/necolas/normalize.css/blob/master/LICENSE.md)\n         */\n        *,\n        *::before,\n        *::after {\n          box-sizing: border-box;\n        }\n\n        :host {\n          font-family: sans-serif;\n          line-height: 1.15;\n          -webkit-text-size-adjust: 100%;\n          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n        }\n\n        article,\n        aside,\n        figcaption,\n        figure,\n        footer,\n        header,\n        hgroup,\n        main,\n        nav,\n        section {\n          display: block;\n        }\n\n        :host {\n          margin: 0;\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,\n            'Helvetica Neue', Arial, 'Noto Sans', sans-serif,\n            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',\n            'Noto Color Emoji';\n          font-size: 16px;\n          font-weight: 400;\n          line-height: 1.5;\n          color: #212529;\n          text-align: left;\n          background-color: #fff;\n        }\n\n        [tabindex='-1']:focus:not(:focus-visible) {\n          outline: 0 !important;\n        }\n\n        hr {\n          box-sizing: content-box;\n          height: 0;\n          overflow: visible;\n        }\n\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6 {\n          margin-top: 0;\n          margin-bottom: 8px;\n        }\n\n        p {\n          margin-top: 0;\n          margin-bottom: 16px;\n        }\n\n        abbr[title],\n        abbr[data-original-title] {\n          text-decoration: underline;\n          -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n          cursor: help;\n          border-bottom: 0;\n          -webkit-text-decoration-skip-ink: none;\n          text-decoration-skip-ink: none;\n        }\n\n        address {\n          margin-bottom: 16px;\n          font-style: normal;\n          line-height: inherit;\n        }\n\n        ol,\n        ul,\n        dl {\n          margin-top: 0;\n          margin-bottom: 16px;\n        }\n\n        ol ol,\n        ul ul,\n        ol ul,\n        ul ol {\n          margin-bottom: 0;\n        }\n\n        dt {\n          font-weight: 700;\n        }\n\n        dd {\n          margin-bottom: 8px;\n          margin-left: 0;\n        }\n\n        blockquote {\n          margin: 0 0 16px;\n        }\n\n        b,\n        strong {\n          font-weight: bolder;\n        }\n\n        small {\n          font-size: 80%;\n        }\n\n        sub,\n        sup {\n          position: relative;\n          font-size: 75%;\n          line-height: 0;\n          vertical-align: baseline;\n        }\n\n        sub {\n          bottom: -0.25em;\n        }\n\n        sup {\n          top: -0.5em;\n        }\n\n        a {\n          color: #007bff;\n          text-decoration: none;\n          background-color: transparent;\n        }\n\n        a:hover {\n          color: #0056b3;\n          text-decoration: underline;\n        }\n\n        a:not([href]) {\n          color: inherit;\n          text-decoration: none;\n        }\n\n        a:not([href]):hover {\n          color: inherit;\n          text-decoration: none;\n        }\n\n        pre,\n        code,\n        kbd,\n        samp {\n          font-family: SFMono-Regular, Menlo, Monaco, Consolas,\n            'Liberation Mono', 'Courier New', monospace;\n          font-size: 1em;\n        }\n\n        pre {\n          margin-top: 0;\n          margin-bottom: 16px;\n          overflow: auto;\n        }\n\n        figure {\n          margin: 0 0 16px;\n        }\n\n        img {\n          vertical-align: middle;\n          border-style: none;\n        }\n\n        svg {\n          overflow: hidden;\n          vertical-align: middle;\n        }\n\n        table {\n          border-collapse: collapse;\n        }\n\n        caption {\n          padding-top: 12px;\n          padding-bottom: 12px;\n          color: #6c757d;\n          text-align: left;\n          caption-side: bottom;\n        }\n\n        th {\n          text-align: inherit;\n        }\n\n        label {\n          display: inline-block;\n          margin-bottom: 8px;\n        }\n\n        button {\n          border-radius: 0;\n        }\n\n        button:focus {\n          outline: 1px dotted;\n          outline: 5px auto -webkit-focus-ring-color;\n        }\n\n        input,\n        button,\n        select,\n        optgroup,\n        textarea {\n          margin: 0;\n          font-family: inherit;\n          font-size: inherit;\n          line-height: inherit;\n        }\n\n        button,\n        input {\n          overflow: visible;\n        }\n\n        button,\n        select {\n          text-transform: none;\n        }\n\n        select {\n          word-wrap: normal;\n        }\n\n        button,\n        [type='button'],\n        [type='reset'],\n        [type='submit'] {\n          -webkit-appearance: button;\n        }\n\n        button:not(:disabled),\n        [type='button']:not(:disabled),\n        [type='reset']:not(:disabled),\n        [type='submit']:not(:disabled) {\n          cursor: pointer;\n        }\n\n        button::-moz-focus-inner,\n        [type='button']::-moz-focus-inner,\n        [type='reset']::-moz-focus-inner,\n        [type='submit']::-moz-focus-inner {\n          padding: 0;\n          border-style: none;\n        }\n\n        input[type='radio'],\n        input[type='checkbox'] {\n          box-sizing: border-box;\n          padding: 0;\n        }\n\n        input[type='date'],\n        input[type='time'],\n        input[type='datetime-local'],\n        input[type='month'] {\n          -webkit-appearance: listbox;\n        }\n\n        textarea {\n          overflow: auto;\n          resize: vertical;\n        }\n\n        fieldset {\n          min-width: 0;\n          padding: 0;\n          margin: 0;\n          border: 0;\n        }\n\n        legend {\n          display: block;\n          width: 100%;\n          max-width: 100%;\n          padding: 0;\n          margin-bottom: 8px;\n          font-size: 24px;\n          line-height: inherit;\n          color: inherit;\n          white-space: normal;\n        }\n\n        progress {\n          vertical-align: baseline;\n        }\n\n        [type='number']::-webkit-inner-spin-button,\n        [type='number']::-webkit-outer-spin-button {\n          height: auto;\n        }\n\n        [type='search'] {\n          outline-offset: -2px;\n          -webkit-appearance: none;\n        }\n\n        [type='search']::-webkit-search-decoration {\n          -webkit-appearance: none;\n        }\n\n        ::-webkit-file-upload-button {\n          font: inherit;\n          -webkit-appearance: button;\n        }\n\n        output {\n          display: inline-block;\n        }\n\n        summary {\n          display: list-item;\n          cursor: pointer;\n        }\n\n        template {\n          display: none;\n        }\n\n        [hidden] {\n          display: none !important;\n        }\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
;
;
function CssReset() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("style", null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__["noop"](_templateObject()));
} //# sourceMappingURL=CssReset.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/ComponentStyles.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "ComponentStyles": ()=>ComponentStyles
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$CodeFrame$2f$styles$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/CodeFrame/styles.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Dialog$2f$index$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/Dialog/index.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$LeftRightDialogHeader$2f$styles$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/LeftRightDialogHeader/styles.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Overlay$2f$styles$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/Overlay/styles.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Terminal$2f$styles$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/Terminal/styles.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Toast$2f$index$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/Toast/index.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$VersionStalenessInfo$2f$index$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/VersionStalenessInfo/index.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$BuildError$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/BuildError.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RootLayoutError$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/RootLayoutError.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$Errors$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/Errors.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RuntimeError$2f$index$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/RuntimeError/index.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/noop-template.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function _templateObject() {
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__["_"]([
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        \n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n        ",
        "\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
;
;
;
;
;
;
;
;
;
;
;
;
;
function ComponentStyles() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("style", null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__["noop"](_templateObject(), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Overlay$2f$styles$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Toast$2f$index$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Dialog$2f$index$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$LeftRightDialogHeader$2f$styles$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$CodeFrame$2f$styles$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$Terminal$2f$styles$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$BuildError$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RootLayoutError$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$Errors$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RuntimeError$2f$index$2e$js__$28$ecmascript$29$__["styles"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$VersionStalenessInfo$2f$index$2e$js__$28$ecmascript$29$__["styles"]));
} //# sourceMappingURL=ComponentStyles.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/Base.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "Base": ()=>Base
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/noop-template.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function _templateObject() {
    const data = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$swc$2f$helpers$2f$esm$2f$_tagged_template_literal_loose$2e$js__$28$ecmascript$29$__["_"]([
        "\n        :host {\n          --size-gap-half: 4px;\n          --size-gap: 8px;\n          --size-gap-double: 16px;\n          --size-gap-triple: 24px;\n          --size-gap-quad: 32px;\n\n          --size-font-small: 14px;\n          --size-font: 16px;\n          --size-font-big: 20px;\n          --size-font-bigger: 24px;\n\n          --color-accents-1: #808080;\n          --color-accents-2: #222222;\n          --color-accents-3: #404040;\n\n          --font-stack-monospace: 'SFMono-Regular', Consolas, 'Liberation Mono',\n            Menlo, Courier, monospace;\n\n          --color-ansi-selection: rgba(95, 126, 151, 0.48);\n          --color-ansi-bg: #111111;\n          --color-ansi-fg: #cccccc;\n\n          --color-ansi-white: #777777;\n          --color-ansi-black: #141414;\n          --color-ansi-blue: #00aaff;\n          --color-ansi-cyan: #88ddff;\n          --color-ansi-green: #98ec65;\n          --color-ansi-magenta: #aa88ff;\n          --color-ansi-red: #ff5555;\n          --color-ansi-yellow: #ffcc33;\n          --color-ansi-bright-white: #ffffff;\n          --color-ansi-bright-black: #777777;\n          --color-ansi-bright-blue: #33bbff;\n          --color-ansi-bright-cyan: #bbecff;\n          --color-ansi-bright-green: #b6f292;\n          --color-ansi-bright-magenta: #cebbff;\n          --color-ansi-bright-red: #ff8888;\n          --color-ansi-bright-yellow: #ffd966;\n        }\n\n        .mono {\n          font-family: var(--font-stack-monospace);\n        }\n\n        h1,\n        h2,\n        h3,\n        h4,\n        h5,\n        h6 {\n          margin-bottom: var(--size-gap);\n          font-weight: 500;\n          line-height: 1.5;\n        }\n      "
    ]);
    _templateObject = function() {
        return data;
    };
    return data;
}
;
;
function Base() {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("style", null, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$noop$2d$template$2e$js__$28$ecmascript$29$__["noop"](_templateObject()));
} //# sourceMappingURL=Base.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/icons/CloseIcon.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "CloseIcon": ()=>CloseIcon
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const CloseIcon = ()=>{
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("path", {
        d: "M18 6L6 18",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("path", {
        d: "M6 6L18 18",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
    }));
};
;
 //# sourceMappingURL=CloseIcon.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/error-overlay-reducer.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "ACTION_BEFORE_REFRESH": ()=>ACTION_BEFORE_REFRESH,
    "ACTION_BUILD_ERROR": ()=>ACTION_BUILD_ERROR,
    "ACTION_BUILD_OK": ()=>ACTION_BUILD_OK,
    "ACTION_REFRESH": ()=>ACTION_REFRESH,
    "ACTION_UNHANDLED_ERROR": ()=>ACTION_UNHANDLED_ERROR,
    "ACTION_UNHANDLED_REJECTION": ()=>ACTION_UNHANDLED_REJECTION,
    "ACTION_VERSION_INFO": ()=>ACTION_VERSION_INFO,
    "INITIAL_OVERLAY_STATE": ()=>INITIAL_OVERLAY_STATE,
    "errorOverlayReducer": ()=>errorOverlayReducer
});
const ACTION_BUILD_OK = "build-ok";
const ACTION_BUILD_ERROR = "build-error";
const ACTION_BEFORE_REFRESH = "before-fast-refresh";
const ACTION_REFRESH = "fast-refresh";
const ACTION_UNHANDLED_ERROR = "unhandled-error";
const ACTION_UNHANDLED_REJECTION = "unhandled-rejection";
const ACTION_VERSION_INFO = "version-info";
const INITIAL_OVERLAY_STATE = {
    nextId: 1,
    buildError: null,
    errors: [],
    notFound: false,
    refreshState: {
        type: "idle"
    },
    versionInfo: {
        installed: "0.0.0",
        staleness: "unknown"
    }
};
function pushErrorFilterDuplicates(errors, err) {
    return [
        ...errors.filter((e)=>{
            // Filter out duplicate errors
            return e.event.reason !== err.event.reason;
        }),
        err
    ];
}
const errorOverlayReducer = (state, action)=>{
    switch(action.type){
        case ACTION_BUILD_OK:
            {
                return {
                    ...state,
                    buildError: null
                };
            }
        case ACTION_BUILD_ERROR:
            {
                return {
                    ...state,
                    buildError: action.message
                };
            }
        case ACTION_BEFORE_REFRESH:
            {
                return {
                    ...state,
                    refreshState: {
                        type: "pending",
                        errors: []
                    }
                };
            }
        case ACTION_REFRESH:
            {
                return {
                    ...state,
                    buildError: null,
                    errors: // and UNHANDLED_REJECTION events might be dispatched between the
                    // BEFORE_REFRESH and the REFRESH event. We want to keep those errors
                    // around until the next refresh. Otherwise we run into a race
                    // condition where those errors would be cleared on refresh completion
                    // before they can be displayed.
                    state.refreshState.type === "pending" ? state.refreshState.errors : [],
                    refreshState: {
                        type: "idle"
                    }
                };
            }
        case ACTION_UNHANDLED_ERROR:
        case ACTION_UNHANDLED_REJECTION:
            {
                switch(state.refreshState.type){
                    case "idle":
                        {
                            return {
                                ...state,
                                nextId: state.nextId + 1,
                                errors: pushErrorFilterDuplicates(state.errors, {
                                    id: state.nextId,
                                    event: action
                                })
                            };
                        }
                    case "pending":
                        {
                            return {
                                ...state,
                                nextId: state.nextId + 1,
                                refreshState: {
                                    ...state.refreshState,
                                    errors: pushErrorFilterDuplicates(state.refreshState.errors, {
                                        id: state.nextId,
                                        event: action
                                    })
                                }
                            };
                        }
                    default:
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const _ = state.refreshState;
                        return state;
                }
            }
        case ACTION_VERSION_INFO:
            {
                return {
                    ...state,
                    versionInfo: action.versionInfo
                };
            }
        default:
            {
                return state;
            }
    }
}; //# sourceMappingURL=error-overlay-reducer.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/hooks/use-on-click-outside.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "useOnClickOutside": ()=>useOnClickOutside
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
function useOnClickOutside(el, handler) {
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.useEffect(()=>{
        if (el == null || handler == null) {
            return;
        }
        const listener = (e)=>{
            // Do nothing if clicking ref's element or descendent elements
            if (!el || el.contains(e.target)) {
                return;
            }
            handler(e);
        };
        const root = el.getRootNode();
        root.addEventListener("mousedown", listener);
        root.addEventListener("touchstart", listener);
        return function() {
            root.removeEventListener("mousedown", listener);
            root.removeEventListener("touchstart", listener);
        };
    }, [
        handler,
        el
    ]);
} //# sourceMappingURL=use-on-click-outside.js.map

})()),
"[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/ReactDevOverlay.js (ecmascript, app ssr)": (({ r: __turbopack_require__, f: __turbopack_require_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, l: __turbopack_load__, j: __turbopack_dynamic__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/error-overlay-reducer.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$ShadowPortal$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/components/ShadowPortal.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$BuildError$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/BuildError.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$Errors$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/Errors.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RootLayoutError$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/container/RootLayoutError.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parseStack$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/helpers/parseStack.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$Base$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/Base.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$ComponentStyles$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/ComponentStyles.js (ecmascript, app ssr)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$CssReset$2e$js__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/esm/client/components/react-dev-overlay/internal/styles/CssReset.js (ecmascript, app ssr)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
;
;
;
;
;
;
class ReactDevOverlay extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.PureComponent {
    static getDerivedStateFromError(error) {
        const e = error;
        const event = {
            type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$error$2d$overlay$2d$reducer$2e$js__$28$ecmascript$29$__["ACTION_UNHANDLED_ERROR"],
            reason: error,
            frames: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$helpers$2f$parseStack$2e$js__$28$ecmascript$29$__["parseStack"](e.stack)
        };
        const errorEvent = {
            id: 0,
            event
        };
        return {
            reactError: errorEvent
        };
    }
    componentDidCatch(componentErr) {
        this.props.onReactError(componentErr);
    }
    render() {
        const { state, children } = this.props;
        const { reactError } = this.state;
        const hasBuildError = state.buildError != null;
        const hasRuntimeErrors = Boolean(state.errors.length);
        const rootLayoutMissingTagsError = state.rootLayoutMissingTagsError;
        const isMounted = hasBuildError || hasRuntimeErrors || reactError || rootLayoutMissingTagsError;
        return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.Fragment, null, reactError ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("html", null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("head", null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement("body", null)) : children, isMounted ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$components$2f$ShadowPortal$2e$js__$28$ecmascript$29$__["ShadowPortal"], null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$CssReset$2e$js__$28$ecmascript$29$__["CssReset"], null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$Base$2e$js__$28$ecmascript$29$__["Base"], null), /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$styles$2f$ComponentStyles$2e$js__$28$ecmascript$29$__["ComponentStyles"], null), rootLayoutMissingTagsError ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$RootLayoutError$2e$js__$28$ecmascript$29$__["RootLayoutError"], {
            missingTags: rootLayoutMissingTagsError.missingTags
        }) : hasBuildError ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$BuildError$2e$js__$28$ecmascript$29$__["BuildError"], {
            message: state.buildError,
            versionInfo: state.versionInfo
        }) : reactError ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$Errors$2e$js__$28$ecmascript$29$__["Errors"], {
            versionInfo: state.versionInfo,
            initialDisplayState: "fullscreen",
            errors: [
                reactError
            ]
        }) : hasRuntimeErrors ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$28$ecmascript$29$__.createElement(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$react$2d$dev$2d$overlay$2f$internal$2f$container$2f$Errors$2e$js__$28$ecmascript$29$__["Errors"], {
            initialDisplayState: "minimized",
            errors: state.errors,
            versionInfo: state.versionInfo
        }) : undefined) : undefined);
    }
    constructor(...args){
        super(...args);
        this.state = {
            reactError: null
        };
    }
}
const __TURBOPACK__default__export__ = ReactDevOverlay;
 //# sourceMappingURL=ReactDevOverlay.js.map

})()),

};

//# sourceMappingURL=08b5e_next_dist_esm_client_components_react-dev-overlay_internal_85c0f1._.js.map