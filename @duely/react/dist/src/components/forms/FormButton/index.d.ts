import React from 'react';
import { UseFormMethods } from 'react-hook-form';
declare type FormButtonProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
    form: UseFormMethods<TFieldValues>;
    spinner?: boolean;
    loading?: boolean;
    dense?: boolean;
} & Omit<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'form'>;
export declare function FormButton<TFieldValues extends Record<string, any> = Record<string, any>>({ form, children, type, disabled, loading, spinner, dense, className, ...props }: FormButtonProps<TFieldValues>): JSX.Element;
export {};
