import React from 'react';
declare type SkeletonParagraphProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
    words?: number;
    seed?: number;
};
export declare function SkeletonParagraph({ className, words, seed }: SkeletonParagraphProps): JSX.Element;
export {};
