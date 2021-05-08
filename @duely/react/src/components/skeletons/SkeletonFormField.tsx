import React from 'react';
import { Util } from '../../util';
import { LoadingBar } from '../LoadingBar';
import { SkeletonText } from './SkeletonText';

type SkeletonFormFieldProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  label?: string;
  className?: string;
  type?: string;
};

export function SkeletonFormField({ type, className, label, ...props }: SkeletonFormFieldProps) {
  let element;

  switch (type) {
    default: {
      element = (
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
          <input
            disabled
            type={type}
            className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
          />
        </div>
      );
    }
  }

  className = Util.createClassName('flex flex-col relative', className);

  return (
    <div className={className}>
      <div className="flex justify-between whitespace-nowrap">
        <span className="pb-1 pl-px text-sm font-medium text-gray-700">
          {label ?? <SkeletonText />}
        </span>
      </div>

      {element}

      <LoadingBar className="h-px px-1" loading={true} />

      <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-4"> </p>
    </div>
  );
}
