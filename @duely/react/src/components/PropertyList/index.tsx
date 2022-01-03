import { createClassName } from '@duely/util';
import React, { Fragment } from 'react';

export const PropertyList = Object.assign(PropertyListRoot, { Item: PropertyListItem });

type PropertyListItemProps = {
  label: React.ReactNode;
  children: React.ReactNode;
  bold?: boolean;
};

function PropertyListItem(props: PropertyListItemProps) {
  return null;
}

type PropertyListProps = {
  row?: boolean;
  col?: boolean;
  children:
    | React.ReactElement<PropertyListItemProps, typeof PropertyListItem>
    | React.ReactElement<PropertyListItemProps, typeof PropertyListItem>[];
};

function PropertyListRoot({ children, row, col }: PropertyListProps) {
  row ??= !col;
  col ??= !row;

  const itemDefinitions =
    React.Children.map(
      children,
      (child: React.ReactElement<PropertyListItemProps, typeof PropertyListItem>) => child.props
    ) ?? [];

  const className = createClassName(
    'grid gap-x-6 gap-y-2',
    row
      ? 'grid-flow-row auto-rows-auto grid-cols-[minmax(144px,_auto)_1fr]'
      : 'grid-flow-col auto-cols-[minmax(175px,_max-content)] grid-rows-2'
  );

  return (
    <div className={className}>
      {itemDefinitions.map((item, i) => (
        <Fragment key={i}>
          <div className={`text-sm text-gray-550 ${item.bold ? 'font-medium' : 'font-normal'}`}>
            {item.label}
          </div>
          <div
            className={`text-sm text-gray-700 dark:text-gray-300 ${
              item.bold ? 'font-medium' : 'font-normal'
            }`}
          >
            {item.children}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
