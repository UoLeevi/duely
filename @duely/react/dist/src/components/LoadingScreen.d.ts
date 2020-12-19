import React from 'react';
declare type LoadingScreenProps = {
    message?: string | null;
    children?: React.ReactNode;
};
export declare function LoadingScreen({ message, children }: LoadingScreenProps): React.ReactPortal | null;
export {};
