import React from 'react';
declare type LoadingBarProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
    loading?: boolean;
};
export declare function LoadingBar({ loading, className, ...props }: LoadingBarProps): JSX.Element;
export {};
