import type { ImageInput } from '@duely/core';
import { DocumentNode, print as printGqlQuery } from 'graphql';

export const Util = {
  hasProperty,
  readFileAsDataUrl,
  readFileAsImageInput,
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
  sentenceCase,
  mimeTypeFromDataUrl,
  diff,
  get,
  template,
  createGraphQLPlaygroundUrl,
  fetchRecapthcaToken,
  isPrivateIp,
  getReactElement
};

// see: https://github.com/graphql/graphql-playground/issues/1018#issuecomment-762935106
function createGraphQLPlaygroundUrl(
  query?: DocumentNode,
  variables?: object,
  tabName?: string
): URL {
  const jwt = localStorage.getItem('user-jwt') ?? localStorage.getItem('visitor-jwt');
  const baseUrl = 'https://api.duely.app';

  // tabs must be an array
  const tabsData = [
    {
      endpoint: baseUrl + '/graphql',
      name: tabName,
      // tab variables, NOTE: variables are unique in that they must be passed to the VariableEditor as a String, hence JSON.stringify
      variables: JSON.stringify(variables),
      headers: { authorization: `Bearer ${jwt}` },
      // tab query
      query: query && printGqlQuery(query)
    }
  ].map(removeUndefined);

  // create tabsQueryParam
  const tabsQueryParam = new URLSearchParams({
    tabs: JSON.stringify(tabsData)
  }).toString();

  // concat with baseUrl
  return new URL(`${baseUrl}?${tabsQueryParam}`);
}

function removeUndefined<T extends object>(obj: T) {
  return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1] !== undefined));
}

function hasProperty<T, TKey extends PropertyKey>(
  obj: T,
  propertyName: TKey
): obj is T & Record<TKey, unknown> {
  return typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, propertyName);
}

// see: https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
async function readFileAsDataUrl(file: File | null | undefined): Promise<string | null> {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = reject;
      reader.onload = async () => {
        if (!reader.result) {
          reject(new Error('Unable to read file as Data-URL.'));
          return;
        }

        const dataUrl = reader.result as string;
        resolve(dataUrl);
      };
    } catch (err: any) {
      reject(err);
    }
  });
}

async function readFileAsImageInput(file: File | null | undefined): Promise<ImageInput | null> {
  if (!file) return null;
  const dataUrl = await readFileAsDataUrl(file);
  if (!dataUrl) return null;
  const color = (await estimateImageColor(dataUrl)) ?? '#ffffff';
  return {
    name: file.name,
    data: dataUrl,
    color
  };
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

function dataUriFromSvg(svg: string): string {
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
  if (size < 1000) return `${size.toFixed(0)}B`;

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

function mimeTypeFromDataUrl(dataUrl: string) {
  return dataUrl.substr(5, dataUrl.indexOf(';') - 5);
}

function diff(fromObject: object, omitObject: object) {
  return Object.fromEntries(
    Object.entries(fromObject).filter(
      ([key, value]) => omitObject?.[key as keyof typeof omitObject] !== value
    )
  );
}

type NestedDictionary = {
  [key: string]: NestedDictionary | any;
};

function get(obj: NestedDictionary, path: string): string | null | undefined {
  return path
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\./, '')
    .split('.')
    .reduce(
      (prev, key) => (prev as NestedDictionary)?.[key] as NestedDictionary,
      obj
    ) as unknown as string | null | undefined;
}

function template(template: string, variables: Record<string, any>) {
  return template.replace(
    /{(.*?)}/g,
    (_, placeholder) => get(variables, placeholder)?.toString() ?? placeholder
  );
}

declare global {
  interface Window {
    __duely: {
      reCAPTCHA_site_key: string;
    };
    grecaptcha: any;
  }
}

function isPrivateIp(hostname: string) {
  var parts = hostname.split('.').map((part) => parseInt(part, 10));
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}

function fetchRecapthcaToken(action?: string): Promise<string | undefined> {
  return new Promise((resolve) => {
    if (
      !window.__duely.reCAPTCHA_site_key ||
      location.hostname === 'localhost' ||
      isPrivateIp(location.hostname)
    ) {
      resolve(undefined);
    }

    window.grecaptcha.ready(() => {
      return window.grecaptcha
        .execute(window.__duely.reCAPTCHA_site_key, { action: action ?? 'submit' })
        .then(function (token: string) {
          resolve(token);
        });
    });
  });
}

function getReactElement(node: React.ReactNode, props?: Record<string, any>) {
  return typeof node === 'function' ? node(props) : node;
}
