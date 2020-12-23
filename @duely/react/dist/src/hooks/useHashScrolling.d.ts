import React from 'react';
export declare function useHashScrolling<THTMLElement extends HTMLElement>(): [
    ref: (node: THTMLElement) => void,
    hashLink: React.ReactNode,
    hash: string | undefined
];
