import {
  current_subdomain_Q,
  service_and_agency_from_url_parts_Q,
  service_Q,
  update_service_M,
  useMutation,
  useQuery
} from '@duely/client';
import { Card, FormButton, FormErrorInfo, FormField } from '@duely/react';
import useImage from 'hooks/useImage';
import { FormSection } from 'pages/dashboard/components/FormSection';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';

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
            {service && <UpdateServiceBasicInfoFrom service_id={service.id} />}
          </FormSection>
        </Card>
        <Card>
          <FormSection
            title="Pricing"
            description="Service pricing can be set to either a one-time payment or a subscription."
          >
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}

type ServiceProps = {
  service_id: string;
};

function UpdateServiceBasicInfoFrom({ service_id }: ServiceProps) {
  const form = useForm();
  const { data: service, loading: serviceLoading } = useQuery(service_Q, { service_id });
  const [updateService, stateUpdate] = useMutation(update_service_M);

  const state = {
    loading: serviceLoading || stateUpdate.loading,
    error: stateUpdate.error,
    success: stateUpdate.data?.success
  };

  // image logo
  const current_image_logo = service?.default_variant.image_logo;
  const image_logo_file = form.watch('image_logo_file_list')?.[0];
  const imageLogo = useImage({ file: image_logo_file, image: current_image_logo });

  useEffect(() => {
    if (!service) return;
    form.setValue('name', service.name);
    form.setValue('description', service.default_variant.description);
    form.setValue('url_name', service.url_name);
  }, [form, service]);

  async function onSubmit({ ...data }) {
    const res_service = await updateService({ service_id, ...data });

    if (!res_service?.success) return;
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <FormField
          form={form}
          label="Service name"
          className="max-w-xl"
          name="name"
          type="text"
          validateRule={{ required: true }}
        />
        <FormField
          form={form}
          label="URL friendly name"
          className="max-w-xl"
          name="url_name"
          type="text"
          prefix={`/`}
          hint="How would you like the service name to appear in URLs"
          validateRule={{ required: true }}
        />
        <FormField
          form={form}
          label="Description"
          className="max-w-xl"
          name="description"
          type="textarea"
          rows={5}
          validateRule={{ required: true }}
        />
        <FormField
          form={form}
          label="Logo image"
          className="max-w-xl"
          name="image_logo_file_list"
          type="image"
          loading={imageLogo.loading}
          src={imageLogo.data ?? undefined}
          accept="image/jpeg, image/png"
          hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
          validateRule={{ required: true }}
        />

        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton dense loading={state.loading}>
            Save
          </FormButton>
          <FormErrorInfo error={state.error} />
        </div>
      </form>
    </>
  );
}
