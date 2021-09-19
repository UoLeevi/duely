import { hexToByte } from '../Util';

  // input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
  export function hsl2rgb(h: number, s: number, l: number) {
    const a = s * Math.min(l, 1 - l);
    const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0), f(8), f(4)].map((x) => Math.ceil(x * 255));
  }

  export function hex2rgb(hex: string): [number, number, number, number] {
    let r;
    let g;
    let b;
    let a = 1.0;

    switch (hex.length) {
      case 5:
        a = hexToByte(hex[4].repeat(2)) / 256.0;
      /* fall through */

      case 4:
        r = hexToByte(hex[1].repeat(2));
        g = hexToByte(hex[2].repeat(2));
        b = hexToByte(hex[3].repeat(2));
        break;

      case 8:
        a = hexToByte(hex.substr(7, 2)) / 256.0;
      /* fall through */

      case 7:
        r = hexToByte(hex.substr(1, 2));
        g = hexToByte(hex.substr(3, 2));
        b = hexToByte(hex.substr(5, 2));
        break;

      default:
        throw Error('Value is not a hexadecimal color code.');
    }

    return [r, g, b, a];
  }

  export function hex2hsl(hex: string) {
    return rgb2hsl(...hex2rgb(hex));
  }

  export function rgb2hsl(r: number, g: number, b: number, a?: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const m = Math.max(r, g, b);
    const n = m - Math.min(r, g, b);
    const f = 1 - Math.abs(m + m - n - 1);
    const h = n && (m === r ? (g - b) / n : m === g ? 2 + (b - r) / n : 4 + (r - g) / n);
    return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (m + m - n) / 2, a];
  }
