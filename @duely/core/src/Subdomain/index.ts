import { Agency } from '../Agency';
import { Membership } from '../Membership';
import { Resource } from '../Resource';

export interface Subdomain extends Resource<'subdomain', 'sub'> {
  name: string;
  agency?: Partial<Agency>;
  memberships: Partial<Membership>[];
};
