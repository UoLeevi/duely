import { Resource } from '../Resource';

export interface StripeAccount extends Resource<'stripe account', 'stripe', 'stripe_account'> {
  id_ext: string;
  name: string;
};
