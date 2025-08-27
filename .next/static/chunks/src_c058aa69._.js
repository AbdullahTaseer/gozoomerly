(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn() {
    for(var _len = arguments.length, inputs = new Array(_len), _key = 0; _key < _len; _key++){
        inputs[_key] = arguments[_key];
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/accordion.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Accordion",
    ()=>Accordion,
    "AccordionContent",
    ()=>AccordionContent,
    "AccordionItem",
    ()=>AccordionItem,
    "AccordionTrigger",
    ()=>AccordionTrigger
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Accordion(param) {
    let { ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "accordion",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Accordion;
function AccordionItem(param) {
    let { className, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "accordion-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-[#F3F3F3] rounded-md px-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = AccordionItem;
function AccordionTrigger(param) {
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
            "data-slot": "accordion-trigger",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-[16px] cursor-pointer max-[600px]:text-[14px] font-semibold transition-all outline-none", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionIcon, {}, void 0, false, {
                    fileName: "[project]/src/components/ui/accordion.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/accordion.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_c2 = AccordionTrigger;
function AccordionIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-muted-foreground border h-[20px] w-[20px] flex justify-center items-center border-[#020C13] group-data-[state=open]:border-pink-600 rounded-full pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                className: "size-4 text-black group-data-[state=open]:hidden"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/accordion.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                className: "size-4 text-pink-600 hidden group-data-[state=open]:block"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/accordion.tsx",
                lineNumber: 54,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c3 = AccordionIcon;
function AccordionContent(param) {
    let { className, children, ...props } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
        "data-slot": "accordion-content",
        className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-[14px] max-[600px]:text-[12px]",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("pt-0 pb-4", className),
            children: children
        }, void 0, false, {
            fileName: "[project]/src/components/ui/accordion.tsx",
            lineNumber: 70,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 65,
        columnNumber: 5
    }, this);
}
_c4 = AccordionContent;
;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Accordion");
__turbopack_context__.k.register(_c1, "AccordionItem");
__turbopack_context__.k.register(_c2, "AccordionTrigger");
__turbopack_context__.k.register(_c3, "AccordionIcon");
__turbopack_context__.k.register(_c4, "AccordionContent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing.1073205d.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 492,
    height: 663,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-2.40e7c77f.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-2.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 227,
    height: 300,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-3.4d86e750.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-3.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 227,
    height: 300,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-4.188b0216.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-4.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 227,
    height: 300,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-5.496c2970.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-5.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 227,
    height: 300,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/HowZoomerlyWorks.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-2.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-3.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-4.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-5.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const steps = [
    {
        title: "Create Your Board",
        desc: "Choose an event type (birthday, wedding, concert, graduation, family gathering, or surprise). Add the celebrated person or star.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Invite People",
        desc: "Share your board by link, SMS, or email. Control privacy settings. Add co admins if needed.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Collect Memories",
        desc: "Friends and family add wishes, photos, videos, captions, and even voice notes. Every contribution becomes part of the story.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Wish + Gift",
        desc: "Contributors can write a heartfelt wish, attach media, and add a gift if they like. Goals update live with fun gift stickers.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Celebrate & Relive",
        desc: "Surprise boards deliver on a chosen day, while event boards are live and collaborative. Either way, your memories are saved forever.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    }
];
const SCROLL_INTERVAL = 2000;
const HowZoomerlyWorks = ()=>{
    _s();
    const [activeStep, setActiveStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HowZoomerlyWorks.useEffect": ()=>{
            const handleScroll = {
                "HowZoomerlyWorks.useEffect.handleScroll": ()=>{
                    const scrollY = window.scrollY;
                    const stepIndex = Math.min(Math.floor(scrollY / SCROLL_INTERVAL), steps.length - 1);
                    setActiveStep(stepIndex);
                }
            }["HowZoomerlyWorks.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            return ({
                "HowZoomerlyWorks.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["HowZoomerlyWorks.useEffect"];
        }
    }["HowZoomerlyWorks.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-[10000px] bg-gray-50 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "sticky top-0 h-screen flex flex-col items-center justify-center px-[5%] max-[769px]:px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-center text-[30px] max-[600px]:text-[24px] font-bold",
                    children: "How Zoomerly Works"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mt-12 max-[600px]:mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-2 flex justify-center max-lg:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: steps[activeStep].img,
                                alt: "Step Image",
                                className: "rounded-[20px] w-full h-auto object-cover transition-all duration-700 ease-in-out"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                            lineNumber: 67,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-3 space-y-3",
                            children: steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-3 transition-all duration-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-semibold text-2xl border-l-2 border-[#D9D9D9] pl-3 duration-300 ".concat(index === activeStep ? "text-pink-600 border-pink-600" : "text-gray-700"),
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 border-l-2 border-[#D9D9D9] pt-2 pl-3 line-clamp-2",
                                            children: step.desc
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                                            lineNumber: 87,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, index, true, {
                                    fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                                    lineNumber: 77,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                            lineNumber: 75,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                    lineNumber: 66,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
            lineNumber: 61,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
        lineNumber: 59,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HowZoomerlyWorks, "PXCJErOXCJ9m7SR2lIxR0D85v1g=");
_c = HowZoomerlyWorks;
const __TURBOPACK__default__export__ = HowZoomerlyWorks;
var _c;
__turbopack_context__.k.register(_c, "HowZoomerlyWorks");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/turn-birthday-into-moment-particles.8eb9b299.svg");}),
"[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg.mjs { IMAGE => \"[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg (static in ecmascript)\" } [app-client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 1086,
    height: 635,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/sections/StartYouFirstCelebration.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg.mjs { IMAGE => "[project]/src/assets/svgs/turn-birthday-into-moment-particles.svg (static in ecmascript)" } [app-client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/buttons/GlobalButton.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const cardData = [
    {
        title: "Campaign for Kim Kardashian!",
        birthday: "Birthday on Jun 4",
        followers: "1.4M",
        participated: "1.1M",
        wishes: "13000",
        gifts: "10000"
    },
    {
        title: "Support Maria's Mission!",
        birthday: "Birthday on Aug 15",
        followers: "890K",
        participated: "650K",
        wishes: "8900",
        gifts: "7200"
    },
    {
        title: "Join Farah's Cause!",
        birthday: "Birthday on Sep 22",
        followers: "2.1M",
        participated: "1.8M",
        wishes: "21000",
        gifts: "18500"
    }
];
const StartYourFirstCelebration = ()=>{
    _s();
    const [activeCardIndex, setActiveCardIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [visibleCards, setVisibleCards] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const sectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animateCardsSequentially = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "StartYourFirstCelebration.useCallback[animateCardsSequentially]": ()=>{
            setVisibleCards([]);
            cardData.forEach({
                "StartYourFirstCelebration.useCallback[animateCardsSequentially]": (_, index)=>{
                    setTimeout({
                        "StartYourFirstCelebration.useCallback[animateCardsSequentially]": ()=>{
                            setVisibleCards({
                                "StartYourFirstCelebration.useCallback[animateCardsSequentially]": (prev)=>[
                                        ...prev,
                                        index
                                    ]
                            }["StartYourFirstCelebration.useCallback[animateCardsSequentially]"]);
                        }
                    }["StartYourFirstCelebration.useCallback[animateCardsSequentially]"], index * 300); // 300ms delay between each card
                }
            }["StartYourFirstCelebration.useCallback[animateCardsSequentially]"]);
        }
    }["StartYourFirstCelebration.useCallback[animateCardsSequentially]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StartYourFirstCelebration.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "StartYourFirstCelebration.useEffect": (param)=>{
                    let [entry] = param;
                    if (entry.isIntersecting) {
                        animateCardsSequentially();
                    }
                }
            }["StartYourFirstCelebration.useEffect"], {
                threshold: 0.3
            });
            if (sectionRef.current) {
                observer.observe(sectionRef.current);
            }
            return ({
                "StartYourFirstCelebration.useEffect": ()=>observer.disconnect()
            })["StartYourFirstCelebration.useEffect"];
        }
    }["StartYourFirstCelebration.useEffect"], [
        animateCardsSequentially
    ]);
    const handleDotClick = (index)=>{
        setActiveCardIndex(index);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        ref: sectionRef,
        className: "relative px-[5%] max-[769px]:px-4 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "relative rounded-[20px] bg-gradient-to-b from-pink-500 via-pink-400 to-purple-500 text-white text-center px-6 py-12 overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$turn$2d$birthday$2d$into$2d$moment$2d$particles$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "Confetti Particles",
                    className: "absolute inset-0 w-full h-full object-cover pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 76,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-[30px] max-[600px]:text-[24px] font-bold mb-4",
                    children: "Turn Your Birthday Into a Movement."
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "max-w-3xl mx-auto text-[16px] leading-relaxed mb-6",
                    children: [
                        "Are you a creator, public figure, community leader or just someone passionate about making a difference? This year, let your birthday do more. ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold",
                            children: "Start a Spotlight Board"
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                            lineNumber: 88,
                            columnNumber: 49
                        }, ("TURBOPACK compile-time value", void 0)),
                        " to raise awareness, support a cause, or rally your community. It's public, purpose-driven, and made to inspire. Anyone can join in by sending wishes, sharing your story, or contributing a gift toward your mission. Your celebration becomes a platform for impact."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 86,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "font-semibold text-lg mb-8",
                    children: "🎂 Because some birthdays aren't just about cake they're about change."
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 94,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-center gap-4 mb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: "Explore Spotlight Birthdays",
                            bgColor: "white",
                            color: "#000000",
                            width: "220px",
                            hover: {
                                bgColor: 'white'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                            lineNumber: 99,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            title: "Create a Public Birthday Board",
                            bgColor: "transparent",
                            borderColor: "white",
                            borderWidth: "1px",
                            width: "220px",
                            hover: {
                                bgColor: 'transparent'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                            lineNumber: 100,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 98,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
            lineNumber: 74,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(StartYourFirstCelebration, "bulDOorxAy58/GjkttGkcceZ8qI=");
_c = StartYourFirstCelebration;
const __TURBOPACK__default__export__ = StartYourFirstCelebration;
var _c;
__turbopack_context__.k.register(_c, "StartYourFirstCelebration");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_c058aa69._.js.map