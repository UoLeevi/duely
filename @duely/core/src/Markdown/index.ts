import { AccessLevel } from '../AccessLevel';
import { Agency } from '../Agency';
import { Resource } from '../Resource';

export interface Markdown extends Resource<'markdown', 'md'> {
  name: string;
  data: string;
  agency?: Partial<Agency>;
  access: AccessLevel;
};
