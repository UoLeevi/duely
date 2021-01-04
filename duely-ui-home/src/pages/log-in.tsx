import { LogInForm } from '@duely/react';
import TopBar from 'components/TopBar';
import { useLocation } from 'react-router-dom';

export default function LogIn() {
  const location = useLocation<{ redirectTo?: string }>();
  const { redirectTo } = location?.state ?? {};

  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <h2 className="self-center text-xl font-semibold text-gray-700">Log in</h2>
            <LogInForm redirectTo={redirectTo} />
          </div>
        </main>
      </div>
    </div>
  );
}
