import { FormFieldRegisterOptions } from '@duely/react-form';

export type FormFieldElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = {
  name: TName;
  registerOptions?: FormFieldRegisterOptions<TFormFields[TName]>;
  loading?: boolean;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  hintOrInfoRef: React.MutableRefObject<React.ReactNode>;
};
