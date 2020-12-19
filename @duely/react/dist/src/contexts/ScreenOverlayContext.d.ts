import React, { ReactNode } from 'react';
export declare const ScreenOverlayContext: React.Context<React.MutableRefObject<HTMLElement | null> | null>;
declare type Props = {
    children: ReactNode;
};
export declare function ScreenOverlayContextProvider({ children }: Props): JSX.Element;
export declare function withScreenOverlayContext(Fn: React.ComponentType): JSX.Element;
export {};
