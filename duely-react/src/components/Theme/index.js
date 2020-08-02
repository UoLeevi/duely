import React from 'react';

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

function hexToByte(x) {
  return parseInt(x, 16);
};

function rgb2hsl(r, g, b) 
{
  r /= 255;
  g /= 255;
  b /= 255;
  const a = Math.max(r, g, b);
  const n = a - Math.min(r, g, b);
  const f = 1 - Math.abs(a + a - n - 1); 
  const h = n && (a === r ? (g - b) / n : ((a === g) ? 2 + (b - r) / n : 4 + (r - g) / n)); 
  return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (a + a - n) / 2];
}

function setThemeHexColor(style, colorKey, hex) {
  let r;
  let g;
  let b;

  switch (hex.length) {
    case 4:
      r = hexToByte(hex[1].repeat(2));
      g = hexToByte(hex[1].repeat(2));
      b = hexToByte(hex[1].repeat(2));
      break;

    case 7:
      r = hexToByte(hex.substring(1, 3));
      g = hexToByte(hex.substring(3, 5));
      b = hexToByte(hex.substring(5, 7));
      break;

    default:
      return;
  }

  const [h, s, l] = rgb2hsl(r, g, b);
  style[`--color-${colorKey}-h`] = h.toFixed(2);
  style[`--color-${colorKey}-s`] = (s * 100).toFixed(2) + '%';
  style[`--color-${colorKey}-l`] = (l * 100).toFixed(2) + '%';
}

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

  return React.cloneElement(element, { style, ...props, ref });
});

export default Theme;
