import React from 'react';
import { Util } from '../../util';


export function SkeletonText({ ch, className }) {
  className = Util.createClassName(className, '');
  const style = {
    height: '1.7ex',
    width: `${ch || 20}ch`
  };

  return (
    <span className={className}>
      <span style={style} className="bg-gray-200 rounded-sm animate-pulse inline-block"></span>
      &nbsp;
    </span>
  );
}
