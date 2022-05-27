import { createClassName } from '@duely/util';
import React, { useId, useRef } from 'react';
import { icons, SkeletonText, Tooltip, useQueryState } from '..';
import { useMessage } from '../../hooks';

export type IdPropertyValueProps = {
  children: React.ReactNode;
};

export function IdPropertyValue({ children }: IdPropertyValueProps) {
  const tooltipId = useId();
  const { showMessage } = useMessage();

  const { loading } = useQueryState();

  const className = 'text-sm text-gray-700 dark:text-gray-300';

  if (loading) {
    return <SkeletonText ch={32} className={className} />;
  }

  return (
    <div className="flex group">
      <span className={createClassName(className, 'font-mono')}>{children}</span>
      {children && (
        <>
          <span
            className="text-[0.8125rem] ml-2 transition-opacity opacity-0 pointer-events-none group-hover:opacity-60 group-hover:cursor-pointer group-hover:hover:opacity-100 group-hover:pointer-events-auto"
            data-tooltip={tooltipId}
            onClick={async () => {
              const id = children?.toString();
              if (!id) return;

              if (navigator.clipboard) {
                await navigator.clipboard.writeText(id);
                showMessage(
                  <div className="flex items-center space-x-3">
                    {icons['clipboard-check.solid']}
                    <span>Copied!</span>
                  </div>
                );
              } else {
                showMessage(
                  <div className="flex items-center space-x-3">
                    {icons['exclamation.solid']}
                    <span>Clipboard is not accessible!</span>
                  </div>
                );
              }
            }}
          >
            {icons['duplicate']}
          </span>
          <Tooltip id={tooltipId}>
            <span className="px-2 py-1 font-medium tracking-wide text-white bg-gray-600 rounded">
              Copy ID
            </span>
          </Tooltip>
        </>
      )}
    </div>
  );
}
