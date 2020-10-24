import Head from 'next/head';
import Link from 'next/link';
import TopBar from '@/components/TopBar';

export default function Home() {
  return (
    <>
      <Head>
        <title>Duely - Home</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/index.css" />
      </Head>

      <div className="relative min-h-screen h-full bg-white pt-12 md:pt-16 flex flex-col">
        <TopBar />
        <div className="container box-content h-full px-3 md:px-4 mx-auto flex flex-col flex-1 space-y-6">
          <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
            <div className="flex flex-col items-center">
              <div className="font-bold text-gray-500 text-xl sm:text-2xl leading-none mb-3">Duely</div>
              <h3 className="font-bold text-4xl sm:text-5xl md:text-6xl text-center leading-tight">
                <span>Platform for</span><br />
                <span className="font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-green-500">digital agencies</span></h3>
              <Link href="/sign-up">
                <button className="mt-6 bg-indigo-500 px-5 py-3 rounded text-md font-medium leading-5 text-white transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50">Request early access</button>
              </Link>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
