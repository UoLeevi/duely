import React from 'react';
import { Util } from '../../../util';
import { BsExclamationDiamondFill } from 'react-icons/bs';

export function FormErrorInfo({ error, className }) {
  if (!error) return null;

  className = Util.createClassName(
    'flex flex-row items-center justify-center text-red-400 space-x-3 font-semibold',
    className
  );

  return (
    <div className={className}>
      <BsExclamationDiamondFill />
      <p className="text-center text-sm">{error.message ?? error}</p>
    </div>
  );
}
