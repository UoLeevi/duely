import React from 'react';
declare type ErrorScreenProps = {
    error?: Error | string | null;
    message?: string | null;
    children?: React.ReactNode;
};
export declare function ErrorScreen({ error, message, children }: ErrorScreenProps): React.ReactPortal | null;
export {};
