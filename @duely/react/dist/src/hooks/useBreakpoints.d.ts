declare const breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
};
export declare function useBreakpoints(): {
    [K in keyof typeof breakpoints]: boolean;
};
export {};
