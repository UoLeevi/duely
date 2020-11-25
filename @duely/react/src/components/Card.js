import React from 'react';
import { Util } from '../util';

export function Card({ className, children }) {
  className = Util.createClassName(className, 'flex flex-col w-full bg-white border shadow-sm rounded-md');
  return (
    <div className={className}>
      {children}
    </div>
  );
}
