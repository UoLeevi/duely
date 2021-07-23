import { Link } from 'react-router-dom';
import { useQuery, current_agency_Q, image_Q, products_Q, count_products_Q } from '@duely/client';
import {
  Util,
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
  icons
} from '@duely/react';
import { ConfirmProductDeletionModal } from './components';
import { DashboardSection } from '../components';
import { Currency } from '@duely/core';

const statusColors = {
  draft: 'orange',
  live: 'green'
};

const wrap = {
  sm: {
    columns: 5,
    spans: [5, 2, 3]
  }
};

const headers = ['Product', 'Status', 'Action'];

export default function DashboardProductsHome() {
  const { data: agency, loading: agencyLoading, error: agencyError } = useQuery(current_agency_Q);
  const { sm } = useBreakpoints();
  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  type TProduct = NonNullable<ReturnType<typeof products_Q.result>> extends readonly (infer T)[]
    ? T
    : never;

  const pagination = usePagination<TProduct>({
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

  const columns = [
    // product name & description
    (product: TProduct | null) => {
      if (!product) {
        return (
          <div className="flex space-x-6">
            <div className="w-32 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-1"></div>

            <div className="flex flex-col space-y-1">
              <SkeletonText />
              <SkeletonParagraph className="max-w-sm text-xs" words={10} />
              <SkeletonText className="text-xs" />
            </div>
          </div>
        );
      }

      const { data: image_logo, loading: image_logoLoading } = useQuery(
        image_Q,
        { image_id: product.image_logo?.id! },
        { skip: !product.image_logo }
      );

      return (
        <div className="flex space-x-6">
          {image_logoLoading ? (
            <div className="w-32 h-20 bg-gray-200 rounded-lg animate-pulse flex-shrink-1"></div>
          ) : image_logo ? (
            <img
              className="object-cover w-32 h-20 rounded-lg flex-shrink-1"
              src={image_logo.data}
              alt={`${product.name} logo`}
            />
          ) : (
            <div className="w-32 h-20 bg-gray-200 rounded-lg flex-shrink-1"></div>
          )}

          <div className="flex flex-col space-y-1">
            <span className="font-medium">{product.name}</span>
            <p className="flex-1 max-w-sm text-xs text-gray-500">
              {Util.truncate(product.description ?? '', 120)}
            </p>
            <div className="flex items-center pb-1 space-x-3 text-xs text-gray-500 whitespace-nowrap">
              {product.default_price && (
                <span>
                  {Currency.format(
                    product.default_price.unit_amount,
                    product.default_price.currency as Currency
                  )}
                </span>
              )}

              <a
                className="px-1 rounded-sm hover:text-indigo-600 focus:outline-none focus-visible:text-indigo-600"
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
    },

    // product product status
    (product: TProduct | null) =>
      !product ? (
        <ColoredChip color={statusColors} />
      ) : (
        <ColoredChip color={statusColors} text={product.status} />
      ),

    // actions
    (product: TProduct | null) => {
      if (!product) {
        return <SkeletonText />;
      }

      const actions = [
        {
          key: 'edit',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <span className="flex items-center space-x-2 whitespace-nowrap">
              {icons.pencil}
              <span>Edit</span>
            </span>
          ),
          to: `products/${product.url_name}/edit`
        },
        {
          key: 'copy-checkout-url',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800 cursor-pointer',
          children: (
            <span className="flex items-center space-x-2 whitespace-nowrap">
              {icons.clipboard}
              <span>Copy checkout URL</span>
            </span>
          ),
          onClick: () =>
            navigator.clipboard.writeText(`https://${agency?.subdomain.name}.duely.app/checkout/${product.url_name}`)
        },
        {
          key: 'delete',
          className:
            'text-sm text-center text-gray-500 focus:text-gray-700 focus:outline-none hover:text-gray-800',
          children: (
            <span className="flex items-center space-x-2 whitespace-nowrap">
              {icons.trash}
              <span>Delete</span>
            </span>
          ),
          to: '?delete_product=' + product.id
        }
      ];

      return (
        <div className="flex space-x-6 font-medium">
          {sm && (
            <DropMenu>
              {actions.map((action) => (action.to ? <Link {...action} /> : <span {...action} />))}
            </DropMenu>
          )}

          {!sm &&
            actions.map((action) => (action.to ? <Link {...action} /> : <span {...action} />))}
        </div>
      );
    }
  ];

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
            columns={columns}
            headers={headers}
            wrap={wrap}
            loading={loading}
            error={error}
            pagination={pagination}
            footerPaginationControls
          />
        </Card>
      </DashboardSection>

      <ConfirmProductDeletionModal />
    </>
  );
}
