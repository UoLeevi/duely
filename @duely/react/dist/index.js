(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("react-router-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "react-router-dom"], factory);
	else if(typeof exports === 'object')
		exports["@duely/react"] = factory(require("react"), require("react-dom"), require("react-router-dom"));
	else
		root["@duely/react"] = factory(root["react"], root["react-dom"], root["react-router-dom"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__7__, __WEBPACK_EXTERNAL_MODULE__13__, __WEBPACK_EXTERNAL_MODULE__25__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(1);
__exportStar(__webpack_require__(4), exports);
__exportStar(__webpack_require__(5), exports);
__exportStar(__webpack_require__(9), exports);
__exportStar(__webpack_require__(22), exports);


/***/ }),
/* 1 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  -webkit-tap-highlight-color: transparent;\n}\n\n:root {\n  --color-primary: #667eea;\n  --color-secondary: #34d399;\n  --color-accent: #f97316;\n  --color-background: #fbfcfd;\n  --color-surface: #f1f5f9;\n  --color-error: #f43f5e;\n  --color-success: #10b981;\n}\n\n/*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\n:root {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n     tab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n  margin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n  font-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'] {\n  -webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n  padding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Inherit font-family and line-height from `html` so users can set them as\n * a class directly on the `html` element.\n */\n\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e2e8f0; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #94a3b8;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #94a3b8;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #94a3b8;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n\n/**\n * Make replaced elements `display: block` by default as that's\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\nhtml, body {\n  height: 100%;\n}\n\n/* #region form-field-radio-toggle */\n\n/* #endregion */\n\n.table {\n  display: table;\n}\n\n.contents {\n  display: contents;\n}\n\n.font-semibold {\n  font-weight: 600;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n.max-w-xs {\n  max-width: 20rem;\n}\n\n* {\n  --tw-shadow: 0 0 #0000;\n}\n\n* {\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n}\n\n@-webkit-keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@-webkit-keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@-webkit-keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@media (min-width: 640px) {\n  .sm\\:max-w-sm {\n    max-width: 24rem;\n  }\n}\n\n@media (min-width: 768px) {\n}\n\n@media (min-width: 1024px) {\n}\n\n@media (min-width: 1280px) {\n}\n\n@media (min-width: 1536px) {\n}\n", "",{"version":3,"sources":["webpack://./src/styles/module.css"],"names":[],"mappings":"AAAA;EACE,wCAAwC;AAC1C;;AAEA;EACE,wBAAwB;EACxB,0BAA0B;EAC1B,uBAAuB;EACvB,2BAA2B;EAC3B,wBAAwB;EACxB,sBAAsB;EACtB,wBAAwB;AAC1B;;AAEA,8FAA8F;;AAE9F;;;CAGC;;AAED;;CAEC;;AAED;;;EAGE,sBAAsB;AACxB;;AAEA;;CAEC;;AAED;EACE,gBAAgB;EAChB,cAAc;KACX,WAAW;AAChB;;AAEA;;;CAGC;;AAED;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;EACE,SAAS;AACX;;AAEA;;CAEC;;AAED;EACE;;;;;;;;;kBASgB;AAClB;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;EACE,SAAS,EAAE,MAAM;EACjB,cAAc,EAAE,MAAM;AACxB;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;EACE,yCAAyC;UACjC,iCAAiC;AAC3C;;AAEA;;CAEC;;AAED;;EAEE,mBAAmB;AACrB;;AAEA;;;CAGC;;AAED;;;;EAIE;;;;;;WAMS,EAAE,MAAM;EACjB,cAAc,EAAE,MAAM;AACxB;;AAEA;;CAEC;;AAED;EACE,cAAc;AAChB;;AAEA;;CAEC;;AAED;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;EACE,cAAc,EAAE,MAAM;EACtB,qBAAqB,EAAE,MAAM;AAC/B;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;CAGC;;AAED;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;CAEC;;AAED;;EAEE,0BAA0B;AAC5B;;AAEA;;CAEC;;AAED;;CAEC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;EACE,UAAU;AACZ;;AAEA;;CAEC;;AAED;EACE,wBAAwB;AAC1B;;AAEA;;CAEC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;;;CAGC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;EACE,kBAAkB;AACpB;;AAEA;;;;EAIE;;AAEF;;EAEE;;AAEF;;;;;;;;;;;;;EAaE,SAAS;AACX;;AAEA;EACE,6BAA6B;EAC7B,sBAAsB;AACxB;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB;EACnB,0CAA0C;AAC5C;;AAEA;EACE,SAAS;EACT,UAAU;AACZ;;AAEA;;EAEE,gBAAgB;EAChB,SAAS;EACT,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;;EAKE;;AAEF;EACE,4NAA4N,EAAE,MAAM;EACpO,gBAAgB,EAAE,MAAM;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,oBAAoB;EACpB,oBAAoB;AACtB;;AAEA;;;;;;;;;;;;;;;;;;;;;;;;EAwBE;;AAEF;;;EAGE,sBAAsB,EAAE,MAAM;EAC9B,eAAe,EAAE,MAAM;EACvB,mBAAmB,EAAE,MAAM;EAC3B,qBAAqB,EAAE,MAAM;AAC/B;;AAEA;;EAEE;;AAEF;EACE,qBAAqB;AACvB;;AAEA;;;;;;;;EAQE;;AAEF;EACE,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;;EAEE,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;;;;;;EAME,kBAAkB;EAClB,oBAAoB;AACtB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,wBAAwB;AAC1B;;AAEA;;;;;;EAME;;AAEF;;;;;EAKE,UAAU;EACV,oBAAoB;EACpB,cAAc;AAChB;;AAEA;;;;;EAKE;;AAEF;;;;EAIE,+GAA+G;AACjH;;AAEA;;;;;;EAME;;AAEF;;;;;;;;EAQE,cAAc;EACd,sBAAsB;AACxB;;AAEA;;;;;EAKE;;AAEF;;EAEE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,YAAY;AACd;;AAEA,oCAAoC;;AAEpC,eAAe;;AAEf;EACE,cAAc;AAChB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;EACnB,oBAAoB;AACtB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,4CAA4C;EAC5C,2BAA2B;EAC3B,4BAA4B;EAC5B,wCAAwC;EACxC,kCAAkC;EAClC,2BAA2B;AAC7B;;AAEA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,mBAAmB;IACnB,UAAU;EACZ;AACF;;AAEA;EACE;IACE,mBAAmB;IACnB,UAAU;EACZ;AACF;;AAEA;EACE;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,2BAA2B;IAC3B,0DAA0D;YAClD,kDAAkD;EAC5D;;EAEA;IACE,eAAe;IACf,0DAA0D;YAClD,kDAAkD;EAC5D;AACF;;AAEA;EACE;IACE,2BAA2B;IAC3B,0DAA0D;YAClD,kDAAkD;EAC5D;;EAEA;IACE,eAAe;IACf,0DAA0D;YAClD,kDAAkD;EAC5D;AACF;;AAEA;EACE;IACE,4BAA4B;EAC9B;;EAEA;IACE,2BAA2B;EAC7B;AACF;;AAEA;EACE;IACE,4BAA4B;EAC9B;;EAEA;IACE,2BAA2B;EAC7B;AACF;;AAEA;EACE;IACE,gBAAgB;EAClB;AACF;;AAEA;AACA;;AAEA;AACA;;AAEA;AACA;;AAEA;AACA","sourcesContent":["* {\n  -webkit-tap-highlight-color: transparent;\n}\n\n:root {\n  --color-primary: #667eea;\n  --color-secondary: #34d399;\n  --color-accent: #f97316;\n  --color-background: #fbfcfd;\n  --color-surface: #f1f5f9;\n  --color-error: #f43f5e;\n  --color-success: #10b981;\n}\n\n/*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\n:root {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n     tab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n  margin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n  font-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'] {\n  -webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n  padding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Inherit font-family and line-height from `html` so users can set them as\n * a class directly on the `html` element.\n */\n\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e2e8f0; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #94a3b8;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #94a3b8;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #94a3b8;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n\n/**\n * Make replaced elements `display: block` by default as that's\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\nhtml, body {\n  height: 100%;\n}\n\n/* #region form-field-radio-toggle */\n\n/* #endregion */\n\n.table {\n  display: table;\n}\n\n.contents {\n  display: contents;\n}\n\n.font-semibold {\n  font-weight: 600;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n.max-w-xs {\n  max-width: 20rem;\n}\n\n* {\n  --tw-shadow: 0 0 #0000;\n}\n\n* {\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n}\n\n@-webkit-keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@-webkit-keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@-webkit-keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@media (min-width: 640px) {\n  .sm\\:max-w-sm {\n    max-width: 24rem;\n  }\n}\n\n@media (min-width: 768px) {\n}\n\n@media (min-width: 1024px) {\n}\n\n@media (min-width: 1280px) {\n}\n\n@media (min-width: 1536px) {\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 2 */
/***/ ((module) => {



function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

module.exports = function cssWithMappingToString(item) {
  var _item = _slicedToArray(item, 4),
      content = _item[1],
      cssMapping = _item[3];

  if (typeof btoa === 'function') {
    // eslint-disable-next-line no-undef
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
  }

  return [content].join('\n');
};

/***/ }),
/* 3 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 4 */
/***/ (function(__unused_webpack_module, exports) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Util = void 0;
exports.Util = {
    readFileAsDataUrl,
    readFileAsImageInput,
    estimateImageColor,
    dataUriFromSvg,
    byteToHex,
    hexToByte,
    hsl2rgb,
    hex2rgb,
    hex2hsl,
    rgb2hsl,
    createClassName,
    formatDate,
    formatFileSize,
    findFirstFocusableChild,
    getNameInitials,
    pseudoRandom,
    poisson,
    truncate,
    sentenceCase,
    mimeTypeFromDataUrl,
    pick,
    diff
};
// see: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
function readFileAsDataUrl(file) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file)
            return null;
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onerror = reject;
                reader.onload = () => __awaiter(this, void 0, void 0, function* () {
                    if (!reader.result) {
                        reject(new Error('Unable to read file as Data-URL.'));
                        return;
                    }
                    const dataUrl = reader.result;
                    resolve(dataUrl);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    });
}
function readFileAsImageInput(file) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!file)
            return null;
        const dataUrl = yield readFileAsDataUrl(file);
        if (!dataUrl)
            return null;
        const color = (_a = (yield estimateImageColor(dataUrl))) !== null && _a !== void 0 ? _a : '#ffffff';
        return {
            name: file.name,
            data: dataUrl,
            color
        };
    });
}
function estimateImageColor(url) {
    return new Promise((resolve) => {
        const context = document.createElement('canvas').getContext('2d');
        if (!context) {
            throw new Error('');
        }
        const img = new Image();
        img.src = url;
        img.onload = function () {
            context.drawImage(img, 0, 0, 1, 1);
            const hex = '#' +
                Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3))
                    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
                    .join('');
            resolve(hex);
        };
    });
}
function dataUriFromSvg(svg) {
    return ('data:image/svg+xml;base64,' + btoa(svg));
}
function byteToHex(x) {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}
function hexToByte(x) {
    return parseInt(x, 16);
}
// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function hsl2rgb(h, s, l) {
    const a = s * Math.min(l, 1 - l);
    const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)].map((x) => Math.ceil(x * 255));
}
function hex2rgb(hex) {
    let r;
    let g;
    let b;
    let a = 1.0;
    switch (hex.length) {
        case 5:
            a = hexToByte(hex[4].repeat(2)) / 256.0;
        /* fall through */
        case 4:
            r = hexToByte(hex[1].repeat(2));
            g = hexToByte(hex[2].repeat(2));
            b = hexToByte(hex[3].repeat(2));
            break;
        case 8:
            a = hexToByte(hex.substr(7, 2)) / 256.0;
        /* fall through */
        case 7:
            r = hexToByte(hex.substr(1, 2));
            g = hexToByte(hex.substr(3, 2));
            b = hexToByte(hex.substr(5, 2));
            break;
        default:
            throw Error('Value is not a hexadecimal color code.');
    }
    return [r, g, b, a];
}
function hex2hsl(hex) {
    return rgb2hsl(...hex2rgb(hex));
}
function rgb2hsl(r, g, b, a) {
    r /= 255;
    g /= 255;
    b /= 255;
    const m = Math.max(r, g, b);
    const n = m - Math.min(r, g, b);
    const f = 1 - Math.abs(m + m - n - 1);
    const h = n && (m === r ? (g - b) / n : m === g ? 2 + (b - r) / n : 4 + (r - g) / n);
    return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (m + m - n) / 2, a];
}
function isString(arg) {
    return typeof arg === 'string';
}
function createClassName(...classNames) {
    return Array.from(new Set(classNames
        .filter(isString)
        .join(' ')
        .split(' ')
        .filter((c) => !!c))).join(' ');
}
const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];
function formatDate(d) {
    return `${d.getUTCDate()} ${shortMonthNames[d.getUTCMonth()]} ${d.getUTCFullYear()} ${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
}
function formatFileSize(size) {
    if (size < 1000)
        return `${size}B`;
    size /= 1000;
    if (size < 1000)
        return `${size.toPrecision(3)}KB`;
    size /= 1000;
    if (size < 1000)
        return `${size.toPrecision(3)}MB`;
    size /= 1000;
    if (size < 1000)
        return `${size.toPrecision(3)}GB`;
}
function findFirstFocusableChild(parent) {
    return parent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
}
function getNameInitials(name) {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}
function pseudoRandom(seed) {
    const x = Math.sin(seed || Math.random()) * 10000;
    return x - Math.floor(x);
}
function poisson(mean, generateRandom) {
    const L = Math.exp(-mean);
    let p = 1.0;
    let k = 0;
    generateRandom = generateRandom !== null && generateRandom !== void 0 ? generateRandom : Math.random;
    do {
        k++;
        p *= generateRandom();
    } while (p > L);
    return k - 1;
}
function truncate(text, maxLength) {
    return (text === null || text === void 0 ? void 0 : text.length) > maxLength ? text.substring(0, maxLength).trimEnd() + '...' : text;
}
function sentenceCase(text) {
    return text && text.charAt(0).toUpperCase() + text.substring(1);
}
function mimeTypeFromDataUrl(dataUrl) {
    return dataUrl.substr(5, dataUrl.indexOf(';') - 5);
}
function pick(fromObject, keys) {
    keys = Array.isArray(keys) ? keys : Object.keys(keys);
    return Object.fromEntries(Object.entries(fromObject).filter(([key]) => keys.includes(key)));
}
function diff(fromObject, omitObject) {
    return Object.fromEntries(Object.entries(fromObject).filter(([key, value]) => (omitObject === null || omitObject === void 0 ? void 0 : omitObject[key]) !== value));
}


/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(6), exports);
__exportStar(__webpack_require__(8), exports);


/***/ }),
/* 6 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.withScreenOverlayContext = exports.ScreenOverlayContextProvider = exports.ScreenOverlayContext = void 0;
const react_1 = __importStar(__webpack_require__(7));
exports.ScreenOverlayContext = react_1.createContext(null);
function ScreenOverlayContextProvider({ children }) {
    const ref = react_1.useRef(null);
    const [ready, setReady] = react_1.useState(false);
    react_1.useLayoutEffect(() => {
        if (ready)
            return;
        setReady(true);
    }, [ready]);
    return (react_1.default.createElement(exports.ScreenOverlayContext.Provider, { value: ref },
        react_1.default.createElement("div", { className: "fixed inset-0 z-20 grid w-full h-full bg-transparent pointer-events-none place-items-center", ref: ref }),
        ready && children));
}
exports.ScreenOverlayContextProvider = ScreenOverlayContextProvider;
function withScreenOverlayContext(Fn) {
    return (react_1.default.createElement(ScreenOverlayContextProvider, null,
        react_1.default.createElement(Fn, null)));
}
exports.withScreenOverlayContext = withScreenOverlayContext;


/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__7__;

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.withViewportContext = exports.ViewportContextProvider = exports.ViewportContext = void 0;
const react_1 = __importStar(__webpack_require__(7));
exports.ViewportContext = react_1.createContext({ width: 0, height: 0 });
function ViewportContextProvider({ children }) {
    const [width, setWidth] = react_1.useState(window.innerWidth);
    const [height, setHeight] = react_1.useState(window.innerHeight);
    const handleWindowResize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    react_1.useEffect(() => {
        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, []);
    return react_1.default.createElement(exports.ViewportContext.Provider, { value: { width, height } }, children);
}
exports.ViewportContextProvider = ViewportContextProvider;
function withViewportContext(Fn) {
    return (react_1.default.createElement(ViewportContextProvider, null,
        react_1.default.createElement(Fn, null)));
}
exports.withViewportContext = withViewportContext;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(10), exports);
__exportStar(__webpack_require__(11), exports);
__exportStar(__webpack_require__(12), exports);
__exportStar(__webpack_require__(14), exports);
__exportStar(__webpack_require__(15), exports);
__exportStar(__webpack_require__(32), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(34), exports);
__exportStar(__webpack_require__(36), exports);
__exportStar(__webpack_require__(37), exports);
__exportStar(__webpack_require__(40), exports);
__exportStar(__webpack_require__(41), exports);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadingBar = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
function LoadingBar(_a) {
    var { loading = true, className } = _a, props = __rest(_a, ["loading", "className"]);
    loading = !!loading;
    const [playAnimation, setPlayAnimation] = react_1.useState(loading);
    const progressClassName = util_1.Util.createClassName('w-full h-full transition-opacity duration-100 bg-indigo-300 bg-mask-x-transparent', loading ? 'opacity-100 delay-100' : 'opacity-0', playAnimation && 'animate-progress');
    className = util_1.Util.createClassName('relative overflow-hidden w-full h-1 bg-mask-x-transparent', className);
    react_1.useEffect(() => {
        if (loading === playAnimation) {
            return;
        }
        if (loading) {
            setPlayAnimation(loading);
            return;
        }
        const timeoutID = setTimeout(() => setPlayAnimation(loading), 110);
        return () => clearTimeout(timeoutID);
    }, [loading, playAnimation]);
    return (react_1.default.createElement("div", Object.assign({ className: className }, props),
        react_1.default.createElement("div", { className: progressClassName })));
}
exports.LoadingBar = LoadingBar;


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadingSpinner = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
function LoadingSpinner({ className, loading }) {
    loading = !!loading;
    const [playAnimation, setPlayAnimation] = react_1.useState(loading);
    className = util_1.Util.createClassName('transition-opacity duration-150', loading ? 'opacity-100 duration-100' : 'opacity-0', playAnimation && 'animate-spin', className);
    react_1.useEffect(() => {
        if (loading === playAnimation) {
            return;
        }
        if (loading) {
            setPlayAnimation(loading);
            return;
        }
        const timeoutID = setTimeout(() => setPlayAnimation(loading), 110);
        return () => clearTimeout(timeoutID);
    }, [loading, playAnimation]);
    return (react_1.default.createElement("svg", { className: className, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 38 38", stroke: "#fff" },
        react_1.default.createElement("g", { fill: "none", fillRule: "evenodd" },
            react_1.default.createElement("g", { transform: "translate(1 1)", strokeWidth: "3" },
                react_1.default.createElement("circle", { strokeOpacity: ".5", cx: "18", cy: "18", r: "18" }),
                react_1.default.createElement("path", { d: "M36 18c0-9.94-8.06-18-18-18" })))));
}
exports.LoadingSpinner = LoadingSpinner;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoadingScreen = void 0;
const contexts_1 = __webpack_require__(5);
const react_1 = __importStar(__webpack_require__(7));
const react_dom_1 = __importDefault(__webpack_require__(13));
function LoadingScreen({ message, children }) {
    const screenOverlayRef = react_1.useContext(contexts_1.ScreenOverlayContext);
    if (!(screenOverlayRef === null || screenOverlayRef === void 0 ? void 0 : screenOverlayRef.current))
        return null;
    const hasChildren = react_1.default.Children.count(children) !== 0;
    return react_dom_1.default.createPortal(hasChildren ? children : react_1.default.createElement(DefaultLoadingMessage, { message: message }), screenOverlayRef.current);
}
exports.LoadingScreen = LoadingScreen;
function DefaultLoadingMessage({ message }) {
    message = message !== null && message !== void 0 ? message : 'Loading...';
    return react_1.default.createElement("span", { className: "font-medium tracking-wider text-gray-700 animate-pulse" }, message);
}


/***/ }),
/* 13 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__13__;

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorScreen = void 0;
const contexts_1 = __webpack_require__(5);
const react_1 = __importStar(__webpack_require__(7));
const react_dom_1 = __importDefault(__webpack_require__(13));
function ErrorScreen({ error, message, children }) {
    console.error(error);
    const screenOverlayRef = react_1.useContext(contexts_1.ScreenOverlayContext);
    if (!(screenOverlayRef === null || screenOverlayRef === void 0 ? void 0 : screenOverlayRef.current))
        return null;
    const hasChildren = react_1.default.Children.count(children) !== 0;
    return react_dom_1.default.createPortal(hasChildren ? children : react_1.default.createElement(DefaultErrorMessage, { message: message }), screenOverlayRef.current);
}
exports.ErrorScreen = ErrorScreen;
function DefaultErrorMessage({ message }) {
    message = message !== null && message !== void 0 ? message : 'Some error occurred';
    return react_1.default.createElement("span", { className: "text-sm font-medium text-red-500" }, message);
}


/***/ }),
/* 15 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(16), exports);
__exportStar(__webpack_require__(17), exports);
__exportStar(__webpack_require__(18), exports);
__exportStar(__webpack_require__(19), exports);
__exportStar(__webpack_require__(20), exports);
__exportStar(__webpack_require__(21), exports);
__exportStar(__webpack_require__(30), exports);


/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Form = void 0;
const react_1 = __importStar(__webpack_require__(7));
function Form(_a) {
    var { form, onSubmit, values, children } = _a, props = __rest(_a, ["form", "onSubmit", "values", "children"]);
    const reset = form.reset;
    react_1.useEffect(() => {
        if (!values)
            return;
        reset(values);
    }, [reset, values]);
    const onReset = react_1.useCallback((e) => {
        e.preventDefault();
        reset();
    }, [reset]);
    return (react_1.default.createElement("form", Object.assign({ onSubmit: form.handleSubmit(onSubmit), onReset: onReset }, props), children));
}
exports.Form = Form;


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormField = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const LoadingBar_1 = __webpack_require__(10);
function FormField(_a) {
    var _b, _c, _d, _e, _f, _g, _h;
    var { name, label, form, type, registerOptions, hint, prefix, suffix, actions, loading, options, accept, image, className } = _a, props = __rest(_a, ["name", "label", "form", "type", "registerOptions", "hint", "prefix", "suffix", "actions", "loading", "options", "accept", "image", "className"]);
    const error = form.errors[name];
    let errorMessage = error &&
        (error.message ||
            (error.type === 'required' && 'Required') ||
            (error.type === 'minLength' && 'Too short') ||
            (error.type === 'maxLength' && 'Too long') ||
            (error.type === 'min' && 'Too small') ||
            (error.type === 'max' && 'Too large') ||
            'Invalid');
    const [longErrorMessage, shortErrorMessage] = (errorMessage === null || errorMessage === void 0 ? void 0 : errorMessage.length) > 20 ? [errorMessage, null] : [null, errorMessage];
    let element;
    let hintOrInfo = hint;
    switch (type) {
        case 'radio-toggle': {
            if (!Array.isArray(options) || options.length !== 2)
                throw new Error('radio-toggle expects options prop as an array containing two items.');
            const [left, right] = options.map((option) => typeof option === 'object' ? option : { value: option });
            const selected = form.watch(name);
            element = (react_1.default.createElement("div", { className: "flex" },
                react_1.default.createElement("div", { className: "grid items-center grid-cols-3 form-field-radio-toggle" },
                    react_1.default.createElement("input", Object.assign({ ref: form.register(registerOptions), type: "radio", id: `radio-toggle-option-${left.value}`, name: name, value: left.value, defaultChecked: true, hidden: true }, props)),
                    react_1.default.createElement("label", { htmlFor: `radio-toggle-option-${left.value}`, className: "grid row-start-1" },
                        react_1.default.createElement("span", { className: "pr-3 font-medium tracking-wide text-right" }, (_b = left.element) !== null && _b !== void 0 ? _b : util_1.Util.sentenceCase(left.value))),
                    react_1.default.createElement("div", { className: "relative w-12 h-8 col-start-2 row-start-1 border border-gray-300 rounded-md shadow-sm outline-none pointer-events-none sm:text-sm sm:leading-5" },
                        react_1.default.createElement("div", { className: `box-border grid place-items-center absolute inset-y-0 w-6 m-px transition border-2 border-transparent rounded-md bg-clip-content ${(_c = (left.value === selected ? left : right).className) !== null && _c !== void 0 ? _c : 'bg-gradient-to-r from-gray-400 to-gray-300'}` })),
                    react_1.default.createElement("input", Object.assign({ ref: form.register(registerOptions), type: "radio", id: `radio-toggle-option-${right.value}`, name: name, value: right.value, hidden: true }, props)),
                    react_1.default.createElement("label", { htmlFor: `radio-toggle-option-${right.value}`, className: "grid row-start-1" },
                        react_1.default.createElement("span", { className: "pl-3 font-medium tracking-wide text-left" }, (_d = right.element) !== null && _d !== void 0 ? _d : util_1.Util.sentenceCase(right.value))))));
            break;
        }
        case 'radio-blocks': {
            const selected = form.watch(name);
            const children = (_e = (options !== null && options !== void 0 ? options : []).map((option) => {
                const { value, element, description } = typeof option === 'object'
                    ? option
                    : { value: option, element: undefined, description: undefined };
                const className = util_1.Util.createClassName(selected === value && (props.disabled ? 'border-gray-400' : 'border-blue-400'), selected !== value && props.disabled && 'opacity-50', 'text-gray-700 px-4 border border-gray-300 rounded-md shadow-sm flex items-center h-20 flex-1');
                return (react_1.default.createElement("label", { key: value, htmlFor: `radio-blocks-option-${value}`, className: className },
                    react_1.default.createElement("input", Object.assign({ ref: form.register(registerOptions), key: value, value: value, id: `radio-blocks-option-${value}`, name: name, type: "radio", hidden: true }, props)),
                    react_1.default.createElement("div", { className: "space-y-2" },
                        react_1.default.createElement("span", { className: "font-semibold" }, element !== null && element !== void 0 ? element : value),
                        description && react_1.default.createElement("p", { className: "text-xs whitespace-nowrap" }, description))));
            })) !== null && _e !== void 0 ? _e : [];
            element = react_1.default.createElement("div", { className: "grid gap-4 grid-cols-fill-200" }, children);
            break;
        }
        case 'select': {
            const children = (_f = ['', ...(options !== null && options !== void 0 ? options : [])].map((option) => {
                const { value, element } = typeof option === 'object' ? option : { value: option, element: undefined };
                return (react_1.default.createElement("option", { key: value, value: value }, element !== null && element !== void 0 ? element : value));
            })) !== null && _f !== void 0 ? _f : [];
            element = (react_1.default.createElement("div", { className: "relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                react_1.default.createElement("select", Object.assign({ id: name, name: name, ref: form.register(registerOptions), className: "w-full py-2 pl-3 pr-10 bg-transparent border-none rounded-md outline-none appearance-none", spellCheck: "false", autoComplete: "off" }, props), children),
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "absolute right-0 w-5 h-5 mr-3 text-gray-600 pointer-events-none", viewBox: "0 0 20 20", fill: "currentColor" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }))));
            break;
        }
        case 'image': {
            const fileList = form.watch(name);
            const hasFile = ((_g = fileList === null || fileList === void 0 ? void 0 : fileList.length) !== null && _g !== void 0 ? _g : 0) > 0;
            hintOrInfo = hasFile
                ? Array.from(fileList)
                    .map((f) => `${f.name} ${util_1.Util.formatFileSize(f.size)}`)
                    .join(', ')
                : null;
            loading = !!loading;
            accept = accept !== null && accept !== void 0 ? accept : 'image/png, image/jpeg';
            const className = util_1.Util.createClassName(loading && 'animate-pulse border-indigo-400', !loading && 'border-gray-300', image && 'border border-gray-300 shadow-sm', !image && 'px-6 pt-5 pb-6 border-2 border-dashed', 'relative transition-colors flex justify-center rounded-md');
            element = (react_1.default.createElement("label", { htmlFor: name, className: className },
                image && (react_1.default.createElement("img", { className: "flex-1 object-contain rounded-md", src: image.data, alt: typeof label === 'string' ? label : '' })),
                !image && (react_1.default.createElement("div", { className: "text-center" },
                    react_1.default.createElement("svg", { className: "w-12 h-12 mx-auto text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48" },
                        react_1.default.createElement("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })),
                    react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-600" },
                        react_1.default.createElement("span", { className: "font-medium text-indigo-600 transition duration-150 ease-in-out cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline" }, "Upload a file"),
                        react_1.default.createElement("span", null, " or drag and drop")),
                    react_1.default.createElement("p", { className: "mt-1 text-xs text-gray-500" }, hint !== null && hint !== void 0 ? hint : accept.split('image/').join('').toUpperCase()))),
                react_1.default.createElement("input", Object.assign({ disabled: loading, id: name, name: name, ref: form.register(registerOptions), accept: accept, type: "file", hidden: true, spellCheck: "false", autoComplete: "off" }, props))));
            break;
        }
        case 'file': {
            const fileList = form.watch(name);
            const hasFile = ((_h = fileList === null || fileList === void 0 ? void 0 : fileList.length) !== null && _h !== void 0 ? _h : 0) > 0;
            const filenames = hasFile
                ? Array.from(fileList)
                    .map((f) => f.name)
                    .join(', ')
                : null;
            hintOrInfo = hasFile
                ? Array.from(fileList)
                    .map((f) => util_1.Util.formatFileSize(f.size))
                    .join(', ')
                : null;
            element = (react_1.default.createElement("label", { className: "grid px-3 border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5", htmlFor: name },
                filenames ? (react_1.default.createElement("span", { className: "w-full py-2 bg-transparent rounded-md row-span-full col-span-full" }, filenames)) : (react_1.default.createElement("span", { className: "w-full py-2 text-gray-500 bg-transparent rounded-md row-span-full col-span-full" },
                    react_1.default.createElement("span", null, "Upload a file"),
                    " or drag and drop")),
                react_1.default.createElement("input", Object.assign({ id: name, name: name, ref: form.register(registerOptions), type: "file", accept: accept, hidden: true, spellCheck: "false", autoComplete: "off" }, props))));
            break;
        }
        case 'textarea': {
            element = (react_1.default.createElement("div", { className: "flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                prefix && react_1.default.createElement("span", { className: "pl-3 text-gray-500" }, prefix),
                react_1.default.createElement("textarea", Object.assign({ id: name, name: name, ref: form.register(registerOptions), className: "w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3", spellCheck: "false", autoComplete: "off" }, props)),
                suffix && react_1.default.createElement("span", { className: "pr-3 text-gray-500" }, suffix)));
            break;
        }
        default: {
            element = (react_1.default.createElement("div", { className: "flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                prefix && react_1.default.createElement("span", { className: "pl-3 text-gray-500" }, prefix),
                react_1.default.createElement("input", Object.assign({ id: name, name: name, ref: form.register(registerOptions), type: type, className: "w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3", spellCheck: "false", autoComplete: "off" }, props)),
                suffix && react_1.default.createElement("span", { className: "pr-3 text-gray-500" }, suffix)));
        }
    }
    className = util_1.Util.createClassName('flex flex-col relative', className);
    return (react_1.default.createElement("div", { className: className },
        react_1.default.createElement("div", { className: "flex justify-between whitespace-nowrap" },
            label && (react_1.default.createElement("label", { className: "pb-1 pl-px text-sm font-medium text-gray-700", htmlFor: name }, label)),
            shortErrorMessage ? (react_1.default.createElement("p", { className: "text-xs font-medium leading-5 text-red-500" }, shortErrorMessage)) : (actions)),
        element,
        react_1.default.createElement(LoadingBar_1.LoadingBar, { className: "h-px px-1", loading: !!loading }),
        longErrorMessage ? (react_1.default.createElement("p", { className: "pt-1 pl-px m-0 text-xs text-red-500 min-h-4" }, longErrorMessage)) : (react_1.default.createElement("p", { className: "pt-1 pl-px m-0 text-xs text-gray-500 min-h-4" }, hintOrInfo))));
}
exports.FormField = FormField;


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormButton = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const LoadingSpinner_1 = __webpack_require__(11);
function FormButton(_a) {
    var { form, children, type, disabled, loading, spinner, dense, className } = _a, props = __rest(_a, ["form", "children", "type", "disabled", "loading", "spinner", "dense", "className"]);
    spinner = spinner || loading;
    disabled = !!(disabled || loading || !form.formState.isDirty);
    className = util_1.Util.createClassName('relative flex justify-center tracking-wide items-center border appearance-none rounded-md text-md font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm', type === 'reset'
        ? 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
        : 'bg-indigo-500 text-white border-transparent hover:bg-indigo-600', spinner ? (dense ? 'px-9 py-1.5' : 'px-12 py-2.5') : dense ? 'px-4 py-1.5' : 'px-7 py-2.5', !loading && 'disabled:opacity-50', className);
    return (react_1.default.createElement("button", Object.assign({ type: type, disabled: disabled, className: className }, props),
        react_1.default.createElement(LoadingSpinner_1.LoadingSpinner, { loading: loading, className: `absolute left-0 ${dense ? 'h-5 ml-2' : 'h-6 ml-3'}` }),
        children));
}
exports.FormButton = FormButton;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormErrorInfo = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
function FormErrorInfo(_a) {
    var { error, className } = _a, props = __rest(_a, ["error", "className"]);
    if (!error)
        return null;
    className = util_1.Util.createClassName('flex flex-row items-center justify-center text-red-400 space-x-3 font-semibold', className);
    return (react_1.default.createElement("div", Object.assign({ className: className }, props),
        react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
        react_1.default.createElement("p", { className: "text-sm text-center" }, typeof error === 'string' ? error : error === null || error === void 0 ? void 0 : error.message)));
}
exports.FormErrorInfo = FormErrorInfo;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormInfoMessage = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
function FormInfoMessage(_a) {
    var { success, info, error, className } = _a, props = __rest(_a, ["success", "info", "error", "className"]);
    className = util_1.Util.createClassName('flex flex-row items-center justify-center space-x-2 font-medium', error ? 'text-red-400' : 'text-gray-500', className);
    return (react_1.default.createElement("div", Object.assign({ className: className }, props),
        error && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", className: "h-5" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" })),
            react_1.default.createElement("p", { className: "text-sm text-center" }, typeof error === 'string' ? error : error === null || error === void 0 ? void 0 : error.message))),
        !error && success && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", className: "h-5 text-green-600" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })),
            react_1.default.createElement("p", { className: "text-sm text-center" }, success))),
        !error && !success && info && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", className: "h-5" },
                react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })),
            react_1.default.createElement("p", { className: "text-sm text-center" }, info)))));
}
exports.FormInfoMessage = FormInfoMessage;


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FormSection = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const hooks_1 = __webpack_require__(22);
const util_1 = __webpack_require__(4);
function FormSection(_a) {
    var { title, description, children, className, id } = _a, props = __rest(_a, ["title", "description", "children", "className", "id"]);
    className = util_1.Util.createClassName(className, 'relative flex flex-col px-5 pt-4 pb-5');
    const [linkRef, hashLink] = hooks_1.useHashScrolling();
    return (react_1.default.createElement("section", Object.assign({ className: className }, props),
        react_1.default.createElement("div", { className: "flex items-center space-x-2 group" },
            react_1.default.createElement("h3", { ref: linkRef, className: "font-bold tracking-wide text-gray-700" },
                title,
                hashLink)),
        react_1.default.createElement("div", { className: "flex flex-col -m-2 xl:-m-4 xl:flex-row" },
            react_1.default.createElement("div", { className: "flex flex-col items-start pt-1 m-2 xl:m-4 xl:w-1/3 2xl:w-1/4" },
                react_1.default.createElement("p", { className: "text-sm text-gray-500" }, description)),
            react_1.default.createElement("div", { className: "flex flex-col m-2 xl:m-4 xl:w-2/3 2xl:w-3/4" }, children))));
}
exports.FormSection = FormSection;


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(23), exports);
__exportStar(__webpack_require__(24), exports);
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(28), exports);
__exportStar(__webpack_require__(29), exports);


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useClassName = void 0;
const react_1 = __webpack_require__(7);
function useClassName(domElement, className) {
    react_1.useLayoutEffect(() => {
        const classNames = className.split(' ');
        const added = classNames.filter((c) => !domElement.classList.contains(c));
        added.forEach((c) => domElement.classList.add(c));
        return () => added.forEach((c) => domElement.classList.remove(c));
    }, [domElement, className]);
}
exports.useClassName = useClassName;


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useDynamicNavigation = void 0;
const react_1 = __webpack_require__(7);
const react_router_dom_1 = __webpack_require__(25);
function isAnchorElement(target) {
    var _a;
    return ((_a = target) === null || _a === void 0 ? void 0 : _a.tagName) === 'A';
}
function useDynamicNavigation({ resolveUrl, passAccessToken, replace, local } = {}) {
    // TODO: async event handler does not work if default is not prevented
    const history = react_router_dom_1.useHistory();
    return react_1.useCallback((e) => __awaiter(this, void 0, void 0, function* () {
        const a = isAnchorElement(e === null || e === void 0 ? void 0 : e.currentTarget) ? e === null || e === void 0 ? void 0 : e.currentTarget : null;
        let url = null;
        let shouldRelyOnDefault = false;
        if (typeof resolveUrl === 'function') {
            e === null || e === void 0 ? void 0 : e.preventDefault();
            url = yield resolveUrl();
        }
        else if (a) {
            url = a.href;
            shouldRelyOnDefault = true;
        }
        else {
            e === null || e === void 0 ? void 0 : e.preventDefault();
        }
        if (url == null)
            throw new Error('resolveUrl returned null or undefined');
        if (!(url instanceof URL)) {
            url = new URL(url);
            if (passAccessToken) {
                const isDuelyDomain = ('.' + url.hostname).endsWith('.duely.app');
                const access_token = localStorage.getItem('user-jwt');
                if (access_token && isDuelyDomain) {
                    url.searchParams.set('access_token', access_token);
                }
            }
        }
        const href = url.toString();
        if (local) {
            const to = href.split(url.host)[1];
            history[replace ? 'replace' : 'push'](to);
        }
        else if (a && shouldRelyOnDefault) {
            const originalHref = a.href;
            a.href = href;
            setTimeout(() => (a.href = originalHref), 0);
        }
        else {
            window.location[replace ? 'replace' : 'assign'](href);
        }
    }), [resolveUrl, passAccessToken, history, replace]);
}
exports.useDynamicNavigation = useDynamicNavigation;


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__25__;

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useBreakpoints = void 0;
const react_1 = __webpack_require__(7);
const ViewportContext_1 = __webpack_require__(8);
const breakpoints = {
    'sm': 640,
    'md': 768,
    'lg': 1024,
    'xl': 1280,
    '2xl': 1536
};
function useBreakpoints() {
    const { width } = react_1.useContext(ViewportContext_1.ViewportContext);
    return Object.assign({}, ...Object.entries(breakpoints).map(([k, v]) => ({ [k]: v <= width })));
}
exports.useBreakpoints = useBreakpoints;


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useHashScrolling = void 0;
const react_1 = __importStar(__webpack_require__(7));
const react_router_dom_1 = __webpack_require__(25);
function HashLink({ hash }) {
    return (react_1.default.createElement(react_router_dom_1.Link, { to: hash, className: "absolute inset-y-0 right-0 flex items-center my-auto text-transparent transition-colors focus:outline-none group-hover:text-indigo-600 focus-visible:text-indigo-500", style: {
            marginRight: '-1.5em'
        } },
        react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", style: { height: '1em', width: '1em' }, viewBox: "0 0 20 20", fill: "currentColor", transform: "scale(-1 1)" },
            react_1.default.createElement("path", { fillRule: "evenodd", d: "M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z", clipRule: "evenodd" }))));
}
function useHashScrolling() {
    const [hash, setHash] = react_1.useState();
    const hashLink = hash && react_1.default.createElement(HashLink, { hash: hash });
    const location = react_router_dom_1.useLocation();
    return [
        react_1.useCallback((node) => {
            var _a, _b;
            if (!node)
                return;
            let id = node.id || ((_a = node.querySelector('[id]')) === null || _a === void 0 ? void 0 : _a.id);
            if (!id) {
                id = (_b = node.textContent) === null || _b === void 0 ? void 0 : _b.trim().toLowerCase().replace(/[^\w\d-]+/g, '-');
                if (!id)
                    return;
                node.id = id;
                if (!node.classList.contains('relative'))
                    node.classList.add('relative');
                if (!node.classList.contains('group'))
                    node.classList.add('group');
            }
            const hash = `#${id}`;
            setHash(hash);
            if (location.hash !== hash)
                return;
            node.scrollIntoView();
        }, [location.hash, setHash]),
        hashLink,
        hash
    ];
}
exports.useHashScrolling = useHashScrolling;


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useImageInputFromFileList = void 0;
const react_1 = __webpack_require__(7);
const util_1 = __webpack_require__(4);
/**
 * Use image from file or if file is not provided use image from image object.
 */
function useImageInputFromFileList(fileList) {
    const [state, setState] = react_1.useState({
        image: null,
        loading: !!fileList,
        error: null
    });
    react_1.useEffect(() => {
        if (!fileList) {
            setState({ loading: false, error: null, image: null });
            return;
        }
        if (fileList.length !== 1) {
            setState({
                loading: false,
                error: new Error('Only one file should be provided.'),
                image: null
            });
            return;
        }
        const file = fileList[0];
        setState({ loading: true, error: null, image: null });
        util_1.Util.readFileAsImageInput(file)
            .then((image) => setState({ loading: false, error: null, image }))
            .catch((error) => setState({ loading: false, error, image: null }));
    }, [fileList]);
    return state;
}
exports.useImageInputFromFileList = useImageInputFromFileList;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useTemporaryValue = void 0;
const react_1 = __webpack_require__(7);
function useTemporaryValue(durationMs) {
    const timeoutRef = react_1.useRef();
    const isMountedRef = react_1.useRef();
    react_1.useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);
    const [value, setValue] = react_1.useState();
    return {
        value,
        setValue: react_1.useCallback((value) => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = window.setTimeout(() => {
                timeoutRef.current = undefined;
                if (isMountedRef.current)
                    setValue(undefined);
            }, durationMs);
            setValue(value);
        }, [durationMs]),
        reset: react_1.useCallback(() => {
            if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = undefined;
        }, [])
    };
}
exports.useTemporaryValue = useTemporaryValue;


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(31), exports);


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.useFormMessages = void 0;
const hooks_1 = __webpack_require__(22);
function useFormMessages() {
    const { value: infoMessage, setValue: setInfoMessage, reset: resetInfoMessage } = hooks_1.useTemporaryValue(4000);
    const { value: successMessage, setValue: setSuccessMessage, reset: resetSuccessMessage } = hooks_1.useTemporaryValue(4000);
    const { value: errorMessage, setValue: setErrorMessage, reset: resetErrorMessage } = hooks_1.useTemporaryValue(7000);
    return {
        infoMessage,
        setInfoMessage(infoMessage) {
            resetErrorMessage();
            resetSuccessMessage();
            setInfoMessage(infoMessage);
        },
        successMessage,
        setSuccessMessage(successMessage) {
            resetInfoMessage();
            resetErrorMessage();
            setSuccessMessage(successMessage);
        },
        errorMessage,
        setErrorMessage(errorMessage) {
            resetInfoMessage();
            resetSuccessMessage();
            setErrorMessage(errorMessage);
        }
    };
}
exports.useFormMessages = useFormMessages;


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sidebar = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const react_router_dom_1 = __webpack_require__(25);
const hooks_1 = __webpack_require__(22);
const util_1 = __webpack_require__(4);
function Sidebar(_a) {
    var { className, links, topContent, bottomContent } = _a, props = __rest(_a, ["className", "links", "topContent", "bottomContent"]);
    const { md } = hooks_1.useBreakpoints();
    className = util_1.Util.createClassName(className, 'z-10 w-full h-16 bg-white border-t md:bg-gray-25 md:border-none border-box md:w-48 xl:w-64 md:h-full md:p-2');
    return (react_1.default.createElement("aside", Object.assign({ className: className }, props),
        react_1.default.createElement("div", { className: "flex w-full pb-2 overflow-x-auto md:h-full md:flex-col md:justify-between md:space-y-4 max-w-screen md:pb-0" },
            md && topContent,
            react_1.default.createElement("nav", { className: "flex flex-row justify-center flex-1 p-1 space-x-1 md:flex-col md:justify-start md:space-y-2 md:space-x-0" }, links.map((link) => (react_1.default.createElement(SidebarLink, Object.assign({ key: link.to }, link))))),
            md && bottomContent)));
}
exports.Sidebar = Sidebar;
function SidebarLink({ text, icon, to, exact, className }) {
    const match = react_router_dom_1.useRouteMatch({ path: to, exact });
    const Icon = icon;
    className = util_1.Util.createClassName(className, match
        ? 'md:bg-white md:shadow-sm'
        : 'focus-visible:text-gray-700 hover:text-gray-700 border-transparent', 'flex flex-col md:flex-row items-center focus:outline-none md:border space-y-1 md:space-y-0 md:space-x-3 rounded-md text-gray-500 text-xs shadow-gray-500 md:text-sm font-semibold px-2 md:px-3 py-2 focus-visible:bg-white');
    return (react_1.default.createElement(react_router_dom_1.Link, { to: to, className: className },
        react_1.default.createElement(Icon, { className: "text-lg sm:text-xl md:text-2xl" }),
        react_1.default.createElement("span", null, text)));
}


/***/ }),
/* 33 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Table = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const hooks_1 = __webpack_require__(22);
const LoadingSpinner_1 = __webpack_require__(11);
function Table({ rows: items, columns, headers, className, dense, breakpoint, wrap: wrapOptions, loading, error }) {
    var _a, _b, _c;
    const breakpoints = hooks_1.useBreakpoints();
    const isNotWrapped = breakpoints[breakpoint !== null && breakpoint !== void 0 ? breakpoint : 'sm'];
    const wrapColCount = (_a = wrapOptions === null || wrapOptions === void 0 ? void 0 : wrapOptions.columns) !== null && _a !== void 0 ? _a : 1;
    const wrapColSpans = (_b = wrapOptions === null || wrapOptions === void 0 ? void 0 : wrapOptions.spans) !== null && _b !== void 0 ? _b : new Array(headers.length).fill(1);
    const wrapColSpanSum = wrapColSpans.reduce((a, b) => a + b, 0);
    const gridTemplateColumns = isNotWrapped
        ? `repeat(${headers.length}, auto)`
        : `repeat(${(_c = wrapOptions === null || wrapOptions === void 0 ? void 0 : wrapOptions.columns) !== null && _c !== void 0 ? _c : 1}, auto)`;
    className = util_1.Util.createClassName(className, 'grid auto-rows-auto gap-x-6');
    loading = !!loading;
    if (isNotWrapped) {
        if (error) {
            headers = [
                react_1.default.createElement(TableHeader, { key: 0, column: 1 }, "Error")
            ];
        }
        else if (loading) {
            headers = [
                react_1.default.createElement(TableHeader, { key: 0, column: 1 }, "Loading...")
            ];
        }
        else {
            headers = headers.map((header, j) => {
                return (react_1.default.createElement(TableHeader, { key: j, column: j + 1 }, header));
            });
        }
    }
    let rows;
    if (error) {
        let message = typeof error === 'object' ? error === null || error === void 0 ? void 0 : error.message : error;
        message = message === 'string' ? message : null;
        rows = (react_1.default.createElement(TableErrorRow, { message: message, row: isNotWrapped ? 2 : 1, wrapColCount: wrapColCount, wrapColSpanSum: wrapColSpanSum, isNotWrapped: isNotWrapped }));
    }
    else if (loading) {
        rows = (react_1.default.createElement(TableLoadingRow, { row: isNotWrapped ? 2 : 1, wrapColCount: wrapColCount, wrapColSpanSum: wrapColSpanSum, isNotWrapped: isNotWrapped }));
    }
    else {
        rows = items.map((item, i) => {
            var _a, _b;
            return (react_1.default.createElement(TableRow, { key: (_b = (_a = item.key) !== null && _a !== void 0 ? _a : item.id) !== null && _b !== void 0 ? _b : i, item: item, row: i + (isNotWrapped ? 2 : 1), columns: columns, headers: headers, dense: dense, wrapColCount: wrapColCount, wrapColSpans: wrapColSpans, wrapColSpanSum: wrapColSpanSum, isNotWrapped: isNotWrapped, first: i === 0, last: i === items.length - 1 }));
        });
    }
    return (react_1.default.createElement("div", { className: className, style: { gridTemplateColumns } },
        isNotWrapped && (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("div", { className: "h-8 border-b border-gray-200", style: { gridArea: `1 / 1 / 2 / -1` } }),
            headers)),
        rows));
}
exports.Table = Table;
function TableHeader({ children, column }) {
    const gridArea = `1 / ${column} / 2 / ${column + 1}`;
    return (react_1.default.createElement("div", { className: "grid text-xs tracking-wide text-gray-500", style: { gridArea } }, children));
}
function TableCell({ children, row, column, span, header, dense, firstRow, lastRow, firstCol, lastCol, isNotWrapped }) {
    const gridArea = `${row} / ${column} / ${row + 1} / ${column + span}`;
    if (isNotWrapped) {
        const className = 'relative grid items-center ' + (lastRow ? 'pt-3' : 'py-3');
        return (react_1.default.createElement("div", { className: className, style: { gridArea } }, children));
    }
    let className = 'flex flex-col space-y-2 ';
    if (!firstRow || !firstCol) {
        className += dense ? (firstCol ? 'pt-4 ' : 'pt-2 ') : firstCol ? 'pt-6 ' : 'pt-3 ';
    }
    if (!lastRow || !lastCol) {
        className += dense ? (lastCol ? 'pb-4 ' : 'pb-2 ') : lastCol ? 'pb-6 ' : 'pb-3 ';
    }
    return (react_1.default.createElement("div", { className: className, style: { gridArea } },
        react_1.default.createElement("div", { className: "grid text-xs tracking-wide text-gray-500" }, header),
        react_1.default.createElement("div", { className: "relative grid items-center flex-1" }, children)));
}
function TableRow({ item, row, columns, headers, dense, wrapColCount, wrapColSpans, wrapColSpanSum, first, last, isNotWrapped }) {
    let className = 'border-gray-200' + (last ? '' : ' border-b');
    const cells = columns.map((column, j) => column(item, j));
    if (isNotWrapped) {
        const gridArea = `${row} / 1 / ${row + 1} / -1`;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement("div", { className: className, style: { gridArea } }),
            cells.map((cell, j) => (react_1.default.createElement(TableCell, { key: j, row: row, column: j + 1, span: 1, header: headers[j], dense: dense, isNotWrapped: isNotWrapped, firstRow: first, lastRow: last, firstCol: j % columns.length === 0, lastCol: (j + 1) % columns.length === 0 }, cell)))));
    }
    row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
    const gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
    let next = 1;
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement("div", { className: className, style: { gridArea } }),
        cells.map((cell, j) => {
            const column = ((next - 1) % wrapColCount) + 1;
            const span = wrapColSpans[j];
            const cellRow = row + Math.floor((next - 1) / wrapColCount);
            const firstCol = cellRow === row;
            const lastCol = cellRow + 1 - row === wrapColSpanSum / wrapColCount;
            next += span;
            return (react_1.default.createElement(TableCell, { key: j, row: cellRow, column: column, span: span, header: headers[j], dense: dense, isNotWrapped: isNotWrapped, firstRow: first, lastRow: last, firstCol: firstCol, lastCol: lastCol }, cell));
        })));
}
function TableLoadingRow({ row, wrapColCount, wrapColSpanSum, isNotWrapped }) {
    let className = 'grid p-4 text-gray-400 border-gray-200 place-items-center';
    let gridArea = `${row} / 1 / ${row + 1} / -1`;
    if (!isNotWrapped) {
        row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
        gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
    }
    return (react_1.default.createElement("div", { className: className, style: { gridArea } },
        react_1.default.createElement(LoadingSpinner_1.LoadingSpinner, { loading: true, className: "w-10 h-10" })));
}
function TableErrorRow({ row, message, wrapColCount, wrapColSpanSum, isNotWrapped }) {
    let className = 'grid p-4 border-gray-200 place-items-center';
    let gridArea = `${row} / 1 / ${row + 1} / -1`;
    message = message !== null && message !== void 0 ? message : 'Some error occurred';
    if (!isNotWrapped) {
        row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
        gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
    }
    return (react_1.default.createElement("div", { className: className, style: { gridArea } },
        react_1.default.createElement("div", { className: "flex items-center space-x-3 text-red-500" },
            react_1.default.createElement("div", { className: "grid w-8 h-8 bg-red-200 rounded-full place-items-center" },
                react_1.default.createElement("svg", { className: "w-6 h-6", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                    react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }))),
            react_1.default.createElement("span", { className: "text-sm font-medium" }, message))));
}


/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DropMenu = void 0;
const react_1 = __importStar(__webpack_require__(7));
const react_2 = __webpack_require__(35);
function DropMenu({ children, button }) {
    const [isOpen, setIsOpen] = react_1.useState(false);
    const ref = react_1.useRef(null);
    function open() {
        setIsOpen((isOpen) => !isOpen);
    }
    function close() {
        setIsOpen(false);
    }
    return (react_1.default.createElement("div", { className: "relative" },
        react_1.default.createElement("button", { ref: ref, type: "button", onClick: open, className: "focus:outline-none" }, button !== null && button !== void 0 ? button : (react_1.default.createElement("svg", { className: "h-6 text-gray-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            react_1.default.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" })))),
        react_1.default.createElement(react_2.Transition, { show: isOpen, enter: "transition ease-out duration-75", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95" },
            react_1.default.createElement(DropMenuItems, { buttonRef: ref, close: close }, children))));
}
exports.DropMenu = DropMenu;
function DropMenuItems(_a) {
    var { children, close, buttonRef } = _a, props = __rest(_a, ["children", "close", "buttonRef"]);
    const ref = react_1.useRef(null);
    react_1.useEffect(() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
    function onBlur(e) {
        const container = ref.current;
        const focusedEl = e.relatedTarget;
        if (focusedEl === buttonRef.current)
            return;
        if (!focusedEl || !(container === null || container === void 0 ? void 0 : container.contains(focusedEl))) {
            close();
        }
    }
    return (react_1.default.createElement("div", Object.assign({ ref: ref, tabIndex: -1, className: "absolute right-0 z-10 flex flex-col px-4 py-2 space-y-2 bg-white border rounded-md shadow-md focus:outline-none", onBlur: onBlur }, props), children));
}


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Listbox": () => /* binding */ Listbox,
/* harmony export */   "Menu": () => /* binding */ Menu,
/* harmony export */   "Switch": () => /* binding */ Switch,
/* harmony export */   "Transition": () => /* binding */ Transition
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

var useIsoMorphicEffect = typeof window !== 'undefined' ? react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect : react__WEBPACK_IMPORTED_MODULE_0__.useEffect;

// didn't take care of the Suspense case. To fix this we used the approach the @reach-ui/auto-id
// uses.
//
// Credits: https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx

var state = {
  serverHandoffComplete: false
};
var id = 0;

function generateId() {
  return ++id;
}

function useId() {
  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(state.serverHandoffComplete ? generateId : null),
      id = _React$useState[0],
      setId = _React$useState[1];

  useIsoMorphicEffect(function () {
    if (id === null) setId(generateId()); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (state.serverHandoffComplete === false) state.serverHandoffComplete = true;
  }, []);
  return id != null ? '' + id : undefined;
}

function useIsInitialRender() {
  var initial = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    initial.current = false;
  }, []);
  return initial.current;
}

function useIsMounted() {
  var mounted = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(true);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

function match(value, lookup) {
  if (value in lookup) {
    var returnValue = lookup[value];

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return typeof returnValue === 'function' ? returnValue.apply(void 0, args) : returnValue;
  }

  var error = new Error("Tried to handle \"" + value + "\" but there is no handler defined. Only defined handlers are: " + Object.keys(lookup).map(function (key) {
    return "\"" + key + "\"";
  }).join(', ') + ".");

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, match);
  }

  throw error;
}

function once(cb) {
  var state = {
    called: false
  };
  return function () {
    if (state.called) {
      return;
    }

    state.called = true;
    return cb.apply(void 0, arguments);
  };
}

function disposables() {
  var disposables = [];
  var api = {
    requestAnimationFrame: function (_requestAnimationFrame) {
      function requestAnimationFrame() {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function () {
      var raf = requestAnimationFrame.apply(void 0, arguments);
      api.add(function () {
        return cancelAnimationFrame(raf);
      });
    }),
    nextFrame: function nextFrame() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      api.requestAnimationFrame(function () {
        api.requestAnimationFrame.apply(api, args);
      });
    },
    setTimeout: function (_setTimeout) {
      function setTimeout() {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function () {
      var timer = setTimeout.apply(void 0, arguments);
      api.add(function () {
        return clearTimeout(timer);
      });
    }),
    add: function add(cb) {
      disposables.push(cb);
    },
    dispose: function dispose() {
      disposables.splice(0).forEach(function (dispose) {
        return dispose();
      });
    }
  };
  return api;
}

function addClasses(node) {
  var _node$classList;

  for (var _len = arguments.length, classes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classes[_key - 1] = arguments[_key];
  }

  node && classes.length > 0 && (_node$classList = node.classList).add.apply(_node$classList, classes);
}

function removeClasses(node) {
  var _node$classList2;

  for (var _len2 = arguments.length, classes = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classes[_key2 - 1] = arguments[_key2];
  }

  node && classes.length > 0 && (_node$classList2 = node.classList).remove.apply(_node$classList2, classes);
}

var Reason;

(function (Reason) {
  Reason["Finished"] = "finished";
  Reason["Cancelled"] = "cancelled";
})(Reason || (Reason = {}));

function waitForTransition(node, done) {
  var d = disposables();
  if (!node) return d.dispose; // Safari returns a comma separated list of values, so let's sort them and take the highest value.

  var _getComputedStyle = getComputedStyle(node),
      transitionDuration = _getComputedStyle.transitionDuration,
      transitionDelay = _getComputedStyle.transitionDelay;

  var _map = [transitionDuration, transitionDelay].map(function (value) {
    var _value$split$filter$m = value.split(',') // Remove falseys we can't work with
    .filter(Boolean) // Values are returned as `0.3s` or `75ms`
    .map(function (v) {
      return v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000;
    }).sort(function (a, z) {
      return z - a;
    }),
        _value$split$filter$m2 = _value$split$filter$m[0],
        resolvedValue = _value$split$filter$m2 === void 0 ? 0 : _value$split$filter$m2;

    return resolvedValue;
  }),
      durationMs = _map[0],
      delaysMs = _map[1]; // Waiting for the transition to end. We could use the `transitionend` event, however when no
  // actual transition/duration is defined then the `transitionend` event is not fired.
  //
  // TODO: Downside is, when you slow down transitions via devtools this timeout is still using the
  // full 100% speed instead of the 25% or 10%.


  if (durationMs !== 0) {
    d.setTimeout(function () {
      done(Reason.Finished);
    }, durationMs + delaysMs);
  } else {
    // No transition is happening, so we should cleanup already. Otherwise we have to wait until we
    // get disposed.
    done(Reason.Finished);
  } // If we get disposed before the timeout runs we should cleanup anyway


  d.add(function () {
    return done(Reason.Cancelled);
  });
  return d.dispose;
}

function transition(node, base, from, to, done) {
  var d = disposables();

  var _done = done !== undefined ? once(done) : function () {};

  addClasses.apply(void 0, [node].concat(base, from));
  d.nextFrame(function () {
    removeClasses.apply(void 0, [node].concat(from));
    addClasses.apply(void 0, [node].concat(to));
    d.add(waitForTransition(node, function (reason) {
      removeClasses.apply(void 0, [node].concat(to, base));
      return _done(reason);
    }));
  }); // Once we get disposed, we should ensure that we cleanup after ourselves. In case of an unmount,
  // the node itself will be nullified and will be a no-op. In case of a full transition the classes
  // are already removed which is also a no-op. However if you go from enter -> leave mid-transition
  // then we have some leftovers that should be cleaned.

  d.add(function () {
    return removeClasses.apply(void 0, [node].concat(base, from, to));
  }); // When we get disposed early, than we should also call the done method but switch the reason.

  d.add(function () {
    return _done(Reason.Cancelled);
  });
  return d.dispose;
}

function useSplitClasses(classes) {
  if (classes === void 0) {
    classes = '';
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return classes.split(' ').filter(function (className) {
      return className.trim().length > 1;
    });
  }, [classes]);
}

var TransitionContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
var TreeStates;

(function (TreeStates) {
  TreeStates["Visible"] = "visible";
  TreeStates["Hidden"] = "hidden";
})(TreeStates || (TreeStates = {}));

function useTransitionContext() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(TransitionContext);

  if (context === null) {
    throw new Error('A <Transition.Child /> is used but it is missing a parent <Transition />.');
  }

  return context;
}

function useParentNesting() {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(NestingContext);

  if (context === null) {
    throw new Error('A <Transition.Child /> is used but it is missing a parent <Transition />.');
  }

  return context;
}

var NestingContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

function useNesting(done) {
  var doneRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(done);
  var transitionableChildren = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  var mounted = useIsMounted();
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    doneRef.current = done;
  }, [done]);
  var unregister = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (childId) {
    var idx = transitionableChildren.current.indexOf(childId);
    if (idx === -1) return;
    transitionableChildren.current.splice(idx, 1);

    if (transitionableChildren.current.length <= 0 && mounted.current) {
      var _doneRef$current;

      (_doneRef$current = doneRef.current) === null || _doneRef$current === void 0 ? void 0 : _doneRef$current.call(doneRef);
    }
  }, [doneRef, mounted, transitionableChildren]);
  var register = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (childId) {
    transitionableChildren.current.push(childId);
    return function () {
      return unregister(childId);
    };
  }, [transitionableChildren, unregister]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      children: transitionableChildren,
      register: register,
      unregister: unregister
    };
  }, [register, unregister, transitionableChildren]);
}

function TransitionChild(props) {
  var children = props.children,
      enter = props.enter,
      enterFrom = props.enterFrom,
      enterTo = props.enterTo,
      leave = props.leave,
      leaveFrom = props.leaveFrom,
      leaveTo = props.leaveTo,
      rest = _objectWithoutPropertiesLoose(props, ["children", "enter", "enterFrom", "enterTo", "leave", "leaveFrom", "leaveTo"]);

  var container = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);

  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(TreeStates.Visible),
      state = _React$useState[0],
      setState = _React$useState[1];

  var _useTransitionContext = useTransitionContext(),
      show = _useTransitionContext.show,
      appear = _useTransitionContext.appear;

  var _useParentNesting = useParentNesting(),
      register = _useParentNesting.register,
      unregister = _useParentNesting.unregister;

  var initial = useIsInitialRender();
  var id = useId();
  var isTransitioning = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(false);
  var nesting = useNesting(function () {
    // When all children have been unmounted we can only hide ourselves if and only if we are not
    // transitioning ourserlves. Otherwise we would unmount before the transitions are finished.
    if (!isTransitioning.current) {
      setState(TreeStates.Hidden);
      unregister(id);
    }
  });
  useIsoMorphicEffect(function () {
    if (!id) return;
    return register(id);
  }, [register, id]);
  var enterClasses = useSplitClasses(enter);
  var enterFromClasses = useSplitClasses(enterFrom);
  var enterToClasses = useSplitClasses(enterTo);
  var leaveClasses = useSplitClasses(leave);
  var leaveFromClasses = useSplitClasses(leaveFrom);
  var leaveToClasses = useSplitClasses(leaveTo);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (state === TreeStates.Visible && container.current === null) {
      throw new Error('Did you forget to passthrough the `ref` to the actual DOM node?');
    }
  }, [container, state]); // Skipping initial transition

  var skip = initial && !appear;
  useIsoMorphicEffect(function () {
    var node = container.current;
    if (!node) return;
    if (skip) return;
    isTransitioning.current = true;
    return show ? transition(node, enterClasses, enterFromClasses, enterToClasses, function () {
      isTransitioning.current = false;
    }) : transition(node, leaveClasses, leaveFromClasses, leaveToClasses, function (reason) {
      isTransitioning.current = false;
      if (reason !== Reason.Finished) return; // When we don't have children anymore we can safely unregister from the parent and hide
      // ourselves.

      if (nesting.children.current.length <= 0) {
        setState(TreeStates.Hidden);
        unregister(id);
      }
    });
  }, [id, isTransitioning, unregister, nesting, container, skip, show, enterClasses, enterFromClasses, enterToClasses, leaveClasses, leaveFromClasses, leaveToClasses]); // Unmount the whole tree

  if (state === TreeStates.Hidden) return null;

  if (typeof children === 'function') {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(NestingContext.Provider, {
      value: nesting
    }, children(container));
  }

  var _rest$as = rest.as,
      Component = _rest$as === void 0 ? 'div' : _rest$as,
      passthroughProps = _objectWithoutPropertiesLoose(rest, ["as"]);

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(NestingContext.Provider, {
    value: nesting
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Component, Object.assign({}, passthroughProps, {
    ref: container
  }), children));
}

function Transition(props) {
  var _match;

  var show = props.show,
      _props$appear = props.appear,
      appear = _props$appear === void 0 ? false : _props$appear,
      rest = _objectWithoutPropertiesLoose(props, ["show", "appear"]);

  if (![true, false].includes(show)) {
    throw new Error('A <Transition /> is used but it is missing a `show={true | false}` prop.');
  }

  var _React$useState2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(show ? TreeStates.Visible : TreeStates.Hidden),
      state = _React$useState2[0],
      setState = _React$useState2[1];

  var nestingBag = useNesting(function () {
    setState(TreeStates.Hidden);
  });
  var initial = useIsInitialRender();
  var transitionBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      show: show,
      appear: appear || !initial
    };
  }, [show, appear, initial]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    if (show) {
      setState(TreeStates.Visible);
    } else if (nestingBag.children.current.length <= 0) {
      setState(TreeStates.Hidden);
    }
  }, [show, nestingBag]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(NestingContext.Provider, {
    value: nestingBag
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TransitionContext.Provider, {
    value: transitionBag
  }, match(state, (_match = {}, _match[TreeStates.Visible] = function () {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(TransitionChild, Object.assign({}, rest));
  }, _match[TreeStates.Hidden] = null, _match))));
}
Transition.Child = TransitionChild;

function render(props, bag, tag) {
  var _props$as = props.as,
      Component = _props$as === void 0 ? tag : _props$as,
      children = props.children,
      passThroughProps = _objectWithoutPropertiesLoose(props, ["as", "children"]);

  var resolvedChildren = typeof children === 'function' ? children(bag) : children;

  if (Component === react__WEBPACK_IMPORTED_MODULE_0__.Fragment) {
    if (Object.keys(passThroughProps).length > 0) {
      if (Array.isArray(resolvedChildren) && resolvedChildren.length > 1) {
        var err = new Error('You should only render 1 child');
        if (Error.captureStackTrace) Error.captureStackTrace(err, render);
        throw err;
      }

      if (!(0,react__WEBPACK_IMPORTED_MODULE_0__.isValidElement)(resolvedChildren)) {
        var _err = new Error("You should render an element as a child. Did you forget the as=\"...\" prop?");

        if (Error.captureStackTrace) Error.captureStackTrace(_err, render);
        throw _err;
      }

      return (0,react__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(resolvedChildren, // Filter out undefined values so that they don't override the existing values
      mergeEventFunctions(compact(passThroughProps), resolvedChildren.props, ['onClick']));
    }
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Component, passThroughProps, resolvedChildren);
}
/**
 * We can use this function for the following useCase:
 *
 * <Menu.Item> <button onClick={console.log} /> </Menu.Item>
 *
 * Our `Menu.Item` will have an internal `onClick`, if you passthrough an `onClick` to the actual
 * `Menu.Item` component we will call it correctly. However, when we have an `onClick` on the actual
 * first child, that one should _also_ be called (but before this implementation, it was just
 * overriding the `onClick`). But it is only when we *render* that we have access to the existing
 * props of this component.
 *
 * It's a bit hacky, and not that clean, but it is something internal and we have tests to rely on
 * so that we can refactor this later (if needed).
 */

function mergeEventFunctions(passThroughProps, existingProps, functionsToMerge) {
  var clone = Object.assign({}, passThroughProps);

  var _loop = function _loop() {
    var func = _step.value;

    if (passThroughProps[func] !== undefined && existingProps[func] !== undefined) {
      var _Object$assign;

      Object.assign(clone, (_Object$assign = {}, _Object$assign[func] = function (event) {
        // Props we control
        if (!event.defaultPrevented) passThroughProps[func](event); // Existing props on the component

        if (!event.defaultPrevented) existingProps[func](event);
      }, _Object$assign));
    }
  };

  for (var _iterator = _createForOfIteratorHelperLoose(functionsToMerge), _step; !(_step = _iterator()).done;) {
    _loop();
  }

  return clone;
}
/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 */


function forwardRefWithAs(component) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(component);
}

function compact(object) {
  var clone = Object.assign({}, object);

  for (var key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }

  return clone;
}

function useDisposables() {
  // Using useState instead of useRef so that we can use the initializer function.
  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(disposables),
      d = _React$useState[0];

  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    return function () {
      return d.dispose();
    };
  }, [d]);
  return d;
}

function useSyncRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (value) {
    refs.forEach(function (ref) {
      if (ref === null) return;
      if (typeof ref === 'function') return ref(value);
      ref.current = value;
    });
  }, [refs]);
}

// TODO: This must already exist somewhere, right? 🤔
// Ref: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
var Keys;

(function (Keys) {
  Keys["Space"] = " ";
  Keys["Enter"] = "Enter";
  Keys["Escape"] = "Escape";
  Keys["Backspace"] = "Backspace";
  Keys["ArrowUp"] = "ArrowUp";
  Keys["ArrowDown"] = "ArrowDown";
  Keys["Home"] = "Home";
  Keys["End"] = "End";
  Keys["PageUp"] = "PageUp";
  Keys["PageDown"] = "PageDown";
  Keys["Tab"] = "Tab";
})(Keys || (Keys = {}));

var _reducers;
var MenuStates;

(function (MenuStates) {
  MenuStates[MenuStates["Open"] = 0] = "Open";
  MenuStates[MenuStates["Closed"] = 1] = "Closed";
})(MenuStates || (MenuStates = {}));

var ActionTypes;

(function (ActionTypes) {
  ActionTypes[ActionTypes["OpenMenu"] = 0] = "OpenMenu";
  ActionTypes[ActionTypes["CloseMenu"] = 1] = "CloseMenu";
  ActionTypes[ActionTypes["GoToItem"] = 2] = "GoToItem";
  ActionTypes[ActionTypes["Search"] = 3] = "Search";
  ActionTypes[ActionTypes["ClearSearch"] = 4] = "ClearSearch";
  ActionTypes[ActionTypes["RegisterItem"] = 5] = "RegisterItem";
  ActionTypes[ActionTypes["UnregisterItem"] = 6] = "UnregisterItem";
})(ActionTypes || (ActionTypes = {}));

var Focus;

(function (Focus) {
  Focus[Focus["FirstItem"] = 0] = "FirstItem";
  Focus[Focus["PreviousItem"] = 1] = "PreviousItem";
  Focus[Focus["NextItem"] = 2] = "NextItem";
  Focus[Focus["LastItem"] = 3] = "LastItem";
  Focus[Focus["SpecificItem"] = 4] = "SpecificItem";
  Focus[Focus["Nothing"] = 5] = "Nothing";
})(Focus || (Focus = {}));

function calculateActiveItemIndex(state, focus, id) {
  var _state$activeItemInde, _match;

  if (state.items.length <= 0) return null;
  var items = state.items;
  var activeItemIndex = (_state$activeItemInde = state.activeItemIndex) !== null && _state$activeItemInde !== void 0 ? _state$activeItemInde : -1;
  var nextActiveIndex = match(focus, (_match = {}, _match[Focus.FirstItem] = function () {
    return items.findIndex(function (item) {
      return !item.dataRef.current.disabled;
    });
  }, _match[Focus.PreviousItem] = function () {
    var idx = items.slice().reverse().findIndex(function (item, idx, all) {
      if (activeItemIndex !== -1 && all.length - idx - 1 >= activeItemIndex) return false;
      return !item.dataRef.current.disabled;
    });
    if (idx === -1) return idx;
    return items.length - 1 - idx;
  }, _match[Focus.NextItem] = function () {
    return items.findIndex(function (item, idx) {
      if (idx <= activeItemIndex) return false;
      return !item.dataRef.current.disabled;
    });
  }, _match[Focus.LastItem] = function () {
    var idx = items.slice().reverse().findIndex(function (item) {
      return !item.dataRef.current.disabled;
    });
    if (idx === -1) return idx;
    return items.length - 1 - idx;
  }, _match[Focus.SpecificItem] = function () {
    return items.findIndex(function (item) {
      return item.id === id;
    });
  }, _match[Focus.Nothing] = function () {
    return null;
  }, _match));
  if (nextActiveIndex === -1) return state.activeItemIndex;
  return nextActiveIndex;
}

var reducers = (_reducers = {}, _reducers[ActionTypes.CloseMenu] = function (state) {
  return _extends({}, state, {
    menuState: MenuStates.Closed
  });
}, _reducers[ActionTypes.OpenMenu] = function (state) {
  return _extends({}, state, {
    menuState: MenuStates.Open
  });
}, _reducers[ActionTypes.GoToItem] = function (state, action) {
  var activeItemIndex = calculateActiveItemIndex(state, action.focus, action.id);

  if (state.searchQuery === '' && state.activeItemIndex === activeItemIndex) {
    return state;
  }

  return _extends({}, state, {
    searchQuery: '',
    activeItemIndex: activeItemIndex
  });
}, _reducers[ActionTypes.Search] = function (state, action) {
  var searchQuery = state.searchQuery + action.value;
  var match = state.items.findIndex(function (item) {
    var _item$dataRef$current;

    return ((_item$dataRef$current = item.dataRef.current.textValue) === null || _item$dataRef$current === void 0 ? void 0 : _item$dataRef$current.startsWith(searchQuery)) && !item.dataRef.current.disabled;
  });

  if (match === -1 || match === state.activeItemIndex) {
    return _extends({}, state, {
      searchQuery: searchQuery
    });
  }

  return _extends({}, state, {
    searchQuery: searchQuery,
    activeItemIndex: match
  });
}, _reducers[ActionTypes.ClearSearch] = function (state) {
  return _extends({}, state, {
    searchQuery: ''
  });
}, _reducers[ActionTypes.RegisterItem] = function (state, action) {
  return _extends({}, state, {
    items: [].concat(state.items, [{
      id: action.id,
      dataRef: action.dataRef
    }])
  });
}, _reducers[ActionTypes.UnregisterItem] = function (state, action) {
  var nextItems = state.items.slice();
  var currentActiveItem = state.activeItemIndex !== null ? nextItems[state.activeItemIndex] : null;
  var idx = nextItems.findIndex(function (a) {
    return a.id === action.id;
  });
  if (idx !== -1) nextItems.splice(idx, 1);
  return _extends({}, state, {
    items: nextItems,
    activeItemIndex: function () {
      if (idx === state.activeItemIndex) return null;
      if (currentActiveItem === null) return null; // If we removed the item before the actual active index, then it would be out of sync. To
      // fix this, we will find the correct (new) index position.

      return nextItems.indexOf(currentActiveItem);
    }()
  });
}, _reducers);
var MenuContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

function useMenuContext(component) {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(MenuContext);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <" + Menu.name + " /> component.");

    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, useMenuContext);
    }

    throw err;
  }

  return context;
}

function stateReducer(state, action) {
  return match(action.type, reducers, state, action);
} // ---


var DEFAULT_MENU_TAG = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;
function Menu(props) {
  var d = useDisposables();
  var reducerBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(stateReducer, {
    menuState: MenuStates.Closed,
    buttonRef: (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)(),
    itemsRef: (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)(),
    items: [],
    searchQuery: '',
    activeItemIndex: null
  });
  var _reducerBag$ = reducerBag[0],
      menuState = _reducerBag$.menuState,
      itemsRef = _reducerBag$.itemsRef,
      buttonRef = _reducerBag$.buttonRef,
      dispatch = reducerBag[1];
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    function handler(event) {
      var _buttonRef$current, _itemsRef$current;

      if (menuState !== MenuStates.Open) return;
      if ((_buttonRef$current = buttonRef.current) === null || _buttonRef$current === void 0 ? void 0 : _buttonRef$current.contains(event.target)) return;

      if (!((_itemsRef$current = itemsRef.current) === null || _itemsRef$current === void 0 ? void 0 : _itemsRef$current.contains(event.target))) {
        dispatch({
          type: ActionTypes.CloseMenu
        });
      }

      if (!event.defaultPrevented) d.nextFrame(function () {
        var _buttonRef$current2;

        return (_buttonRef$current2 = buttonRef.current) === null || _buttonRef$current2 === void 0 ? void 0 : _buttonRef$current2.focus();
      });
    }

    window.addEventListener('click', handler);
    return function () {
      return window.removeEventListener('click', handler);
    };
  }, [menuState, itemsRef, buttonRef, d, dispatch]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: menuState === MenuStates.Open
    };
  }, [menuState]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(MenuContext.Provider, {
    value: reducerBag
  }, render(props, propsBag, DEFAULT_MENU_TAG));
}
var DEFAULT_BUTTON_TAG = 'button';
var Button = /*#__PURE__*/forwardRefWithAs(function Button(props, ref) {
  var _state$itemsRef$curre5;

  var _useMenuContext = useMenuContext([Menu.name, Button.name].join('.')),
      state = _useMenuContext[0],
      dispatch = _useMenuContext[1];

  var buttonRef = useSyncRefs(state.buttonRef, ref);

  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      focused = _React$useState[0],
      setFocused = _React$useState[1];

  var id = "headlessui-menu-button-" + useId();
  var d = useDisposables();
  var handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        event.preventDefault();
        dispatch({
          type: ActionTypes.OpenMenu
        });
        d.nextFrame(function () {
          var _state$itemsRef$curre;

          (_state$itemsRef$curre = state.itemsRef.current) === null || _state$itemsRef$curre === void 0 ? void 0 : _state$itemsRef$curre.focus();
          dispatch({
            type: ActionTypes.GoToItem,
            focus: Focus.FirstItem
          });
        });
        break;

      case Keys.ArrowUp:
        event.preventDefault();
        dispatch({
          type: ActionTypes.OpenMenu
        });
        d.nextFrame(function () {
          var _state$itemsRef$curre2;

          (_state$itemsRef$curre2 = state.itemsRef.current) === null || _state$itemsRef$curre2 === void 0 ? void 0 : _state$itemsRef$curre2.focus();
          dispatch({
            type: ActionTypes.GoToItem,
            focus: Focus.LastItem
          });
        });
        break;
    }
  }, [dispatch, state, d]);
  var handlePointerUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    if (state.menuState === MenuStates.Open) {
      dispatch({
        type: ActionTypes.CloseMenu
      });
      d.nextFrame(function () {
        var _state$buttonRef$curr;

        return (_state$buttonRef$curr = state.buttonRef.current) === null || _state$buttonRef$curr === void 0 ? void 0 : _state$buttonRef$curr.focus();
      });
    } else {
      event.preventDefault();
      dispatch({
        type: ActionTypes.OpenMenu
      });
      d.nextFrame(function () {
        var _state$itemsRef$curre3;

        return (_state$itemsRef$curre3 = state.itemsRef.current) === null || _state$itemsRef$curre3 === void 0 ? void 0 : _state$itemsRef$curre3.focus();
      });
    }
  }, [dispatch, d, state]);
  var handleFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var _state$itemsRef$curre4;

    if (state.menuState === MenuStates.Open) (_state$itemsRef$curre4 = state.itemsRef.current) === null || _state$itemsRef$curre4 === void 0 ? void 0 : _state$itemsRef$curre4.focus();
    setFocused(true);
  }, [state, setFocused]);
  var handleBlur = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    return setFocused(false);
  }, [setFocused]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: state.menuState === MenuStates.Open,
      focused: focused
    };
  }, [state, focused]);
  var passthroughProps = props;
  var propsWeControl = {
    ref: buttonRef,
    id: id,
    type: 'button',
    'aria-haspopup': true,
    'aria-controls': (_state$itemsRef$curre5 = state.itemsRef.current) === null || _state$itemsRef$curre5 === void 0 ? void 0 : _state$itemsRef$curre5.id,
    'aria-expanded': state.menuState === MenuStates.Open ? true : undefined,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerUp: handlePointerUp
  };
  return render(_extends({}, passthroughProps, propsWeControl), propsBag, DEFAULT_BUTTON_TAG);
});
var DEFAULT_ITEMS_TAG = 'div';
var Items = /*#__PURE__*/forwardRefWithAs(function Items(props, ref) {
  var _state$items$state$ac, _state$buttonRef$curr4;

  var _props$static = props["static"],
      isStatic = _props$static === void 0 ? false : _props$static,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["static"]);

  var _useMenuContext2 = useMenuContext([Menu.name, Items.name].join('.')),
      state = _useMenuContext2[0],
      dispatch = _useMenuContext2[1];

  var itemsRef = useSyncRefs(state.itemsRef, ref);
  var id = "headlessui-menu-items-" + useId();
  var searchDisposables = useDisposables();
  var handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    searchDisposables.dispose();

    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
      // @ts-expect-error Fallthrough is expected here
      case Keys.Space:
        if (state.searchQuery !== '') {
          event.preventDefault();
          return dispatch({
            type: ActionTypes.Search,
            value: event.key
          });
        }

      // When in type ahead mode, fallthrough

      case Keys.Enter:
        event.preventDefault();
        dispatch({
          type: ActionTypes.CloseMenu
        });

        if (state.activeItemIndex !== null) {
          var _document$getElementB;

          var _id = state.items[state.activeItemIndex].id;
          (_document$getElementB = document.getElementById(_id)) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.click();
        }

        disposables().nextFrame(function () {
          var _state$buttonRef$curr2;

          return (_state$buttonRef$curr2 = state.buttonRef.current) === null || _state$buttonRef$curr2 === void 0 ? void 0 : _state$buttonRef$curr2.focus();
        });
        break;

      case Keys.ArrowDown:
        event.preventDefault();
        return dispatch({
          type: ActionTypes.GoToItem,
          focus: Focus.NextItem
        });

      case Keys.ArrowUp:
        event.preventDefault();
        return dispatch({
          type: ActionTypes.GoToItem,
          focus: Focus.PreviousItem
        });

      case Keys.Home:
      case Keys.PageUp:
        event.preventDefault();
        return dispatch({
          type: ActionTypes.GoToItem,
          focus: Focus.FirstItem
        });

      case Keys.End:
      case Keys.PageDown:
        event.preventDefault();
        return dispatch({
          type: ActionTypes.GoToItem,
          focus: Focus.LastItem
        });

      case Keys.Escape:
        event.preventDefault();
        dispatch({
          type: ActionTypes.CloseMenu
        });
        disposables().nextFrame(function () {
          var _state$buttonRef$curr3;

          return (_state$buttonRef$curr3 = state.buttonRef.current) === null || _state$buttonRef$curr3 === void 0 ? void 0 : _state$buttonRef$curr3.focus();
        });
        break;

      case Keys.Tab:
        return event.preventDefault();

      default:
        if (event.key.length === 1) {
          dispatch({
            type: ActionTypes.Search,
            value: event.key
          });
          searchDisposables.setTimeout(function () {
            return dispatch({
              type: ActionTypes.ClearSearch
            });
          }, 350);
        }

        break;
    }
  }, [dispatch, searchDisposables, state]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: state.menuState === MenuStates.Open
    };
  }, [state]);
  var propsWeControl = {
    'aria-activedescendant': state.activeItemIndex === null ? undefined : (_state$items$state$ac = state.items[state.activeItemIndex]) === null || _state$items$state$ac === void 0 ? void 0 : _state$items$state$ac.id,
    'aria-labelledby': (_state$buttonRef$curr4 = state.buttonRef.current) === null || _state$buttonRef$curr4 === void 0 ? void 0 : _state$buttonRef$curr4.id,
    id: id,
    onKeyDown: handleKeyDown,
    role: 'menu',
    tabIndex: 0
  };
  if (!isStatic && state.menuState === MenuStates.Closed) return null;
  return render(_extends({}, passthroughProps, propsWeControl, {
    ref: itemsRef
  }), propsBag, DEFAULT_ITEMS_TAG);
});
var DEFAULT_ITEM_TAG = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;

function Item(props) {
  var _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      className = props.className,
      onClick = props.onClick,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["disabled", "className", "onClick"]);

  var _useMenuContext3 = useMenuContext([Menu.name, Item.name].join('.')),
      state = _useMenuContext3[0],
      dispatch = _useMenuContext3[1];

  var d = useDisposables();
  var id = "headlessui-menu-item-" + useId();
  var active = state.activeItemIndex !== null ? state.items[state.activeItemIndex].id === id : false;
  var bag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    disabled: disabled
  });
  useIsoMorphicEffect(function () {
    bag.current.disabled = disabled;
  }, [bag, disabled]);
  useIsoMorphicEffect(function () {
    var _document$getElementB2, _document$getElementB3;

    bag.current.textValue = (_document$getElementB2 = document.getElementById(id)) === null || _document$getElementB2 === void 0 ? void 0 : (_document$getElementB3 = _document$getElementB2.textContent) === null || _document$getElementB3 === void 0 ? void 0 : _document$getElementB3.toLowerCase();
  }, [bag, id]);
  useIsoMorphicEffect(function () {
    dispatch({
      type: ActionTypes.RegisterItem,
      id: id,
      dataRef: bag
    });
    return function () {
      return dispatch({
        type: ActionTypes.UnregisterItem,
        id: id
      });
    };
  }, [bag, id]);
  var handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    if (disabled) return event.preventDefault();
    dispatch({
      type: ActionTypes.CloseMenu
    });
    d.nextFrame(function () {
      var _state$buttonRef$curr5;

      return (_state$buttonRef$curr5 = state.buttonRef.current) === null || _state$buttonRef$curr5 === void 0 ? void 0 : _state$buttonRef$curr5.focus();
    });
    if (onClick) return onClick(event);
  }, [d, dispatch, state.buttonRef, disabled, onClick]);
  var handleFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return dispatch({
      type: ActionTypes.GoToItem,
      focus: Focus.Nothing
    });
    dispatch({
      type: ActionTypes.GoToItem,
      focus: Focus.SpecificItem,
      id: id
    });
  }, [disabled, id, dispatch]);
  var handlePointerMove = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return;
    if (active) return;
    dispatch({
      type: ActionTypes.GoToItem,
      focus: Focus.SpecificItem,
      id: id
    });
  }, [disabled, active, id, dispatch]);
  var handlePointerLeave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return;
    if (!active) return;
    dispatch({
      type: ActionTypes.GoToItem,
      focus: Focus.Nothing
    });
  }, [disabled, active, dispatch]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      active: active,
      disabled: disabled
    };
  }, [active, disabled]);
  var propsWeControl = {
    id: id,
    role: 'menuitem',
    tabIndex: -1,
    className: resolvePropValue(className, propsBag),
    'aria-disabled': disabled === true ? true : undefined,
    onClick: handleClick,
    onFocus: handleFocus,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave
  };
  return render(_extends({}, passthroughProps, propsWeControl), propsBag, DEFAULT_ITEM_TAG);
}

function resolvePropValue(property, bag) {
  if (property === undefined) return undefined;
  if (typeof property === 'function') return property(bag);
  return property;
} // ---


Menu.Button = Button;
Menu.Items = Items;
Menu.Item = Item;

function useComputed(cb, dependencies) {
  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(cb),
      value = _React$useState[0],
      setValue = _React$useState[1];

  var cbRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(cb);
  useIsoMorphicEffect(function () {
    cbRef.current = cb;
  }, [cb]);
  useIsoMorphicEffect(function () {
    return setValue(cbRef.current);
  }, [cbRef, setValue].concat(dependencies));
  return value;
}

var _reducers$1;
var ListboxStates;

(function (ListboxStates) {
  ListboxStates[ListboxStates["Open"] = 0] = "Open";
  ListboxStates[ListboxStates["Closed"] = 1] = "Closed";
})(ListboxStates || (ListboxStates = {}));

var ActionTypes$1;

(function (ActionTypes) {
  ActionTypes[ActionTypes["OpenListbox"] = 0] = "OpenListbox";
  ActionTypes[ActionTypes["CloseListbox"] = 1] = "CloseListbox";
  ActionTypes[ActionTypes["GoToOption"] = 2] = "GoToOption";
  ActionTypes[ActionTypes["Search"] = 3] = "Search";
  ActionTypes[ActionTypes["ClearSearch"] = 4] = "ClearSearch";
  ActionTypes[ActionTypes["RegisterOption"] = 5] = "RegisterOption";
  ActionTypes[ActionTypes["UnregisterOption"] = 6] = "UnregisterOption";
})(ActionTypes$1 || (ActionTypes$1 = {}));

var Focus$1;

(function (Focus) {
  Focus[Focus["First"] = 0] = "First";
  Focus[Focus["Previous"] = 1] = "Previous";
  Focus[Focus["Next"] = 2] = "Next";
  Focus[Focus["Last"] = 3] = "Last";
  Focus[Focus["Specific"] = 4] = "Specific";
  Focus[Focus["Nothing"] = 5] = "Nothing";
})(Focus$1 || (Focus$1 = {}));

function calculateActiveOptionIndex(state, focus, id) {
  var _state$activeOptionIn, _match;

  if (state.options.length <= 0) return null;
  var options = state.options;
  var activeOptionIndex = (_state$activeOptionIn = state.activeOptionIndex) !== null && _state$activeOptionIn !== void 0 ? _state$activeOptionIn : -1;
  var nextActiveIndex = match(focus, (_match = {}, _match[Focus$1.First] = function () {
    return options.findIndex(function (option) {
      return !option.dataRef.current.disabled;
    });
  }, _match[Focus$1.Previous] = function () {
    var idx = options.slice().reverse().findIndex(function (option, idx, all) {
      if (activeOptionIndex !== -1 && all.length - idx - 1 >= activeOptionIndex) return false;
      return !option.dataRef.current.disabled;
    });
    if (idx === -1) return idx;
    return options.length - 1 - idx;
  }, _match[Focus$1.Next] = function () {
    return options.findIndex(function (option, idx) {
      if (idx <= activeOptionIndex) return false;
      return !option.dataRef.current.disabled;
    });
  }, _match[Focus$1.Last] = function () {
    var idx = options.slice().reverse().findIndex(function (option) {
      return !option.dataRef.current.disabled;
    });
    if (idx === -1) return idx;
    return options.length - 1 - idx;
  }, _match[Focus$1.Specific] = function () {
    return options.findIndex(function (option) {
      return option.id === id;
    });
  }, _match[Focus$1.Nothing] = function () {
    return null;
  }, _match));
  if (nextActiveIndex === -1) return state.activeOptionIndex;
  return nextActiveIndex;
}

var reducers$1 = (_reducers$1 = {}, _reducers$1[ActionTypes$1.CloseListbox] = function (state) {
  return _extends({}, state, {
    listboxState: ListboxStates.Closed
  });
}, _reducers$1[ActionTypes$1.OpenListbox] = function (state) {
  return _extends({}, state, {
    listboxState: ListboxStates.Open
  });
}, _reducers$1[ActionTypes$1.GoToOption] = function (state, action) {
  var activeOptionIndex = calculateActiveOptionIndex(state, action.focus, action.id);

  if (state.searchQuery === '' && state.activeOptionIndex === activeOptionIndex) {
    return state;
  }

  return _extends({}, state, {
    searchQuery: '',
    activeOptionIndex: activeOptionIndex
  });
}, _reducers$1[ActionTypes$1.Search] = function (state, action) {
  var searchQuery = state.searchQuery + action.value;
  var match = state.options.findIndex(function (option) {
    var _option$dataRef$curre;

    return !option.dataRef.current.disabled && ((_option$dataRef$curre = option.dataRef.current.textValue) === null || _option$dataRef$curre === void 0 ? void 0 : _option$dataRef$curre.startsWith(searchQuery));
  });

  if (match === -1 || match === state.activeOptionIndex) {
    return _extends({}, state, {
      searchQuery: searchQuery
    });
  }

  return _extends({}, state, {
    searchQuery: searchQuery,
    activeOptionIndex: match
  });
}, _reducers$1[ActionTypes$1.ClearSearch] = function (state) {
  return _extends({}, state, {
    searchQuery: ''
  });
}, _reducers$1[ActionTypes$1.RegisterOption] = function (state, action) {
  return _extends({}, state, {
    options: [].concat(state.options, [{
      id: action.id,
      dataRef: action.dataRef
    }])
  });
}, _reducers$1[ActionTypes$1.UnregisterOption] = function (state, action) {
  var nextOptions = state.options.slice();
  var currentActiveOption = state.activeOptionIndex !== null ? nextOptions[state.activeOptionIndex] : null;
  var idx = nextOptions.findIndex(function (a) {
    return a.id === action.id;
  });
  if (idx !== -1) nextOptions.splice(idx, 1);
  return _extends({}, state, {
    options: nextOptions,
    activeOptionIndex: function () {
      if (idx === state.activeOptionIndex) return null;
      if (currentActiveOption === null) return null; // If we removed the option before the actual active index, then it would be out of sync. To
      // fix this, we will find the correct (new) index position.

      return nextOptions.indexOf(currentActiveOption);
    }()
  });
}, _reducers$1);
var ListboxContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

function stateReducer$1(state, action) {
  return match(action.type, reducers$1, state, action);
}

function useListboxContext(component) {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(ListboxContext);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <" + Listbox.name + " /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useListboxContext);
    throw err;
  }

  return context;
} // ---


var DEFAULT_LISTBOX_TAG = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;
function Listbox(props) {
  var value = props.value,
      onChange = props.onChange,
      passThroughProps = _objectWithoutPropertiesLoose(props, ["value", "onChange"]);

  var d = useDisposables();
  var reducerBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useReducer)(stateReducer$1, {
    listboxState: ListboxStates.Closed,
    propsRef: {
      current: {
        value: value,
        onChange: onChange
      }
    },
    labelRef: (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)(),
    buttonRef: (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)(),
    optionsRef: (0,react__WEBPACK_IMPORTED_MODULE_0__.createRef)(),
    options: [],
    searchQuery: '',
    activeOptionIndex: null
  });
  var _reducerBag$ = reducerBag[0],
      listboxState = _reducerBag$.listboxState,
      propsRef = _reducerBag$.propsRef,
      optionsRef = _reducerBag$.optionsRef,
      buttonRef = _reducerBag$.buttonRef,
      dispatch = reducerBag[1];
  useIsoMorphicEffect(function () {
    propsRef.current.value = value;
  }, [value, propsRef]);
  useIsoMorphicEffect(function () {
    propsRef.current.onChange = onChange;
  }, [onChange, propsRef]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
    function handler(event) {
      var _buttonRef$current, _optionsRef$current;

      if (listboxState !== ListboxStates.Open) return;
      if ((_buttonRef$current = buttonRef.current) === null || _buttonRef$current === void 0 ? void 0 : _buttonRef$current.contains(event.target)) return;

      if (!((_optionsRef$current = optionsRef.current) === null || _optionsRef$current === void 0 ? void 0 : _optionsRef$current.contains(event.target))) {
        dispatch({
          type: ActionTypes$1.CloseListbox
        });
      }

      if (!event.defaultPrevented) d.nextFrame(function () {
        var _buttonRef$current2;

        return (_buttonRef$current2 = buttonRef.current) === null || _buttonRef$current2 === void 0 ? void 0 : _buttonRef$current2.focus();
      });
    }

    window.addEventListener('click', handler);
    return function () {
      return window.removeEventListener('click', handler);
    };
  }, [listboxState, optionsRef, buttonRef, d, dispatch]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: listboxState === ListboxStates.Open
    };
  }, [listboxState]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(ListboxContext.Provider, {
    value: reducerBag
  }, render(passThroughProps, propsBag, DEFAULT_LISTBOX_TAG));
}
var DEFAULT_BUTTON_TAG$1 = 'button';
var Button$1 = /*#__PURE__*/forwardRefWithAs(function Button(props, ref) {
  var _state$optionsRef$cur5;

  var _useListboxContext = useListboxContext([Listbox.name, Button.name].join('.')),
      state = _useListboxContext[0],
      dispatch = _useListboxContext[1];

  var buttonRef = useSyncRefs(state.buttonRef, ref);

  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false),
      focused = _React$useState[0],
      setFocused = _React$useState[1];

  var id = "headlessui-listbox-button-" + useId();
  var d = useDisposables();
  var handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.OpenListbox
        });
        d.nextFrame(function () {
          var _state$optionsRef$cur;

          (_state$optionsRef$cur = state.optionsRef.current) === null || _state$optionsRef$cur === void 0 ? void 0 : _state$optionsRef$cur.focus();
          if (!state.propsRef.current.value) dispatch({
            type: ActionTypes$1.GoToOption,
            focus: Focus$1.First
          });
        });
        break;

      case Keys.ArrowUp:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.OpenListbox
        });
        d.nextFrame(function () {
          var _state$optionsRef$cur2;

          (_state$optionsRef$cur2 = state.optionsRef.current) === null || _state$optionsRef$cur2 === void 0 ? void 0 : _state$optionsRef$cur2.focus();
          if (!state.propsRef.current.value) dispatch({
            type: ActionTypes$1.GoToOption,
            focus: Focus$1.Last
          });
        });
        break;
    }
  }, [dispatch, state, d]);
  var handlePointerUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    if (state.listboxState === ListboxStates.Open) {
      dispatch({
        type: ActionTypes$1.CloseListbox
      });
      d.nextFrame(function () {
        var _state$buttonRef$curr;

        return (_state$buttonRef$curr = state.buttonRef.current) === null || _state$buttonRef$curr === void 0 ? void 0 : _state$buttonRef$curr.focus();
      });
    } else {
      event.preventDefault();
      dispatch({
        type: ActionTypes$1.OpenListbox
      });
      d.nextFrame(function () {
        var _state$optionsRef$cur3;

        return (_state$optionsRef$cur3 = state.optionsRef.current) === null || _state$optionsRef$cur3 === void 0 ? void 0 : _state$optionsRef$cur3.focus();
      });
    }
  }, [dispatch, d, state]);
  var handleFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var _state$optionsRef$cur4;

    if (state.listboxState === ListboxStates.Open) return (_state$optionsRef$cur4 = state.optionsRef.current) === null || _state$optionsRef$cur4 === void 0 ? void 0 : _state$optionsRef$cur4.focus();
    setFocused(true);
  }, [state, setFocused]);
  var handleBlur = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    return setFocused(false);
  }, [setFocused]);
  var labelledby = useComputed(function () {
    if (!state.labelRef.current) return undefined;
    return [state.labelRef.current.id, id].join(' ');
  }, [state.labelRef.current, id]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: state.listboxState === ListboxStates.Open,
      focused: focused
    };
  }, [state, focused]);
  var passthroughProps = props;
  var propsWeControl = {
    ref: buttonRef,
    id: id,
    type: 'button',
    'aria-haspopup': true,
    'aria-controls': (_state$optionsRef$cur5 = state.optionsRef.current) === null || _state$optionsRef$cur5 === void 0 ? void 0 : _state$optionsRef$cur5.id,
    'aria-expanded': state.listboxState === ListboxStates.Open ? true : undefined,
    'aria-labelledby': labelledby,
    onKeyDown: handleKeyDown,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onPointerUp: handlePointerUp
  };
  return render(_extends({}, passthroughProps, propsWeControl), propsBag, DEFAULT_BUTTON_TAG$1);
});
var DEFAULT_LABEL_TAG = 'label';

function Label(props) {
  var _useListboxContext2 = useListboxContext([Listbox.name, Label.name].join('.')),
      state = _useListboxContext2[0];

  var id = "headlessui-listbox-label-" + useId();
  var handlePointerUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    var _state$buttonRef$curr2;

    return (_state$buttonRef$curr2 = state.buttonRef.current) === null || _state$buttonRef$curr2 === void 0 ? void 0 : _state$buttonRef$curr2.focus();
  }, [state.buttonRef]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: state.listboxState === ListboxStates.Open
    };
  }, [state]);
  var propsWeControl = {
    ref: state.labelRef,
    id: id,
    onPointerUp: handlePointerUp
  };
  return render(_extends({}, props, propsWeControl), propsBag, DEFAULT_LABEL_TAG);
}

var DEFAULT_OPTIONS_TAG = 'ul';
var Options = /*#__PURE__*/forwardRefWithAs(function Options(props, ref) {
  var _state$options$state$;

  var _props$static = props["static"],
      isStatic = _props$static === void 0 ? false : _props$static,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["enter", "enterFrom", "enterTo", "leave", "leaveFrom", "leaveTo", "static"]);

  var _useListboxContext3 = useListboxContext([Listbox.name, Options.name].join('.')),
      state = _useListboxContext3[0],
      dispatch = _useListboxContext3[1];

  var optionsRef = useSyncRefs(state.optionsRef, ref);
  var id = "headlessui-listbox-options-" + useId();
  var d = useDisposables();
  var searchDisposables = useDisposables();
  var handleKeyDown = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    searchDisposables.dispose();

    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
      // @ts-expect-error Fallthrough is expected here
      case Keys.Space:
        if (state.searchQuery !== '') {
          event.preventDefault();
          return dispatch({
            type: ActionTypes$1.Search,
            value: event.key
          });
        }

      // When in type ahead mode, fallthrough

      case Keys.Enter:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.CloseListbox
        });

        if (state.activeOptionIndex !== null) {
          var dataRef = state.options[state.activeOptionIndex].dataRef;
          state.propsRef.current.onChange(dataRef.current.value);
        }

        disposables().nextFrame(function () {
          var _state$buttonRef$curr3;

          return (_state$buttonRef$curr3 = state.buttonRef.current) === null || _state$buttonRef$curr3 === void 0 ? void 0 : _state$buttonRef$curr3.focus();
        });
        break;

      case Keys.ArrowDown:
        event.preventDefault();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Next
        });

      case Keys.ArrowUp:
        event.preventDefault();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Previous
        });

      case Keys.Home:
      case Keys.PageUp:
        event.preventDefault();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.First
        });

      case Keys.End:
      case Keys.PageDown:
        event.preventDefault();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Last
        });

      case Keys.Escape:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.CloseListbox
        });
        return d.nextFrame(function () {
          var _state$buttonRef$curr4;

          return (_state$buttonRef$curr4 = state.buttonRef.current) === null || _state$buttonRef$curr4 === void 0 ? void 0 : _state$buttonRef$curr4.focus();
        });

      case Keys.Tab:
        return event.preventDefault();

      default:
        if (event.key.length === 1) {
          dispatch({
            type: ActionTypes$1.Search,
            value: event.key
          });
          searchDisposables.setTimeout(function () {
            return dispatch({
              type: ActionTypes$1.ClearSearch
            });
          }, 350);
        }

        break;
    }
  }, [d, dispatch, searchDisposables, state]);
  var labelledby = useComputed(function () {
    var _state$labelRef$curre, _state$labelRef$curre2, _state$buttonRef$curr5;

    return (_state$labelRef$curre = (_state$labelRef$curre2 = state.labelRef.current) === null || _state$labelRef$curre2 === void 0 ? void 0 : _state$labelRef$curre2.id) !== null && _state$labelRef$curre !== void 0 ? _state$labelRef$curre : (_state$buttonRef$curr5 = state.buttonRef.current) === null || _state$buttonRef$curr5 === void 0 ? void 0 : _state$buttonRef$curr5.id;
  }, [state.labelRef.current, state.buttonRef.current]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      open: state.listboxState === ListboxStates.Open
    };
  }, [state]);
  var propsWeControl = {
    'aria-activedescendant': state.activeOptionIndex === null ? undefined : (_state$options$state$ = state.options[state.activeOptionIndex]) === null || _state$options$state$ === void 0 ? void 0 : _state$options$state$.id,
    'aria-labelledby': labelledby,
    id: id,
    onKeyDown: handleKeyDown,
    role: 'listbox',
    tabIndex: 0
  };
  if (!isStatic && state.listboxState === ListboxStates.Closed) return null;
  return render(_extends({}, passthroughProps, propsWeControl, {
    ref: optionsRef
  }), propsBag, DEFAULT_OPTIONS_TAG);
});
var DEFAULT_OPTION_TAG = 'li';

function Option(props) {
  var _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      value = props.value,
      className = props.className,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["disabled", "value", "className"]);

  var _useListboxContext4 = useListboxContext([Listbox.name, Option.name].join('.')),
      state = _useListboxContext4[0],
      dispatch = _useListboxContext4[1];

  var id = "headlessui-listbox-option-" + useId();
  var active = state.activeOptionIndex !== null ? state.options[state.activeOptionIndex].id === id : false;
  var selected = state.propsRef.current.value === value;
  var bag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    disabled: disabled,
    value: value
  });
  useIsoMorphicEffect(function () {
    bag.current.disabled = disabled;
  }, [bag, disabled]);
  useIsoMorphicEffect(function () {
    bag.current.value = value;
  }, [bag, value]);
  useIsoMorphicEffect(function () {
    var _document$getElementB, _document$getElementB2;

    bag.current.textValue = (_document$getElementB = document.getElementById(id)) === null || _document$getElementB === void 0 ? void 0 : (_document$getElementB2 = _document$getElementB.textContent) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.toLowerCase();
  }, [bag, id]);
  var select = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    return state.propsRef.current.onChange(value);
  }, [state.propsRef, value]);
  useIsoMorphicEffect(function () {
    dispatch({
      type: ActionTypes$1.RegisterOption,
      id: id,
      dataRef: bag
    });
    return function () {
      return dispatch({
        type: ActionTypes$1.UnregisterOption,
        id: id
      });
    };
  }, [bag, id]);
  useIsoMorphicEffect(function () {
    var _document$getElementB3, _document$getElementB4;

    if (!selected) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
    (_document$getElementB3 = document.getElementById(id)) === null || _document$getElementB3 === void 0 ? void 0 : (_document$getElementB4 = _document$getElementB3.focus) === null || _document$getElementB4 === void 0 ? void 0 : _document$getElementB4.call(_document$getElementB3);
  }, []);
  useIsoMorphicEffect(function () {
    if (!active) return;
    var d = disposables();
    d.nextFrame(function () {
      var _document$getElementB5, _document$getElementB6;

      return (_document$getElementB5 = document.getElementById(id)) === null || _document$getElementB5 === void 0 ? void 0 : (_document$getElementB6 = _document$getElementB5.scrollIntoView) === null || _document$getElementB6 === void 0 ? void 0 : _document$getElementB6.call(_document$getElementB5, {
        block: 'nearest'
      });
    });
    return d.dispose;
  }, [active]);
  var handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    if (disabled) return event.preventDefault();
    select();
    dispatch({
      type: ActionTypes$1.CloseListbox
    });
    disposables().nextFrame(function () {
      var _state$buttonRef$curr6;

      return (_state$buttonRef$curr6 = state.buttonRef.current) === null || _state$buttonRef$curr6 === void 0 ? void 0 : _state$buttonRef$curr6.focus();
    });
  }, [dispatch, state.buttonRef, disabled, select]);
  var handleFocus = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Nothing
    });
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
  }, [disabled, id, dispatch]);
  var handlePointerMove = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return;
    if (active) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
  }, [disabled, active, id, dispatch]);
  var handlePointerLeave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (disabled) return;
    if (!active) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Nothing
    });
  }, [disabled, active, dispatch]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      active: active,
      selected: selected,
      disabled: disabled
    };
  }, [active, selected, disabled]);
  var propsWeControl = {
    id: id,
    role: 'option',
    tabIndex: -1,
    className: resolvePropValue$1(className, propsBag),
    'aria-disabled': disabled === true ? true : undefined,
    'aria-selected': selected === true ? true : undefined,
    onClick: handleClick,
    onFocus: handleFocus,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave
  };
  return render(_extends({}, passthroughProps, propsWeControl), propsBag, DEFAULT_OPTION_TAG);
}

function resolvePropValue$1(property, bag) {
  if (property === undefined) return undefined;
  if (typeof property === 'function') return property(bag);
  return property;
} // ---


Listbox.Button = Button$1;
Listbox.Label = Label;
Listbox.Options = Options;
Listbox.Option = Option;

var GroupContext = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);

function useGroupContext(component) {
  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(GroupContext);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <Switch.Group /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useGroupContext);
    throw err;
  }

  return context;
} // ---


var DEFAULT_GROUP_TAG = react__WEBPACK_IMPORTED_MODULE_0__.Fragment;

function Group(props) {
  var _React$useState = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
      switchElement = _React$useState[0],
      setSwitchElement = _React$useState[1];

  var _React$useState2 = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null),
      labelElement = _React$useState2[0],
      setLabelElement = _React$useState2[1];

  var context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      "switch": switchElement,
      label: labelElement,
      setSwitch: setSwitchElement,
      setLabel: setLabelElement
    };
  }, [switchElement, setSwitchElement, labelElement, setLabelElement]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(GroupContext.Provider, {
    value: context
  }, render(props, {}, DEFAULT_GROUP_TAG));
} // ---


var DEFAULT_SWITCH_TAG = 'button';
function Switch(props) {
  var _groupContext$label;

  var checked = props.checked,
      onChange = props.onChange,
      className = props.className,
      passThroughProps = _objectWithoutPropertiesLoose(props, ["checked", "onChange", "className"]);

  var id = "headlessui-switch-" + useId();
  var groupContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(GroupContext);
  var toggle = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    return onChange(!checked);
  }, [onChange, checked]);
  var handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    event.preventDefault();
    toggle();
  }, [toggle]);
  var handleKeyUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (event) {
    if (event.key === Keys.Space) {
      event.preventDefault();
      toggle();
    }
  }, [toggle]);
  var propsBag = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(function () {
    return {
      checked: checked
    };
  }, [checked]);
  var propsWeControl = {
    id: id,
    ref: groupContext === null ? undefined : groupContext.setSwitch,
    role: 'switch',
    tabIndex: 0,
    className: resolvePropValue$2(className, propsBag),
    'aria-checked': checked,
    'aria-labelledby': groupContext === null || groupContext === void 0 ? void 0 : (_groupContext$label = groupContext.label) === null || _groupContext$label === void 0 ? void 0 : _groupContext$label.id,
    onClick: handleClick,
    onKeyUp: handleKeyUp
  };
  return render(_extends({}, passThroughProps, propsWeControl), propsBag, DEFAULT_SWITCH_TAG);
}
var DEFAULT_LABEL_TAG$1 = 'label';

function Label$1(props) {
  var state = useGroupContext([Switch.name, Label$1.name].join('.'));
  var id = "headlessui-switch-label-" + useId();
  var handlePointerUp = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
    if (!state["switch"]) return;
    state["switch"].click();
    state["switch"].focus();
  }, [state["switch"]]);
  var propsWeControl = {
    ref: state.setLabel,
    id: id,
    onPointerUp: handlePointerUp
  };
  return render(_extends({}, props, propsWeControl), {}, DEFAULT_LABEL_TAG$1);
} // ---


Switch.Group = Group;
Switch.Label = Label$1; // ---

function resolvePropValue$2(property, bag) {
  if (property === undefined) return undefined;
  if (typeof property === 'function') return property(bag);
  return property;
}


//# sourceMappingURL=headlessui.esm.js.map


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Card = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
function Card(_a) {
    var { className, children } = _a, props = __rest(_a, ["className", "children"]);
    className = util_1.Util.createClassName(className, 'flex flex-col w-full bg-white border shadow-sm rounded-md');
    return (react_1.default.createElement("div", Object.assign({ className: className }, props), children));
}
exports.Card = Card;


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(38), exports);
__exportStar(__webpack_require__(39), exports);


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkeletonText = void 0;
const react_1 = __importDefault(__webpack_require__(7));
function SkeletonText(_a) {
    var { ch, className } = _a, props = __rest(_a, ["ch", "className"]);
    const style = {
        height: '1.7ex',
        width: `${ch || 20}ch`
    };
    return (react_1.default.createElement("span", Object.assign({ className: className }, props),
        react_1.default.createElement("span", { style: style, className: "inline-block bg-gray-200 rounded-sm animate-pulse" }),
        react_1.default.createElement("span", null, " ")));
}
exports.SkeletonText = SkeletonText;


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SkeletonParagraph = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const SkeletonText_1 = __webpack_require__(38);
function SkeletonParagraph({ className, words, seed }) {
    words || (words = 20);
    const wordLengths = react_1.useMemo(() => Array.from(generateWordLengths(words, seed)), [words, seed]);
    return (react_1.default.createElement("p", { className: className }, wordLengths.map((ch, i) => (react_1.default.createElement(SkeletonText_1.SkeletonText, { key: i, ch: ch })))));
}
exports.SkeletonParagraph = SkeletonParagraph;
function* generateWordLengths(count, seed) {
    const averageWordLength = 5;
    seed !== null && seed !== void 0 ? seed : (seed = 0);
    const generateRandom = () => util_1.Util.pseudoRandom(++seed);
    while (count--) {
        const wordLength = util_1.Util.poisson(averageWordLength, generateRandom);
        if (wordLength > 0)
            yield wordLength;
    }
}


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Modal = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const contexts_1 = __webpack_require__(5);
const react_dom_1 = __importDefault(__webpack_require__(13));
const react_2 = __webpack_require__(35);
function Modal({ children, show, close, openerRef, className }) {
    const screenOverlayRef = react_1.useContext(contexts_1.ScreenOverlayContext);
    if (!(screenOverlayRef === null || screenOverlayRef === void 0 ? void 0 : screenOverlayRef.current))
        return null;
    const backdropStyle = {
        width: '110%',
        height: '110%'
    };
    return react_dom_1.default.createPortal(react_1.default.createElement(react_2.Transition, { show: show, enter: "transition ease-out duration-75", enterFrom: "transform opacity-0 scale-95", enterTo: "transform opacity-100 scale-100", leave: "transition ease-in duration-75", leaveFrom: "transform opacity-100 scale-100", leaveTo: "transform opacity-0 scale-95", className: "grid w-full h-full place-items-center" },
        react_1.default.createElement("div", { style: backdropStyle, className: "z-30 flex items-center justify-center bg-gray-100 bg-opacity-75 pointer-events-auto bg-blur" },
            react_1.default.createElement(ModalContent, { openerRef: openerRef, close: close, className: className }, children))), screenOverlayRef.current);
}
exports.Modal = Modal;
function ModalContent({ children, close, openerRef, className }) {
    const ref = react_1.useRef(null);
    react_1.useEffect(() => { var _a; return (_a = ref.current) === null || _a === void 0 ? void 0 : _a.focus(); }, []);
    function onBlur(e) {
        const container = ref.current;
        const focusedEl = e.relatedTarget;
        if (focusedEl === (openerRef === null || openerRef === void 0 ? void 0 : openerRef.current))
            return;
        if (!focusedEl || !(container === null || container === void 0 ? void 0 : container.contains(focusedEl))) {
            close === null || close === void 0 ? void 0 : close();
        }
    }
    className = util_1.Util.createClassName(className, 'box-border relative flex flex-col shadow-lg focus:outline-none');
    return (react_1.default.createElement("div", { ref: ref, tabIndex: -1, className: className, onClick: (e) => e.stopPropagation(), onBlur: onBlur }, children));
}


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const LoadingSpinner_1 = __webpack_require__(11);
function Button(_a) {
    var { children, disabled, loading, spinner, className } = _a, props = __rest(_a, ["children", "disabled", "loading", "spinner", "className"]);
    disabled = !!(disabled || loading);
    className = util_1.Util.createClassName('relative inline-flex items-center justify-center font-medium leading-5 transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm appearance-none focus:outline-none focus-visible:outline-none focus-visible:ring', spinner && 'px-9', className);
    return (react_1.default.createElement("button", Object.assign({ disabled: disabled, className: className }, props),
        spinner && react_1.default.createElement(LoadingSpinner_1.LoadingSpinner, { loading: loading, className: "absolute left-0 ml-2 text-xl" }),
        children));
}
exports.Button = Button;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })()
;
});
//# sourceMappingURL=index.js.map