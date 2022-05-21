import { FormFieldRegisterOptions } from '../../../../form/FormFieldControl';

export type FormFieldElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = {
  name: TName;
  registerOptions?: FormFieldRegisterOptions<TFormFields[TName]>;
  loading?: boolean;
};
