(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"), require("react-router-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom", "react-router-dom"], factory);
	else if(typeof exports === 'object')
		exports["@duely/react"] = factory(require("react"), require("react-dom"), require("react-router-dom"));
	else
		root["@duely/react"] = factory(root["react"], root["react-dom"], root["react-router-dom"]);
})(self, function(__WEBPACK_EXTERNAL_MODULE__7__, __WEBPACK_EXTERNAL_MODULE__13__, __WEBPACK_EXTERNAL_MODULE__20__) {
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
__exportStar(__webpack_require__(21), exports);


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
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  -webkit-tap-highlight-color: transparent;\n}\n\n:root {\n  --color-primary: #6366F1;\n  --color-secondary: #34D399;\n  --color-accent: #F97316;\n  --color-background: #fbfcfd;\n  --color-surface: #F1F5F9;\n  --color-error: #F43F5E;\n  --color-success: #10B981;\n}\n\n/*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\n:root {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n     tab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n  margin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n  font-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'] {\n  -webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n  padding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Inherit font-family and line-height from `html` so users can set them as\n * a class directly on the `html` element.\n */\n\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e2e8f0; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #94a3b8;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #94a3b8;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #94a3b8;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n\n/**\n * Make replaced elements `display: block` by default as that's\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\nhtml, body {\n  height: 100%;\n}\n\n._37MJ1xvRzfDb-7MwXjBbO4 {\n  width: 100%;\n}\n\n@media (min-width: 640px) {\n  ._37MJ1xvRzfDb-7MwXjBbO4 {\n    max-width: 640px;\n  }\n}\n\n@media (min-width: 768px) {\n  ._37MJ1xvRzfDb-7MwXjBbO4 {\n    max-width: 768px;\n  }\n}\n\n@media (min-width: 1024px) {\n  ._37MJ1xvRzfDb-7MwXjBbO4 {\n    max-width: 1024px;\n  }\n}\n\n@media (min-width: 1280px) {\n  ._37MJ1xvRzfDb-7MwXjBbO4 {\n    max-width: 1280px;\n  }\n}\n\n@media (min-width: 1536px) {\n  ._37MJ1xvRzfDb-7MwXjBbO4 {\n    max-width: 1536px;\n  }\n}\n\n._2uOpjo53uWIMx4iJYo94cY > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\n\n._2PYxk-YPpKEQCI2e7E5KO3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n\n._1vJLvLJl8MA2TDrA-yzNCC > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\n\n._1eOBlGKIC8GqwJGqsIGRaW > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n\n._1V3wlQcAuWyRjMGCxNQIud {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\n\n._2aGIhZibaurBv8nwA9Q-bm {\n  background-color: transparent;\n}\n\n._3Vcwul-J2M1qnLi7bsKwG_ {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}\n\n._2STjTKytcbSYLl_jiEBZEV {\n  --tw-bg-opacity: 1;\n  background-color: rgba(241, 245, 249, var(--tw-bg-opacity));\n}\n\n._2kaUyx4AXAGwAUu-AM9_oL {\n  --tw-bg-opacity: 1;\n  background-color: rgba(226, 232, 240, var(--tw-bg-opacity));\n}\n\n._3NygkfmhelfMuzXmJG8C9w {\n  --tw-bg-opacity: 1;\n  background-color: rgba(254, 205, 211, var(--tw-bg-opacity));\n}\n\n._2CLhhN82c8CWUwJPd3qm_s {\n  --tw-bg-opacity: 1;\n  background-color: rgba(165, 180, 252, var(--tw-bg-opacity));\n}\n\n._2kGQGHquliuyU-tssBDWXc {\n  --tw-bg-opacity: 1;\n  background-color: rgba(99, 102, 241, var(--tw-bg-opacity));\n}\n\n._30dKle-dim5g9fmfWdioz9 {\n  --tw-bg-opacity: 0.75;\n}\n\n._1ciKIw2U78YIhS0J9Ilmf1 {\n  border-color: transparent;\n}\n\n._1vBIEuJg_Ynkk29JbeI0Kc {\n  --tw-border-opacity: 1;\n  border-color: rgba(226, 232, 240, var(--tw-border-opacity));\n}\n\n.ymagmuF55F303wpanecad {\n  --tw-border-opacity: 1;\n  border-color: rgba(203, 213, 225, var(--tw-border-opacity));\n}\n\n.bt_qOjaPuMAZRTE_btl89 {\n  --tw-border-opacity: 1;\n  border-color: rgba(96, 165, 250, var(--tw-border-opacity));\n}\n\n._2npXaoVLYM0GiGkow26h2v {\n  --tw-border-opacity: 1;\n  border-color: rgba(129, 140, 248, var(--tw-border-opacity));\n}\n\n._2iHvNreL1xXXij5KDBqWu7 {\n  border-radius: 0.125rem;\n}\n\n._2ZCf_UtnFIuXD79u2P5J2W {\n  border-radius: 0.375rem;\n}\n\n._3foxC13zHfqRuYDEXFIa_M {\n  border-radius: 9999px;\n}\n\n._12e9b_WHCGnuhp5ueVbVj- {\n  border-style: dashed;\n}\n\n._1-yzk0S7SsIWmOLKszWkkp {\n  border-style: none;\n}\n\n._1tyt1J9kqh0ZYDfxj4toNS {\n  border-width: 2px;\n}\n\n._3ns5ZDans6ivU4Jy-6FHsZ {\n  border-width: 1px;\n}\n\n._30MiZ5dfGsb62M6ceM0OnP {\n  border-top-width: 1px;\n}\n\n._3Akz5exBKobAUc4KWf9NPD {\n  border-bottom-width: 1px;\n}\n\n._1R0vi2nTfwXneAnF953RwI {\n  box-sizing: border-box;\n}\n\n._3DxdJz1JtKLKVI5LrjXaUt {\n  cursor: pointer;\n}\n\n.pgxru5RQlKXLgmu51EswQ {\n  display: inline-block;\n}\n\n._2hhh-RontV7H-5VX_IwFVe {\n  display: flex;\n}\n\n._1ESmf8DCPrwhl7RbqNiOFb {\n  display: inline-flex;\n}\n\n._2MkMVopa8acIOkmJhKV696 {\n  display: table;\n}\n\n._1hyqIawiA2M3dqtMPt4G9k {\n  display: grid;\n}\n\n._3G_3OCal0y0PB4MT0DejEU {\n  display: contents;\n}\n\n.QOiFlXSM9R_TtkRQkC5cO {\n  display: none;\n}\n\n._1e8Qz7Cd0j0NK4dGtlTcAB {\n  flex-direction: row;\n}\n\n._3FYTJTeYvW_FjZM7B1wuC4 {\n  flex-direction: column;\n}\n\n._3Oa6iGRni5VxBaiBRwoFYe {\n  place-items: center;\n}\n\n._2yZgYvtGkeKurQ7OdRwCUM {\n  align-items: center;\n}\n\n._34cZoimpsLy9g6X3qW7-Qh {\n  justify-content: center;\n}\n\n._3EuGNse2-AKpmUbkEIHd9_ {\n  justify-content: space-between;\n}\n\n._3-q919xj_nemgWA1S-4S9n {\n  flex: 1 1 0%;\n}\n\n._3S1RGwebX_xCsFO3zExltz {\n  font-weight: 500;\n}\n\n._3SFniFu9gXrCnzyNwY6cPD {\n  font-weight: 600;\n}\n\n.WQa2tPDQObuivBxvCjIZQ {\n  height: 0.25rem;\n}\n\n._11dBeLQKu5_ocptSwbTI5Q {\n  height: 1.5rem;\n}\n\n._1L4i0ejXp3YAhcS_qC-Pez {\n  height: 2rem;\n}\n\n._1iqCmXDb2NYyJoPDYYaFtB {\n  height: 2.5rem;\n}\n\n.wpOGrG9GSNkbr8PU9my_n {\n  height: 3rem;\n}\n\n.l1Fyi9DQ2ys_IWl_0m0mk {\n  height: 4rem;\n}\n\n.JNwfWVe2E1cwCrlUW-wui {\n  height: 5rem;\n}\n\n._31y-df6ySEtki7AV67X5KG {\n  height: 1px;\n}\n\n._27NfzlGsI7-5wwHvGpKLWS {\n  height: 100%;\n}\n\n._48uVxMRbWRS-LJQNc5VKm {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n\n._1uAwiRap1uIoosu3D2xwF8 {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n._1nCdaIxVs0IMFPj8yIISnf {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n\n._3jEdX6YJ-5F6e7cRcB7RQ6 {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n\n._2y8R_A5lyns4SZjobamXcg {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n\n._1TkINGyzUZU6fv77a2nPoy {\n  line-height: 1.25rem;\n}\n\n.FzXu5WLb_A1sY_RR1OGL0 {\n  line-height: 1.75rem;\n}\n\n._2ovnnXPKXhdai0IEgZryH7 {\n  margin: 0px;\n}\n\n._3FNjO2S8UOqFWtw4NYcfHn {\n  margin: 0.75rem;\n}\n\n._3UsXXxhD9BktIH_BQJEjS- {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.qUkURVD_2dJ1Z9ec-EsvM {\n  margin-top: 0.25rem;\n}\n\n._3v9GTI6jG-QodlXjEJruOy {\n  margin-left: 0.5rem;\n}\n\n._2J4-kb_e3N7qegILLdbszN {\n  margin-right: 0.75rem;\n}\n\n._2vRjPKXK-E5FWWLPWV0ZFh {\n  margin-left: 0.75rem;\n}\n\n._14Mb0q46kJiTDcv1w6i5To {\n  max-width: 20rem;\n}\n\n._2P85pyQst6nEPOZkY7twm_ {\n  -o-object-fit: contain;\n     object-fit: contain;\n}\n\n.TNbNpYg2nHZF9dCa3NhpO {\n  opacity: 0;\n}\n\n._6bkXDqvjIFSTAy7EJ-yq2 {\n  opacity: 1;\n}\n\n.ePWcJFaTkLUAQ7B7rLLUy {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n._39E7HYI4uEfTkPGeYxGcoi:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n._2Zqw0q5l8GPulb3QhogSk1:focus-visible {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n._1c3B1kjcyiKnTftXKNRbBf {\n  overflow: hidden;\n}\n\n._3nFGIeBt7raMYEaLtq2LUO {\n  overflow-x: auto;\n}\n\n._2mYJMB41xs0L5lL8p0oYrW {\n  padding: 0.25rem;\n}\n\n._3dDq2BdbPaYayttsmpP7eZ {\n  padding: 1rem;\n}\n\n._14W5KgLSMcOeE1HcTjZAC6 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n\n._3vV4Tg7k0iF0ThLOOogUgx {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n\n._3BDnUhVGi8Wu55u1d8EW_ {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n\n._2F4tDHc80JV0EkLmrmnfVm {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n._1fAdO0U-3AJTIqa8_duElG {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n\n._1Ic3o40Obnjg5LAEc2kEaK {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n\n._3wpVYPENni41OIjOzmhv95 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n\n._2hyHcpNdYn_o4Gmz4VXZ-W {\n  padding-left: 2.25rem;\n  padding-right: 2.25rem;\n}\n\n.uKteDteHMkS07cuVgG_zP {\n  padding-left: 3rem;\n  padding-right: 3rem;\n}\n\n._2BCK1NaWLXyCwvVWN23Oy1 {\n  padding-top: 0.25rem;\n}\n\n._1jBj8a_5xAwhseP1Hev-5S {\n  padding-top: 0.5rem;\n}\n\n._1iEILwjev_PhsmuehAJmon {\n  padding-bottom: 0.5rem;\n}\n\n.FgCemuLHx0ASOL-dOYpXO {\n  padding-top: 0.75rem;\n}\n\n._2rwhm5GsORXyikzZv8IZXB {\n  padding-right: 0.75rem;\n}\n\n._2TS0FwZ57izydjAy4Bojk- {\n  padding-bottom: 0.75rem;\n}\n\n._2AybGpMeoCHndaIv7wyXrj {\n  padding-left: 0.75rem;\n}\n\n._1sKT10tAv26IUxEFxRd_nX {\n  padding-top: 1rem;\n}\n\n._17LtfHIX9QHP__wnZblzBs {\n  padding-bottom: 1rem;\n}\n\n._1rJ0w6SBaAU1ADDbVhtn7q {\n  padding-top: 1.25rem;\n}\n\n._2QOMsKPnphGXtOKg1HtLId {\n  padding-top: 1.5rem;\n}\n\n._204nOOSgLb0j2urQtqyowf {\n  padding-bottom: 1.5rem;\n}\n\n._3r_G27avjM8S7sMB4bv7Yv {\n  padding-right: 2.5rem;\n}\n\n.VkOixFu92d4bXJ-OHOMtC {\n  padding-left: 1px;\n}\n\n.TYvbspuCvcNjHJ3lPCziw:first-child {\n  padding-left: 0.75rem;\n}\n\n._33cIObaYRS2clFi0VUAcha:last-child {\n  padding-right: 0.75rem;\n}\n\n._27B3-x4jeqx3phQRI8gns_ {\n  pointer-events: none;\n}\n\n.MiFXNR2erm5JswAqsC-6L {\n  pointer-events: auto;\n}\n\n._3EgSLLZvTu8Tlv4tubhR8x {\n  position: fixed;\n}\n\n._3TiU0ZqUcY9JSpP2CoEjyt {\n  position: absolute;\n}\n\n.mlpYRS4PyTtxSl766oZv_ {\n  position: relative;\n}\n\n.ojqmUJGbZ5N8_9EtLAEDR {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n._3EckfZEiJjayECZlGPcRV6 {\n  top: 0px;\n}\n\n._20IhhTfRhOn_R3gsmQk-Wl {\n  right: 0px;\n}\n\n.g2KA0rJBxfkaUpOOR_QK {\n  left: 0px;\n}\n\n.EWUNfACaDyqpuUmineNHk {\n  resize: both;\n}\n\n* {\n  --tw-shadow: 0 0 #0000;\n}\n\n._3GAPOS2yapBF0SoKz-Taft {\n  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n._1i5DMTd_RXg2Y8jsCeIvC {\n  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n._3cM9vgKMw8eNuLhrc_7ZUf {\n  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n* {\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n}\n\n.QLjgUptqsgOKZ4kaD8xPA:focus-within {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n\n.IUDZnsVGB9XvwRVUAhpRL {\n  text-align: center;\n}\n\n._1EoRqOLVsFDsF_5dvThmai {\n  --tw-text-opacity: 1;\n  color: rgba(255, 255, 255, var(--tw-text-opacity));\n}\n\n._1IXUqwOg4bqYZBLJ7tj8B- {\n  --tw-text-opacity: 1;\n  color: rgba(148, 163, 184, var(--tw-text-opacity));\n}\n\n._1r64egQAqDp-afOb5KUXdn {\n  --tw-text-opacity: 1;\n  color: rgba(100, 116, 139, var(--tw-text-opacity));\n}\n\n._1I9ADyAddmfh_p9rT-PN2P {\n  --tw-text-opacity: 1;\n  color: rgba(71, 85, 105, var(--tw-text-opacity));\n}\n\n._3sVOGqHdGZd0ojkeWWWmIK {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n._38tUzNdVgtyksMZ3a3q5AZ {\n  --tw-text-opacity: 1;\n  color: rgba(251, 113, 133, var(--tw-text-opacity));\n}\n\n._2gBsFVxaok0yrJxoO-5dyA {\n  --tw-text-opacity: 1;\n  color: rgba(244, 63, 94, var(--tw-text-opacity));\n}\n\n._3xXc0UeW_vcuaukP0KHV-e {\n  --tw-text-opacity: 1;\n  color: rgba(79, 70, 229, var(--tw-text-opacity));\n}\n\n.VieSZCnPB9yiPxJWioa_U {\n  color: var(--color-accent);\n}\n\n._1Qi4xNV0VXG5Z3W5JO5nvn:hover {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n._2ddh7V2Eyl2nHyPWojTBpW:hover {\n  --tw-text-opacity: 1;\n  color: rgba(99, 102, 241, var(--tw-text-opacity));\n}\n\n._23tRBmZO2xYelREV4MHDB:focus-visible {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n._2luRct1Ts_Kv2INlGDNeeC {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n._3g3o92mdfPXn4Bq3edcY4X:focus {\n  text-decoration: underline;\n}\n\n.yzguYrYfoqyVTrOx2-3hM {\n  letter-spacing: 0.025em;\n}\n\n._2m_hFJ0RElTIzHgDSoB_6k {\n  letter-spacing: 0.05em;\n}\n\n._3xxDDAOUHCSRA20KJUHYlJ {\n  white-space: nowrap;\n}\n\n.Oa4vAORa-Xxs5JaAdJmLA {\n  width: 1.5rem;\n}\n\n.KzDFYBIvWby2Y2hsWx_aD {\n  width: 2rem;\n}\n\n._2-lBdmSkxu0CFkj5zileXL {\n  width: 2.5rem;\n}\n\n._1vaCDrBrjOsi39QycTfG_e {\n  width: 3rem;\n}\n\n._10Fe2GNwYb9ESSCo6FWvHy {\n  width: 100%;\n}\n\n._1Gkdi6nVZepXBzvGfjzl2y {\n  z-index: 10;\n}\n\n._37fRW0Eu39t2i7l4s67U4m {\n  z-index: 20;\n}\n\n.RNt0eBhUqRRW30mYgVYSS {\n  z-index: 30;\n}\n\n.hEKF4k_u2j41Jn6QE-7Qs {\n  gap: 1rem;\n}\n\n._1R5omKea8qkBAH8EZPy_LL {\n  -moz-column-gap: 1.5rem;\n       column-gap: 1.5rem;\n}\n\n.X-FZYD610NKgRZXNG7Mcp {\n  grid-column: 1 / -1;\n}\n\n._3UV9bSxgyX9eVZ4Wo3zrS2 {\n  grid-auto-rows: auto;\n}\n\n._1FyI4SuUlaEAzxKstB8pAf {\n  grid-row: 1 / -1;\n}\n\n._3HpKzvAoQcUeu3idv3FxCJ {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n._1QzhyNqHeTCT5q3-iHz2er {\n  --tw-scale-x: .95;\n  --tw-scale-y: .95;\n}\n\n._2dwUU8pPVH3_V-3SNdUsys {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n}\n\n.IGWgMsrv3Dqs7N2wLeE7w {\n  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n._1gqOwM6n8ie8KpnOYFu7dq {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n._21PJ5y4QKO1G3wWOAzLHG5 {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n\n.w3w6MGOQ2lR94lWWijGI1 {\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n._2oK-dWmChF9F3q4fDOWhAL {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.tIyyK12kPAapNgfwNXjmC {\n  transition-duration: 75ms;\n}\n\n.yJATGjrOn5DGh37peE0Nu {\n  transition-duration: 100ms;\n}\n\n._3-oVh1akGxMV0wW2aIWZEi {\n  transition-duration: 150ms;\n}\n\n._3qDqUb10QKC5zLIQdqB0BP {\n  transition-delay: 100ms;\n}\n\n@-webkit-keyframes _3Q4U4hda8t0Yj6Eo7LZtdS {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes _3Q4U4hda8t0Yj6Eo7LZtdS {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes hYOG3VlUmRJFs5GH4ihKw {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@keyframes hYOG3VlUmRJFs5GH4ihKw {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes ScnfEe7JWUy-BcZn_iUe5 {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes ScnfEe7JWUy-BcZn_iUe5 {\n  50% {\n    opacity: .5;\n  }\n}\n\n@-webkit-keyframes varh9e7DfVsM-1uSZZ02w {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes varh9e7DfVsM-1uSZZ02w {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@-webkit-keyframes _3BHNs11zMYXnwxT0rLJsEQ {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@keyframes _3BHNs11zMYXnwxT0rLJsEQ {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n._1r4_6yAR4VMJlmjwu2Cpf2 {\n  -webkit-animation: _3Q4U4hda8t0Yj6Eo7LZtdS 1s linear infinite;\n          animation: _3Q4U4hda8t0Yj6Eo7LZtdS 1s linear infinite;\n}\n\n._2ok3qIMezO_7RjR1SYfy0Z {\n  -webkit-animation: ScnfEe7JWUy-BcZn_iUe5 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n          animation: ScnfEe7JWUy-BcZn_iUe5 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n\n._3C5rZzesBFyp48YdVo9X_E {\n  -webkit-animation: _3BHNs11zMYXnwxT0rLJsEQ 1800ms cubic-bezier(.02,.25,1,.61) infinite;\n          animation: _3BHNs11zMYXnwxT0rLJsEQ 1800ms cubic-bezier(.02,.25,1,.61) infinite;\n}\n\n._1MxktCGVUbvIkO5m-_zQB6 {\n  -webkit-backdrop-filter: blur(2px);\n          backdrop-filter: blur(2px);\n}\n\n._1oy2HsWK3iljGXKbRGjv0- {\n  -webkit-mask-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0), transparent);\n          mask-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0), transparent);\n}\n\n._3qeVx0QEhfq3KAdlY3TVrO {\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n}\n\n@media (min-width: 640px) {\n  ._3RT77ZvZynZ6GDmL4-M-YR {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  ._3vjLeXoo-82F5wh0MzonWC {\n    font-size: 1.25rem;\n    line-height: 1.75rem;\n  }\n\n  ._1TBSS2Ll9hdbw8_x6gSbTC {\n    line-height: 1.25rem;\n  }\n\n  .CHCxoSGHOGddsxZjtTjWI {\n    max-width: 24rem;\n  }\n}\n\n@media (min-width: 768px) {\n  ._2fLnjxOhsczIYpIJ862GjM > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0px * var(--tw-space-y-reverse));\n  }\n\n  .RYO0Mi8z3_lhk7GBhN_oc > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(0px * var(--tw-space-x-reverse));\n    margin-left: calc(0px * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  ._3E2VYRnRIBNrjb1UlJVx0B > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n  }\n\n  .NGhL9AbmveDeCkqUgApiJ > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n    margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  ._6NoWTmoyBQMyrXiE7mo_5 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n  }\n\n  .TYrCLKjWEJQ1pCQRKIjXO {\n    --tw-bg-opacity: 1;\n    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n  }\n\n  ._3Ga1JPLh5CdqRVUOIGhejX {\n    --tw-bg-opacity: 1;\n    background-color: rgba(251, 252, 253, var(--tw-bg-opacity));\n  }\n\n  ._16IktQ-SXjmODq_bpZLQzW {\n    border-style: none;\n  }\n\n  ._14f_GjT01GIxiGv75rjpbI {\n    border-width: 1px;\n  }\n\n  ._3B0di9IxiTSNg5LEa_kR9m {\n    flex-direction: row;\n  }\n\n  ._1fvOAwOmP_hehsNLmIVY9O {\n    flex-direction: column;\n  }\n\n  ._3YwO8rC2d9rensC2_C1xBI {\n    justify-content: flex-start;\n  }\n\n  ._1Sf45EADXn7L5GWuXjCIMN {\n    justify-content: space-between;\n  }\n\n  ._14Lyg9Qga3e7jJuc6PrX5X {\n    height: 100%;\n  }\n\n  ._357eEo3Bf2y4ePqmTihbjU {\n    height: 100vh;\n  }\n\n  .BRUIosFvckqCRgbtpG77_ {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  ._1ZRrirwR6sI_XUVbmQeqde {\n    font-size: 1.5rem;\n    line-height: 2rem;\n  }\n\n  ._2ORBkwDMsbqbAkZmYAKKHI {\n    padding: 0.5rem;\n  }\n\n  ._2LAsEpnSxfSNJGm6mlxTI {\n    padding-left: 0.75rem;\n    padding-right: 0.75rem;\n  }\n\n  ._1fNXsmbKtEpbS0hYvKrlS3 {\n    padding-bottom: 0px;\n  }\n\n  ._3nFK_S-uwHx1KTWlSypm2F {\n    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  }\n\n  .k4nGZe3h83OMceLlAhkiM {\n    width: 12rem;\n  }\n}\n\n@media (min-width: 1024px) {\n}\n\n@media (min-width: 1280px) {\n  ._2tOhz1t-Zsv_XRqEkYJgTF {\n    width: 16rem;\n  }\n}\n\n@media (min-width: 1536px) {\n}\n", "",{"version":3,"sources":["webpack://./src/styles.module.css"],"names":[],"mappings":"AAAA;EACE,wCAAwC;AAC1C;;AAEA;EACE,wBAAwB;EACxB,0BAA0B;EAC1B,uBAAuB;EACvB,2BAA2B;EAC3B,wBAAwB;EACxB,sBAAsB;EACtB,wBAAwB;AAC1B;;AAEA,8FAA8F;;AAE9F;;;CAGC;;AAED;;CAEC;;AAED;;;EAGE,sBAAsB;AACxB;;AAEA;;CAEC;;AAED;EACE,gBAAgB;EAChB,cAAc;KACX,WAAW;AAChB;;AAEA;;;CAGC;;AAED;EACE,iBAAiB,EAAE,MAAM;EACzB,8BAA8B,EAAE,MAAM;AACxC;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;EACE,SAAS;AACX;;AAEA;;CAEC;;AAED;EACE;;;;;;;;;kBASgB;AAClB;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;EACE,SAAS,EAAE,MAAM;EACjB,cAAc,EAAE,MAAM;AACxB;;AAEA;;;CAGC;;AAED;;CAEC;;AAED;EACE,yCAAyC;UACjC,iCAAiC;AAC3C;;AAEA;;CAEC;;AAED;;EAEE,mBAAmB;AACrB;;AAEA;;;CAGC;;AAED;;;;EAIE;;;;;;WAMS,EAAE,MAAM;EACjB,cAAc,EAAE,MAAM;AACxB;;AAEA;;CAEC;;AAED;EACE,cAAc;AAChB;;AAEA;;CAEC;;AAED;;EAEE,cAAc;EACd,cAAc;EACd,kBAAkB;EAClB,wBAAwB;AAC1B;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,WAAW;AACb;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;EACE,cAAc,EAAE,MAAM;EACtB,qBAAqB,EAAE,MAAM;AAC/B;;AAEA;;;CAGC;;AAED;;;CAGC;;AAED;;;;;EAKE,oBAAoB,EAAE,MAAM;EAC5B,eAAe,EAAE,MAAM;EACvB,iBAAiB,EAAE,MAAM;EACzB,SAAS,EAAE,MAAM;AACnB;;AAEA;;;CAGC;;AAED;SACS,MAAM;EACb,oBAAoB;AACtB;;AAEA;;CAEC;;AAED;;EAEE,0BAA0B;AAC5B;;AAEA;;CAEC;;AAED;;CAEC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;EACE,UAAU;AACZ;;AAEA;;CAEC;;AAED;EACE,wBAAwB;AAC1B;;AAEA;;CAEC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;;;CAGC;;AAED;;;CAGC;;AAED;;CAEC;;AAED;EACE,kBAAkB;AACpB;;AAEA;;;;EAIE;;AAEF;;EAEE;;AAEF;;;;;;;;;;;;;EAaE,SAAS;AACX;;AAEA;EACE,6BAA6B;EAC7B,sBAAsB;AACxB;;AAEA;;;EAGE;;AAEF;EACE,mBAAmB;EACnB,0CAA0C;AAC5C;;AAEA;EACE,SAAS;EACT,UAAU;AACZ;;AAEA;;EAEE,gBAAgB;EAChB,SAAS;EACT,UAAU;AACZ;;AAEA;;EAEE;;AAEF;;;;;EAKE;;AAEF;EACE,4NAA4N,EAAE,MAAM;EACpO,gBAAgB,EAAE,MAAM;AAC1B;;AAEA;;;EAGE;;AAEF;EACE,oBAAoB;EACpB,oBAAoB;AACtB;;AAEA;;;;;;;;;;;;;;;;;;;;;;;;EAwBE;;AAEF;;;EAGE,sBAAsB,EAAE,MAAM;EAC9B,eAAe,EAAE,MAAM;EACvB,mBAAmB,EAAE,MAAM;EAC3B,qBAAqB,EAAE,MAAM;AAC/B;;AAEA;;EAEE;;AAEF;EACE,qBAAqB;AACvB;;AAEA;;;;;;;;EAQE;;AAEF;EACE,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,cAAc;AAChB;;AAEA;;EAEE,cAAc;AAChB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;;;;;;EAME,kBAAkB;EAClB,oBAAoB;AACtB;;AAEA;;;EAGE;;AAEF;EACE,cAAc;EACd,wBAAwB;AAC1B;;AAEA;;;;;;EAME;;AAEF;;;;;EAKE,UAAU;EACV,oBAAoB;EACpB,cAAc;AAChB;;AAEA;;;;;EAKE;;AAEF;;;;EAIE,+GAA+G;AACjH;;AAEA;;;;;;EAME;;AAEF;;;;;;;;EAQE,cAAc;EACd,sBAAsB;AACxB;;AAEA;;;;;EAKE;;AAEF;;EAEE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA;EACE;IACE,gBAAgB;EAClB;AACF;;AAEA;EACE;IACE,gBAAgB;EAClB;AACF;;AAEA;EACE;IACE,iBAAiB;EACnB;AACF;;AAEA;EACE;IACE,iBAAiB;EACnB;AACF;;AAEA;EACE;IACE,iBAAiB;EACnB;AACF;;AAEA;EACE,uBAAuB;EACvB,+DAA+D;EAC/D,wDAAwD;AAC1D;;AAEA;EACE,uBAAuB;EACvB,uDAAuD;EACvD,gEAAgE;AAClE;;AAEA;EACE,uBAAuB;EACvB,8DAA8D;EAC9D,uDAAuD;AACzD;;AAEA;EACE,uBAAuB;EACvB,uDAAuD;EACvD,gEAAgE;AAClE;;AAEA;EACE,wBAAwB;KACrB,qBAAqB;UAChB,gBAAgB;AAC1B;;AAEA;EACE,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,2DAA2D;AAC7D;;AAEA;EACE,kBAAkB;EAClB,0DAA0D;AAC5D;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,sBAAsB;EACtB,2DAA2D;AAC7D;;AAEA;EACE,sBAAsB;EACtB,2DAA2D;AAC7D;;AAEA;EACE,sBAAsB;EACtB,0DAA0D;AAC5D;;AAEA;EACE,sBAAsB;EACtB,2DAA2D;AAC7D;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,wBAAwB;AAC1B;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,8BAA8B;AAChC;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,cAAc;AAChB;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,kBAAkB;EAClB,iBAAiB;AACnB;;AAEA;EACE,mBAAmB;EACnB,oBAAoB;AACtB;;AAEA;EACE,mBAAmB;EACnB,oBAAoB;AACtB;;AAEA;EACE,kBAAkB;EAClB,oBAAoB;AACtB;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,iBAAiB;EACjB,kBAAkB;AACpB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,sBAAsB;KACnB,mBAAmB;AACxB;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,8BAA8B;EAC9B,mBAAmB;AACrB;;AAEA;EACE,8BAA8B;EAC9B,mBAAmB;AACrB;;AAEA;EACE,8BAA8B;EAC9B,mBAAmB;AACrB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;;AAEA;EACE,mBAAmB;EACnB,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;EACpB,qBAAqB;AACvB;;AAEA;EACE,oBAAoB;EACpB,uBAAuB;AACzB;;AAEA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,mBAAmB;AACrB;;AAEA;EACE,oBAAoB;EACpB,qBAAqB;AACvB;;AAEA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;;AAEA;EACE,kBAAkB;EAClB,mBAAmB;AACrB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,iBAAiB;AACnB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,eAAe;AACjB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,QAAQ;EACR,UAAU;EACV,WAAW;EACX,SAAS;AACX;;AAEA;EACE,QAAQ;AACV;;AAEA;EACE,UAAU;AACZ;;AAEA;EACE,SAAS;AACX;;AAEA;EACE,YAAY;AACd;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,4CAA4C;EAC5C,uGAAuG;AACzG;;AAEA;EACE,kFAAkF;EAClF,uGAAuG;AACzG;;AAEA;EACE,oFAAoF;EACpF,uGAAuG;AACzG;;AAEA;EACE,4CAA4C;EAC5C,2BAA2B;EAC3B,4BAA4B;EAC5B,wCAAwC;EACxC,kCAAkC;EAClC,2BAA2B;AAC7B;;AAEA;EACE,2GAA2G;EAC3G,yGAAyG;EACzG,4FAA4F;AAC9F;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,oBAAoB;EACpB,kDAAkD;AACpD;;AAEA;EACE,oBAAoB;EACpB,kDAAkD;AACpD;;AAEA;EACE,oBAAoB;EACpB,kDAAkD;AACpD;;AAEA;EACE,oBAAoB;EACpB,gDAAgD;AAClD;;AAEA;EACE,oBAAoB;EACpB,+CAA+C;AACjD;;AAEA;EACE,oBAAoB;EACpB,kDAAkD;AACpD;;AAEA;EACE,oBAAoB;EACpB,gDAAgD;AAClD;;AAEA;EACE,oBAAoB;EACpB,gDAAgD;AAClD;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,oBAAoB;EACpB,+CAA+C;AACjD;;AAEA;EACE,oBAAoB;EACpB,iDAAiD;AACnD;;AAEA;EACE,oBAAoB;EACpB,+CAA+C;AACjD;;AAEA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,mBAAmB;AACrB;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,aAAa;AACf;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,WAAW;AACb;;AAEA;EACE,SAAS;AACX;;AAEA;EACE,uBAAuB;OAClB,kBAAkB;AACzB;;AAEA;EACE,mBAAmB;AACrB;;AAEA;EACE,oBAAoB;AACtB;;AAEA;EACE,gBAAgB;AAClB;;AAEA;EACE,mBAAmB;EACnB,mBAAmB;EACnB,cAAc;EACd,cAAc;EACd,cAAc;EACd,eAAe;EACf,eAAe;EACf,2MAA2M;AAC7M;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,eAAe;AACjB;;AAEA;EACE,wGAAwG;EACxG,wDAAwD;EACxD,0BAA0B;AAC5B;;AAEA;EACE,4BAA4B;EAC5B,wDAAwD;EACxD,0BAA0B;AAC5B;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,sDAAsD;AACxD;;AAEA;EACE,wDAAwD;AAC1D;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,0BAA0B;AAC5B;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,yBAAyB;EAC3B;AACF;;AAEA;EACE;IACE,mBAAmB;IACnB,UAAU;EACZ;AACF;;AAEA;EACE;IACE,mBAAmB;IACnB,UAAU;EACZ;AACF;;AAEA;EACE;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,WAAW;EACb;AACF;;AAEA;EACE;IACE,2BAA2B;IAC3B,0DAA0D;YAClD,kDAAkD;EAC5D;;EAEA;IACE,eAAe;IACf,0DAA0D;YAClD,kDAAkD;EAC5D;AACF;;AAEA;EACE;IACE,2BAA2B;IAC3B,0DAA0D;YAClD,kDAAkD;EAC5D;;EAEA;IACE,eAAe;IACf,0DAA0D;YAClD,kDAAkD;EAC5D;AACF;;AAEA;EACE;IACE,4BAA4B;EAC9B;;EAEA;IACE,2BAA2B;EAC7B;AACF;;AAEA;EACE;IACE,4BAA4B;EAC9B;;EAEA;IACE,2BAA2B;EAC7B;AACF;;AAEA;EACE,6DAA0C;UAClC,qDAAkC;AAC5C;;AAEA;EACE,iFAAiE;UACzD,yEAAyD;AACnE;;AAEA;EACE,sFAAuE;UAC/D,8EAA+D;AACzE;;AAEA;EACE,kCAAkC;UAC1B,0BAA0B;AACpC;;AAEA;EACE,+GAA+G;UACvG,uGAAuG;AACjH;;AAEA;EACE,4DAA4D;AAC9D;;AAEA;EACE;IACE,mBAAmB;IACnB,oBAAoB;EACtB;;EAEA;IACE,kBAAkB;IAClB,oBAAoB;EACtB;;EAEA;IACE,oBAAoB;EACtB;;EAEA;IACE,gBAAgB;EAClB;AACF;;AAEA;EACE;IACE,uBAAuB;IACvB,2DAA2D;IAC3D,oDAAoD;EACtD;;EAEA;IACE,uBAAuB;IACvB,mDAAmD;IACnD,4DAA4D;EAC9D;;EAEA;IACE,uBAAuB;IACvB,8DAA8D;IAC9D,uDAAuD;EACzD;;EAEA;IACE,uBAAuB;IACvB,uDAAuD;IACvD,gEAAgE;EAClE;;EAEA;IACE,uBAAuB;IACvB,4DAA4D;IAC5D,qDAAqD;EACvD;;EAEA;IACE,kBAAkB;IAClB,2DAA2D;EAC7D;;EAEA;IACE,kBAAkB;IAClB,2DAA2D;EAC7D;;EAEA;IACE,kBAAkB;EACpB;;EAEA;IACE,iBAAiB;EACnB;;EAEA;IACE,mBAAmB;EACrB;;EAEA;IACE,sBAAsB;EACxB;;EAEA;IACE,2BAA2B;EAC7B;;EAEA;IACE,8BAA8B;EAChC;;EAEA;IACE,YAAY;EACd;;EAEA;IACE,aAAa;EACf;;EAEA;IACE,mBAAmB;IACnB,oBAAoB;EACtB;;EAEA;IACE,iBAAiB;IACjB,iBAAiB;EACnB;;EAEA;IACE,eAAe;EACjB;;EAEA;IACE,qBAAqB;IACrB,sBAAsB;EACxB;;EAEA;IACE,mBAAmB;EACrB;;EAEA;IACE,4CAA4C;IAC5C,uGAAuG;EACzG;;EAEA;IACE,YAAY;EACd;AACF;;AAEA;AACA;;AAEA;EACE;IACE,YAAY;EACd;AACF;;AAEA;AACA","sourcesContent":["* {\n  -webkit-tap-highlight-color: transparent;\n}\n\n:root {\n  --color-primary: #6366F1;\n  --color-secondary: #34D399;\n  --color-accent: #F97316;\n  --color-background: #fbfcfd;\n  --color-surface: #F1F5F9;\n  --color-error: #F43F5E;\n  --color-success: #10B981;\n}\n\n/*! modern-normalize v1.0.0 | MIT License | https://github.com/sindresorhus/modern-normalize */\n\n/*\nDocument\n========\n*/\n\n/**\nUse a better box model (opinionated).\n*/\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n/**\nUse a more readable tab size (opinionated).\n*/\n\n:root {\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n     tab-size: 4;\n}\n\n/**\n1. Correct the line height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n*/\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/*\nSections\n========\n*/\n\n/**\nRemove the margin in all browsers.\n*/\n\nbody {\n  margin: 0;\n}\n\n/**\nImprove consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n*/\n\nbody {\n  font-family:\n\t\tsystem-ui,\n\t\t-apple-system, /* Firefox supports this but not yet `system-ui` */\n\t\t'Segoe UI',\n\t\tRoboto,\n\t\tHelvetica,\n\t\tArial,\n\t\tsans-serif,\n\t\t'Apple Color Emoji',\n\t\t'Segoe UI Emoji';\n}\n\n/*\nGrouping content\n================\n*/\n\n/**\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n}\n\n/*\nText-level semantics\n====================\n*/\n\n/**\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr[title] {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/**\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n1. Improve consistency of default fonts in all browsers. (https://github.com/sindresorhus/modern-normalize/issues/3)\n2. Correct the odd 'em' font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family:\n\t\tui-monospace,\n\t\tSFMono-Regular,\n\t\tConsolas,\n\t\t'Liberation Mono',\n\t\tMenlo,\n\t\tmonospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/**\nPrevent 'sub' and 'sup' elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\nTabular data\n============\n*/\n\n/**\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n}\n\n/*\nForms\n=====\n*/\n\n/**\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\nRemove the inheritance of text transform in Edge and Firefox.\n1. Remove the inheritance of text transform in Firefox.\n*/\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\nCorrect the inability to style clickable types in iOS and Safari.\n*/\n\nbutton,\n[type='button'] {\n  -webkit-appearance: button;\n}\n\n/**\nRemove the inner border and padding in Firefox.\n*/\n\n/**\nRestore the focus styles unset by the previous rule.\n*/\n\n/**\nRemove the additional ':invalid' styles in Firefox.\nSee: https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737\n*/\n\n/**\nRemove the padding so developers are not caught out when they zero out 'fieldset' elements in all browsers.\n*/\n\nlegend {\n  padding: 0;\n}\n\n/**\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n/**\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n/**\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n/**\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to 'inherit' in Safari.\n*/\n\n/*\nInteractive\n===========\n*/\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nbutton {\n  background-color: transparent;\n  background-image: none;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nol,\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the user's configured `sans` font-family (with Tailwind's default\n *    sans-serif font stack as a fallback) as a sane default.\n * 2. Use Tailwind's default \"normal\" line-height so the user isn't forced\n *    to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Inherit font-family and line-height from `html` so users can set them as\n * a class directly on the `html` element.\n */\n\nbody {\n  font-family: inherit;\n  line-height: inherit;\n}\n\n/**\n * 1. Prevent padding and border from affecting element width.\n *\n *    We used to set this in the html element and inherit from\n *    the parent element for everything else. This caused issues\n *    in shadow-dom-enhanced elements like <details> where the content\n *    is wrapped by a div with box-sizing set to `content-box`.\n *\n *    https://github.com/mozdevs/cssremedy/issues/4\n *\n *\n * 2. Allow adding a border to an element by just adding a border-width.\n *\n *    By default, the way the browser specifies that an element should have no\n *    border is by setting it's border-style to `none` in the user-agent\n *    stylesheet.\n *\n *    In order to easily add borders to elements by just setting the `border-width`\n *    property, we change the default border-style for all elements to `solid`, and\n *    use border-width to hide them instead. This way our `border` utilities only\n *    need to set the `border-width` property instead of the entire `border`\n *    shorthand, making our border utilities much more straightforward to compose.\n *\n *    https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e2e8f0; /* 2 */\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\nhr {\n  border-top-width: 1px;\n}\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\nimg {\n  border-style: solid;\n}\n\ntextarea {\n  resize: vertical;\n}\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  color: #94a3b8;\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  color: #94a3b8;\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  color: #94a3b8;\n}\n\nbutton {\n  cursor: pointer;\n}\n\ntable {\n  border-collapse: collapse;\n}\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don't inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured 'mono' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * 'mono' font family.\n */\n\npre,\ncode,\nkbd,\nsamp {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n}\n\n/**\n * Make replaced elements `display: block` by default as that's\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\nhtml, body {\n  height: 100%;\n}\n\n.container {\n  width: 100%;\n}\n\n@media (min-width: 640px) {\n  .container {\n    max-width: 640px;\n  }\n}\n\n@media (min-width: 768px) {\n  .container {\n    max-width: 768px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .container {\n    max-width: 1024px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .container {\n    max-width: 1280px;\n  }\n}\n\n@media (min-width: 1536px) {\n  .container {\n    max-width: 1536px;\n  }\n}\n\n.space-y-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.25rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.25rem * var(--tw-space-y-reverse));\n}\n\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n\n.space-y-2 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-y-reverse: 0;\n  margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n  margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n}\n\n.space-x-3 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n}\n\n.appearance-none {\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n}\n\n.bg-transparent {\n  background-color: transparent;\n}\n\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}\n\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(241, 245, 249, var(--tw-bg-opacity));\n}\n\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(226, 232, 240, var(--tw-bg-opacity));\n}\n\n.bg-red-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(254, 205, 211, var(--tw-bg-opacity));\n}\n\n.bg-indigo-300 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(165, 180, 252, var(--tw-bg-opacity));\n}\n\n.bg-indigo-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgba(99, 102, 241, var(--tw-bg-opacity));\n}\n\n.bg-opacity-75 {\n  --tw-bg-opacity: 0.75;\n}\n\n.border-transparent {\n  border-color: transparent;\n}\n\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgba(226, 232, 240, var(--tw-border-opacity));\n}\n\n.border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgba(203, 213, 225, var(--tw-border-opacity));\n}\n\n.border-blue-400 {\n  --tw-border-opacity: 1;\n  border-color: rgba(96, 165, 250, var(--tw-border-opacity));\n}\n\n.border-indigo-400 {\n  --tw-border-opacity: 1;\n  border-color: rgba(129, 140, 248, var(--tw-border-opacity));\n}\n\n.rounded-sm {\n  border-radius: 0.125rem;\n}\n\n.rounded-md {\n  border-radius: 0.375rem;\n}\n\n.rounded-full {\n  border-radius: 9999px;\n}\n\n.border-dashed {\n  border-style: dashed;\n}\n\n.border-none {\n  border-style: none;\n}\n\n.border-2 {\n  border-width: 2px;\n}\n\n.border {\n  border-width: 1px;\n}\n\n.border-t {\n  border-top-width: 1px;\n}\n\n.border-b {\n  border-bottom-width: 1px;\n}\n\n.box-border {\n  box-sizing: border-box;\n}\n\n.cursor-pointer {\n  cursor: pointer;\n}\n\n.inline-block {\n  display: inline-block;\n}\n\n.flex {\n  display: flex;\n}\n\n.inline-flex {\n  display: inline-flex;\n}\n\n.table {\n  display: table;\n}\n\n.grid {\n  display: grid;\n}\n\n.contents {\n  display: contents;\n}\n\n.hidden {\n  display: none;\n}\n\n.flex-row {\n  flex-direction: row;\n}\n\n.flex-col {\n  flex-direction: column;\n}\n\n.place-items-center {\n  place-items: center;\n}\n\n.items-center {\n  align-items: center;\n}\n\n.justify-center {\n  justify-content: center;\n}\n\n.justify-between {\n  justify-content: space-between;\n}\n\n.flex-1 {\n  flex: 1 1 0%;\n}\n\n.font-medium {\n  font-weight: 500;\n}\n\n.font-semibold {\n  font-weight: 600;\n}\n\n.h-1 {\n  height: 0.25rem;\n}\n\n.h-6 {\n  height: 1.5rem;\n}\n\n.h-8 {\n  height: 2rem;\n}\n\n.h-10 {\n  height: 2.5rem;\n}\n\n.h-12 {\n  height: 3rem;\n}\n\n.h-16 {\n  height: 4rem;\n}\n\n.h-20 {\n  height: 5rem;\n}\n\n.h-px {\n  height: 1px;\n}\n\n.h-full {\n  height: 100%;\n}\n\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n\n.text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n}\n\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n\n.text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n}\n\n.leading-5 {\n  line-height: 1.25rem;\n}\n\n.leading-7 {\n  line-height: 1.75rem;\n}\n\n.m-0 {\n  margin: 0px;\n}\n\n.m-3 {\n  margin: 0.75rem;\n}\n\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.mt-1 {\n  margin-top: 0.25rem;\n}\n\n.ml-2 {\n  margin-left: 0.5rem;\n}\n\n.mr-3 {\n  margin-right: 0.75rem;\n}\n\n.ml-3 {\n  margin-left: 0.75rem;\n}\n\n.max-w-xs {\n  max-width: 20rem;\n}\n\n.object-contain {\n  -o-object-fit: contain;\n     object-fit: contain;\n}\n\n.opacity-0 {\n  opacity: 0;\n}\n\n.opacity-100 {\n  opacity: 1;\n}\n\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.focus-visible\\:outline-none:focus-visible {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n\n.overflow-hidden {\n  overflow: hidden;\n}\n\n.overflow-x-auto {\n  overflow-x: auto;\n}\n\n.p-1 {\n  padding: 0.25rem;\n}\n\n.p-4 {\n  padding: 1rem;\n}\n\n.px-1 {\n  padding-left: 0.25rem;\n  padding-right: 0.25rem;\n}\n\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n\n.py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n}\n\n.px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n}\n\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n\n.px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n}\n\n.px-9 {\n  padding-left: 2.25rem;\n  padding-right: 2.25rem;\n}\n\n.px-12 {\n  padding-left: 3rem;\n  padding-right: 3rem;\n}\n\n.pt-1 {\n  padding-top: 0.25rem;\n}\n\n.pt-2 {\n  padding-top: 0.5rem;\n}\n\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n\n.pt-3 {\n  padding-top: 0.75rem;\n}\n\n.pr-3 {\n  padding-right: 0.75rem;\n}\n\n.pb-3 {\n  padding-bottom: 0.75rem;\n}\n\n.pl-3 {\n  padding-left: 0.75rem;\n}\n\n.pt-4 {\n  padding-top: 1rem;\n}\n\n.pb-4 {\n  padding-bottom: 1rem;\n}\n\n.pt-5 {\n  padding-top: 1.25rem;\n}\n\n.pt-6 {\n  padding-top: 1.5rem;\n}\n\n.pb-6 {\n  padding-bottom: 1.5rem;\n}\n\n.pr-10 {\n  padding-right: 2.5rem;\n}\n\n.pl-px {\n  padding-left: 1px;\n}\n\n.first\\:pl-3:first-child {\n  padding-left: 0.75rem;\n}\n\n.last\\:pr-3:last-child {\n  padding-right: 0.75rem;\n}\n\n.pointer-events-none {\n  pointer-events: none;\n}\n\n.pointer-events-auto {\n  pointer-events: auto;\n}\n\n.fixed {\n  position: fixed;\n}\n\n.absolute {\n  position: absolute;\n}\n\n.relative {\n  position: relative;\n}\n\n.inset-0 {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n\n.top-0 {\n  top: 0px;\n}\n\n.right-0 {\n  right: 0px;\n}\n\n.left-0 {\n  left: 0px;\n}\n\n.resize {\n  resize: both;\n}\n\n* {\n  --tw-shadow: 0 0 #0000;\n}\n\n.shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n\n* {\n  --tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgba(59, 130, 246, 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n}\n\n.focus-within\\:ring:focus-within {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n\n.text-center {\n  text-align: center;\n}\n\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgba(255, 255, 255, var(--tw-text-opacity));\n}\n\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgba(148, 163, 184, var(--tw-text-opacity));\n}\n\n.text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgba(100, 116, 139, var(--tw-text-opacity));\n}\n\n.text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgba(71, 85, 105, var(--tw-text-opacity));\n}\n\n.text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n.text-red-400 {\n  --tw-text-opacity: 1;\n  color: rgba(251, 113, 133, var(--tw-text-opacity));\n}\n\n.text-red-500 {\n  --tw-text-opacity: 1;\n  color: rgba(244, 63, 94, var(--tw-text-opacity));\n}\n\n.text-indigo-600 {\n  --tw-text-opacity: 1;\n  color: rgba(79, 70, 229, var(--tw-text-opacity));\n}\n\n.text-accent {\n  color: var(--color-accent);\n}\n\n.hover\\:text-gray-700:hover {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n.hover\\:text-indigo-500:hover {\n  --tw-text-opacity: 1;\n  color: rgba(99, 102, 241, var(--tw-text-opacity));\n}\n\n.focus-visible\\:text-gray-700:focus-visible {\n  --tw-text-opacity: 1;\n  color: rgba(51, 65, 85, var(--tw-text-opacity));\n}\n\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.focus\\:underline:focus {\n  text-decoration: underline;\n}\n\n.tracking-wide {\n  letter-spacing: 0.025em;\n}\n\n.tracking-wider {\n  letter-spacing: 0.05em;\n}\n\n.whitespace-nowrap {\n  white-space: nowrap;\n}\n\n.w-6 {\n  width: 1.5rem;\n}\n\n.w-8 {\n  width: 2rem;\n}\n\n.w-10 {\n  width: 2.5rem;\n}\n\n.w-12 {\n  width: 3rem;\n}\n\n.w-full {\n  width: 100%;\n}\n\n.z-10 {\n  z-index: 10;\n}\n\n.z-20 {\n  z-index: 20;\n}\n\n.z-30 {\n  z-index: 30;\n}\n\n.gap-4 {\n  gap: 1rem;\n}\n\n.gap-x-6 {\n  -moz-column-gap: 1.5rem;\n       column-gap: 1.5rem;\n}\n\n.col-span-full {\n  grid-column: 1 / -1;\n}\n\n.auto-rows-auto {\n  grid-auto-rows: auto;\n}\n\n.row-span-full {\n  grid-row: 1 / -1;\n}\n\n.transform {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n\n.scale-95 {\n  --tw-scale-x: .95;\n  --tw-scale-y: .95;\n}\n\n.scale-100 {\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n}\n\n.transition {\n  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n.transition-opacity {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n\n.ease-out {\n  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n}\n\n.ease-in-out {\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n.duration-75 {\n  transition-duration: 75ms;\n}\n\n.duration-100 {\n  transition-duration: 100ms;\n}\n\n.duration-150 {\n  transition-duration: 150ms;\n}\n\n.delay-100 {\n  transition-delay: 100ms;\n}\n\n@-webkit-keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@-webkit-keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@keyframes ping {\n  75%, 100% {\n    transform: scale(2);\n    opacity: 0;\n  }\n}\n\n@-webkit-keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@keyframes pulse {\n  50% {\n    opacity: .5;\n  }\n}\n\n@-webkit-keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@keyframes bounce {\n  0%, 100% {\n    transform: translateY(-25%);\n    -webkit-animation-timing-function: cubic-bezier(0.8,0,1,1);\n            animation-timing-function: cubic-bezier(0.8,0,1,1);\n  }\n\n  50% {\n    transform: none;\n    -webkit-animation-timing-function: cubic-bezier(0,0,0.2,1);\n            animation-timing-function: cubic-bezier(0,0,0.2,1);\n  }\n}\n\n@-webkit-keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n@keyframes progress {\n  from {\n    transform: translateX(-100%);\n  }\n\n  to {\n    transform: translateX(110%);\n  }\n}\n\n.animate-spin {\n  -webkit-animation: spin 1s linear infinite;\n          animation: spin 1s linear infinite;\n}\n\n.animate-pulse {\n  -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n}\n\n.animate-progress {\n  -webkit-animation: progress 1800ms cubic-bezier(.02,.25,1,.61) infinite;\n          animation: progress 1800ms cubic-bezier(.02,.25,1,.61) infinite;\n}\n\n.bg-blur {\n  -webkit-backdrop-filter: blur(2px);\n          backdrop-filter: blur(2px);\n}\n\n.bg-mask-x-transparent {\n  -webkit-mask-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0), transparent);\n          mask-image: linear-gradient(to right, transparent, rgba(0, 0, 0, 1.0), rgba(0, 0, 0, 1.0), transparent);\n}\n\n.grid-cols-fill-200 {\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n}\n\n@media (min-width: 640px) {\n  .sm\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .sm\\:text-xl {\n    font-size: 1.25rem;\n    line-height: 1.75rem;\n  }\n\n  .sm\\:leading-5 {\n    line-height: 1.25rem;\n  }\n\n  .sm\\:max-w-sm {\n    max-width: 24rem;\n  }\n}\n\n@media (min-width: 768px) {\n  .md\\:space-y-0 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0px * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0px * var(--tw-space-y-reverse));\n  }\n\n  .md\\:space-x-0 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(0px * var(--tw-space-x-reverse));\n    margin-left: calc(0px * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  .md\\:space-y-2 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(0.5rem * var(--tw-space-y-reverse));\n  }\n\n  .md\\:space-x-3 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-x-reverse: 0;\n    margin-right: calc(0.75rem * var(--tw-space-x-reverse));\n    margin-left: calc(0.75rem * calc(1 - var(--tw-space-x-reverse)));\n  }\n\n  .md\\:space-y-4 > :not([hidden]) ~ :not([hidden]) {\n    --tw-space-y-reverse: 0;\n    margin-top: calc(1rem * calc(1 - var(--tw-space-y-reverse)));\n    margin-bottom: calc(1rem * var(--tw-space-y-reverse));\n  }\n\n  .md\\:bg-white {\n    --tw-bg-opacity: 1;\n    background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n  }\n\n  .md\\:bg-gray-25 {\n    --tw-bg-opacity: 1;\n    background-color: rgba(251, 252, 253, var(--tw-bg-opacity));\n  }\n\n  .md\\:border-none {\n    border-style: none;\n  }\n\n  .md\\:border {\n    border-width: 1px;\n  }\n\n  .md\\:flex-row {\n    flex-direction: row;\n  }\n\n  .md\\:flex-col {\n    flex-direction: column;\n  }\n\n  .md\\:justify-start {\n    justify-content: flex-start;\n  }\n\n  .md\\:justify-between {\n    justify-content: space-between;\n  }\n\n  .md\\:h-full {\n    height: 100%;\n  }\n\n  .md\\:h-screen {\n    height: 100vh;\n  }\n\n  .md\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n\n  .md\\:text-2xl {\n    font-size: 1.5rem;\n    line-height: 2rem;\n  }\n\n  .md\\:p-2 {\n    padding: 0.5rem;\n  }\n\n  .md\\:px-3 {\n    padding-left: 0.75rem;\n    padding-right: 0.75rem;\n  }\n\n  .md\\:pb-0 {\n    padding-bottom: 0px;\n  }\n\n  .md\\:shadow-sm {\n    --tw-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n  }\n\n  .md\\:w-48 {\n    width: 12rem;\n  }\n}\n\n@media (min-width: 1024px) {\n}\n\n@media (min-width: 1280px) {\n  .xl\\:w-64 {\n    width: 16rem;\n  }\n}\n\n@media (min-width: 1536px) {\n}\n"],"sourceRoot":""}]);
// Exports
___CSS_LOADER_EXPORT___.locals = {
	"container": "_37MJ1xvRzfDb-7MwXjBbO4",
	"space-y-1": "_2uOpjo53uWIMx4iJYo94cY",
	"space-x-1": "_2PYxk-YPpKEQCI2e7E5KO3",
	"space-y-2": "_1vJLvLJl8MA2TDrA-yzNCC",
	"space-x-3": "_1eOBlGKIC8GqwJGqsIGRaW",
	"appearance-none": "_1V3wlQcAuWyRjMGCxNQIud",
	"bg-transparent": "_2aGIhZibaurBv8nwA9Q-bm",
	"bg-white": "_3Vcwul-J2M1qnLi7bsKwG_",
	"bg-gray-100": "_2STjTKytcbSYLl_jiEBZEV",
	"bg-gray-200": "_2kaUyx4AXAGwAUu-AM9_oL",
	"bg-red-200": "_3NygkfmhelfMuzXmJG8C9w",
	"bg-indigo-300": "_2CLhhN82c8CWUwJPd3qm_s",
	"bg-indigo-500": "_2kGQGHquliuyU-tssBDWXc",
	"bg-opacity-75": "_30dKle-dim5g9fmfWdioz9",
	"border-transparent": "_1ciKIw2U78YIhS0J9Ilmf1",
	"border-gray-200": "_1vBIEuJg_Ynkk29JbeI0Kc",
	"border-gray-300": "ymagmuF55F303wpanecad",
	"border-blue-400": "bt_qOjaPuMAZRTE_btl89",
	"border-indigo-400": "_2npXaoVLYM0GiGkow26h2v",
	"rounded-sm": "_2iHvNreL1xXXij5KDBqWu7",
	"rounded-md": "_2ZCf_UtnFIuXD79u2P5J2W",
	"rounded-full": "_3foxC13zHfqRuYDEXFIa_M",
	"border-dashed": "_12e9b_WHCGnuhp5ueVbVj-",
	"border-none": "_1-yzk0S7SsIWmOLKszWkkp",
	"border-2": "_1tyt1J9kqh0ZYDfxj4toNS",
	"border": "_3ns5ZDans6ivU4Jy-6FHsZ",
	"border-t": "_30MiZ5dfGsb62M6ceM0OnP",
	"border-b": "_3Akz5exBKobAUc4KWf9NPD",
	"box-border": "_1R0vi2nTfwXneAnF953RwI",
	"cursor-pointer": "_3DxdJz1JtKLKVI5LrjXaUt",
	"inline-block": "pgxru5RQlKXLgmu51EswQ",
	"flex": "_2hhh-RontV7H-5VX_IwFVe",
	"inline-flex": "_1ESmf8DCPrwhl7RbqNiOFb",
	"table": "_2MkMVopa8acIOkmJhKV696",
	"grid": "_1hyqIawiA2M3dqtMPt4G9k",
	"contents": "_3G_3OCal0y0PB4MT0DejEU",
	"hidden": "QOiFlXSM9R_TtkRQkC5cO",
	"flex-row": "_1e8Qz7Cd0j0NK4dGtlTcAB",
	"flex-col": "_3FYTJTeYvW_FjZM7B1wuC4",
	"place-items-center": "_3Oa6iGRni5VxBaiBRwoFYe",
	"items-center": "_2yZgYvtGkeKurQ7OdRwCUM",
	"justify-center": "_34cZoimpsLy9g6X3qW7-Qh",
	"justify-between": "_3EuGNse2-AKpmUbkEIHd9_",
	"flex-1": "_3-q919xj_nemgWA1S-4S9n",
	"font-medium": "_3S1RGwebX_xCsFO3zExltz",
	"font-semibold": "_3SFniFu9gXrCnzyNwY6cPD",
	"h-1": "WQa2tPDQObuivBxvCjIZQ",
	"h-6": "_11dBeLQKu5_ocptSwbTI5Q",
	"h-8": "_1L4i0ejXp3YAhcS_qC-Pez",
	"h-10": "_1iqCmXDb2NYyJoPDYYaFtB",
	"h-12": "wpOGrG9GSNkbr8PU9my_n",
	"h-16": "l1Fyi9DQ2ys_IWl_0m0mk",
	"h-20": "JNwfWVe2E1cwCrlUW-wui",
	"h-px": "_31y-df6ySEtki7AV67X5KG",
	"h-full": "_27NfzlGsI7-5wwHvGpKLWS",
	"text-xs": "_48uVxMRbWRS-LJQNc5VKm",
	"text-sm": "_1uAwiRap1uIoosu3D2xwF8",
	"text-lg": "_1nCdaIxVs0IMFPj8yIISnf",
	"text-xl": "_3jEdX6YJ-5F6e7cRcB7RQ6",
	"text-2xl": "_2y8R_A5lyns4SZjobamXcg",
	"leading-5": "_1TkINGyzUZU6fv77a2nPoy",
	"leading-7": "FzXu5WLb_A1sY_RR1OGL0",
	"m-0": "_2ovnnXPKXhdai0IEgZryH7",
	"m-3": "_3FNjO2S8UOqFWtw4NYcfHn",
	"mx-auto": "_3UsXXxhD9BktIH_BQJEjS-",
	"mt-1": "qUkURVD_2dJ1Z9ec-EsvM",
	"ml-2": "_3v9GTI6jG-QodlXjEJruOy",
	"mr-3": "_2J4-kb_e3N7qegILLdbszN",
	"ml-3": "_2vRjPKXK-E5FWWLPWV0ZFh",
	"max-w-xs": "_14Mb0q46kJiTDcv1w6i5To",
	"object-contain": "_2P85pyQst6nEPOZkY7twm_",
	"opacity-0": "TNbNpYg2nHZF9dCa3NhpO",
	"opacity-100": "_6bkXDqvjIFSTAy7EJ-yq2",
	"outline-none": "ePWcJFaTkLUAQ7B7rLLUy",
	"focus:outline-none": "_39E7HYI4uEfTkPGeYxGcoi",
	"focus-visible:outline-none": "_2Zqw0q5l8GPulb3QhogSk1",
	"overflow-hidden": "_1c3B1kjcyiKnTftXKNRbBf",
	"overflow-x-auto": "_3nFGIeBt7raMYEaLtq2LUO",
	"p-1": "_2mYJMB41xs0L5lL8p0oYrW",
	"p-4": "_3dDq2BdbPaYayttsmpP7eZ",
	"px-1": "_14W5KgLSMcOeE1HcTjZAC6",
	"py-2": "_3vV4Tg7k0iF0ThLOOogUgx",
	"px-2": "_3BDnUhVGi8Wu55u1d8EW_",
	"py-3": "_2F4tDHc80JV0EkLmrmnfVm",
	"px-3": "_1fAdO0U-3AJTIqa8_duElG",
	"px-4": "_1Ic3o40Obnjg5LAEc2kEaK",
	"px-6": "_3wpVYPENni41OIjOzmhv95",
	"px-9": "_2hyHcpNdYn_o4Gmz4VXZ-W",
	"px-12": "uKteDteHMkS07cuVgG_zP",
	"pt-1": "_2BCK1NaWLXyCwvVWN23Oy1",
	"pt-2": "_1jBj8a_5xAwhseP1Hev-5S",
	"pb-2": "_1iEILwjev_PhsmuehAJmon",
	"pt-3": "FgCemuLHx0ASOL-dOYpXO",
	"pr-3": "_2rwhm5GsORXyikzZv8IZXB",
	"pb-3": "_2TS0FwZ57izydjAy4Bojk-",
	"pl-3": "_2AybGpMeoCHndaIv7wyXrj",
	"pt-4": "_1sKT10tAv26IUxEFxRd_nX",
	"pb-4": "_17LtfHIX9QHP__wnZblzBs",
	"pt-5": "_1rJ0w6SBaAU1ADDbVhtn7q",
	"pt-6": "_2QOMsKPnphGXtOKg1HtLId",
	"pb-6": "_204nOOSgLb0j2urQtqyowf",
	"pr-10": "_3r_G27avjM8S7sMB4bv7Yv",
	"pl-px": "VkOixFu92d4bXJ-OHOMtC",
	"first:pl-3": "TYvbspuCvcNjHJ3lPCziw",
	"last:pr-3": "_33cIObaYRS2clFi0VUAcha",
	"pointer-events-none": "_27B3-x4jeqx3phQRI8gns_",
	"pointer-events-auto": "MiFXNR2erm5JswAqsC-6L",
	"fixed": "_3EgSLLZvTu8Tlv4tubhR8x",
	"absolute": "_3TiU0ZqUcY9JSpP2CoEjyt",
	"relative": "mlpYRS4PyTtxSl766oZv_",
	"inset-0": "ojqmUJGbZ5N8_9EtLAEDR",
	"top-0": "_3EckfZEiJjayECZlGPcRV6",
	"right-0": "_20IhhTfRhOn_R3gsmQk-Wl",
	"left-0": "g2KA0rJBxfkaUpOOR_QK",
	"resize": "EWUNfACaDyqpuUmineNHk",
	"shadow-sm": "_3GAPOS2yapBF0SoKz-Taft",
	"shadow-md": "_1i5DMTd_RXg2Y8jsCeIvC",
	"shadow-lg": "_3cM9vgKMw8eNuLhrc_7ZUf",
	"focus-within:ring": "QLjgUptqsgOKZ4kaD8xPA",
	"text-center": "IUDZnsVGB9XvwRVUAhpRL",
	"text-white": "_1EoRqOLVsFDsF_5dvThmai",
	"text-gray-400": "_1IXUqwOg4bqYZBLJ7tj8B-",
	"text-gray-500": "_1r64egQAqDp-afOb5KUXdn",
	"text-gray-600": "_1I9ADyAddmfh_p9rT-PN2P",
	"text-gray-700": "_3sVOGqHdGZd0ojkeWWWmIK",
	"text-red-400": "_38tUzNdVgtyksMZ3a3q5AZ",
	"text-red-500": "_2gBsFVxaok0yrJxoO-5dyA",
	"text-indigo-600": "_3xXc0UeW_vcuaukP0KHV-e",
	"text-accent": "VieSZCnPB9yiPxJWioa_U",
	"hover:text-gray-700": "_1Qi4xNV0VXG5Z3W5JO5nvn",
	"hover:text-indigo-500": "_2ddh7V2Eyl2nHyPWojTBpW",
	"focus-visible:text-gray-700": "_23tRBmZO2xYelREV4MHDB",
	"truncate": "_2luRct1Ts_Kv2INlGDNeeC",
	"focus:underline": "_3g3o92mdfPXn4Bq3edcY4X",
	"tracking-wide": "yzguYrYfoqyVTrOx2-3hM",
	"tracking-wider": "_2m_hFJ0RElTIzHgDSoB_6k",
	"whitespace-nowrap": "_3xxDDAOUHCSRA20KJUHYlJ",
	"w-6": "Oa4vAORa-Xxs5JaAdJmLA",
	"w-8": "KzDFYBIvWby2Y2hsWx_aD",
	"w-10": "_2-lBdmSkxu0CFkj5zileXL",
	"w-12": "_1vaCDrBrjOsi39QycTfG_e",
	"w-full": "_10Fe2GNwYb9ESSCo6FWvHy",
	"z-10": "_1Gkdi6nVZepXBzvGfjzl2y",
	"z-20": "_37fRW0Eu39t2i7l4s67U4m",
	"z-30": "RNt0eBhUqRRW30mYgVYSS",
	"gap-4": "hEKF4k_u2j41Jn6QE-7Qs",
	"gap-x-6": "_1R5omKea8qkBAH8EZPy_LL",
	"col-span-full": "X-FZYD610NKgRZXNG7Mcp",
	"auto-rows-auto": "_3UV9bSxgyX9eVZ4Wo3zrS2",
	"row-span-full": "_1FyI4SuUlaEAzxKstB8pAf",
	"transform": "_3HpKzvAoQcUeu3idv3FxCJ",
	"scale-95": "_1QzhyNqHeTCT5q3-iHz2er",
	"scale-100": "_2dwUU8pPVH3_V-3SNdUsys",
	"transition": "IGWgMsrv3Dqs7N2wLeE7w",
	"transition-opacity": "_1gqOwM6n8ie8KpnOYFu7dq",
	"ease-in": "_21PJ5y4QKO1G3wWOAzLHG5",
	"ease-out": "w3w6MGOQ2lR94lWWijGI1",
	"ease-in-out": "_2oK-dWmChF9F3q4fDOWhAL",
	"duration-75": "tIyyK12kPAapNgfwNXjmC",
	"duration-100": "yJATGjrOn5DGh37peE0Nu",
	"duration-150": "_3-oVh1akGxMV0wW2aIWZEi",
	"delay-100": "_3qDqUb10QKC5zLIQdqB0BP",
	"animate-spin": "_1r4_6yAR4VMJlmjwu2Cpf2",
	"spin": "_3Q4U4hda8t0Yj6Eo7LZtdS",
	"animate-pulse": "_2ok3qIMezO_7RjR1SYfy0Z",
	"pulse": "ScnfEe7JWUy-BcZn_iUe5",
	"animate-progress": "_3C5rZzesBFyp48YdVo9X_E",
	"progress": "_3BHNs11zMYXnwxT0rLJsEQ",
	"bg-blur": "_1MxktCGVUbvIkO5m-_zQB6",
	"bg-mask-x-transparent": "_1oy2HsWK3iljGXKbRGjv0-",
	"grid-cols-fill-200": "_3qeVx0QEhfq3KAdlY3TVrO",
	"sm:text-sm": "_3RT77ZvZynZ6GDmL4-M-YR",
	"sm:text-xl": "_3vjLeXoo-82F5wh0MzonWC",
	"sm:leading-5": "_1TBSS2Ll9hdbw8_x6gSbTC",
	"sm:max-w-sm": "CHCxoSGHOGddsxZjtTjWI",
	"md:space-y-0": "_2fLnjxOhsczIYpIJ862GjM",
	"md:space-x-0": "RYO0Mi8z3_lhk7GBhN_oc",
	"md:space-y-2": "_3E2VYRnRIBNrjb1UlJVx0B",
	"md:space-x-3": "NGhL9AbmveDeCkqUgApiJ",
	"md:space-y-4": "_6NoWTmoyBQMyrXiE7mo_5",
	"md:bg-white": "TYrCLKjWEJQ1pCQRKIjXO",
	"md:bg-gray-25": "_3Ga1JPLh5CdqRVUOIGhejX",
	"md:border-none": "_16IktQ-SXjmODq_bpZLQzW",
	"md:border": "_14f_GjT01GIxiGv75rjpbI",
	"md:flex-row": "_3B0di9IxiTSNg5LEa_kR9m",
	"md:flex-col": "_1fvOAwOmP_hehsNLmIVY9O",
	"md:justify-start": "_3YwO8rC2d9rensC2_C1xBI",
	"md:justify-between": "_1Sf45EADXn7L5GWuXjCIMN",
	"md:h-full": "_14Lyg9Qga3e7jJuc6PrX5X",
	"md:h-screen": "_357eEo3Bf2y4ePqmTihbjU",
	"md:text-sm": "BRUIosFvckqCRgbtpG77_",
	"md:text-2xl": "_1ZRrirwR6sI_XUVbmQeqde",
	"md:p-2": "_2ORBkwDMsbqbAkZmYAKKHI",
	"md:px-3": "_2LAsEpnSxfSNJGm6mlxTI",
	"md:pb-0": "_1fNXsmbKtEpbS0hYvKrlS3",
	"md:shadow-sm": "_3nFK_S-uwHx1KTWlSypm2F",
	"md:w-48": "k4nGZe3h83OMceLlAhkiM",
	"xl:w-64": "_2tOhz1t-Zsv_XRqEkYJgTF",
	"ping": "hYOG3VlUmRJFs5GH4ihKw",
	"bounce": "varh9e7DfVsM-1uSZZ02w"
};
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
    processImageFile,
    processFile,
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
    truncate
};
function processImageFile(file, options = { estimateColor: true }) {
    return __awaiter(this, void 0, void 0, function* () {
        const imageFile = yield processFile(file);
        if (options.estimateColor && (imageFile === null || imageFile === void 0 ? void 0 : imageFile.url)) {
            imageFile.color = yield estimateImageColor(imageFile.url);
        }
        return imageFile;
    });
}
function processFile(file, decoder) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!file)
            return null;
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onerror = reject;
                reader.onload = () => __awaiter(this, void 0, void 0, function* () {
                    const url = reader.result;
                    const result = {
                        url,
                        data: url
                    };
                    if (decoder) {
                        result.data = yield decoder(url);
                    }
                    resolve(result);
                });
            }
            catch (err) {
                reject(err);
            }
        });
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
    return 'data:image/svg+xml;base64,' + btoa(svg);
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
__exportStar(__webpack_require__(19), exports);
__exportStar(__webpack_require__(26), exports);
__exportStar(__webpack_require__(27), exports);
__exportStar(__webpack_require__(29), exports);
__exportStar(__webpack_require__(30), exports);
__exportStar(__webpack_require__(33), exports);
__exportStar(__webpack_require__(34), exports);


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


/***/ }),
/* 16 */
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
    var _b, _c, _d, _e;
    var { name, label, form, type, validateRule, hint, prefix, suffix, actions, loading, options, accept, src, className } = _a, props = __rest(_a, ["name", "label", "form", "type", "validateRule", "hint", "prefix", "suffix", "actions", "loading", "options", "accept", "src", "className"]);
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
        case 'radio-blocks': {
            const selected = form.watch(name);
            const children = (_b = (options !== null && options !== void 0 ? options : []).map((option) => {
                const { value, element, description } = typeof option === 'object'
                    ? option
                    : { value: option, element: undefined, description: undefined };
                const className = util_1.Util.createClassName(selected === value && 'border-blue-400', 'text-gray-700 px-4 border border-gray-300 rounded-md shadow-sm flex items-center h-20 flex-1');
                return (react_1.default.createElement("label", { key: value, htmlFor: value, className: className },
                    react_1.default.createElement("input", Object.assign({ ref: form.register(validateRule), key: value, value: value, id: value, name: name, type: "radio", hidden: true }, props)),
                    react_1.default.createElement("div", { className: "space-y-2" },
                        react_1.default.createElement("span", { className: "font-semibold" }, element !== null && element !== void 0 ? element : value),
                        description && react_1.default.createElement("p", { className: "text-xs whitespace-nowrap" }, description))));
            })) !== null && _b !== void 0 ? _b : [];
            element = react_1.default.createElement("div", { className: "grid gap-4 grid-cols-fill-200" }, children);
            break;
        }
        case 'select': {
            const children = (_c = ['', ...(options !== null && options !== void 0 ? options : [])].map((option) => {
                const { value, element } = typeof option === 'object' ? option : { value: option, element: undefined };
                return (react_1.default.createElement("option", { key: value, value: value }, element !== null && element !== void 0 ? element : value));
            })) !== null && _c !== void 0 ? _c : [];
            element = (react_1.default.createElement("div", { className: "relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                react_1.default.createElement("select", Object.assign({ id: name, name: name, ref: form.register(validateRule), className: "w-full py-2 pl-3 pr-10 bg-transparent border-none rounded-md outline-none appearance-none", spellCheck: "false", autoComplete: "off" }, props), children),
                react_1.default.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "absolute right-0 w-5 h-5 mr-3 text-gray-600 pointer-events-none", viewBox: "0 0 20 20", fill: "currentColor" },
                    react_1.default.createElement("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }))));
            break;
        }
        case 'image': {
            const fileList = form.watch(name);
            const hasFile = (_d = fileList === null || fileList === void 0 ? void 0 : fileList.length) !== null && _d !== void 0 ? _d : 0 > 0;
            hintOrInfo = hasFile
                ? Array.from(fileList)
                    .map((f) => `${f.name} ${util_1.Util.formatFileSize(f.size)}`)
                    .join(', ')
                : null;
            loading = !!loading;
            accept = accept !== null && accept !== void 0 ? accept : 'image/png, image/jpeg';
            const className = util_1.Util.createClassName(loading && 'animate-pulse border-indigo-400', 'relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md');
            element = (react_1.default.createElement("label", { htmlFor: name, className: className },
                src && (react_1.default.createElement("img", { className: "flex-1 object-contain", src: src, alt: typeof label === 'string' ? label : '' })),
                !src && (react_1.default.createElement("div", { className: "text-center" },
                    react_1.default.createElement("svg", { className: "w-12 h-12 mx-auto text-gray-400", stroke: "currentColor", fill: "none", viewBox: "0 0 48 48" },
                        react_1.default.createElement("path", { d: "M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })),
                    react_1.default.createElement("p", { className: "mt-1 text-sm text-gray-600" },
                        react_1.default.createElement("span", { className: "font-medium text-indigo-600 transition duration-150 ease-in-out cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline" }, "Upload a file"),
                        react_1.default.createElement("span", null, " or drag and drop")),
                    react_1.default.createElement("p", { className: "mt-1 text-xs text-gray-500" }, hint !== null && hint !== void 0 ? hint : accept.split('image/').join('').toUpperCase()))),
                react_1.default.createElement("input", Object.assign({ disabled: loading, id: name, name: name, ref: form.register(validateRule), accept: accept, type: "file", hidden: true, spellCheck: "false", autoComplete: "off" }, props))));
            break;
        }
        case 'file': {
            const fileList = form.watch(name);
            const hasFile = (_e = fileList === null || fileList === void 0 ? void 0 : fileList.length) !== null && _e !== void 0 ? _e : 0 > 0;
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
                react_1.default.createElement("input", Object.assign({ id: name, name: name, ref: form.register(validateRule), type: "file", accept: accept, hidden: true, spellCheck: "false", autoComplete: "off" }, props))));
            break;
        }
        case 'textarea': {
            element = (react_1.default.createElement("div", { className: "flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                prefix && react_1.default.createElement("span", { className: "pl-3 text-gray-500" }, prefix),
                react_1.default.createElement("textarea", Object.assign({ id: name, name: name, ref: form.register(validateRule), className: "w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3", spellCheck: "false", autoComplete: "off" }, props)),
                suffix && react_1.default.createElement("span", { className: "pr-3 text-gray-500" }, suffix)));
            break;
        }
        default: {
            element = (react_1.default.createElement("div", { className: "flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5" },
                prefix && react_1.default.createElement("span", { className: "pl-3 text-gray-500" }, prefix),
                react_1.default.createElement("input", Object.assign({ id: name, name: name, ref: form.register(validateRule), type: type, className: "w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3", spellCheck: "false", autoComplete: "off" }, props)),
                suffix && react_1.default.createElement("span", { className: "pr-3 text-gray-500" }, suffix)));
        }
    }
    className = util_1.Util.createClassName('flex flex-col relative', className);
    return (react_1.default.createElement("div", { className: className },
        react_1.default.createElement("div", { className: "flex justify-between whitespace-nowrap" },
            label && (react_1.default.createElement("label", { className: "pl-px text-sm font-medium leading-7 text-gray-700", htmlFor: name }, label)),
            shortErrorMessage ? (react_1.default.createElement("p", { className: "text-xs font-medium leading-5 text-red-500" }, shortErrorMessage)) : (actions)),
        element,
        react_1.default.createElement(LoadingBar_1.LoadingBar, { className: "h-px px-1", loading: !!loading }),
        longErrorMessage ? (react_1.default.createElement("p", { className: "pt-1 pl-px m-0 text-xs text-red-500 min-h-4" }, longErrorMessage)) : (react_1.default.createElement("p", { className: "pt-1 pl-px m-0 text-xs text-gray-500 min-h-4" }, hintOrInfo))));
}
exports.FormField = FormField;


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
exports.FormButton = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const LoadingSpinner_1 = __webpack_require__(11);
function FormButton(_a) {
    var { children, type, disabled, loading, dense, className } = _a, props = __rest(_a, ["children", "type", "disabled", "loading", "dense", "className"]);
    disabled = !!(disabled || loading);
    className = util_1.Util.createClassName('relative flex justify-center items-center appearance-none bg-indigo-500 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm', dense ? 'px-9 py-2' : 'px-12 py-3', className);
    return (react_1.default.createElement("button", Object.assign({ type: type, disabled: disabled, className: className }, props),
        react_1.default.createElement(LoadingSpinner_1.LoadingSpinner, { loading: loading, className: `absolute left-0 ${dense ? 'h-5 ml-2' : 'h-6 ml-3'}` }),
        children));
}
exports.FormButton = FormButton;


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
exports.Sidebar = void 0;
const react_1 = __importDefault(__webpack_require__(7));
const react_router_dom_1 = __webpack_require__(20);
const hooks_1 = __webpack_require__(21);
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
/* 20 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__20__;

/***/ }),
/* 21 */
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
__exportStar(__webpack_require__(22), exports);
__exportStar(__webpack_require__(23), exports);
__exportStar(__webpack_require__(24), exports);
__exportStar(__webpack_require__(25), exports);


/***/ }),
/* 22 */
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
/* 23 */
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
const react_router_dom_1 = __webpack_require__(20);
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
/* 24 */
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
/* 25 */
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
const react_router_dom_1 = __webpack_require__(20);
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
/* 26 */
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
const hooks_1 = __webpack_require__(21);
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
const react_2 = __webpack_require__(28);
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
/* 28 */
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
/* 29 */
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
__exportStar(__webpack_require__(32), exports);


/***/ }),
/* 31 */
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
/* 32 */
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
const SkeletonText_1 = __webpack_require__(31);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Modal = void 0;
const react_1 = __importStar(__webpack_require__(7));
const util_1 = __webpack_require__(4);
const contexts_1 = __webpack_require__(5);
const react_dom_1 = __importDefault(__webpack_require__(13));
const react_2 = __webpack_require__(28);
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
/* 34 */
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