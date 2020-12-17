import React from 'react';
declare type SidebarProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
    topContent?: React.ReactNode;
    bottomContent?: React.ReactNode;
    links: {
        text: string;
        icon: React.ComponentType<{
            className: string;
        }>;
        exact?: boolean;
        to: string;
    }[];
};
export declare function Sidebar({ className, links, topContent, bottomContent }: SidebarProps): JSX.Element;
export {};
