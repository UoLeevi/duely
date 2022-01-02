import React from 'react';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { DatePropertyValue, DateRangePropertyValue } from './dates';
import { IdPropertyValue } from './ids';

export const PropertyValue = Object.assign(PropertyValueRoot, {
  Date: DatePropertyValue,
  DateRange: DateRangePropertyValue,
  Id: IdPropertyValue
});

export type TextPropertyValueProps = {
  children: React.ReactNode;
};

export function PropertyValueRoot({ children }: TextPropertyValueProps) {
  const { loading } = useQueryState();

  if (loading) {
    return <SkeletonText />;
  }

  return <span>{children}</span>;
}
