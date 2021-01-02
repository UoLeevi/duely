import React from 'react';
declare type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    spinner?: boolean;
    loading?: boolean;
    dense?: boolean;
};
export declare function Button({ children, disabled, loading, spinner, dense, className, ...props }: ButtonProps): JSX.Element;
export {};
