import { useMemo, useState } from 'react';
import { FieldArrayItem, FormControl } from '../FormControl';
import { FormFieldHTMLElement, FormFieldRegisterOptions } from '../FormFieldControl';

export type UseFormReturn<TFormFields extends Record<string, any> = Record<string, any>> = {
  control: FormControl<TFormFields>;
  register<TName extends string & keyof TFormFields>(
    name: TName,
    options?: FormFieldRegisterOptions<TFormFields[TName]>
  ): {
    name: string;
    ref(el: FormFieldHTMLElement | null): void;
  };
  unregister<TName extends string & keyof TFormFields>(name: TName): void;
  useFormFieldState<TName extends string & keyof TFormFields>(
    name: TName
  ): {
    isDirty: boolean;
    isTouched: boolean;
    error: string | null;
  };
  useFormFieldValue<TName extends string & keyof TFormFields>(
    name: TName
  ): TFormFields[TName] | undefined;
  useFormValue(): Partial<TFormFields>;
  useFormState(): {
    isDirty: boolean;
    isSubmitting: boolean;
  };
  useFieldArray<
    TName extends string & keyof TFormFields,
    TItem,
    TKeyField extends string & keyof TItem
  >(
    name: TName,
    bind?: {
      keyField: TKeyField | ((item: TItem) => string);
      items: TItem[] | undefined;
      loading?: boolean;
    }
  ): {
    fields: FieldArrayItem<TItem>[];
    addItem: () => void;
    removeItem: (item: number | string) => void;
  };
  reset(defaultValues?: Partial<TFormFields>): void;
  handleSubmit(
    onSubmit: (
      data: TFormFields,
      event?: React.BaseSyntheticEvent<object, any, any> | undefined
    ) => any | Promise<any>
  ): (event?: React.BaseSyntheticEvent<object, any, any> | undefined) => Promise<void>;
  setValue<TName extends string & keyof TFormFields>(name: TName, value: TFormFields[TName]): void;
  setDefaultValue<TName extends string & keyof TFormFields>(
    name: TName,
    value: TFormFields[TName]
  ): void;
};

export function useForm<TFormFields extends Record<string, any> = Record<string, any>>(options?: {
  defaultValues?: Partial<TFormFields>;
}): UseFormReturn<TFormFields> {
  const control = useState(() => new FormControl<TFormFields>(options))[0];
  return useMemo(
    () => ({
      control,
      register: control.register.bind(control),
      unregister: control.unregister.bind(control),
      useFormFieldState: control.useFormFieldState.bind(control),
      useFormFieldValue: control.useFormFieldValue.bind(control),
      useFormValue: control.useFormValue.bind(control),
      useFormState: control.useFormState.bind(control),
      useFieldArray: control.useFieldArray.bind(control) as any,
      reset: control.reset.bind(control),
      handleSubmit: control.handleSubmit.bind(control),
      setValue: control.setValue.bind(control),
      setDefaultValue: control.setDefaultValue.bind(control)
    }),
    []
  );
}
