import React from 'react';

export function SkeletonText({ ch, className }) {
  const style = {
    height: '1.7ex',
    width: `${ch || 20}ch`
  };

  return (
    <span className={className}>
      <span style={style} className="bg-gray-200 rounded-sm animate-pulse inline-block"></span>
      <span> </span>
    </span>
  );
}
