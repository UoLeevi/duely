import { formatFileSize } from '@duely/util';

export namespace ValidationRules {
  export function maxFileSize(bytes: number) {
    return (fileList: FileList) =>
      fileList?.[0]?.size > bytes ? `Maximum image size is ${formatFileSize(bytes)}.` : undefined;
  }

  export function isNumber(value: string) {
    return isNaN(+value) ? 'Value is not a valid number.' : undefined;
  }

  export function isPositiveNumber(value: string) {
    return isNaN(+value) || +value < 0 ? 'Value is not a positive number.' : undefined;
  }

  export function isPositiveInteger(value: string) {
    return isNaN(+value) || !Number.isInteger(+value) ? 'Value is not a positive integer.' : undefined;
  }

  // see: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  export function isEmailAddress(value: string) {
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value
    )
      ? undefined
      : 'Invalid email address.';
  }
}
