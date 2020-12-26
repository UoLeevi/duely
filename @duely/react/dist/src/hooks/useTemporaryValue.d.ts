export declare function useTemporaryValue<T>(durationMs: number): {
    value: T | undefined;
    setValue: (value: T) => void;
    reset: () => void;
};
