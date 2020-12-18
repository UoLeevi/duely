import React from 'react';
declare type FormButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    loading?: boolean;
};
export declare function FormButton({ children, type, disabled, loading, className, ...props }: FormButtonProps): JSX.Element;
export {};
