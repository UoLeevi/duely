import {
  DashboardCard,
  DashboardSection
} from '../components';
import { CreateServiceForm } from './components';

export default function DashboardServicesCreateService() {
  return (
    <>
      <DashboardSection>
        <DashboardCard className="px-6 py-4 sm:px-8 sm:py-6 xl:px-16 xl:py-10 max-w-screen-sm xl:max-w-screen-md">
          <h2 className="text-xl font-medium mb-3">Create a service</h2>
          <CreateServiceForm />
        </DashboardCard>
      </DashboardSection>
    </>
  );
}
