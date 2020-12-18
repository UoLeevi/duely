import React from 'react';
import type { RegisterOptions, UseFormMethods } from 'react-hook-form';
declare type FormFieldProps = {
    name: string;
    label?: React.ReactNode;
    form: UseFormMethods<Record<string, any>>;
    validateRule?: RegisterOptions;
    hint?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    actions?: React.ReactNode;
    loading?: boolean;
    options?: (string | {
        value?: string;
        element?: React.ReactNode;
        description?: React.ReactNode;
    })[];
} & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;
export declare function FormField({ name, label, form, type, validateRule, hint, prefix, suffix, actions, loading, options, accept, src, className, ...props }: FormFieldProps): JSX.Element;
export {};
