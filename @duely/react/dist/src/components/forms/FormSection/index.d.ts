import React from 'react';
declare type FormSectionProps = {
    title: React.ReactNode;
    description?: React.ReactNode;
    ref?: React.RefObject<HTMLElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
export declare function FormSection({ title, description, children, className, id, ...props }: FormSectionProps): JSX.Element;
export {};
