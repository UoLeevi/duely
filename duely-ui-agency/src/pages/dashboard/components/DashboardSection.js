import React from 'react';

export function DashboardSection({ title, children }) {
  return (
    <div className="flex flex-col sm:p-2 md:p-3 xl:p-5 space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div className="flex flex-col">
        {children}
      </div>
    </div>
  );
}
