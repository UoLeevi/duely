import { agency_Q, current_agency_Q, current_user_Q, useQuery } from '@duely/client';
import { Util } from '@duely/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageBlockComponentProps } from './page-blocks';

type HeroWithAngledImageProps = {
  headline1?: string;
  headline2?: string;
  paragraph?: string;
  imageSrc?: string;
  imageAlt?: string;
} & PageBlockComponentProps;

export function HeroWithAngledImage({
  agency,
  headline1,
  headline2,
  paragraph,
  imageSrc,
  imageAlt
}: HeroWithAngledImageProps) {
  headline1 = headline1 && Util.template(headline1, { agency });
  headline2 = headline2 && Util.template(headline2, { agency });
  paragraph = paragraph && Util.template(paragraph, { agency });

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <AngledEdgeRight />
          <HeroNavBar />
          <section className="px-4 mx-auto mt-10 max-w-7xl sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <HeroHeadline headline1={headline1!} headline2={headline2!} />
              <HeroParagraph paragraph={paragraph!} />
            </div>
            <HeroActions />
          </section>
        </div>
        <HeroImage src={imageSrc!} alt={imageAlt} />
      </div>
    </div>
  );
}

type HeroImageProps = {
  src: string;
  alt?: string;
};

function HeroImage({ src, alt }: HeroImageProps) {
  return (
    <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
      <img
        className="object-cover w-full h-56 sm:h-72 md:h-96 lg:w-full lg:h-full"
        src={src}
        alt={alt ?? ''}
      />
    </div>
  );
}

function HeroActions() {
  return (
    <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
      <div className="rounded-md shadow">
        <a
          href="#"
          className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
        >
          Book a consultation
        </a>
      </div>
      <div className="mt-3 sm:mt-0 sm:ml-3">
        <a
          href="#"
          className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
        >
          Learn more
        </a>
      </div>
    </div>
  );
}

type HeroHeadlineProps = {
  headline1: string;
  headline2: string;
};

function HeroHeadline({ headline1, headline2 }: HeroHeadlineProps) {
  return (
    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
      <span className="whitespace-nowrap">{headline1}</span>
      <br />
      <span className="text-indigo-600">{headline2}</span>
    </h1>
  );
}

type HeroParagraphProps = {
  paragraph: string;
};

function HeroParagraph({ paragraph }: HeroParagraphProps) {
  return (
    <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
      {paragraph}
    </p>
  );
}

function AngledEdgeRight() {
  return (
    <svg
      className="absolute inset-y-0 right-0 hidden w-48 h-full text-white transform translate-x-1/2 lg:block"
      fill="currentColor"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polygon points="50,0 100,0 50,100 0,100" />
    </svg>
  );
}

function HeroNavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const { data: agency } = useQuery(current_agency_Q);
  const { data: user, loading: userLoading } = useQuery(current_user_Q);
  const logoSrc = agency?.theme?.image_logo?.data;
  const isAgent = user?.memberships
    .filter((m) => ['AGENT', 'MANAGER', 'OWNER'].includes(m.access))
    .some((m) => m.subdomain.id === agency?.subdomain.id);

  return (
    <>
      <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
        <nav
          className="relative flex items-center justify-between sm:h-10 lg:justify-start"
          aria-label="Global"
        >
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center justify-between w-full md:w-auto">
              {logoSrc && (
                <a href="/">
                  <span className="sr-only">{agency?.name}</span>
                  <img className="w-auto h-8 sm:h-10" src={logoSrc} alt="logo" />
                </a>
              )}
              <div className="flex items-center -mr-2 md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  id="main-menu"
                  aria-haspopup="true"
                  onClick={() => setShowMenu(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  {/* <!-- Heroicon name: menu --> */}
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:ml-10 md:pr-4 md:space-x-8">
            <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
              Services
            </a>

            <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
              About us
            </a>

            <a href="#" className="font-medium text-gray-500 hover:text-gray-900">
              Contact
            </a>

            {isAgent && (
              <Link to="/dashboard" className="font-medium text-indigo-600 hover:text-indigo-500">
                Dashboard
              </Link>
            )}

            {!user && (
              <Link to="/log-in" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log in
              </Link>
            )}

            {user && !isAgent && (
              <Link to="/log-out" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log out
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* <!--
        Mobile menu, show/hide based on menu open state.

        Entering: "duration-150 ease-out"
          From: "opacity-0 scale-95"
          To: "opacity-100 scale-100"
        Leaving: "duration-100 ease-in"
          From: "opacity-100 scale-100"
          To: "opacity-0 scale-95"
      --> */}
      {showMenu && (
        <div className="absolute inset-x-0 top-0 p-2 transition origin-top-right transform md:hidden">
          <div className="overflow-hidden bg-white rounded-lg shadow-md ring-1 ring-black ring-opacity-5">
            <div className="flex items-center justify-between px-5 pt-4">
              <div>{logoSrc && <img className="w-auto h-8" src={logoSrc} alt="logo" />}</div>
              <div className="-mr-2">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 text-gray-400 bg-white rounded-md hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  onClick={() => setShowMenu(false)}
                >
                  <span className="sr-only">Close main menu</span>
                  {/* <!-- Heroicon name: x --> */}
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div role="menu" aria-orientation="vertical" aria-labelledby="main-menu">
              <div className="px-2 pt-2 pb-3 space-y-1" role="none">
                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                  role="menuitem"
                >
                  Services
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                  role="menuitem"
                >
                  About us
                </a>

                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
                  role="menuitem"
                >
                  Contact
                </a>
              </div>
              <div role="none">
                <a
                  href="#"
                  className="block w-full px-5 py-3 font-medium text-center text-indigo-600 bg-gray-50 hover:bg-gray-100"
                  role="menuitem"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
