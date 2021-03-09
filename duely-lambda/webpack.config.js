const path = require('path');

module.exports = {
  devtool: 'source-map',
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
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        use: 'ts-loader',
        include: [path.resolve(__dirname, 'src')]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  }
};
