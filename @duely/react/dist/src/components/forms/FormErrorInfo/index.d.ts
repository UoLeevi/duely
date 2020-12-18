import React from 'react';
declare type FormErrorFieldProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    error?: Error | string | null;
};
export declare function FormErrorInfo({ error, className, ...props }: FormErrorFieldProps): JSX.Element | null;
export {};
