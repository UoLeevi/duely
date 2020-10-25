import { Suspense } from 'react';
import TopBar from 'components/TopBar';
import LogInForm from 'components/LogInForm';
import { AiOutlineLoading } from 'react-icons/ai';

export default function LogIn() {
  return (
    <div className="relative min-h-screen h-full bg-white pt-12 md:pt-16 flex flex-col">
      <TopBar />
      <div className="container box-content h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="w-full max-w-xs mx-auto flex flex-col space-y-4">
            <h2 className="font-bold text-xl text-gray-900 self-center">Log in</h2>
            <Suspense fallback={<AiOutlineLoading className="animate-spin text-xl text-indigo-500" />}>
              <LogInForm />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
