import stripe from 'stripe';
import fs from 'fs';

if (!process.env.STRIPE_SK_TEST) {
  const config = JSON.parse(fs.readFileSync(process.env.STRIPECONFIGFILE, 'utf8'));
  process.env = {
    ...config.env,
    ...process.env
  };
}

export default stripe(process.env.STRIPE_SK_TEST);
