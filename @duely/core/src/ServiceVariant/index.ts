import { Image } from '../Image';
import { Markdown } from '../Markdown';
import { Price } from '../Price';
import { Resource } from '../Resource';
import { Service } from '../Service';

export interface ServiceVariant extends Resource<'service variant', 'svcvar', 'service_variant'> {
  name: string;
  status: string;
  description: string;
  duration: string;
  default_price?: Partial<Price>;
  prices?: Partial<Price>[];
  image_logo?: Partial<Image>;
  image_hero?: Partial<Image>;
  service?: Partial<Service>;
  markdown_description: Partial<Markdown>;
};
