"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _default = {
  meta: {
    docs: {
      description: 'Rule to make sure component type comment exists',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null,
    schema: [// fill in your schema
    ]
  },
  create: function create(context) {
    return {
      ImportDefaultSpecifier: function ImportDefaultSpecifier(node) {
        // at a ReturnStatement node while going down
        return;
      }
    };
  }
};
exports["default"] = _default;
//# sourceMappingURL=include-component-type-comment.js.map