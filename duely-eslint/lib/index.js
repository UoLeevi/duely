"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _includeComponentTypeComment = require("./rules/include-component-type-comment");

var _default = {
  rules: {
    'include-component-type-comment': _includeComponentTypeComment.IncludeComponentTypeComment
  },
  parserOptions: {
    range: true,
    loc: true,
    comment: true,
    tokens: false,
    // Set to 3, 5 (default), 6, 7, 8, 9, or 10 to specify the version of ECMAScript syntax you want to use.
    // You can also set to 2015 (same as 6), 2016 (same as 7), 2017 (same as 8), 2018 (same as 9), 2019 (same as 10), or 2020 (same as 11) to use the year-based naming.
    ecmaVersion: 10,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
};
exports["default"] = _default;
//# sourceMappingURL=index.js.map