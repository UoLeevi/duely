import React from 'react';
declare type FormInfoMessageProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    success?: string | null;
    info?: string | null;
    error?: Error | string | null | {
        message?: string | null;
    };
};
export declare function FormInfoMessage({ success, info, error, className, ...props }: FormInfoMessageProps): JSX.Element;
export {};
