import React, { useId, useRef } from 'react';
import { createClassName, formatDate } from '@duely/util';
import { TimeConversionTooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';

export type DatePropertyValueProps = {
  children: Date;
  format?: string;
};

export function DatePropertyValue({ children, format }: DatePropertyValueProps) {
  const ref = useRef<HTMLElement>(null);
  const tooltipId = useId();
  const { loading } = useQueryState();
  const className = 'text-sm text-gray-700 dark:text-gray-300';

  format ??= 'mmm d, yyyy';

  if (loading) {
    return <SkeletonText className={className} ch={format.length} />;
  }

  return (
    <>
      <span
        data-tooltip={tooltipId}
        className={createClassName(
          className,
          'relative underline underline-offset-2 hover:bg-black/5'
        )}
      >
        {formatDate(children, format, { tz: 'local' })}
      </span>
      <TimeConversionTooltip id={tooltipId} date={children} />
    </>
  );
}

export type DateRangePropertyValueProps = {
  from: Date;
  to: Date;
};

export function DateRangePropertyValue({ from, to }: DateRangePropertyValueProps) {
  const fromTooltipId = useId();
  const toTooltipId = useId();
  const fromRef = useRef<HTMLElement>(null);
  const toRef = useRef<HTMLElement>(null);
  const { loading } = useQueryState();

  const className = 'text-sm text-gray-700 dark:text-gray-300';

  if (loading) {
    return <SkeletonText className={className} ch={20} />;
  }

  return (
    <span className={className}>
      <span
        data-tooltip={fromTooltipId}
        className="relative underline underline-offset-2 hover:bg-black/5"
      >
        {formatDate(from, 'mmm d', { tz: 'local' })}
      </span>
      <TimeConversionTooltip id={fromTooltipId} date={from} />
      <span> to </span>
      <span
        data-tooltip={toTooltipId}
        className="relative underline underline-offset-2 hover:bg-black/5"
      >
        {formatDate(to, 'mmm d, yyyy', { tz: 'local' })}
      </span>
      <TimeConversionTooltip id={toTooltipId} date={to} />
    </span>
  );
}
