import React from 'react';
declare type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    loading?: boolean;
    spinner?: boolean;
};
export declare function Button({ children, disabled, loading, spinner, className, ...props }: ButtonProps): JSX.Element;
export {};
