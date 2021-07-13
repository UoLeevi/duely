import { Route, RouteProps, Switch, useLocation } from 'react-router-dom';
import Dashboard from './dashboard';
import ThankYouPage from './orders/thank-you';
import NotFound from './not-found';
import { page_by_url_Q, current_subdomain_Q, useQuery, agency_Q, product_Q } from '@duely/client';
import { useMemo } from 'react';
import { pageBlockComponents } from '~/components/page-blocks';
import { ErrorScreen, LoadingScreen } from '@duely/react';
import LogIn from './log-in';
import SignUp from './sign-up';
import PasswordReset from './password-reset';

const routes: RouteProps[] = [
  {
    path: '/log-in',
    component: LogIn
  },
  {
    path: '/sign-up',
    component: SignUp
  },
  {
    path: '/password-reset',
    component: PasswordReset
  },
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
    url: `https://${subdomain?.name}.duely.app${location.pathname}`
  });

  const { data: agency, loading: agencyLoading } = useQuery(
    agency_Q,
    { agency_id: page?.agency.id! },
    { skip: !page }
  );

  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: page?.product?.id! },
    { skip: !page || !page?.product }
  );

  const loading = pageLoading || agencyLoading || productLoading;

  const element = useMemo(
    () =>
      loading || !page || page.blocks.length === 0 ? null : (
        <>
          {page.blocks.map((block) => {
            const definition = block.definition;
            const Component = pageBlockComponents[definition.name];
            const data = JSON.parse(block.data);
            return (
              <Component key={block.id} page={page} agency={agency} product={product} {...data} />
            );
          })}
        </>
      ),
    [agency, loading, page, product]
  );

  if (loading) return <LoadingScreen />;
  if (pageError) return <ErrorScreen />;

  return element ?? <NotFound />;
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
