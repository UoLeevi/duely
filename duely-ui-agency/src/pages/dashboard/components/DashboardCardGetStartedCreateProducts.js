import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@duely/react';

export function DashboardCardGetStartedCreateProducts() {
  return (
    <Card className="items-center px-10 py-6 space-y-4 text-center">
      <h2 className="text-xl font-medium">Create products</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">Start selling online by creating your first product.</p>
      <Link to="/dashboard/products/new-product" className="px-6 py-2 font-medium text-white bg-indigo-500 rounded-md shadow-sm">Create a product</Link>
    </Card>
  );
}
