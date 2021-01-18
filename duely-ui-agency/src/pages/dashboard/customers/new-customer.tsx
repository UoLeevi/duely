import { Card } from '@duely/react';
import { DashboardSection } from '../components';
import { CreateCustomerForm } from './components';

export default function DashboardCustomersCreateCustomer() {
  return (
    <>
      <DashboardSection>
        <Card className="max-w-screen-sm px-6 py-4 sm:px-8 sm:py-6 xl:px-16 xl:py-10 xl:max-w-screen-md">
          <CreateCustomerForm />
        </Card>
      </DashboardSection>
    </>
  );
}
