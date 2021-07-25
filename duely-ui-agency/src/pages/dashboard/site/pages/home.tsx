import { agency_pages_Q, current_agency_Q, product_Q, useQuery } from '@duely/client';
import {
  Card,
  useBreakpoints,
  LoadingScreen,
  ErrorScreen,
  Table,
  DropMenu,
  SkeletonText,
  ColoredChip,
  icons
} from '@duely/react';
import { Link } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { ConfirmPagePublishModal } from './components';

type TItem = NonNullable<ReturnType<typeof agency_pages_Q.result>> extends readonly (infer T)[]
  ? T
  : never;

const statusColors = {
  draft: 'orange',
  live: 'green'
};

const wrap = { lg: { columns: 5, spans: [5, 2, 3] } };

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

  return (
    <>
      <DashboardSection title="Pages">
        <Card className="max-w-screen-lg space-y-4">
          <Table items={rows} wrap={wrap}>
            <Table.Column header="Page">
              {(page: TItem | null) => {
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
              }}
            </Table.Column>

            <Table.Column header="Status">
              {(page: TItem | null) =>
                !page ? (
                  <ColoredChip color={statusColors} text={'loading'} />
                ) : (
                  <ColoredChip
                    color={statusColors}
                    text={page.access === 'PUBLIC' ? 'live' : 'draft'}
                  />
                )
              }
            </Table.Column>

            <Table.Column header="Action">
              {(page: TItem | null) => {
                if (!page) {
                  return <SkeletonText />;
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`pages/${page.id}`}>
                      Edit
                    </DropMenu.Item>

                    <DropMenu.Item
                      icon={icons.eye}
                      to={(page.access === 'PUBLIC' ? '?unpublish=' : '?publish=') + page.id}
                    >
                      {page.access === 'PUBLIC' ? 'Unpublish' : 'Publish'}
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>

      <ConfirmPagePublishModal />
    </>
  );
}
