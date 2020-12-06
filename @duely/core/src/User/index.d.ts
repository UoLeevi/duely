import { Membership } from '../Membership';
import { Resource } from '../Resource';
export interface User extends Resource<'user', 'user'> {
    name: string;
    email_address: string;
    memberships?: Partial<Membership>[];
}
