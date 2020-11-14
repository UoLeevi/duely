import React from 'react';

export function DashboardFlexGrid({ children }) {
  children = React.Children.map(children, child => (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 box-border flex">
      <div className="m-3 flex flex-1">
        {child}
      </div>
    </div>
  ));

  return (
    <div className="flex flex-row flex-wrap -m-3">
      {children}
    </div>
  );
}
