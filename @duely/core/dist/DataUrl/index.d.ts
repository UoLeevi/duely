export declare type DataUrl<MimeType extends string = string, Data extends string = string> = `data:${MimeType}${';base64' | ''},${Data}`;
export declare type Base64DataUrl<MimeType extends string = string, Data extends string = string> = `data:${MimeType};base64,${Data}`;
