import { Card, LinkButton } from '@duely/react';

export function DashboardCardGetStartedCreateProducts() {
  return (
    <Card className="items-center px-10 py-6 space-y-4 text-center">
      <h2 className="text-xl font-medium">Create products</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">
        Start selling online by creating your first product.
      </p>
      <LinkButton dense to="/dashboard/products/new-product" color="indigo" className="text-sm">
        Create a product
      </LinkButton>
    </Card>
  );
}
