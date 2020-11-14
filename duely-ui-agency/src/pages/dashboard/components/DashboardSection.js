import React from 'react';

export function DashboardSection({ title, children }) {
  return (
    <div className="p-3 xl:p-5 space-y-3">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <div>
        {children}
      </div>
    </div>
  );
}
