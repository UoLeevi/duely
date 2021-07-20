import { agency_pages_Q, current_agency_Q, product_Q, useQuery } from '@duely/client';
import {
  Card,
  useBreakpoints,
  LoadingScreen,
  ErrorScreen,
  Table,
  DropMenu,
  SkeletonText
} from '@duely/react';
import { Link } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { ColoredChip } from '../../components/ColoredChip';
import { ConfirmPagePublishModal } from './components';

type TItem = NonNullable<ReturnType<typeof agency_pages_Q.result>> extends readonly (infer T)[]
  ? T
  : never;

function PageColumn(page: TItem | null) {
  if (!page) {
    return (
      <div className="flex flex-col space-y-2">
        <SkeletonText className="text-sm" />
        <SkeletonText className="text-xs" />
      </div>
    );
  }

  const isProductLevelPage = !!page.product?.id;
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: page.product?.id! },
    { skip: !isProductLevelPage }
  );
  let path;
  const loading = productLoading;

  if (page.definition.name === 'Home') {
    path = '/';
  } else if (page.definition.name === 'Product') {
    path = `/products/${product?.url_name}`;
  } else {
    path = null;
  }

  return (
    <div className="flex w-64 space-x-6 min-w-max">
      <div className="flex flex-col space-y-1">
        <span className="font-medium">{page.definition.name} page</span>
        {loading && <SkeletonText className="text-sm" />}
        {!loading && (
          <Link to={path!} className="text-sm font-medium text-gray-500">
            {path}
          </Link>
        )}
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
  const {
    data: pages,
    loading: pagesLoading,
    error: pagesError
  } = useQuery(agency_pages_Q, { agency_id: agency?.id! }, { skip: !agency });

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
    (page: TItem | null) =>
      !page ? (
        <ColoredChip color={statusColors} text={'loading'} />
      ) : (
        <ColoredChip color={statusColors} text={page.access === 'PUBLIC' ? 'live' : 'draft'} />
      ),

    // actions
    (page: TItem | null) => {
      if (!page) {
        return <SkeletonText />;
      }

      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>Edit</span>
            </div>
          ),
          to: `pages/${page.id}`
        },
        {
          key: 'publish',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{page.access === 'PUBLIC' ? 'Unpublish' : 'Publish'}</span>
            </div>
          ),
          to: (page.access === 'PUBLIC' ? '?unpublish=' : '?publish=') + page.id
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
        <Card className="max-w-screen-lg space-y-4">
          <Table items={rows} columns={columns} headers={headers} wrap={wrap} />
        </Card>
      </DashboardSection>

      <ConfirmPagePublishModal />
    </>
  );
}
