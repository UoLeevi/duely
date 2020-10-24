import Head from 'next/head';
import TopBar from '@/components/TopBar';
import LogInForm from '@/components/LogInForm';

export default function LogIn() {
  return (
    <>
      <Head>
        <title>Duely - Log in</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/index.css" />
      </Head>

      <div className="relative min-h-screen h-full bg-white pt-12 md:pt-16 flex flex-col">
        <TopBar />
        <div className="container box-content h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
          <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
            <div className="w-full max-w-xs mx-auto flex flex-col space-y-4">
              <h2 className="font-bold text-xl text-gray-900 self-center">Log in</h2>
              <LogInForm />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
