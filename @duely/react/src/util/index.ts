export const Util = {
  processImageFile,
  processFile,
  estimateImageColor,
  dataUriFromSvg,
  byteToHex,
  hexToByte,
  hsl2rgb,
  hex2rgb,
  hex2hsl,
  rgb2hsl,
  createClassName,
  formatDate,
  formatFileSize,
  findFirstFocusableChild,
  getNameInitials,
  pseudoRandom,
  poisson,
  truncate,
  sentenceCase
};

async function processImageFile(file: File | null | undefined, options = { estimateColor: true }) {
  const imageFile: {
    url: string | null;
    data: string | null;
    color?: string;
  } | null = await processFile(file);

  if (options.estimateColor && imageFile?.url) {
    imageFile.color = await estimateImageColor(imageFile.url);
  }

  return imageFile;
}

async function processFile<T = string | null>(
  file: File | null | undefined,
  decoder?: (data: string | null) => T
): Promise<{
  url: string | null;
  data: T | string | null;
} | null> {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = async () => {
        const url = reader.result as string;
        const result: {
          url: string | null;
          data: T | string | null;
        } = {
          url,
          data: url
        };

        if (decoder) {
          result.data = await decoder(url);
        }

        resolve(result);
      };
    } catch (err) {
      reject(err);
    }
  });
}

function estimateImageColor(url: string): Promise<string> {
  return new Promise((resolve) => {
    const context = document.createElement('canvas').getContext('2d');

    if (!context) {
      throw new Error('');
    }

    const img = new Image();
    img.src = url;
    img.onload = function () {
      context.drawImage(img, 0, 0, 1, 1);
      const hex =
        '#' +
        Array.from(context.getImageData(0, 0, 1, 1).data.slice(0, 3))
          .map((c) => Math.round(c).toString(16).padStart(2, '0'))
          .join('');

      resolve(hex);
    };
  });
}

function dataUriFromSvg(svg: string) {
  return 'data:image/svg+xml;base64,' + btoa(svg);
}

function byteToHex(x: number) {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}

function hexToByte(x: string) {
  return parseInt(x, 16);
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,255]
function hsl2rgb(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [f(0), f(8), f(4)].map((x) => Math.ceil(x * 255));
}

function hex2rgb(hex: string): [number, number, number, number] {
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

function hex2hsl(hex: string) {
  return rgb2hsl(...hex2rgb(hex));
}

function rgb2hsl(r: number, g: number, b: number, a?: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const m = Math.max(r, g, b);
  const n = m - Math.min(r, g, b);
  const f = 1 - Math.abs(m + m - n - 1);
  const h = n && (m === r ? (g - b) / n : m === g ? 2 + (b - r) / n : 4 + (r - g) / n);
  return [60 * (h < 0 ? h + 6 : h), f ? n / f : 0, (m + m - n) / 2, a];
}

function isString(arg: any): arg is string {
  return typeof arg === 'string';
}

function createClassName(...classNames: any[]) {
  return Array.from(
    new Set(
      classNames
        .filter(isString)
        .join(' ')
        .split(' ')
        .filter((c) => !!c)
    )
  ).join(' ');
}

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function formatDate(d: Date) {
  return `${d.getUTCDate()} ${
    shortMonthNames[d.getUTCMonth()]
  } ${d.getUTCFullYear()} ${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
}

function formatFileSize(size: number) {
  if (size < 1000) return `${size}B`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}KB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}MB`;

  size /= 1000;
  if (size < 1000) return `${size.toPrecision(3)}GB`;
}

function findFirstFocusableChild(parent: ParentNode) {
  return parent.querySelector(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

function getNameInitials(name: string) {
  const initials = name.match(/\b\w/g) || [];
  return ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
}

function pseudoRandom(seed?: number) {
  const x = Math.sin(seed || Math.random()) * 10000;
  return x - Math.floor(x);
}

function poisson(mean: number, generateRandom?: () => number) {
  const L = Math.exp(-mean);
  let p = 1.0;
  let k = 0;
  generateRandom = generateRandom ?? Math.random;

  do {
    k++;
    p *= generateRandom();
  } while (p > L);

  return k - 1;
}

function truncate(text: string, maxLength: number) {
  return text?.length > maxLength ? text.substring(0, maxLength).trimEnd() + '...' : text;
}

function sentenceCase(text: string) {
  return text && text.charAt(0).toUpperCase() + text.substring(1);
}
