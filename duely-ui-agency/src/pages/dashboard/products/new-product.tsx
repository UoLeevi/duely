import { Card } from '@duely/react';
import { DashboardSection } from '../components';
import { CreateProductForm } from './components';

export default function DashboardProductsCreateProduct() {
  return (
    <>
      <DashboardSection>
        <Card className="max-w-screen-sm px-6 py-4 sm:px-8 sm:py-6 xl:px-10 xl:py-7 xl:max-w-screen-md">
          <CreateProductForm />
        </Card>
      </DashboardSection>
    </>
  );
}
