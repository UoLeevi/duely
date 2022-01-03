import React, { useRef } from 'react';
import { formatDate } from '@duely/util';
import { TimeConversionTooltip } from '../Tooltip';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';

export type DatePropertyValueProps = {
  children: Date;
  format?: string;
};

export function DatePropertyValue({ children, format }: DatePropertyValueProps) {
  const ref = useRef<HTMLElement>(null);
  const { loading } = useQueryState();

  if (loading) {
    return <SkeletonText ch={10} />;
  }

  format ??= 'mmm d, yyyy';
  return (
    <>
      <span ref={ref} className="underline underline-offset-2 hover:bg-black/5">
        {formatDate(children, format, { tz: 'local' })}
      </span>
      <TimeConversionTooltip elementRef={ref} date={children} />
    </>
  );
}

export type DateRangePropertyValueProps = {
  from: Date;
  to: Date;
};

export function DateRangePropertyValue({ from, to }: DateRangePropertyValueProps) {
  const fromRef = useRef<HTMLElement>(null);
  const toRef = useRef<HTMLElement>(null);
  const { loading } = useQueryState();

  if (loading) {
    return <SkeletonText ch={20} />;
  }

  return (
    <>
      <span ref={fromRef} className="underline underline-offset-2 hover:bg-black/5">
        {formatDate(from, 'mmm d', { tz: 'local' })}
      </span>
      <TimeConversionTooltip elementRef={fromRef} date={from} />
      <span> to </span>
      <span ref={toRef} className="underline underline-offset-2 hover:bg-black/5">
        {formatDate(to, 'mmm d, yyyy', { tz: 'local' })}
      </span>
      <TimeConversionTooltip elementRef={toRef} date={to} />
    </>
  );
}
