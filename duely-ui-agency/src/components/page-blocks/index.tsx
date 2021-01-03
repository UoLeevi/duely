import { AgencyFragment, PageFragment, ServiceFragment } from '@duely/core';
import { HeroWithAngledImage } from '../HeroWithAngledImage';

export type PageBlockComponentProps = {
  page: PageFragment;
  agency: AgencyFragment;
  service?: ServiceFragment;
} & Record<string, any>

export const pageBlockComponents: Record<string, React.ComponentType<PageBlockComponentProps>> = {
  'Hero with angled image': HeroWithAngledImage
};
