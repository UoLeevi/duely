import React, { Fragment } from 'react';
import { Util } from '../../util';
import { useBreakpoints } from '../../hooks';
import { UsePaginationReturn } from './usePagination';
import { PaginationControls } from '..';

export * from './usePagination';
export * from './PaginationControls';

type TableProps<TItem> = {
  columns: (
    | ((item: TItem | null, column: number) => React.ReactNode)
    | ((item: TItem | null) => React.ReactNode)
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
} & (
  | ({
      pagination: UsePaginationReturn<TItem>;
    } & (
      | {
          footer?: React.ReactNode;
        }
      | {
          footerPaginationControls?: boolean;
        }
    ))
  | {
      items: TItem[] | undefined | null;
      footer?: React.ReactNode;
    }
) &
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export function Table<TItem extends { key?: string | number | null; id?: string | number | null }>({
  columns,
  headers,
  className,
  dense,
  breakpoint,
  wrap: wrapOptions,
  loading,
  error,
  ...rest
}: TableProps<TItem>) {
  const skeletonRowCountFallback = 5;
  const breakpoints = useBreakpoints();
  const isNotWrapped = breakpoints[breakpoint ?? 'lg'];
  const wrapColCount = wrapOptions?.columns ?? 1;
  const wrapColSpans = wrapOptions?.spans ?? new Array(headers.length).fill(1);
  const wrapColSpanSum = wrapColSpans.reduce((a, b) => a + b, 0);

  const gridTemplateColumns = isNotWrapped
    ? `repeat(${headers.length}, auto)`
    : `repeat(${wrapOptions?.columns ?? 1}, auto)`;

  className = Util.createClassName(
    className,
    'grid auto-rows-auto',
    dense ? 'gap-x-3 sm:gap-x-4' : 'gap-x-5 sm:gap-x-6'
  );

  const pagination = Util.hasProperty(rest, 'pagination') ? rest.pagination : undefined;

  loading = !!pagination?.loading || !!loading;
  error = pagination?.error ?? error;
  const items = pagination?.items ?? (Util.hasProperty(rest, 'items') ? rest.items : []) ?? [];

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
  let rowCount: number;

  if (error) {
    let message: string | boolean | null | undefined =
      typeof error === 'object' ? error?.message : error;
    message = message === 'string' ? message : null;
    rowCount = 1;
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
    rowCount = pagination
      ? pagination.loadingTotalNumberOfItems
        ? pagination.itemsPerPage
        : pagination.lastIndex - pagination.firstIndex + 1
      : skeletonRowCountFallback;

    rows = Array.from(new Array(rowCount), (_, i) => {
      return (
        <TableRow
          key={i}
          item={null}
          row={i + (isNotWrapped ? 2 : 1)}
          columns={columns}
          headers={headers}
          dense={dense}
          wrapColCount={wrapColCount}
          wrapColSpans={wrapColSpans}
          wrapColSpanSum={wrapColSpanSum}
          isNotWrapped={isNotWrapped}
          first={i === 0}
          last={i === rowCount - 1}
        />
      );
    });
  } else if (items.length === 0) {
    rowCount = 1;

    rows = (
      <TableInfoRow
        message="No entries to show"
        row={isNotWrapped ? 2 : 1}
        wrapColCount={wrapColCount}
        wrapColSpanSum={wrapColSpanSum}
        isNotWrapped={isNotWrapped}
      />
    );
  } else {
    rowCount = items.length;
    rows = items.map((item, i) => {
      return (
        <TableRow
          key={i}
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

  let footer: React.ReactNode = undefined;

  if (Util.hasProperty(rest, 'footer')) {
    footer = rest.footer as React.ReactNode;
  } else if (
    Util.hasProperty(rest, 'footerPaginationControls') &&
    rest.footerPaginationControls &&
    pagination &&
    (pagination.loadingTotalNumberOfItems || pagination.totalNumberOfItems > 0)
  ) {
    footer = <PaginationControls pagination={pagination} />;
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
          row={rowCount + (isNotWrapped ? 2 : 1)}
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
  className += dense ? 'py-2 sm:py-3 ' : 'py-3 sm:py-4 ';
  if (firstCol) className += dense ? 'pl-3 sm:pl-4 ' : 'pl-4 sm:pl-6 ';
  if (lastCol) className += dense ? 'pr-3 sm:pr-4 ' : 'pr-4 sm:pr-6 ';

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
    let className = 'relative grid items-center py-2 sm:py-3 ';
    if (firstCol) className += dense ? 'pl-3 sm:pl-4 ' : 'pl-4 sm:pl-6 ';
    if (lastCol) className += dense ? 'pr-3 sm:pr-4 ' : 'pr-4 sm:pr-6 ';

    return (
      <div className={className} style={{ gridArea }}>
        {children}
      </div>
    );
  }

  let className = 'flex flex-col space-y-2 ';

  className += dense ? 'px-3 sm:px-4 ' : 'px-4 sm:px-6 ';
  className += dense
    ? firstCol
      ? 'pt-3 sm:pt-4 '
      : 'pt-1.5 sm:pt-2 '
    : firstCol
    ? 'pt-4 sm:pt-6 '
    : 'pt-2 sm:pt-3 ';
  className += dense
    ? lastCol
      ? 'pb-3 sm:pb-4 '
      : 'pb-1.5 sm:pb-2 '
    : lastCol
    ? 'pb-4 sm:pb-6 '
    : 'pb-2 sm:pb-3 ';

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
  className += dense ? 'py-1.5 sm:py-2 ' : 'py-2 sm:py-3 ';
  className += dense ? 'px-3 sm:px-4 ' : 'px-4 sm:px-6 ';

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

type TableInfoRowProps = {
  row: number;
  message: string | null;
  wrapColCount: number;
  wrapColSpanSum: number;
  isNotWrapped: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableInfoRow({
  row,
  message,
  wrapColCount,
  wrapColSpanSum,
  isNotWrapped
}: TableInfoRowProps) {
  let className = 'grid p-4 border-gray-200 dark:border-gray-700 place-items-center';
  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  message = message ?? 'Some error occurred';

  if (!isNotWrapped) {
    row = ((row - 1) * wrapColSpanSum) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  }

  return (
    <div className={className} style={{ gridArea }}>
      <div className="flex items-center space-x-3 text-gray-400">
        <div className="grid w-8 h-8 bg-gray-100 rounded-full place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
