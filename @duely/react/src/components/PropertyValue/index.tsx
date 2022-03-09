import React from 'react';
import { SkeletonText } from '..';
import { useQueryState } from '../Query';
import { DatePropertyValue, DateRangePropertyValue } from './dates';
import { IdPropertyValue } from './ids';
import { CustomerPropertyValue } from './customer';
import { ProductPropertyValue } from './product';
import { PricePropertyValue } from './price';
import { ImagePropertyValue } from './image';
import { SkeletonParagraph } from '../skeletons';
import { createClassName } from '@duely/util';
import { ChargePropertyValue } from './charge';
import { InvoicePropertyValue } from './invoice';
import { PayoutPropertyValue } from './payout';

export const PropertyValue = Object.assign(PropertyValueRoot, {
  Date: DatePropertyValue,
  DateRange: DateRangePropertyValue,
  Id: IdPropertyValue,
  Customer: CustomerPropertyValue,
  Product: ProductPropertyValue,
  Price: PricePropertyValue,
  Image: ImagePropertyValue,
  Charge: ChargePropertyValue,
  Invoice: InvoicePropertyValue,
  Payout: PayoutPropertyValue
});

export type TextPropertyValueProps = {
  children: React.ReactNode;
  className?: string;
  multiline?: boolean;
  ch?: number;
  words?: number;
};

export function PropertyValueRoot({
  children,
  multiline,
  ch,
  words,
  className
}: TextPropertyValueProps) {
  const { loading } = useQueryState();

  className = createClassName(
    className,
    'text-sm text-gray-700 dark:text-gray-300',
    multiline && 'inline-block'
  );

  if (loading) {
    return multiline ? (
      <SkeletonParagraph words={words} className={className} />
    ) : (
      <SkeletonText ch={ch} className={className} />
    );
  }

  return <span className={className}>{children}</span>;
}
