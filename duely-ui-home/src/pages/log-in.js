import { Suspense } from 'react';
import TopBar from 'components/TopBar';
import LogInForm from 'components/LogInForm';
import { AiOutlineLoading } from 'react-icons/ai';

export default function LogIn() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <h2 className="text-form-title">Log in</h2>
            <Suspense fallback={<AiOutlineLoading className="animate-spin text-xl text-indigo-500" />}>
              <LogInForm />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
