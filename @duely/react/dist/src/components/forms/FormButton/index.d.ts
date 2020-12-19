import React from 'react';
declare type FormButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    loading?: boolean;
    dense?: boolean;
};
export declare function FormButton({ children, type, disabled, loading, dense, className, ...props }: FormButtonProps): JSX.Element;
export {};
