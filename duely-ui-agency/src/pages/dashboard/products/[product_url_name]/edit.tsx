import { current_subdomain_Q, product_and_agency_from_url_parts_Q, useQuery } from '@duely/client';
import { Card, FormSection } from '@duely/react';
import { Link, useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { UpdateProductBasicInfoForm } from './components';
import { UpdateProductCheckoutSettingsForm } from './components/UpdateProductCheckoutSettingsForm';
import { UpdateProductPricingForm } from './components/UpdateProductPricingForm';
import { UpdateProductStatusForm } from './components/UpdateProductStatusForm';

export default function DashboardProductsEditProduct() {
  const { product_url_name } = useParams<{ product_url_name: string }>();

  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const { data: product, loading: productLoading } = useQuery(product_and_agency_from_url_parts_Q, {
    subdomain_name: current_subdomain?.name!,
    product_url_name
  });

  return (
    <>
      <DashboardSection title={product?.name} loading={productLoading}>
        <Card>
          <FormSection
            title="Basic information"
            description="Name, description, image and URL name for the product."
          >
            {product && <UpdateProductBasicInfoForm product_id={product.id} />}
          </FormSection>
        </Card>

        <Card>
          <FormSection
            title="Pricing"
            description="Product pricing can be set to either a one-time payment or a subscription."
          >
            {product && <UpdateProductPricingForm product_id={product.id} />}
          </FormSection>
        </Card>

        <Card>
          <FormSection
            title="Checkout"
            description={
              <span>
                By default, after a successful checkout, customers will be redirected to a default
                thank you page hosted on Duely. Alternatively, you can set custom URLs for the thank
                you pages.
                <br />
                <br />
                Custom thank you page URL can be set on both agency level and on product level. If
                the thank you page URL is set on both agency level and product level, the product
                level setting will be used. To set the thank you page URL on the agency level,
                please see the{' '}
                <Link className="text-indigo-600" to="/dashboard/settings#checkout">
                  {' '}
                  checkout settings for the agency
                </Link>
                .
              </span>
            }
          >
            {product && <UpdateProductCheckoutSettingsForm product_id={product.id} />}
          </FormSection>
        </Card>

        <Card>
          <FormSection
            title="Status"
            description={
              <span>
                Product can be published by setting the status as{' '}
                <span className="italic">live</span> or unpublished by setting the status as{' '}
                <span className="italic">draft</span>.
              </span>
            }
          >
            {product && <UpdateProductStatusForm product_id={product.id} />}
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}