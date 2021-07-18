import React, { Fragment, useMemo, useState } from 'react';
import { Util } from '../../util';
import { useBreakpoints } from '../../hooks';
import { LoadingSpinner } from '../LoadingSpinner';

export function usePagination(initialState?: { limit?: number; page?: number }) {
  const [state, setState] = useState({
    limit: initialState?.limit ?? 50,
    page: initialState?.page ?? 1
  });

  const functions = useMemo(
    () => ({
      nextPage() {
        setState((state) => ({
          limit: state.limit,
          page: state.page + 1
        }));
      },
      previousPage() {
        setState((state) => ({
          limit: state.limit,
          page: state.page - 1
        }));
      },
      setPage(page: number) {
        setState((state) => ({
          limit: state.limit,
          page
        }));
      },
      setLimit(limit: number) {
        setState((state) => ({
          limit,
          page: state.page
        }));
      }
    }),
    []
  );

  return {
    ...state,
    ...functions
  };
}

type TableProps<TItem> = {
  rows: TItem[] | undefined | null;
  columns: (
    | ((item: TItem, column: number) => React.ReactNode)
    | ((item: TItem) => React.ReactNode)
  )[];
  headers: React.ReactNode[];
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
  error
}: TableProps<TItem>) {
  const breakpoints = useBreakpoints();
  const isNotWrapped = breakpoints[breakpoint ?? 'lg'];
  const wrapColCount = wrapOptions?.columns ?? 1;
  const wrapColSpans = wrapOptions?.spans ?? new Array(headers.length).fill(1);
  const wrapColSpanSum = wrapColSpans.reduce((a, b) => a + b, 0);

  const gridTemplateColumns = isNotWrapped
    ? `repeat(${headers.length}, auto)`
    : `repeat(${wrapOptions?.columns ?? 1}, auto)`;

  className = Util.createClassName(className, 'grid auto-rows-auto gap-x-6');
  loading = !!loading;
  items = items ?? [];

  if (isNotWrapped) {
    if (error) {
      headers = [
        <TableHeader key={0} column={1}>
          Error
        </TableHeader>
      ];
    } else if (loading) {
      headers = [
        <TableHeader key={0} column={1}>
          Loading...
        </TableHeader>
      ];
    } else {
      headers = headers.map((header, j) => {
        return (
          <TableHeader key={j} column={j + 1}>
            {header}
          </TableHeader>
        );
      });
    }
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
            className="h-8 border-b border-gray-200"
            style={{ gridArea: `1 / 1 / 2 / -1` }}
          ></div>
          {headers}
        </Fragment>
      )}
      {rows}
    </div>
  );
}

type TableHeaderProps = {
  column: number;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableHeader({ children, column }: TableHeaderProps) {
  const gridArea = `1 / ${column} / 2 / ${column + 1}`;
  return (
    <div className="grid text-xs tracking-wide text-gray-500" style={{ gridArea }}>
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
  firstRow: boolean;
  lastRow: boolean;
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
  firstRow,
  lastRow,
  firstCol,
  lastCol,
  isNotWrapped
}: TableCellProps) {
  const gridArea = `${row} / ${column} / ${row + 1} / ${column + span}`;

  if (isNotWrapped) {
    const className = 'relative grid items-center ' + (lastRow ? 'pt-3' : 'py-3');

    return (
      <div className={className} style={{ gridArea }}>
        {children}
      </div>
    );
  }

  let className = 'flex flex-col space-y-2 ';

  if (!firstRow || !firstCol) {
    className += dense ? (firstCol ? 'pt-4 ' : 'pt-2 ') : firstCol ? 'pt-6 ' : 'pt-3 ';
  }

  if (!lastRow || !lastCol) {
    className += dense ? (lastCol ? 'pb-4 ' : 'pb-2 ') : lastCol ? 'pb-6 ' : 'pb-3 ';
  }

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
            firstRow={first}
            lastRow={last}
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
            firstRow={first}
            lastRow={last}
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
  let className = 'grid p-4 text-gray-400 border-gray-200 place-items-center';
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
  let className = 'grid p-4 border-gray-200 place-items-center';
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
