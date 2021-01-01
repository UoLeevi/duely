import { Route, Switch, useLocation } from 'react-router-dom';
import Dashboard from './dashboard';
import ThankYouPage from './orders/thank-you';
import NotFound from './not-found';
import { page_by_url_Q, current_subdomain_Q, useQuery } from '@duely/client';
import React, { useMemo } from 'react';
import { pageBlockComponents } from 'components';
import { ErrorScreen, LoadingScreen } from '@duely/react';

const routes = [
  {
    path: '/orders/thank-you',
    component: ThankYouPage
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/',
    component: DynamicPage
  }
];

function DynamicPage() {
  const { data: subdomain } = useQuery(current_subdomain_Q);
  const location = useLocation();
  const { data: page, loading: pageLoading, error: pageError } = useQuery(page_by_url_Q, {
    url: `https://${subdomain!.name}.duely.app${location.pathname}`
  });

  const children = useMemo(
    () =>
      page?.blocks.map((block) => {
        const definition = block.definition;
        const Component =
          block && pageBlockComponents[definition.name as keyof typeof pageBlockComponents];
        const props = JSON.parse(block.data);
        return <Component key={block.id} {...props} />;
      }),
    [page]
  );

  if (pageLoading) return <LoadingScreen />;
  if (pageError) return <ErrorScreen />;

  return children && children.length > 0 ? <React.Fragment children={children} /> : <NotFound />;
}

export default function Pages() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route key={i} {...route} />
      ))}
    </Switch>
  );
}
