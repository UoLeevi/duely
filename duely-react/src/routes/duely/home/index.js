import React from 'react';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Topbar from 'components/Topbar';
import TopbarActions from 'components/TopbarActions';
import DuelyLogo from 'components/DuelyLogo';

export default [
  {
    path: '/',
    element: (
      <ResponsiveLayout
        topbar={ 
          <Topbar className="gutter py-4">
            <div className="row center-v">
              <DuelyLogo />
              <h1 className="f-5 f-b pa-2">Duely</h1>
            </div>
            <TopbarActions />
          </Topbar>
        }
      />
    )
  }
];
