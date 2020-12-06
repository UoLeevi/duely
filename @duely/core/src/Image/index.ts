import { AccessLevel } from '../AccessLevel';
import { Agency } from '../Agency';
import { Base64DataUrl } from '../DataUrl';
import { Resource } from '../Resource';

type ImageMimeType = 
  | 'image/jpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/webp';

export interface Image extends Resource<'image', 'img'> {
  name: string;
  data: Base64DataUrl<ImageMimeType>;
  color: string;
  access: AccessLevel;
  agency?: Partial<Agency>;
};
