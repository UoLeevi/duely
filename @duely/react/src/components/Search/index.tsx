import React, { useCallback, useEffect, useRef } from 'react';
import { icons } from '..';

export function Search() {
  const ref = useRef<HTMLInputElement>(null);
  const keydown = useCallback((e: KeyboardEvent) => {
    if (e.key !== '/') return;
    if (document.activeElement?.matches('input,textarea,select')) return;
    e.preventDefault();
    ref.current?.focus();
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  }, []);

  return (
    <div className="flex items-center max-w-sm border border-gray-300 rounded-full shadow-sm outline-none md:max-w-lg grow group focus-within:ring sm:text-sm sm:leading-5 dark:border-gray-500">
      <span className="pl-3 pr-1 text-gray-500 whitespace-nowrap">{icons['search.solid']}</span>
      <input
        ref={ref}
        type="text"
        className="w-full min-h-[1em] text-sm py-1 bg-transparent border-none rounded-full outline-none appearance-none first:pl-3 last:pr-3"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="false"
        placeholder="Search..."
      />
      <span className="pl-1 pr-3 text-xs font-bold text-gray-500 transition-opacity opacity-0 group-hover:opacity-100 whitespace-nowrap">
        <span className='inline-flex items-center justify-center w-[1.25rem] h-[1.25rem] p-1 bg-gray-200 rounded'>/</span>
      </span>
    </div>
  );
}
