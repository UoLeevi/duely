import { Agency } from '../Agency';
import { Image } from '../Image';
import { Resource } from '../Resource';
export interface Theme extends Resource<'theme', 'theme'> {
    agency?: Agency;
    name: string;
    image_logo?: Partial<Image> | null;
    image_hero?: Partial<Image> | null;
    color_primary: string;
    color_secondary: string;
    color_accent: string;
    color_background: string;
    color_surface: string;
    color_error: string;
    color_success: string;
}
