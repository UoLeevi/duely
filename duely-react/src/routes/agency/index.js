import React from 'react';
import { query } from 'apollo';
import { subdomain } from 'routes';
import home from './home';
import portal from './portal';
import dashboard from './dashboard';
import AgencyRoot from 'components/AgencyRoot';

export default [
  {
    path: '/',
    element: <AgencyRoot />,
    children: [
      ...home,
      ...portal,
      ...dashboard,
    ],
    beforeEnter: () => query('agency', { subdomainName: subdomain })
  }
];
