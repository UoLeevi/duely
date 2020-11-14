import {
  DashboardCard,
  DashboardSection
} from '../components';
import { CreateServiceForm } from './components';

export default function DashboardServicesCreateService() {
  return (
    <>
      <DashboardSection>
        <DashboardCard className="px-8 xl:px-16 py-6 xl:py-10">
          <h2 className="text-xl font-medium mb-3">Create a service</h2>
          <CreateServiceForm />
        </DashboardCard>
      </DashboardSection>
    </>
  );
}
