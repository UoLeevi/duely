import { dateToTimestamp, timestampToDate } from '@duely/util';
import { FormFieldRawValueGet } from './FormFieldControl';

export const ValueConverters = {
  dateToTimestamp: {
    get: (value: FormFieldRawValueGet) => dateToTimestamp(value?.valueAsDate ?? undefined),
    set: (value: number | null | undefined) => timestampToDate(value ?? undefined)
  }
};
