import { Agency } from '../Agency';
import { Resource } from '../Resource';
import { ServiceVariant } from '../ServiceVariant';

export interface Service extends Resource<'service', 'svc'> {
  name: string;
  url_name: string;
  status: string;
  agency?: Agency;
  default_variant?: Partial<ServiceVariant>;
  variants?: Partial<ServiceVariant>[];
};
