import rule from '../../rules/include-component-type-comment';
import { RuleTester } from 'eslint';

var ruleTester = new RuleTester();
ruleTester.run('include-component-type-comment', rule, {

  valid: [

    // give me some code that won't trigger a warning
  ],

  invalid: [
    {
      code: '',
      errors: [{
        message: 'Fill me in.',
        type: 'Me too'
      }]
    }
  ]
});
