import type { ImageInput } from '@duely/core';
import React from 'react';
import type { RegisterOptions, UseFormMethods } from 'react-hook-form';
declare type FormFieldProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
    name: keyof TFieldValues;
    form: UseFormMethods<TFieldValues>;
    label?: React.ReactNode;
    registerOptions?: RegisterOptions;
    hint?: React.ReactNode;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    image?: ImageInput | null;
    actions?: React.ReactNode;
    loading?: boolean;
    options?: (string | {
        value?: string;
        element?: React.ReactNode;
        description?: React.ReactNode;
    })[];
} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> & React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'form'>;
export declare function FormField<TFieldValues extends Record<string, any> = Record<string, any>>({ name, label, form, type, registerOptions, hint, prefix, suffix, actions, loading, options, accept, image, className, ...props }: FormFieldProps<TFieldValues>): JSX.Element;
export {};
