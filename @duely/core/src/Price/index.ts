import { CurrencyLowercase } from '../Currency';
import { Resource } from '../Resource';
import { ServiceVariant } from '../ServiceVariant';

export interface Price extends Resource<'price', 'price'> {
  name: string;
  status: string;
  type: string;
  unit_amount: number;
  currency: CurrencyLowercase;
  recurring_interval: string;
  recurring_interval_count: number;
  service_variant?: Partial<ServiceVariant>;
};
