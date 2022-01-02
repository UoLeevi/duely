import { formatDate } from '@duely/util';
import React, { RefObject } from 'react';
import { Tooltip } from '.';

export type TimeConversionTooltipProps = {
  date: Date;
} & ({ id: string; elementRef?: undefined } | { id?: undefined; elementRef: RefObject<HTMLElement> });

export function TimeConversionTooltip({ date, ...props }: TimeConversionTooltipProps) {
  return (
    <Tooltip {...props} position="bottom center">
      <div className="grid grid-flow-row grid-cols-[auto_auto] text-xs">
        <div className="col-span-2 px-2 py-1 bg-gray-100">Time conversion</div>
        <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">UTC</div>
        <div className="py-1 pl-1 pr-2 border-t border-black/5">
          {formatDate(date, 'hh:nn - mmm d, yyyy', { tz: 'UTC' })}
        </div>
        <div className="py-1 pl-2 pr-1 font-medium border-t border-black/5">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </div>
        <div className="py-1 pl-1 pr-2 border-t border-black/5">
          {formatDate(date, 'hh:nn - mmm d, yyyy', { tz: 'local' })}
        </div>
      </div>
    </Tooltip>
  );
}
