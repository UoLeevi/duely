import { StartPasswordResetForm } from '@duely/react';
import TopBar from '~/components/TopBar';

export default function PasswordReset() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <StartPasswordResetForm />
          </div>
        </main>
      </div>
    </div>
  );
}
