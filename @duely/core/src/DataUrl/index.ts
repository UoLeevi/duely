export type DataUrl<MimeType extends string = string, Data extends string = string> = `data:${MimeType}${';base64' | ''},${Data}`;
export type Base64DataUrl<MimeType extends string = string, Data extends string = string> = `data:${MimeType};base64,${Data}`;
