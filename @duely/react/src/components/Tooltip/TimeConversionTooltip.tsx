import { formatDate } from '@duely/util';
import React from 'react';
import { Tooltip } from '.';

export type TimeConversionTooltipProps = {
  id: string;
  date: Date;
};

export function TimeConversionTooltip({ id, date }: TimeConversionTooltipProps) {
  return (
    <Tooltip id={id} position="bottom center">
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
