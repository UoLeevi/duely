import React from 'react';
import { setThemeHexColor } from 'utils';

/**

theme {
  uuid
  name
  imageLogo {
    uuid
    name
    color
    data
  }
  imageHero {
    uuid
    name
    color
    data
  }
  colorPrimary
  colorSecondary
  colorAccent
  colorBackground
  colorSurface
  colorError
  colorSuccess
}

 */

const Theme = React.forwardRef(({ theme, children, style, ...props }, ref) => {
  let element = React.Children.only(children);

  if (theme) {
    const colors = {};
    setThemeHexColor(colors, 'primary', theme.colorPrimary);
    setThemeHexColor(colors, 'secondary', theme.colorSecondary);
    setThemeHexColor(colors, 'accent', theme.colorAccent);
    setThemeHexColor(colors, 'background', theme.colorBackground);
    setThemeHexColor(colors, 'surface', theme.colorSurface);
    setThemeHexColor(colors, 'error', theme.colorError);
    setThemeHexColor(colors, 'success', theme.colorSuccess);

    style = {
      ...colors,
      '--url-image-logo': `url('${theme.imageLogo.data}')`,
      '--color-image-logo': theme.imageLogo.color,
      '--url-image-hero': `url('${theme.imageHero.data}')`,
      '--color-image-hero': theme.imageHero.color,
      ...style, 
      ...element.props.style
    };
  }

  return React.cloneElement(element, { style, ...props, 'data-bg-base': true, ref });
});

export default Theme;
