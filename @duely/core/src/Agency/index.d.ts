import { Resource } from '../Resource';
import { Service } from '../Service';
import { StripeAccount } from '../StripeAccount';
import { Subdomain } from '../Subdomain';
import { Theme } from '../Theme';
export interface Agency extends Resource<'agency', 'agcy', 'agency', 'agencies'> {
    name: string;
    stripe_account: Partial<StripeAccount>;
    subdomain?: Partial<Subdomain>;
    theme?: Partial<Theme>;
    services?: Partial<Service>[];
}
