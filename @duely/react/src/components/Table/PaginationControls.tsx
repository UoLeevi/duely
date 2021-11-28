import React from 'react';
import { Button } from '..';
import { itemsPerPageOptions, usePagination, usePagination2 } from './usePagination';

export type PaginationControlsProps = {
  pagination: ReturnType<typeof usePagination>;
};

export function PaginationControls({ pagination }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between w-full space-x-2 text-xs font-semibold sm:space-x-3">
      <div className="flex items-center">
        <span className="hidden sm:inline">View </span>

        <div className="relative flex items-center ml-0 border border-gray-300 rounded-md shadow-sm outline-none sm:ml-1 dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5">
          <select
            className="w-full py-0.5 pl-1.5 pr-5 bg-transparent border-none rounded-md outline-none appearance-none"
            spellCheck="false"
            autoComplete="off"
            onChange={(e) => pagination.setItemsPerPage(+e.target.value)}
            value={pagination.itemsPerPage.toFixed()}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option.toFixed()}>
                {option === 0 ? 'all' : option.toFixed()}
              </option>
            ))}
          </select>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-0 w-4 h-4 mr-1 text-gray-600 pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <span className="ml-1">
          <span className="hidden sm:inline"> entries</span>
          <span> per page</span>
        </span>
      </div>
      <div className="flex items-center space-x-4 md:space-x-8">
        {pagination.loadingTotalNumberOfItems ? (
          'Loading...'
        ) : pagination.lastPageNumber === 1 ? (
          <span>Showing all {pagination.totalNumberOfItems} entries</span>
        ) : (
          <>
            <span>
              Showing {pagination.firstIndex + 1} to {pagination.lastIndex + 1}
              <br className="inline sm:hidden" /> of {pagination.totalNumberOfItems} entries
            </span>
            <div className="flex items-center space-x-0.5">
              <span>Page</span>

              <button
                className={`hidden sm:flex rounded-md font-bold ${
                  pagination.pageNumber !== 1 ? 'visible' : 'invisible'
                }`}
                onClick={pagination.previousPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5">
                <select
                  className="w-full py-0.5 pl-1.5 pr-5 bg-transparent border-none rounded-md outline-none appearance-none"
                  spellCheck="false"
                  autoComplete="off"
                  onChange={(e) => pagination.setPage(+e.target.value)}
                  value={pagination.pageNumber.toFixed()}
                >
                  {Array.from(new Array(pagination.lastPageNumber), (_, i) => (
                    <option key={i} value={(i + 1).toFixed()}>
                      {(i + 1).toFixed()}
                    </option>
                  ))}
                </select>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-0 w-4 h-4 mr-1 text-gray-600 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <button
                className={`hidden sm:flex rounded-md font-bold ${
                  pagination.pageNumber !== pagination.lastPageNumber ? 'visible' : 'invisible'
                }`}
                onClick={pagination.nextPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export type PaginationControlsProps2 = {
  pagination: ReturnType<typeof usePagination2>;
};

export function PaginationControls2({ pagination }: PaginationControlsProps2) {
  return (
    <div className="flex items-center justify-between w-full space-x-2 text-xs font-semibold sm:space-x-3">
      <div className="flex items-center mx-auto">
        <Button
          className="text-xs"
          icon="arrow-sm-down.solid"
          dense
          onClick={pagination.loadMore}
          loading={pagination.loading}
        >
          Load more
        </Button>
      </div>
    </div>
  );
}
