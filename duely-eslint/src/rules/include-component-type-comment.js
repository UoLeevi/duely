export default {
  meta: {
    docs: {
      description: 'Rule to make sure component type comment exists',
      category: 'Fill me in',
      recommended: false
    },
    fixable: null,
    schema: [
      // fill in your schema
    ]
  },

  create(context) {
    return {
      ImportDefaultSpecifier: function(node) {
        // at a ReturnStatement node while going down
        return;
      }
    };
  }
};
