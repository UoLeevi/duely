import { formatFileSize } from '@duely/util';
import { FormFieldRawValueGet } from './FormFieldControl';

export namespace ValidationRules {
  export function maxFileSize(bytes: number) {
    return (value: FormFieldRawValueGet) =>
      !value?.files || value.files[0]?.size > bytes
        ? `Maximum image size is ${formatFileSize(bytes)}.`
        : undefined;
  }

  export function isNumber(value: FormFieldRawValueGet) {
    return !value || isNaN(+value.value) ? 'Value is not a valid number.' : undefined;
  }

  export function isPositiveNumber(value: FormFieldRawValueGet) {
    return !value || isNaN(+value.value) || +value.value < 0
      ? 'Value is not a positive number.'
      : undefined;
  }

  export function isPositiveInteger(value: FormFieldRawValueGet) {
    return !value || isNaN(+value.value) || !Number.isInteger(+value.value)
      ? 'Value is not a positive integer.'
      : undefined;
  }

  // see: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address
  export function isEmailAddress(value: FormFieldRawValueGet) {
    return value &&
      /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        value.value
      )
      ? undefined
      : 'Invalid email address.';
  }
}
