import React, { useRef, useLayoutEffect } from 'react';
import './colors.stories.css';

export default {
  title: 'Colors'
};

function byteToHex(x) {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

function hexToByte(x) {
  return parseInt(x, 16);
};

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function hsl2rgb(h, s, l) 
{
  const a = s * Math.min(l, 1-l);
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);                 
  return [f(0), f(8), f(4)].map(x => Math.ceil(x * 255));
}

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

function colorToHex(colorCode) {
  if (!colorCode) {
    return colorCode;
  }

  if (colorCode.substring(0, 5) === 'rgba(') {
    return '#' + colorCode
      .slice(5)
      .split(',')
      .slice(0, 3)
      .map(parseFloat)
      .map(byteToHex)
      .join('');
  }

  return colorCode;
}

function hexColor(element, colorKey) {
  const style = getComputedStyle(element);
  const h = parseFloat(style.getPropertyValue(`--color-${colorKey}-h`));
  const s = parseFloat(style.getPropertyValue(`--color-${colorKey}-s`)) / 100;
  const l = parseFloat(style.getPropertyValue(`--color-${colorKey}-l`)) / 100;
  return '#' + hsl2rgb(h, s, l).map(byteToHex).join('');
}

function setThemeHexColor(colorKey, hex) {
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
  document.documentElement.style.setProperty(`--color-${colorKey}-h`, h.toFixed(2));
  document.documentElement.style.setProperty(`--color-${colorKey}-s`, (s * 100).toFixed(2) + '%');
  document.documentElement.style.setProperty(`--color-${colorKey}-l`, (l * 100).toFixed(2) + '%');
}

export const Palette = ({ primary, secondary, accent, background, surface, error, success }) => {
  primary = colorToHex(primary);
  secondary = colorToHex(secondary);
  accent = colorToHex(accent);
  background = colorToHex(background);
  surface = colorToHex(surface);
  error = colorToHex(error);
  success = colorToHex(success);
  const ref = useRef();

  useLayoutEffect(() => {
    if (primary) {
      if (primary !== hexColor(ref.current, 'primary')) {
        setThemeHexColor('primary', primary);
      }
    }

    if (secondary) {
      if (secondary !== hexColor(ref.current, 'secondary')) {
        setThemeHexColor('secondary', secondary);
      }
    }

    if (accent) {
      if (accent !== hexColor(ref.current, 'accent')) {
        setThemeHexColor('accent', accent);
      }
    }

    if (background) {
      if (background !== hexColor(ref.current, 'background')) {
        setThemeHexColor('background', background);
      }
    }

    if (surface) {
      if (surface !== hexColor(ref.current, 'surface')) {
        setThemeHexColor('surface', surface);
      }
    }

    if (error) {
      if (error !== hexColor(ref.current, 'error')) {
        setThemeHexColor('error', error);
      }
    }

    if (success) {
      if (success !== hexColor(ref.current, 'success')) {
        setThemeHexColor('success', success);
      }
    }
  }, [ref, primary, secondary, accent, background, surface, error, success]);

  return (
    <div className="colors-story nowrap f-1" ref={ ref }>
      <div>
        <div className="primary primary-bg color-s1n color-l4n bg-l4 pa-2">primary-l4</div>
        <div className="primary primary-bg color-s1n color-l4n bg-l3 pa-2">primary-l3</div>
        <div className="primary primary-bg color-s1n color-l4n bg-l2 pa-2">primary-l2</div>
        <div className="primary primary-bg color-s1n color-l4n bg-l1 pa-2">primary-l1</div>
        <div className="primary primary-bg color-s1n color-l4 pa-2">{ `primary (${primary})` }</div>
        <div className="primary primary-bg color-s1n color-l4 bg-l1n pa-2">primary-l1n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-l2n pa-2">primary-l2n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-l3n pa-2">primary-l3n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-l4n pa-2">primary-l4n</div>
      </div>
      <div>
        <div className="primary primary-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">primary-s1nl4</div>
        <div className="primary primary-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">primary-s1nl3</div>
        <div className="primary primary-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">primary-s1nl2</div>
        <div className="primary primary-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">primary-s1nl1</div>
        <div className="primary primary-bg color-s1n color-l4 bg-s1n pa-2">primary-s1n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">primary-s1nl1n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">primary-s1nl2n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">primary-s1nl3n</div>
        <div className="primary primary-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">primary-s1nl4n</div>
      </div>
      <div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-l4 pa-2">secondary-l4</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-l3 pa-2">secondary-l3</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-l2 pa-2">secondary-l2</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-l1 pa-2">secondary-l1</div>
        <div className="secondary secondary-bg color-s1n color-l4 pa-2">{ `secondary (${secondary})` }</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-l1n pa-2">secondary-l1n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-l2n pa-2">secondary-l2n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-l3n pa-2">secondary-l3n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-l4n pa-2">secondary-l4n</div>
      </div>
      <div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">secondary-s1nl4</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">secondary-s1nl3</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">secondary-s1nl2</div>
        <div className="secondary secondary-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">secondary-s1nl1</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-s1n pa-2">secondary-s1n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">secondary-s1nl1n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">secondary-s1nl2n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">secondary-s1nl3n</div>
        <div className="secondary secondary-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">secondary-s1nl4n</div>
      </div>
      <div>
        <div className="accent accent-bg color-s1n color-l4n bg-l4 pa-2">accent-l4</div>
        <div className="accent accent-bg color-s1n color-l4n bg-l3 pa-2">accent-l3</div>
        <div className="accent accent-bg color-s1n color-l4n bg-l2 pa-2">accent-l2</div>
        <div className="accent accent-bg color-s1n color-l4n bg-l1 pa-2">accent-l1</div>
        <div className="accent accent-bg color-s1n color-l4 pa-2">{ `accent (${accent})` }</div>
        <div className="accent accent-bg color-s1n color-l4 bg-l1n pa-2">accent-l1n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-l2n pa-2">accent-l2n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-l3n pa-2">accent-l3n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-l4n pa-2">accent-l4n</div>
      </div>
      <div>
        <div className="accent accent-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">accent-s1nl4</div>
        <div className="accent accent-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">accent-s1nl3</div>
        <div className="accent accent-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">accent-s1nl2</div>
        <div className="accent accent-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">accent-s1nl1</div>
        <div className="accent accent-bg color-s1n color-l4 bg-s1n pa-2">accent-s1n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">accent-s1nl1n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">accent-s1nl2n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">accent-s1nl3n</div>
        <div className="accent accent-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">accent-s1nl4n</div>
      </div>
      <div>
        <div className="background background-bg color-s1n color-l4n bg-l4 pa-2">background-l4</div>
        <div className="background background-bg color-s1n color-l4n bg-l3 pa-2">background-l3</div>
        <div className="background background-bg color-s1n color-l4n bg-l2 pa-2">background-l2</div>
        <div className="background background-bg color-s1n color-l4n bg-l1 pa-2">background-l1</div>
        <div className="background background-bg color-s1n color-l4 pa-2">{ `background (${background})` }</div>
        <div className="background background-bg color-s1n color-l4 bg-l1n pa-2">background-l1n</div>
        <div className="background background-bg color-s1n color-l4 bg-l2n pa-2">background-l2n</div>
        <div className="background background-bg color-s1n color-l4 bg-l3n pa-2">background-l3n</div>
        <div className="background background-bg color-s1n color-l4 bg-l4n pa-2">background-l4n</div>
      </div>
      <div>
        <div className="background background-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">background-s1nl4</div>
        <div className="background background-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">background-s1nl3</div>
        <div className="background background-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">background-s1nl2</div>
        <div className="background background-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">background-s1nl1</div>
        <div className="background background-bg color-s1n color-l4 bg-s1n pa-2">background-s1n</div>
        <div className="background background-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">background-s1nl1n</div>
        <div className="background background-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">background-s1nl2n</div>
        <div className="background background-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">background-s1nl3n</div>
        <div className="background background-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">background-s1nl4n</div>
      </div>
      <div>
        <div className="surface surface-bg color-s1n color-l4n bg-l4 pa-2">surface-l4</div>
        <div className="surface surface-bg color-s1n color-l4n bg-l3 pa-2">surface-l3</div>
        <div className="surface surface-bg color-s1n color-l4n bg-l2 pa-2">surface-l2</div>
        <div className="surface surface-bg color-s1n color-l4n bg-l1 pa-2">surface-l1</div>
        <div className="surface surface-bg color-s1n color-l4 pa-2">{ `surface (${surface})` }</div>
        <div className="surface surface-bg color-s1n color-l4 bg-l1n pa-2">surface-l1n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-l2n pa-2">surface-l2n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-l3n pa-2">surface-l3n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-l4n pa-2">surface-l4n</div>
      </div>
      <div>
        <div className="surface surface-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">surface-s1nl4</div>
        <div className="surface surface-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">surface-s1nl3</div>
        <div className="surface surface-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">surface-s1nl2</div>
        <div className="surface surface-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">surface-s1nl1</div>
        <div className="surface surface-bg color-s1n color-l4 bg-s1n pa-2">surface-s1n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">surface-s1nl1n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">surface-s1nl2n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">surface-s1nl3n</div>
        <div className="surface surface-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">surface-s1nl4n</div>
      </div>
      <div>
        <div className="error error-bg color-s1n color-l4n bg-l4 pa-2">error-l4</div>
        <div className="error error-bg color-s1n color-l4n bg-l3 pa-2">error-l3</div>
        <div className="error error-bg color-s1n color-l4n bg-l2 pa-2">error-l2</div>
        <div className="error error-bg color-s1n color-l4n bg-l1 pa-2">error-l1</div>
        <div className="error error-bg color-s1n color-l4 pa-2">{ `error (${error})` }</div>
        <div className="error error-bg color-s1n color-l4 bg-l1n pa-2">error-l1n</div>
        <div className="error error-bg color-s1n color-l4 bg-l2n pa-2">error-l2n</div>
        <div className="error error-bg color-s1n color-l4 bg-l3n pa-2">error-l3n</div>
        <div className="error error-bg color-s1n color-l4 bg-l4n pa-2">error-l4n</div>
      </div>
      <div>
        <div className="error error-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">error-s1nl4</div>
        <div className="error error-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">error-s1nl3</div>
        <div className="error error-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">error-s1nl2</div>
        <div className="error error-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">error-s1nl1</div>
        <div className="error error-bg color-s1n color-l4 bg-s1n pa-2">error-s1n</div>
        <div className="error error-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">error-s1nl1n</div>
        <div className="error error-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">error-s1nl2n</div>
        <div className="error error-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">error-s1nl3n</div>
        <div className="error error-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">error-s1nl4n</div>
      </div>
      <div>
        <div className="success success-bg color-s1n color-l4n bg-l4 pa-2">success-l4</div>
        <div className="success success-bg color-s1n color-l4n bg-l3 pa-2">success-l3</div>
        <div className="success success-bg color-s1n color-l4n bg-l2 pa-2">success-l2</div>
        <div className="success success-bg color-s1n color-l4n bg-l1 pa-2">success-l1</div>
        <div className="success success-bg color-s1n color-l4 pa-2">{ `success (${success})` }</div>
        <div className="success success-bg color-s1n color-l4 bg-l1n pa-2">success-l1n</div>
        <div className="success success-bg color-s1n color-l4 bg-l2n pa-2">success-l2n</div>
        <div className="success success-bg color-s1n color-l4 bg-l3n pa-2">success-l3n</div>
        <div className="success success-bg color-s1n color-l4 bg-l4n pa-2">success-l4n</div>
      </div>
      <div>
        <div className="success success-bg color-s1n color-l4n bg-s1n bg-l4 pa-2">success-s1nl4</div>
        <div className="success success-bg color-s1n color-l4n bg-s1n bg-l3 pa-2">success-s1nl3</div>
        <div className="success success-bg color-s1n color-l4n bg-s1n bg-l2 pa-2">success-s1nl2</div>
        <div className="success success-bg color-s1n color-l4n bg-s1n bg-l1 pa-2">success-s1nl1</div>
        <div className="success success-bg color-s1n color-l4 bg-s1n pa-2">success-s1n</div>
        <div className="success success-bg color-s1n color-l4 bg-s1n bg-l1n pa-2">success-s1nl1n</div>
        <div className="success success-bg color-s1n color-l4 bg-s1n bg-l2n pa-2">success-s1nl2n</div>
        <div className="success success-bg color-s1n color-l4 bg-s1n bg-l3n pa-2">success-s1nl3n</div>
        <div className="success success-bg color-s1n color-l4 bg-s1n bg-l4n pa-2">success-s1nl4n</div>
      </div>
    </div>
  )
};

Palette.args = {
  primary: '#5A5AFF',
  secondary: '#E664FF',
  accent: '#64C8FF',
  background: '#818492',
  surface: '#394265',
  error: '#FF6464',
  success: '#00BEA0'
};

Palette.argTypes = {
  primary: {
    control: {
      type: 'color'
    }
  },
  secondary: {
    control: {
      type: 'color'
    }
  },
  accent: {
    control: {
      type: 'color'
    }
  },
  background: {
    control: {
      type: 'color'
    }
  },
  surface: {
    control: {
      type: 'color'
    }
  },
  error: {
    control: {
      type: 'color'
    }
  },
  success: {
    control: {
      type: 'color'
    }
  }
};
