import { CountryCode } from '../Country';

export interface Address {
  city: string | null;
  country: CountryCode | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}
