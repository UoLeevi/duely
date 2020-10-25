import { Suspense } from 'react';
import TopBar from 'components/TopBar';
import StartPasswordResetForm from 'components/StartPasswordResetForm';
import { AiOutlineLoading } from 'react-icons/ai';

export default function PasswordReset() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="container box-content h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <h2 className="text-form-title">Password reset</h2>
            <Suspense fallback={<AiOutlineLoading className="animate-spin text-xl text-indigo-500" />}>
              <StartPasswordResetForm />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
