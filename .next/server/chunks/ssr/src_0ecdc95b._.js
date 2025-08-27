module.exports = [
"[project]/src/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/src/components/ui/accordion.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-accordion/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-ssr] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function Accordion({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "accordion",
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
function AccordionItem({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "accordion-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-[#F3F3F3] rounded-md px-4", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/src/components/ui/accordion.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function AccordionTrigger({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Header"], {
        className: "flex",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Trigger"], {
            "data-slot": "accordion-trigger",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("group flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-[16px] cursor-pointer max-[600px]:text-[14px] font-semibold transition-all outline-none", className),
            ...props,
            children: [
                children,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AccordionIcon, {}, void 0, false, {
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
function AccordionIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "text-muted-foreground border h-[20px] w-[20px] flex justify-center items-center border-[#020C13] group-data-[state=open]:border-pink-600 rounded-full pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                className: "size-4 text-black group-data-[state=open]:hidden"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/accordion.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
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
function AccordionContent({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$accordion$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Content"], {
        "data-slot": "accordion-content",
        className: "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-[14px] max-[600px]:text-[12px]",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("pt-0 pb-4", className),
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
;
}),
"[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing.1073205d.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-2.40e7c77f.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-2.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-3.4d86e750.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-3.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-4.188b0216.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-4.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/as-simple-as-wishing-5.496c2970.svg");}),
"[project]/src/assets/svgs/as-simple-as-wishing-5.svg.mjs { IMAGE => \"[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/components/sections/HowZoomerlyWorks.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-2.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-2.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-3.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-3.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-4.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-4.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/as-simple-as-wishing-5.svg.mjs { IMAGE => "[project]/src/assets/svgs/as-simple-as-wishing-5.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
"use client";
;
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
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Invite People",
        desc: `Share your board by link, SMS, or email. Control privacy settings. Add co admins if needed.`,
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Collect Memories",
        desc: "Friends and family add wishes, photos, videos, captions, and even voice notes. Every contribution becomes part of the story.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Wish + Gift",
        desc: "Contributors can write a heartfelt wish, attach media, and add a gift if they like. Goals update live with fun gift stickers.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    },
    {
        title: "Celebrate & Relive",
        desc: "Surprise boards deliver on a chosen day, while event boards are live and collaborative. Either way, your memories are saved forever.",
        img: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$as$2d$simple$2d$as$2d$wishing$2d$5$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"]
    }
];
const SCROLL_INTERVAL = 2000;
const HowZoomerlyWorks = ()=>{
    const [activeStep, setActiveStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const scrollY = window.scrollY;
            const stepIndex = Math.min(Math.floor(scrollY / SCROLL_INTERVAL), steps.length - 1);
            setActiveStep(stepIndex);
        };
        window.addEventListener("scroll", handleScroll);
        return ()=>window.removeEventListener("scroll", handleScroll);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-[10000px] bg-gray-50 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "sticky top-0 h-screen flex flex-col items-center justify-center px-[5%] max-[769px]:px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-center text-[30px] max-[600px]:text-[24px] font-bold",
                    children: "How Zoomerly Works"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                    lineNumber: 62,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-5 gap-8 items-center mt-12 max-[600px]:mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-2 flex justify-center max-lg:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-span-3 max-lg:col-span-1 space-y-3",
                            children: steps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `py-3 transition-all duration-500`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `font-semibold text-[24px] max-[1200px]:text-[18px] border-l-2 border-[#D9D9D9] pl-3 duration-300 ${index === activeStep ? "text-pink-600 border-pink-600" : "text-gray-700"}`,
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/sections/HowZoomerlyWorks.tsx",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
const __TURBOPACK__default__export__ = HowZoomerlyWorks;
}),
"[project]/src/assets/svgs/community-1.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/community-1.b28907d7.svg");}),
"[project]/src/assets/svgs/community-1.svg.mjs { IMAGE => \"[project]/src/assets/svgs/community-1.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/community-1.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 74,
    height: 74,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/community-2.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/community-2.20b393a3.svg");}),
"[project]/src/assets/svgs/community-2.svg.mjs { IMAGE => \"[project]/src/assets/svgs/community-2.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/community-2.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 74,
    height: 74,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/community-3.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/community-3.daa8f1b6.svg");}),
"[project]/src/assets/svgs/community-3.svg.mjs { IMAGE => \"[project]/src/assets/svgs/community-3.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/community-3.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 74,
    height: 74,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/community-4.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/community-4.831ed283.svg");}),
"[project]/src/assets/svgs/community-4.svg.mjs { IMAGE => \"[project]/src/assets/svgs/community-4.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/community-4.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 74,
    height: 74,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/components/sections/OurCommunityBoard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar-check.js [app-ssr] (ecmascript) <export default as CalendarCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/buttons/GlobalButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/community-1.svg.mjs { IMAGE => "[project]/src/assets/svgs/community-1.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/community-2.svg.mjs { IMAGE => "[project]/src/assets/svgs/community-2.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/community-3.svg.mjs { IMAGE => "[project]/src/assets/svgs/community-3.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/community-4.svg.mjs { IMAGE => "[project]/src/assets/svgs/community-4.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
"use client";
;
;
;
;
;
;
;
;
const boards = [
    {
        id: 1,
        avatar: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$1$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        title: "Sean's 40th Birthday Surprise Board",
        location: "Miami, FL",
        date: "03/12",
        description: "Let's send Sean to the Caribbean!",
        target: 3000,
        raised: 3850,
        contributors: 27,
        wishes: 27,
        gifters: 21,
        topContributors: [
            {
                name: "Team Crew",
                amount: 500
            },
            {
                name: "Mom & Dad",
                amount: 300
            },
            {
                name: "Anna",
                amount: 250
            }
        ]
    },
    {
        id: 2,
        avatar: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        title: "Asha & David's Wedding Board",
        location: "New York",
        date: "09/22",
        description: "Help us start our new life together!",
        target: 7500,
        raised: 8000,
        contributors: 112,
        wishes: 112,
        gifters: 89,
        topContributors: [
            {
                name: "Maya",
                amount: 200
            },
            {
                name: "Uncle Raj",
                amount: 500
            },
            {
                name: "Anna",
                amount: 250
            }
        ]
    },
    {
        id: 3,
        avatar: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        title: "Miami Summer Music Festival Board",
        location: "New York",
        date: "July 2025",
        description: "Fan Board Wall",
        target: 7500,
        raised: 8000,
        contributors: 112,
        wishes: 112,
        gifters: 89,
        topContributors: [
            {
                name: "Maya",
                amount: 200
            },
            {
                name: "Uncle Raj",
                amount: 500
            },
            {
                name: "Anna",
                amount: 250
            }
        ]
    },
    {
        id: 4,
        avatar: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$community$2d$4$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        title: "Martinez Family Reunion Board",
        location: "Texas",
        date: "July 2025",
        description: "Capture Generations of Love",
        target: 7500,
        raised: 8000,
        contributors: 112,
        wishes: 112,
        gifters: 89,
        topContributors: [
            {
                name: "Maya",
                amount: 200
            },
            {
                name: "Uncle Raj",
                amount: 500
            },
            {
                name: "Anna",
                amount: 250
            }
        ]
    }
];
const BoardCard = ({ board })=>{
    const progress = Math.round(board.raised / board.target * 100);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-[#18171F] text-white p-6 rounded-2xl shadow-lg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        src: board.avatar,
                        alt: board.title,
                        width: 45,
                        height: 45,
                        className: "rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold",
                                children: board.title
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-xs text-white flex items-center gap-4 mt-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                                lineNumber: 108,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            board.location
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                        lineNumber: 107,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2d$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CalendarCheck$3e$__["CalendarCheck"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "• ",
                                            board.date
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 106,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 104,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 96,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-[#23232A] p-4 rounded-md mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-semibold",
                        children: board.description
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between text-xs text-white",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Target: $",
                                            board.target.toLocaleString()
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                        lineNumber: 124,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: [
                                            "Raised: $",
                                            board.raised.toLocaleString(),
                                            " (",
                                            progress,
                                            "%)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                        lineNumber: 125,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-full bg-gray-700 h-2 rounded-full mt-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-2 mt-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500",
                                    style: {
                                        width: `${Math.min(progress, 100)}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between mt-4 text-sm text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: [
                                    board.contributors,
                                    " "
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Contributors"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 140,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 138,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: board.wishes
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 143,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: " Wishes"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "font-semibold",
                                children: board.gifters
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Gifters"
                            }, void 0, false, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 137,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[18px] font-semibold",
                        children: "Top Contributors"
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 153,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3 flex-wrap mt-2",
                        children: board.topContributors.map((c, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "bg-[#1B1B1B] text-xs px-3 py-1 rounded-full border border-[#303030]",
                                children: [
                                    c.name,
                                    " -",
                                    " ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[#F71873]",
                                        children: [
                                            "$",
                                            c.amount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                        lineNumber: 161,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, i, true, {
                                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                                lineNumber: 156,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 152,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                title: "View Full Board",
                className: "mt-6"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
        lineNumber: 94,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const OurCommunityBoard = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-[5%] max-[769px]:px-4 py-10",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                className: "text-center text-[30px] max-[600px]:text-[24px] font-bold",
                children: "Real Boards from Our Community"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-center mt-2",
                children: "See how Zoomerly works for every type of celebration"
            }, void 0, false, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid md:grid-cols-2 gap-6 mt-10",
                children: boards.map((board)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BoardCard, {
                        board: board
                    }, board.id, false, {
                        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/sections/OurCommunityBoard.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = OurCommunityBoard;
}),
"[project]/src/assets/svgs/start-celebration-avatar-1.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/start-celebration-avatar-1.6aed0e07.svg");}),
"[project]/src/assets/svgs/start-celebration-avatar-1.svg.mjs { IMAGE => \"[project]/src/assets/svgs/start-celebration-avatar-1.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/start-celebration-avatar-1.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 171,
    height: 171,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/start-celebration-avatar-2.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/start-celebration-avatar-2.b9b4e4ca.svg");}),
"[project]/src/assets/svgs/start-celebration-avatar-2.svg.mjs { IMAGE => \"[project]/src/assets/svgs/start-celebration-avatar-2.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/start-celebration-avatar-2.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 104,
    height: 104,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/start-celebration-avatar-3.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/start-celebration-avatar-3.963d4383.svg");}),
"[project]/src/assets/svgs/start-celebration-avatar-3.svg.mjs { IMAGE => \"[project]/src/assets/svgs/start-celebration-avatar-3.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/start-celebration-avatar-3.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 160,
    height: 160,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/assets/svgs/start-you-first-celebration.svg (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/start-you-first-celebration.8eb9b299.svg");}),
"[project]/src/assets/svgs/start-you-first-celebration.svg.mjs { IMAGE => \"[project]/src/assets/svgs/start-you-first-celebration.svg (static in ecmascript)\" } [app-ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/src/assets/svgs/start-you-first-celebration.svg (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg__$28$static__in__ecmascript$29$__["default"],
    width: 1086,
    height: 635,
    blurWidth: 0,
    blurHeight: 0
};
}),
"[project]/src/components/sections/StartYouFirstCelebration.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/buttons/GlobalButton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/start-celebration-avatar-1.svg.mjs { IMAGE => "[project]/src/assets/svgs/start-celebration-avatar-1.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/start-celebration-avatar-2.svg.mjs { IMAGE => "[project]/src/assets/svgs/start-celebration-avatar-2.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/start-celebration-avatar-3.svg.mjs { IMAGE => "[project]/src/assets/svgs/start-celebration-avatar-3.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/svgs/start-you-first-celebration.svg.mjs { IMAGE => "[project]/src/assets/svgs/start-you-first-celebration.svg (static in ecmascript)" } [app-ssr] (structured image object with data url, ecmascript)');
"use client";
;
;
;
;
;
;
;
const StartYourFirstCelebration = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "px-[5%] max-[769px]:px-4 py-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `relative rounded-[20px] bg-gradient-to-b from-pink-500 via-pink-400 to-purple-500 text-white text-center px-6 py-12 overflow-hidden`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$you$2d$first$2d$celebration$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "Confetti Particles",
                    className: "absolute inset-0 w-full h-full object-cover pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 19,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$1$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "1",
                    height: 150,
                    width: 150,
                    className: "absolute top-10 right-10"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$2$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "1",
                    height: 70,
                    width: 70,
                    className: "absolute top-10 left-10"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 26,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$svgs$2f$start$2d$celebration$2d$avatar$2d$3$2e$svg__$28$static__in__ecmascript$2922$__$7d$__$5b$app$2d$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                    alt: "1",
                    height: 120,
                    width: 120,
                    className: "absolute bottom-10 left-10"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-[60px] max-[600px]:text-[24px] font-bold mb-4 max-w-[800px] mx-auto",
                    children: "Start Your First Celebration Board Today"
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 29,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "max-w-3xl mx-auto text-[16px] leading-relaxed mb-6",
                    children: "It only takes a minute to create a board. Bring people together, share memories, and make celebrations unforgettable."
                }, void 0, false, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 33,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap justify-center gap-4 mb-16",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            title: "Explore Spotlight Birthdays",
                            bgColor: "white",
                            color: "#000000",
                            width: "220px",
                            hover: {
                                bgColor: 'white'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$buttons$2f$GlobalButton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                            lineNumber: 39,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
            lineNumber: 17,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/sections/StartYouFirstCelebration.tsx",
        lineNumber: 16,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = StartYourFirstCelebration;
}),
];

//# sourceMappingURL=src_0ecdc95b._.js.map