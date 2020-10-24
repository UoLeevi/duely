import Link from 'next/link';
import NavMenu from '@/components/NavMenu';
import DuelyLogo from '@/components/DuelyLogo';

export default function TopBar() {
  return (
    <header className="h-12 md:h-16 px-3 md:px-4 box-content border-b border-gray-300 fixed top-0 right-0 left-0 bg-white">
      <div className="container box-content h-full mx-auto flex flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center h-8 md:h-12 relative space-x-2 text-gray-900 rounded p-1">
            <DuelyLogo className="h-full" />
            <span className="text-2xl font-bold">Duely</span>
          </a>
        </Link>
        <div className="relative inline-block">
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
