import React, { useCallback, createContext, useContext } from 'react';
import { FormButton } from '../FormButton';
import { FormField } from '../FormField';
import { FormInfoMessage } from '../FormInfoMessage';
import { FormLabel } from '../FormLabel';
import { FormSection } from '../FormSection';
import { useForm, UseFormReturn } from '../hooks';

const FormContext = createContext<ReturnType<typeof useForm>>(undefined as any);

export const Form = Object.assign(FormRoot, {
  Field: FormField,
  Button: FormButton,
  InfoMessage: FormInfoMessage,
  Section: FormSection,
  Label: FormLabel
});

export function useFormContext() {
  return useContext(FormContext);
}

type FormProps<TFormFields extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFormFields>;
  onSubmit: (data: TFormFields, event?: SubmitEvent) => any | Promise<any>;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

function FormRoot<TFormFields extends Record<string, any> = Record<string, any>>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFormFields>) {
  const onReset = useCallback((e: Event) => {
    e.preventDefault();
    form.reset();
  }, []);

  return (
    <FormContext.Provider value={form as any}>
      <form {...form.register({ onSubmit, onReset })} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
