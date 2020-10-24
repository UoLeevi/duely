import Head from 'next/head';
import TopBar from '@/components/TopBar';
import SignUpForm from '@/components/SignUpForm';

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Duely - Sign up</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/index.css" />
      </Head>

      <div className="relative min-h-screen h-full bg-white pt-12 md:pt-16 flex flex-col">
        <TopBar />
        <div className="container box-content h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
          <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
            <div className="w-full max-w-xs mx-auto flex flex-col space-y-4">
              <h2 className="font-bold text-xl text-gray-900 self-center">Sign up</h2>
              <SignUpForm />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
