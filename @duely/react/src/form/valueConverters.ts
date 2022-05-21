import { dateToTimestamp, timestampToDate } from '@duely/util';
import { FormFieldRawValueGet } from './FormFieldControl';

export const ValueConverters = {
  timestamp: {
    get: (value: FormFieldRawValueGet) => dateToTimestamp(value?.valueAsDate ?? undefined),
    set: (value: number | null | undefined) => timestampToDate(value ?? undefined)
  },
  number: {
    get: (value: FormFieldRawValueGet) => (!value || value.value === '' ? undefined : +value.value),
    set: (value: number | null | undefined) => (value == null ? undefined : value.toString())
  }
};
