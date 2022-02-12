import { useQuery, current_agency_Q, products_Q, count_products_Q } from '@duely/client';
import {
  useBreakpoints,
  Table,
  DropMenu,
  Card,
  useDynamicNavigation,
  SkeletonText,
  SkeletonParagraph,
  usePagination,
  LinkButton,
  ColoredChip,
  icons,
  useMessage,
  PropertyValue
} from '@duely/react';
import { ConfirmProductDeletionModal } from './components';
import { DashboardSection } from '../components';
import { formatPrice, truncate } from '@duely/util';

const statusColors = {
  draft: 'orange',
  live: 'green'
};

export default function DashboardProductsHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();
  const { showMessage } = useMessage();
  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  type TProduct = NonNullable<ReturnType<typeof products_Q.result>> extends readonly (infer T)[]
    ? T
    : never;

  const pagination = usePagination<TProduct, 'id'>({
    getTotalNumberOfItems: () => {
      const {
        data: count_products,
        loading: count_productsLoading,
        error
      } = useQuery(
        count_products_Q,
        {
          filter: {
            agency_id: agency?.id!,
            active: true
          }
        },
        { skip: !agency }
      );

      return {
        count: count_products ?? -1,
        loading: agencyLoading || count_productsLoading,
        error
      };
    },
    getPageItems: ({ itemsPerPage, firstIndex }) => {
      const { data, loading, error } = useQuery(
        products_Q,
        {
          filter: {
            agency_id: agency?.id!,
            active: true
          },
          limit: itemsPerPage === 0 ? undefined : itemsPerPage,
          offset: firstIndex < 0 ? 0 : firstIndex
        },
        { skip: !agency }
      );

      return { items: data ?? [], loading, error };
    },
    itemsPerPage: 5
  });

  const loading = agencyLoading || pagination.loading;
  const error = agencyError ?? pagination.error;

  return (
    <>
      <DashboardSection
        title="Products"
        actions={
          <div className="flex flex-row justify-end">
            <LinkButton
              dense
              color="indigo"
              to="products/new-product"
              icon="plus.solid"
              className="text-sm"
            >
              New product
            </LinkButton>
          </div>
        }
      >
        <Card className="max-w-screen-lg">
          <Table
            wrap={{ sm: 2 }}
            loading={loading}
            error={error}
            pagination={pagination}
            keyField="id"
            rowLink={(product) => ({ to: `/dashboard/products/${product.url_name}` })}
          >
            <Table.Column header="Product" span={8}>
              {(product: TProduct | null) => {
                if (!product) {
                  return (
                    <div className="flex space-x-6">
                      <div className="flex-shrink-0 w-32 h-20 bg-gray-200 rounded-lg animate-pulse"></div>

                      <div className="flex flex-col space-y-1">
                        <SkeletonText />
                        <SkeletonParagraph className="max-w-sm text-xs" words={10} />
                        <SkeletonText className="text-xs" />
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="flex space-x-6">
                    <PropertyValue.Image alt={`${product?.name} logo`}>
                      {product?.image_logo?.id}
                    </PropertyValue.Image>

                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{product.name}</span>
                      <p className="flex-1 max-w-sm text-xs text-gray-500">
                        {truncate(product.description ?? '', 120)}
                      </p>
                      <div className="flex items-center pb-1 space-x-3 text-xs text-gray-500 whitespace-nowrap">
                        <span>
                          {product.prices?.length! > 1
                            ? `${product.prices?.length} prices`
                            : product.default_price && formatPrice(product.default_price)}
                        </span>

                        <a
                          className="relative px-1 rounded-sm hover:text-indigo-600 focus:outline-none focus-visible:text-indigo-600"
                          onClick={passAccessToken}
                          target={`preview ${product.url_name}`}
                          href={`https://${agency?.subdomain.name}.duely.app/checkout/${product.url_name}?preview`}
                        >
                          preview checkout
                        </a>
                      </div>
                    </div>
                  </div>
                );
              }}
            </Table.Column>

            <Table.Column header="Status" span={3}>
              {(product: TProduct | null) =>
                !product ? (
                  <ColoredChip color={statusColors} />
                ) : (
                  <ColoredChip color={statusColors} text={product.status} />
                )
              }
            </Table.Column>

            <Table.Column shrink span={2}>
              {(product: TProduct | null) => {
                if (!product) {
                  return (
                    <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>
                  );
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`products/${product.url_name}/edit`}>
                      Edit
                    </DropMenu.Item>

                    <DropMenu.Item
                      icon={icons.clipboard}
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `https://${agency?.subdomain.name}.duely.app/checkout/${product.url_name}`
                        );
                        showMessage('Copied!');
                      }}
                    >
                      Copy checkout URL
                    </DropMenu.Item>

                    <DropMenu.Item icon={icons.trash} to={'?delete_product=' + product.id}>
                      Delete
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>

      <ConfirmProductDeletionModal />
    </>
  );
}
