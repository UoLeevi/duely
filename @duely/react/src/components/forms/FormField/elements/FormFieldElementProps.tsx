import { FormFieldRegisterOptions } from '@duely/react-form';

export type FormFieldElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = {
  name: TName;
  registerOptions?: FormFieldRegisterOptions<TFormFields[TName]>;
  loading?: boolean;
};
