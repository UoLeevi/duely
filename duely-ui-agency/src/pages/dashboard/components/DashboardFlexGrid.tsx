import React from 'react';

type DashboardFlexGridProps = {
  children: React.ReactNode;
};

export function DashboardFlexGrid({ children }: DashboardFlexGridProps) {
  children = React.Children.map(children, (child) => (
    <div className="box-border flex w-full sm:w-1/2 md:w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4">
      <div className="flex flex-1 m-3">{child}</div>
    </div>
  ));

  return <div className="flex flex-row flex-wrap -m-3">{children}</div>;
}
