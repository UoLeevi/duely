import { Card } from '@duely/react';
import { DashboardSection } from '../components';
import { CreateProductForm } from './components';

export default function DashboardProductsCreateProduct() {
  return (
    <>
      <DashboardSection>
        <Card className="px-6 py-4 sm:px-8 sm:py-6 xl:px-16 xl:py-10 max-w-screen-sm xl:max-w-screen-md">
          <h2 className="text-xl font-medium mb-3">Create a product</h2>
          <CreateProductForm />
        </Card>
      </DashboardSection>
    </>
  );
}
