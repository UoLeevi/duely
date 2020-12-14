declare type useDynamicNavigationArgs = {
    resolveUrl?: () => Promise<string | URL>;
    passAccessToken?: boolean;
    replace?: boolean;
    local?: boolean;
};
export declare function useDynamicNavigation({ resolveUrl, passAccessToken, replace, local }?: useDynamicNavigationArgs): (e: Event | null) => Promise<void>;
export {};
