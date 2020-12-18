import React from 'react';

type SkeletonTextProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  ch?: number;
};

export function SkeletonText({ ch, className, ...props }: SkeletonTextProps) {
  const style = {
    height: '1.7ex',
    width: `${ch || 20}ch`
  };

  return (
    <span className={className} {...props}>
      <span style={style} className="inline-block bg-gray-200 rounded-sm animate-pulse"></span>
      <span> </span>
    </span>
  );
}
