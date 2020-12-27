import { current_subdomain_Q, service_and_agency_from_url_parts_Q, useQuery } from '@duely/client';
import { Card, FormSection } from '@duely/react';
import { Link, useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { UpdateServiceBasicInfoForm } from './components';
import { UpdateServiceCheckoutSettingsForm } from './components/UpdateServiceCheckoutSettingsForm';
import { UpdateServicePricingForm } from './components/UpdateServicePricingForm';

export default function DashboardServicesEditService() {
  const { service_url_name } = useParams<{ service_url_name: string }>();

  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const { data: service, loading: serviceLoading } = useQuery(service_and_agency_from_url_parts_Q, {
    subdomain_name: current_subdomain?.name!,
    service_url_name
  });

  return (
    <>
      <DashboardSection title={service?.name} loading={serviceLoading}>
        <Card>
          <FormSection
            title="Basic information"
            description="Name, description, image and URL name for the service."
          >
            {service && <UpdateServiceBasicInfoForm service_id={service.id} />}
          </FormSection>
        </Card>

        <Card>
          <FormSection
            title="Pricing"
            description="Service pricing can be set to either a one-time payment or a subscription."
          >
            {service && <UpdateServicePricingForm service_id={service.id} />}
          </FormSection>
        </Card>

        <Card>
          <FormSection
            title="Checkout"
            description={
              <span>
                By default, after a successful checkout, customers will be redirected to a default thank you page hosted on Duely. Alternatively, you can set custom URLs for the thank you pages.<br/><br/>
                Custom thank you page URL can be set on both agency level and on service level. If the thank you page URL is set on both agency level and service level, the service level setting will be used. To set the thank you page URL on the agency level, please see the <Link className="text-indigo-600" to="/dashboard/settings#checkout"> checkout settings for the agency</Link>.
              </span>
            }
          >
            {service && <UpdateServiceCheckoutSettingsForm service_id={service.id} />}
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}
