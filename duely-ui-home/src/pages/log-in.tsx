import { LogInForm } from '@duely/react';
import { useLocation } from 'react-router-dom';
import { PageLayout } from '@duely/react';

export default function LogIn() {
  const location = useLocation<{ redirectTo?: string }>();
  const { redirectTo } = location?.state ?? {};

  return (
    <PageLayout>
      <div className="form-container">
        <LogInForm redirectTo={redirectTo} />
      </div>
    </PageLayout>
  );
}
