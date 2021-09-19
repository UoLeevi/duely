export type DataUrl<
  MimeType extends string = string,
  Data extends string = string
> = `data:${MimeType}${';base64' | ''},${Data}`;

export type Base64DataUrl<
  MimeType extends string = string,
  Data extends string = string
> = `data:${MimeType};base64,${Data}`;

export function dataUriFromSvg(svg: string): Base64DataUrl {
  return 'data:image/svg+xml;base64,' + btoa(svg) as Base64DataUrl;
}
