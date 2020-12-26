import React from 'react';
import type { DeepPartial, SubmitHandler, UnpackNestedValue, UseFormMethods } from 'react-hook-form';
declare type FormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
    form: UseFormMethods<TFieldValues>;
    onSubmit: SubmitHandler<TFieldValues>;
    values?: UnpackNestedValue<DeepPartial<TFieldValues>>;
} & Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, 'onSubmit'>;
export declare function Form<TFieldValues extends Record<string, any> = Record<string, any>>({ form, onSubmit, values, children, ...props }: FormProps<TFieldValues>): JSX.Element;
export {};
