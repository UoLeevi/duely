/// <reference types="react" />
declare type useDynamicNavigationArgs = {
    resolveUrl?: () => Promise<string | URL>;
    passAccessToken?: boolean;
    replace?: boolean;
    local?: boolean;
};
export declare function useDynamicNavigation<T>({ resolveUrl, passAccessToken, replace, local }?: useDynamicNavigationArgs): React.ReactEventHandler<T>;
export {};
