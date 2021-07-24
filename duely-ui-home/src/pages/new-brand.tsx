import CreateBrandForm from '~/components/CreateBrandForm';
import { PageLayout } from '@duely/react';

export default function NewBrand() {
  return (
    <PageLayout>
      <div className="form-container">
        <CreateBrandForm />
      </div>
    </PageLayout>
  );
}
