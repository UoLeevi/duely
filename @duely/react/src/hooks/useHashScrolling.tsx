import React, { useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type HashLinkProps = {
  hash: string;
};

function HashLink({ hash }: HashLinkProps) {
  return (
    <Link
      to={hash}
      className="absolute inset-y-0 right-0 flex items-end my-auto text-transparent transition-colors focus:outline-none group-hover:text-indigo-600 focus-visible:text-indigo-500"
      style={{
        marginRight: '-1.5em'
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: '1em', width: '1em', transform: 'translateY(-0.1em)' }}
        viewBox="0 0 20 20"
        fill="currentColor"
        transform="scale(-1 1)"
      >
        <path
          fillRule="evenodd"
          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}

export function useHashScrolling<THTMLElement extends HTMLElement>(): [
  ref: (node: THTMLElement) => void,
  hashLink: React.ReactNode,
  hash: string | undefined
] {
  const [hash, setHash] = useState<string | undefined>();
  const hashLink = hash && <HashLink hash={hash} />;
  const location = useLocation();

  return [
    useCallback(
      (node: THTMLElement) => {
        if (!node) return;
        let id: string | undefined = node.id || node.querySelector('[id]')?.id;

        if (!id) {
          id = node.textContent
            ?.trim()
            .toLowerCase()
            .replace(/[^\w\d-]+/g, '-');

          if (!id) return;
          node.id = id;
          if (!node.classList.contains('relative')) node.classList.add('relative');
          if (!node.classList.contains('group')) node.classList.add('group');
        }

        const hash = `#${id}`;
        setHash(hash);

        if (location.hash !== hash) return;
        node.scrollIntoView();
      },
      [location.hash, setHash]
    ),
    hashLink,
    hash
  ];
}
