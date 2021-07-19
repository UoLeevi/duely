import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Util } from '../../util';
import { useBreakpoints } from '../../hooks';
import { LoadingSpinner } from '../LoadingSpinner';
import { produce } from 'immer';

export function usePagination(initialState: {
  totalNumberOfItems: number;
  itemsPerPage?: number;
  pageNumber?: number;
}) {
  const initialItemsPerPage = initialState.itemsPerPage ?? 50;
  const initialLastPageNumber = Math.max(
    1,
    Math.floor((initialState.totalNumberOfItems - 1) / initialItemsPerPage) + 1
  );
  const initialPageNumber = Math.min(
    initialLastPageNumber,
    Math.max(1, initialState.pageNumber ?? 1)
  );

  const [state, setState] = useState({
    itemsPerPage: initialItemsPerPage,
    pageNumber: initialPageNumber,
    firstIndex:
      initialItemsPerPage === 0
        ? 0
        : Math.min(initialState.totalNumberOfItems, (initialPageNumber - 1) * initialItemsPerPage),
    lastIndex:
      initialItemsPerPage === 0
        ? initialState.totalNumberOfItems - 1
        : Math.min(initialState.totalNumberOfItems, initialPageNumber * initialItemsPerPage - 1),
    lastPageNumber: initialLastPageNumber,
    totalNumberOfItems: initialState.totalNumberOfItems
  });

  useEffect(() => {
    setState((state) => ({
      itemsPerPage: initialItemsPerPage,
      pageNumber: state.pageNumber,
      firstIndex:
        state.itemsPerPage === 0
          ? 0
          : Math.min(initialState.totalNumberOfItems, (state.pageNumber - 1) * state.itemsPerPage),
      lastIndex:
        initialItemsPerPage === 0
          ? initialState.totalNumberOfItems - 1
          : Math.min(initialState.totalNumberOfItems, state.pageNumber * state.itemsPerPage - 1),
      lastPageNumber: Math.max(
        1,
        Math.floor((initialState.totalNumberOfItems - 1) / state.itemsPerPage) + 1
      ),
      totalNumberOfItems: initialState.totalNumberOfItems
    }));
  }, [initialState.totalNumberOfItems]);

  const functions = useMemo(
    () => ({
      nextPage() {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if (state.pageNumber * state.itemsPerPage >= initialState.totalNumberOfItems) return;
            state.pageNumber += 1;
            state.firstIndex += state.itemsPerPage;
            state.lastIndex = Math.min(
              state.lastIndex + state.itemsPerPage,
              initialState.totalNumberOfItems - 1
            );
          })
        );
      },
      previousPage() {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if (state.pageNumber === 1) return;
            state.pageNumber -= 1;
            state.firstIndex -= state.itemsPerPage;
            state.lastIndex -= state.itemsPerPage;
          })
        );
      },
      setPage(pageNumber: number) {
        setState((state) =>
          produce(state, (state) => {
            if (state.itemsPerPage === 0) return;
            if ((pageNumber - 1) * state.itemsPerPage >= initialState.totalNumberOfItems) return;
            state.pageNumber = pageNumber;
            state.firstIndex = Math.min(
              (pageNumber - 1) * state.itemsPerPage,
              initialState.totalNumberOfItems - 1
            );
            state.lastIndex = Math.min(
              pageNumber * state.itemsPerPage,
              initialState.totalNumberOfItems - 1
            );
          })
        );
      },
      setItemsPerPage(itemsPerPage: number) {
        setState((state) =>
          produce(state, (state) => {
            if (isNaN(itemsPerPage) || itemsPerPage < 0) itemsPerPage = 0;
            state.itemsPerPage = itemsPerPage;

            if (state.itemsPerPage === 0) {
              state.firstIndex = 0;
              state.lastIndex = initialState.totalNumberOfItems - 1;
              state.pageNumber = 1;
              return;
            }

            state.lastIndex = Math.min(
              state.firstIndex + state.itemsPerPage,
              initialState.totalNumberOfItems - 1
            );

            state.pageNumber = Math.floor(state.firstIndex / state.itemsPerPage) + 1;
            state.lastPageNumber = Math.max(
              1,
              Math.floor((initialState.totalNumberOfItems - 1) / state.itemsPerPage) + 1
            );
          })
        );
      }
    }),
    [initialState.totalNumberOfItems]
  );

  return {
    ...state,
    ...functions
  };
}

type PaginationControlsProps = {
  pagination: ReturnType<typeof usePagination>;
  loading?: boolean;
};

export function PaginationControls({ pagination, loading }: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between w-full space-x-3 text-xs font-semibold">
      <div>
        <span>View </span>
        <select
          className="!font-semibold"
          onChange={(e) => pagination.setItemsPerPage(+e.target.value)}
          defaultValue={pagination.itemsPerPage.toFixed()}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="500">500</option>
          <option value="0">all</option>
        </select>
        <span> entries per page</span>
      </div>
      <div className="flex items-center space-x-4">
        {loading ? (
          'Loading...'
        ) : pagination.lastPageNumber === 1 ? (
          <span>Showing all {pagination.totalNumberOfItems} entries</span>
        ) : (
          <>
            <span>
              Showing {pagination.firstIndex + 1} to {pagination.lastIndex + 1} of{' '}
              {pagination.totalNumberOfItems} entries
            </span>
            <div className="flex items-center space-x-1">
              <button
                className={`flex px-0.5 py-0.5 rounded-md font-bold ${
                  pagination.pageNumber !== 1 ? 'visible' : 'invisible'
                }`}
                onClick={pagination.previousPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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

              <select
                className="flex px-0.5 py-0.5 rounded-md font-bold"
                onChange={(e) => pagination.setPage(+e.target.value)}
                defaultValue={pagination.pageNumber.toFixed()}
              >
                {Array.from(new Array(pagination.lastPageNumber), (_, i) => (
                  <option key={i} value={(i + 1).toFixed()}>
                    {(i + 1).toFixed()}
                  </option>
                ))}
              </select>

              <button
                className={`flex px-0.5 py-0.5 rounded-md font-bold ${
                  pagination.pageNumber !== pagination.lastPageNumber ? 'visible' : 'invisible'
                }`}
                onClick={pagination.nextPage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
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

type TableProps<TItem> = {
  rows: TItem[] | undefined | null;
  columns: (
    | ((item: TItem, column: number) => React.ReactNode)
    | ((item: TItem) => React.ReactNode)
  )[];
  headers: React.ReactNode[];
  footer?: React.ReactNode;
  dense?: boolean;
  breakpoint?: keyof ReturnType<typeof useBreakpoints>;
  wrap?: {
    columns: number;
    spans: number[];
  };
  loading?: boolean;
  error?: boolean | string | Error | { message: string };
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Table<TItem extends { key?: string | number | null; id?: string | number | null }>({
  rows: items,
  columns,
  headers,
  className,
  dense,
  breakpoint,
  wrap: wrapOptions,
  loading,
  error,
  footer
}: TableProps<TItem>) {
  const breakpoints = useBreakpoints();
  const isNotWrapped = breakpoints[breakpoint ?? 'lg'];
  const wrapColCount = wrapOptions?.columns ?? 1;
  const wrapColSpans = wrapOptions?.spans ?? new Array(headers.length).fill(1);
  const wrapColSpanSum = wrapColSpans.reduce((a, b) => a + b, 0);

  const gridTemplateColumns = isNotWrapped
    ? `repeat(${headers.length}, auto)`
    : `repeat(${wrapOptions?.columns ?? 1}, auto)`;

  className = Util.createClassName(className, 'grid auto-rows-auto', dense ? 'gap-x-4' : 'gap-x-6');
  loading = !!loading;
  items = items ?? [];

  if (isNotWrapped) {
    headers = headers.map((header, j) => {
      return (
        <TableHeader
          key={j}
          column={j + 1}
          firstCol={j % columns.length === 0}
          lastCol={(j + 1) % columns.length === 0}
        >
          {header}
        </TableHeader>
      );
    });
  }

  let rows;

  if (error) {
    let message: string | boolean | null | undefined =
      typeof error === 'object' ? error?.message : error;
    message = message === 'string' ? message : null;
    rows = (
      <TableErrorRow
        message={message as string | null}
        row={isNotWrapped ? 2 : 1}
        wrapColCount={wrapColCount}
        wrapColSpanSum={wrapColSpanSum}
        isNotWrapped={isNotWrapped}
      />
    );
  } else if (loading) {
    rows = (
      <TableLoadingRow
        row={isNotWrapped ? 2 : 1}
        wrapColCount={wrapColCount}
        wrapColSpanSum={wrapColSpanSum}
        isNotWrapped={isNotWrapped}
      />
    );
  } else {
    rows = items.map((item, i) => {
      return (
        <TableRow
          key={item.key ?? item.id ?? i}
          item={item}
          row={i + (isNotWrapped ? 2 : 1)}
          columns={columns}
          headers={headers}
          dense={dense}
          wrapColCount={wrapColCount}
          wrapColSpans={wrapColSpans}
          wrapColSpanSum={wrapColSpanSum}
          isNotWrapped={isNotWrapped}
          first={i === 0}
          last={i === items!.length - 1}
        />
      );
    });
  }

  return (
    <div className={className} style={{ gridTemplateColumns }}>
      {isNotWrapped && (
        <Fragment>
          <div
            className="border-b border-gray-200 dark:border-gray-700"
            style={{ gridArea: `1 / 1 / 2 / -1` }}
          ></div>
          {headers}
        </Fragment>
      )}

      {rows}

      {footer && (
        <TableFooterRow
          row={items.length + (isNotWrapped ? 2 : 1)}
          wrapColCount={wrapColCount}
          wrapColSpanSum={wrapColSpanSum}
          isNotWrapped={isNotWrapped}
          dense={dense}
        >
          {footer}
        </TableFooterRow>
      )}
    </div>
  );
}

type TableHeaderProps = {
  column: number;
  dense?: boolean;
  firstCol: boolean;
  lastCol: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableHeader({ children, column, dense, firstCol, lastCol }: TableHeaderProps) {
  const gridArea = `1 / ${column} / 2 / ${column + 1}`;

  let className = 'grid text-xs tracking-wide text-gray-500 ';
  className += dense ? 'py-3 ' : 'py-4 ';
  if (firstCol) className += dense ? 'pl-4 ' : 'pl-6 ';
  if (lastCol) className += dense ? 'pr-4 ' : 'pr-6 ';

  return (
    <div className={className} style={{ gridArea }}>
      {children}
    </div>
  );
}

type TableCellProps = {
  row: number;
  header: React.ReactNode;
  dense?: boolean;
  column: number;
  span: number;
  firstCol: boolean;
  lastCol: boolean;
  isNotWrapped: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableCell({
  children,
  row,
  column,
  span,
  header,
  dense,
  firstCol,
  lastCol,
  isNotWrapped
}: TableCellProps) {
  const gridArea = `${row} / ${column} / ${row + 1} / ${column + span}`;

  if (isNotWrapped) {
    let className = 'relative grid items-center py-3 ';
    if (firstCol) className += dense ? 'pl-4 ' : 'pl-6 ';
    if (lastCol) className += dense ? 'pr-4 ' : 'pr-6 ';

    return (
      <div className={className} style={{ gridArea }}>
        {children}
      </div>
    );
  }

  let className = 'flex flex-col space-y-2 ';

  className += dense ? 'px-4 ' : 'px-6 ';
  className += dense ? (firstCol ? 'pt-4 ' : 'pt-2 ') : firstCol ? 'pt-6 ' : 'pt-3 ';
  className += dense ? (lastCol ? 'pb-4 ' : 'pb-2 ') : lastCol ? 'pb-6 ' : 'pb-3 ';

  return (
    <div className={className} style={{ gridArea }}>
      <div className="grid text-xs tracking-wide text-gray-500">{header}</div>
      <div className="relative grid items-center flex-1">{children}</div>
    </div>
  );
}

type TableRowProps<TItem> = {
  item: TItem;
  row: number;
  columns: (
    | ((item: TItem, column: number) => React.ReactNode)
    | ((item: TItem) => React.ReactNode)
  )[];
  headers: React.ReactNode[];
  dense?: boolean;
  wrapColSpans: number[];
  first: boolean;
  last: boolean;
  wrapColCount: number;
  wrapColSpanSum: number;
  isNotWrapped: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableRow<TItem>({
  item,
  row,
  columns,
  headers,
  dense,
  wrapColCount,
  wrapColSpans,
  wrapColSpanSum,
  first,
  last,
  isNotWrapped
}: TableRowProps<TItem>) {
  let className = 'border-gray-200 dark:border-gray-700' + (last ? '' : ' border-b');
  const cells = columns.map((column, j) => column(item, j));

  if (isNotWrapped) {
    const gridArea = `${row} / 1 / ${row + 1} / -1`;

    return (
      <Fragment>
        <div className={className} style={{ gridArea }}></div>

        {cells.map((cell, j) => (
          <TableCell
            key={j}
            row={row}
            column={j + 1}
            span={1}
            header={headers[j]}
            dense={dense}
            isNotWrapped={isNotWrapped}
            firstCol={j % columns.length === 0}
            lastCol={(j + 1) % columns.length === 0}
          >
            {cell}
          </TableCell>
        ))}
      </Fragment>
    );
  }

  row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
  const gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  let next = 1;

  return (
    <Fragment>
      <div className={className} style={{ gridArea }}></div>

      {cells.map((cell, j) => {
        const column = ((next - 1) % wrapColCount) + 1;
        const span = wrapColSpans[j];
        const cellRow = row + Math.floor((next - 1) / wrapColCount);
        const firstCol = cellRow === row;
        const lastCol = cellRow + 1 - row === wrapColSpanSum / wrapColCount;
        next += span;
        return (
          <TableCell
            key={j}
            row={cellRow}
            column={column}
            span={span}
            header={headers[j]}
            dense={dense}
            isNotWrapped={isNotWrapped}
            firstCol={firstCol}
            lastCol={lastCol}
          >
            {cell}
          </TableCell>
        );
      })}
    </Fragment>
  );
}

type TableFooterRowProps = {
  row: number;
  wrapColCount: number;
  wrapColSpanSum: number;
  isNotWrapped: boolean;
  dense?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableFooterRow({
  row,
  wrapColCount,
  wrapColSpanSum,
  isNotWrapped,
  dense,
  children
}: TableFooterRowProps) {
  let className =
    'grid text-gray-400 border-t border-gray-200 dark:border-gray-700 place-items-center ';
  className += dense ? 'py-2 ' : 'py-3 ';
  className += dense ? 'px-4 ' : 'px-6 ';

  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  if (!isNotWrapped) {
    row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  }

  return (
    <div className={className} style={{ gridArea }}>
      {children}
    </div>
  );
}

type TableLoadingRowProps = {
  row: number;
  wrapColCount: number;
  wrapColSpanSum: number;
  isNotWrapped: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableLoadingRow({
  row,
  wrapColCount,
  wrapColSpanSum,
  isNotWrapped
}: TableLoadingRowProps) {
  let className = 'grid p-4 text-gray-400 border-gray-200 dark:border-gray-700 place-items-center';
  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  if (!isNotWrapped) {
    row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  }

  return (
    <div className={className} style={{ gridArea }}>
      <LoadingSpinner loading className="w-10 h-10" />
    </div>
  );
}

type TableErrorRowProps = {
  row: number;
  message: string | null;
  wrapColCount: number;
  wrapColSpanSum: number;
  isNotWrapped: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableErrorRow({
  row,
  message,
  wrapColCount,
  wrapColSpanSum,
  isNotWrapped
}: TableErrorRowProps) {
  let className = 'grid p-4 border-gray-200 dark:border-gray-700 place-items-center';
  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  message = message ?? 'Some error occurred';

  if (!isNotWrapped) {
    row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  }

  return (
    <div className={className} style={{ gridArea }}>
      <div className="flex items-center space-x-3 text-red-500">
        <div className="grid w-8 h-8 bg-red-200 rounded-full place-items-center">
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
