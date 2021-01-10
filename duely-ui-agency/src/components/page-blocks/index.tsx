import { AgencyFragment, PageFragment, ProductFragment } from '@duely/core';
import { HeroWithAngledImage } from '../HeroWithAngledImage';

export type PageBlockComponentProps = {
  page: PageFragment;
  agency: AgencyFragment;
  product?: ProductFragment;
} & Record<string, any>

export const pageBlockComponents: Record<string, React.ComponentType<PageBlockComponentProps>> = {
  'Hero with angled image': HeroWithAngledImage
};
