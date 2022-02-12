import {
  agency_stripe_account_Q,
  current_subdomain_Q,
  product_and_agency_from_url_parts_Q,
  product_Q,
  useQuery
} from '@duely/client';
import { Box, ColoredChip, PropertyList, PropertyValue, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';

export * from './components';
export * from './edit';

export function DashboardProductsProduct() {
  const { product_url_name } = useParams<{ product_url_name: string }>();

  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const {
    data: product,
    loading: productLoading,
    query
  } = useQuery(product_and_agency_from_url_parts_Q, {
    subdomain_name: current_subdomain?.name!,
    product_url_name
  });

  return (
    <>
      <Query state={query} queryKey={query.queryDef}>
        <Box>
          <Box.Heading subheading="Product" as="h2" dynamic>
            <div className="flex items-baseline space-x-3">
              <span>
                <span>{product?.name}</span>
              </span>
              {product?.status !== 'live' && (
                <ColoredChip
                  dense
                  text={product?.status}
                  color={{
                    draft: 'orange'
                  }}
                />
              )}
            </div>
          </Box.Heading>

          {/* <PropertyList col>
            <PropertyList.Item label="Started">
              <PropertyValue.Date>{product?.start_date}</PropertyValue.Date>
            </PropertyList.Item>
          </PropertyList> */}
        </Box>

        <Box row>
          <Box.Heading as="h3">Details</Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Name">
              <PropertyValue>{product?.name}</PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="Description">
              <PropertyValue multiline words={20} className="max-w-[40ch]">
                {product?.description}
              </PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="ID">
              <PropertyValue.Id>{product?.id}</PropertyValue.Id>
            </PropertyList.Item>
          </PropertyList>
          <PropertyList>
            <PropertyList.Item label="Image">
              <PropertyValue.Image alt={`${product?.name} logo`}>
                {product?.image_logo?.id}
              </PropertyValue.Image>
            </PropertyList.Item>
          </PropertyList>
        </Box>
      </Query>
    </>
  );
}
