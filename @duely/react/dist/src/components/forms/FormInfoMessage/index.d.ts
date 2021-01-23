import React from 'react';
declare type FormInfoMessageProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    success?: React.ReactNode;
    info?: React.ReactNode;
    error?: Error | React.ReactNode | {
        message?: string | null;
    };
};
export declare function FormInfoMessage({ success, info, error, children, className, ...props }: FormInfoMessageProps): JSX.Element;
export {};
