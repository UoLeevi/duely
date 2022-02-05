import { memo } from '@duely/util';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { icons, Animation, LoadingSpinner } from '..';
import { useAwait, useDebounce } from '../..';
export * from './resultTypes';

export type SearchProps = {
  search: (query: string) => React.ReactNode[] | Promise<React.ReactNode[]>;
};

export function Search({ search }: SearchProps) {
  search = useMemo(() => memo(search), [search]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState<string>();
  const input = useCallback((e: Event) => {
    setQuery(inputRef.current?.value);
  }, []);
  const keydown = useCallback((e: KeyboardEvent) => {
    if (!inputRef.current || !containerRef.current) return;
    if (e.key === '/' && !document.activeElement?.matches('input,textarea,select')) {
      e.preventDefault();
      inputRef.current.focus();
    } else if (e.key === 'Escape' && containerRef.current.matches(':focus-within')) {
      e.preventDefault();
      inputRef.current.value = '';
      setQuery(undefined);
      inputRef.current.blur();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', keydown);
    document.addEventListener('input', input);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('input', input);
    };
  }, []);

  const history = useHistory();

  useEffect(() => {
    let pathname = history.location.pathname;
    return history.listen((location) => {
      if (pathname !== location.pathname) {
        pathname = location.pathname;
        if (!inputRef.current || inputRef.current.value === '') return;
        inputRef.current.value = '';
        setQuery(undefined);
        if (!containerRef.current?.contains(document.activeElement)) return;
        (document.activeElement as HTMLElement).blur();
      }
    });
  }, [history]);

  const debouncedQuery = useDebounce(query);
  const resultPromise = debouncedQuery !== undefined && search(debouncedQuery);
  let { value: results, loading, error } = useAwait(resultPromise);

  loading ||= debouncedQuery != query;
  loading &&= ![undefined, ''].includes(query);

  return (
    <>
      <div
        ref={containerRef}
        className="relative flex items-center max-w-sm bg-white border border-gray-300 rounded-full shadow-sm outline-none md:max-w-lg grow group focus-within:ring sm:text-sm sm:leading-5 dark:border-gray-500"
      >
        <span className="pl-3 pr-1.5 text-gray-500 whitespace-nowrap">
          {
            <Animation.Fade>
              {loading ? (
                <LoadingSpinner loading={loading} className="!text-current w-[1.25em] h-[1.25em]" />
              ) : (
                icons['search.solid']
              )}
            </Animation.Fade>
          }
        </span>
        <input
          ref={inputRef}
          type="text"
          className="w-full min-h-[1em] text-sm py-1 bg-transparent border-none rounded-full outline-none appearance-none first:pl-3 last:pr-3"
          spellCheck="false"
          autoComplete="off"
          autoCorrect="false"
          placeholder="Search..."
        />
        <span className="pl-1 pr-3 text-xs font-bold text-gray-500 transition-opacity opacity-0 group-hover:opacity-100 whitespace-nowrap">
          <span className="inline-flex items-center justify-center w-[1.25rem] h-[1.25rem] p-1 bg-gray-200 rounded">
            /
          </span>
        </span>

        <div className="hidden group-focus-within:flex absolute top-0 z-40 flex-col w-full min-w-[15rem] -translate-x-1/2 translate-y-10 bg-white border rounded-md shadow-lg border-black/5 left-1/2">
          {loading && (
            <div className="py-1.5 px-2.5 flex items-center min-h-[1.25em] box-content truncate whitespace-nowrap">
              <span>Loading results for </span>
              <span className="pl-1 font-semibold">{query}</span>
            </div>
          )}

          {!loading && results && (
            <div className="flex flex-col p-1 space-y-1">
              {results.map((result, i) => (
                <div key={i}>{result}</div>
              ))}
            </div>
          )}
          <div className="flex items-center px-3 py-2 text-sm font-semibold text-gray-400 bg-gray-100 whitespace-nowrap rounded-b-md">
            <span className="pr-1.5">{icons['question-mark-circle.solid']}</span>
            <span>Search tips</span>
          </div>
        </div>
      </div>
    </>
  );
}
