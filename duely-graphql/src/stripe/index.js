import stripe from 'stripe';

export default stripe(process.env.STRIPE_SK_TEST);
