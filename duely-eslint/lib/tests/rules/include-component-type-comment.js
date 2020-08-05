"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _includeComponentTypeComment = _interopRequireDefault(require("../../rules/include-component-type-comment"));

var _eslint = require("eslint");

var ruleTester = new _eslint.RuleTester();
ruleTester.run('include-component-type-comment', _includeComponentTypeComment["default"], {
  valid: [// give me some code that won't trigger a warning
  ],
  invalid: [{
    code: '',
    errors: [{
      message: 'Fill me in.',
      type: 'Me too'
    }]
  }]
});
//# sourceMappingURL=include-component-type-comment.js.map