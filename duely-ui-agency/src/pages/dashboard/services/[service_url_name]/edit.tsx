import {
  current_subdomain_Q,
  service_and_agency_from_url_parts_Q,
  useQuery
} from '@duely/client';
import { Card, FormSection } from '@duely/react';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { UpdateServiceBasicInfoForm } from './components';
import { UpdateServicePricingForm } from './components/UpdateServicePricingForm';

export default function DashboardServicesEditService() {
  // const [createSetting, stateCreate] = useMutation(create_agency_thank_you_page_setting_M);
  // const [updateSetting, stateUpdate] = useMutation(update_agency_thank_you_page_setting_M);
  // const [deleteSetting, stateDelete] = useMutation(delete_agency_thank_you_page_setting_M);

  // const form = useForm<SettingsCheckoutSettingsFormValues>();

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
      </DashboardSection>
    </>
  );
}

