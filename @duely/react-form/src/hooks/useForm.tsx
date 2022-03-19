import { useMemo, useState } from 'react';
import { FieldArrayItem, FormControl, FormRegisterOptions } from '../FormControl';
import { FormFieldHTMLElement, FormFieldRegisterOptions } from '../FormFieldControl';

export type UseFormReturn<TFormFields extends Record<string, any> = Record<string, any>> = {
  control: FormControl<TFormFields>;
  id: string;
  register(options: FormRegisterOptions<TFormFields>): {
    id: string;
    ref(el: HTMLFormElement): void;
  };
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
  ):
    | {
        isDirty: boolean;
        isTouched: boolean;
        error: string | null;
      }
    | undefined;
  useFormFieldValue<TName extends string & keyof TFormFields>(
    name: TName
  ): TFormFields[TName] | undefined;
  useFieldArrayValue<TName extends string & keyof TFormFields>(
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
      items: TItem[] | undefined | null;
      loading?: boolean;
      returnTrueValues?: boolean;
    }
  ): {
    fields: FieldArrayItem<TItem>[];
    addItem: () => void;
    removeItem: (item: number | string) => void;
  };
  requestSubmit(): void;
  reset(defaultValues?: Partial<TFormFields>): void;
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
      id: control.id,
      register: control.register.bind(control),
      unregister: control.unregister.bind(control),
      useFormFieldState: control.useFormFieldState.bind(control),
      useFormFieldValue: control.useFormFieldValue.bind(control),
      useFieldArrayValue: control.useFieldArrayValue.bind(control),
      useFormValue: control.useFormValue.bind(control),
      useFormState: control.useFormState.bind(control),
      useFieldArray: control.useFieldArray.bind(control) as any,
      requestSubmit: control.requestSubmit.bind(control),
      reset: control.reset.bind(control),
      setValue: control.setValue.bind(control),
      setDefaultValue: control.setDefaultValue.bind(control)
    }),
    []
  );
}
