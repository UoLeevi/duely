import React from 'react';
export declare const ViewportContext: React.Context<{
    width: number;
    height: number;
}>;
declare type Props = {
    children: React.ReactNode;
};
export declare function ViewportContextProvider({ children }: Props): JSX.Element;
export declare function withViewportContext(Fn: React.ComponentType): JSX.Element;
export {};
