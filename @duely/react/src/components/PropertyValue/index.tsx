import React from 'react';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { DatePropertyValue, DateRangePropertyValue } from './dates';
import { IdPropertyValue } from './ids';
import { CustomerPropertyValue } from './customer';
import { ProductPropertyValue } from './product';
import { PricePropertyValue } from './price';

export const PropertyValue = Object.assign(PropertyValueRoot, {
  Date: DatePropertyValue,
  DateRange: DateRangePropertyValue,
  Id: IdPropertyValue,
  Customer: CustomerPropertyValue,
  Product: ProductPropertyValue,
  Price: PricePropertyValue
});

export type TextPropertyValueProps = {
  children: React.ReactNode;
};

export function PropertyValueRoot({ children }: TextPropertyValueProps) {
  const { loading } = useQueryState();

  const className = 'text-sm text-gray-700 dark:text-gray-300';

  if (loading) {
    return <SkeletonText className={className} />;
  }

  return <span className={className}>{children}</span>;
}
