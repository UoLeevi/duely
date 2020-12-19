export declare const Util: {
    processImageFile: typeof processImageFile;
    processFile: typeof processFile;
    estimateImageColor: typeof estimateImageColor;
    dataUriFromSvg: typeof dataUriFromSvg;
    byteToHex: typeof byteToHex;
    hexToByte: typeof hexToByte;
    hsl2rgb: typeof hsl2rgb;
    hex2rgb: typeof hex2rgb;
    hex2hsl: typeof hex2hsl;
    rgb2hsl: typeof rgb2hsl;
    createClassName: typeof createClassName;
    formatDate: typeof formatDate;
    formatFileSize: typeof formatFileSize;
    findFirstFocusableChild: typeof findFirstFocusableChild;
    getNameInitials: typeof getNameInitials;
    pseudoRandom: typeof pseudoRandom;
    poisson: typeof poisson;
    truncate: typeof truncate;
};
declare function processImageFile(file: File | null | undefined, options?: {
    estimateColor: boolean;
}): Promise<{
    url: string | null;
    data: string | null;
    color?: string | undefined;
} | null>;
declare function processFile<T = string | null>(file: File | null | undefined, decoder?: (data: string | null) => T): Promise<{
    url: string | null;
    data: T | string | null;
} | null>;
declare function estimateImageColor(url: string): Promise<string>;
declare function dataUriFromSvg(svg: string): string;
declare function byteToHex(x: number): string;
declare function hexToByte(x: string): number;
declare function hsl2rgb(h: number, s: number, l: number): number[];
declare function hex2rgb(hex: string): [number, number, number, number];
declare function hex2hsl(hex: string): (number | undefined)[];
declare function rgb2hsl(r: number, g: number, b: number, a?: number): (number | undefined)[];
declare function createClassName(...classNames: any[]): string;
declare function formatDate(d: Date): string;
declare function formatFileSize(size: number): string | undefined;
declare function findFirstFocusableChild(parent: ParentNode): Element | null;
declare function getNameInitials(name: string): string;
declare function pseudoRandom(seed?: number): number;
declare function poisson(mean: number, generateRandom?: () => number): number;
declare function truncate(text: string, maxLength: number): string;
export {};
