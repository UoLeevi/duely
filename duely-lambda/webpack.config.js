const { merge } = require('webpack-merge');
const commonConfig = require('./node_modules/@duely/build/webpack/webpack.common.js');

module.exports = merge(commonConfig, {
  target: 'node',
  entry: {
    index: { import: './src/index.ts', filename: 'index.js' },
    echo: { import: './src/jobs/echo/index.ts', filename: 'jobs/echo/index.js' },
    'process-order': {
      import: './src/jobs/process-order/index.ts',
      filename: 'jobs/process-order/index.js'
    },
    'integration/teachable/enroll': {
      import: './src/jobs/integration/teachable/enroll/index.ts',
      filename: 'jobs/integration/teachable/enroll/index.js'
    },
    'webhook-event/stripe-agency/checkout.session.completed': {
      import: './src/jobs/webhook-event/stripe-agency/checkout.session.completed/index.ts',
      filename: 'jobs/webhook-event/stripe-agency/checkout.session.completed/index.js'
    },
    'webhook-event/stripe-agency/customer.created': {
      import: './src/jobs/webhook-event/stripe-agency/customer.created/index.ts',
      filename: 'jobs/webhook-event/stripe-agency/customer.created/index.js'
    }
  }
});
