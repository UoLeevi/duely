import { AccessLevel } from '../AccessLevel';
import { Resource } from '../Resource';
import { Subdomain } from '../Subdomain';
import { User } from '../User';

export interface Membership extends Resource<'membership', 'member'> {
  access: AccessLevel
  user?: Partial<User>
  subdomain?: Partial<Subdomain>
};
