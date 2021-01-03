import { agency_pages_Q, current_agency_Q, service_Q, useQuery } from '@duely/client';
import {
  Card,
  useBreakpoints,
  LoadingScreen,
  ErrorScreen,
  Table,
  DropMenu,
  SkeletonText
} from '@duely/react';
import { BsPencilSquare } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { ColoredChip } from '../../components/ColoredChip';

type TItem = NonNullable<ReturnType<typeof agency_pages_Q.result>> extends readonly (infer T)[]
  ? T
  : never;

function PageColumn(page: TItem) {
  const isServiceLevelPage = !!page.service?.id;
  const { data: service, loading: serviceLoading } = useQuery(
    service_Q,
    { service_id: page.service?.id! },
    { skip: !isServiceLevelPage }
  );
  let path;
  const loading = serviceLoading;

  if (page.definition.name === 'Home') {
    path = '/';
  } else if (page.definition.name === 'Service') {
    path = `/services/${service?.url_name}`;
  } else {
    path = null;
  }

  return (
    <div className="flex w-64 space-x-6 min-w-max">
      <div className="flex flex-col space-y-1">
        <span className="font-medium">{page.definition.name} page</span>
        {loading && <SkeletonText className="text-sm" />}
        {!loading && <Link to={path!} className="text-sm font-medium text-gray-500">{path}</Link>}
      </div>
    </div>
  );
}

const statusColors = {
  draft: 'orange',
  live: 'green'
};

const wrap = {
  columns: 5,
  spans: [5, 2, 3]
};

const headers = ['Page', 'Status', 'Action'];

export default function DashboardSitePagesHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const { data: pages, loading: pagesLoading, error: pagesError } = useQuery(
    agency_pages_Q,
    { agency_id: agency?.id! },
    { skip: !agency }
  );

  const loading = agencyLoading || pagesLoading;
  const error = agencyError ?? pagesError;

  const { sm } = useBreakpoints();

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen />;

  const rows = pages ?? [];

  const columns = [
    // name & description
    PageColumn,

    // status
    (page: TItem) => (
      <ColoredChip color={statusColors} text={page.access === 'PUBLIC' ? 'live' : 'draft'} />
    ),

    // actions
    (page: TItem) => {
      const actions = [
        {
          key: 'edit',
          className:
            'className="text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
              <BsPencilSquare />
              <span>Edit</span>
            </div>
          ),
          to: `pages/${page.id}`
        }
      ];

      return (
        <div className="flex space-x-6 font-medium">
          {sm && (
            <DropMenu>
              {actions.map((action) => (
                <Link {...action} />
              ))}
            </DropMenu>
          )}

          {!sm && actions.map((action) => <Link {...action} />)}
        </div>
      );
    }
  ];

  return (
    <>
      <DashboardSection title="Pages">
        <Card className="max-w-screen-lg px-6 py-4 space-y-4">
          <Table rows={rows} columns={columns} headers={headers} wrap={wrap} />
        </Card>
      </DashboardSection>
    </>
  );
}
