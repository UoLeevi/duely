import { createClassName } from '@duely/util';
import React, { Fragment } from 'react';

export const PropertyList = Object.assign(PropertyListRoot, { Item: PropertyListItem });

type PropertyListItemProps = {
  label: React.ReactNode;
  children: React.ReactNode;
};

function PropertyListItem(props: PropertyListItemProps) {
  return null;
}

type PropertyListProps = {
  vertical?: boolean;
  horizontal?: boolean;
  children:
    | React.ReactElement<PropertyListItemProps, typeof PropertyListItem>
    | React.ReactElement<PropertyListItemProps, typeof PropertyListItem>[];
};

function PropertyListRoot({ children, vertical, horizontal }: PropertyListProps) {
  vertical ??= !horizontal;
  horizontal ??= !vertical;

  const itemDefinitions =
    React.Children.map(
      children,
      (child: React.ReactElement<PropertyListItemProps, typeof PropertyListItem>) => ({
        label: child!.props.label,
        children: child!.props.children
      })
    ) ?? [];

  const className = createClassName(
    'grid gap-2',
    vertical
      ? 'grid-flow-row auto-rows-auto grid-cols-[minmax(160px,_auto)_1fr]'
      : 'grid-flow-col auto-cols-auto grid-rows-2'
  );

  return (
    <div className={className}>
      {itemDefinitions.map((item, i) => (
        <Fragment key={i}>
          <div className="text-sm font-normal text-gray-550">{item.label}</div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-300">
            {item.children}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
