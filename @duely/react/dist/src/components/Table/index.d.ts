import React from 'react';
import { useBreakpoints } from '../../hooks';
declare type TableProps<TItem> = {
    rows: TItem[] | undefined | null;
    columns: (((item: TItem, column: number) => React.ReactNode) | ((item: TItem) => React.ReactNode))[];
    headers: React.ReactNode[];
    dense?: boolean;
    breakpoint?: keyof ReturnType<typeof useBreakpoints>;
    wrap?: {
        columns: number;
        spans: number[];
    };
    loading?: boolean;
    error?: boolean | string | Error | {
        message: string;
    };
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
export declare function Table<TItem extends {
    key?: string | number | null;
    id?: string | number | null;
}>({ rows: items, columns, headers, className, dense, breakpoint, wrap: wrapOptions, loading, error }: TableProps<TItem>): JSX.Element;
export {};
