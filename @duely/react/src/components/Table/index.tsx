import React, { Fragment, Key } from 'react';
import { createClassName, hasProperty, isFunction } from '@duely/util';
import { useBreakpoints } from '../../hooks';
import { UsePaginationReturn } from './usePagination';
import { PaginationControls } from '..';

export * from './usePagination';
export * from './PaginationControls';

export const Table = Object.assign(TableRoot, { Column });

type ColumnProps<TItem> = {
  header: React.ReactNode;
  children: (item: TItem | null, row: number, column: number) => React.ReactNode;
  span?: number | Partial<Record<keyof ReturnType<typeof useBreakpoints> | 'xs', number>>;
};

function Column<TItem>(props: ColumnProps<TItem>) {
  return null;
}

type TableProps<TItem extends Record<TKeyField, Key>, TKeyField extends keyof TItem> = {
  children:
    | React.ReactElement<ColumnProps<TItem>, typeof Column>
    | React.ReactElement<ColumnProps<TItem>, typeof Column>[];
  keyField?: TKeyField | ((item: TItem) => string);
  dense?: boolean;
  wrap?: number | Partial<Record<keyof ReturnType<typeof useBreakpoints> | 'xs', number>>;
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

function TableRoot<TItem extends Record<TKeyField, Key>, TKeyField extends keyof TItem>({
  children,
  keyField,
  className,
  dense,
  wrap: wrapOptions,
  loading,
  error,
  ...rest
}: TableProps<TItem, TKeyField>) {
  const skeletonRowCountFallback = 5;

  const columnDefinitions =
    React.Children.map(
      children,
      (child: React.ReactElement<ColumnProps<TItem>, typeof Column>) => ({
        header: child!.props.header,
        span: child!.props.span,
        render: child!.props.children
      })
    ) ?? [];

  const breakpoints = useBreakpoints();
  const columns = columnDefinitions.map((c) => c.render);
  let headers = columnDefinitions.map((c) => c.header);
  const wrapColSpans = columnDefinitions.map((c) => {
    if (!c.span) return 1;
    if (typeof c.span === 'number') return c.span;

    const span_2xl = c.span['2xl'] ?? 1;
    const span_xl = c.span['xl'] ?? span_2xl;
    const span_lg = c.span['lg'] ?? span_xl;
    const span_md = c.span['md'] ?? span_lg;
    const span_sm = c.span['sm'] ?? span_md;
    const span_xs = c.span['xs'] ?? span_sm;

    if (breakpoints['2xl']) {
      return span_2xl;
    } else if (breakpoints['xl']) {
      return span_xl;
    } else if (breakpoints['lg']) {
      return span_lg;
    } else if (breakpoints['md']) {
      return span_md;
    } else if (breakpoints['sm']) {
      return span_sm;
    } else {
      return span_xs;
    }
  });

  const wrapColSpansMax = wrapColSpans.reduce((a, b) => (a > b ? a : b), 1);
  const wrapColSpansTotal = wrapColSpans.reduce((a, b) => a + b, 0);
  let wrapColCount: number;

  if (!wrapOptions) {
    wrapColCount = wrapColSpansTotal;
  } else if (typeof wrapOptions === 'number') {
    wrapColCount = Math.max(wrapOptions, wrapColSpansMax);
  } else {
    const wrapOption_2xl = wrapOptions?.['2xl'] ?? wrapColSpansTotal;
    const wrapOption_xl = wrapOptions?.['xl'] ?? wrapOption_2xl;
    const wrapOption_lg = wrapOptions?.['lg'] ?? wrapOption_xl;
    const wrapOption_md = wrapOptions?.['md'] ?? wrapOption_lg;
    const wrapOption_sm = wrapOptions?.['sm'] ?? wrapOption_md;
    const wrapOption_xs = wrapOptions?.['xs'] ?? wrapOption_sm;

    if (breakpoints['2xl']) {
      wrapColCount = Math.max(wrapOption_2xl, wrapColSpansMax);
    } else if (breakpoints['xl']) {
      wrapColCount = Math.max(wrapOption_xl, wrapColSpansMax);
    } else if (breakpoints['lg']) {
      wrapColCount = Math.max(wrapOption_lg, wrapColSpansMax);
    } else if (breakpoints['md']) {
      wrapColCount = Math.max(wrapOption_md, wrapColSpansMax);
    } else if (breakpoints['sm']) {
      wrapColCount = Math.max(wrapOption_sm, wrapColSpansMax);
    } else {
      wrapColCount = Math.max(wrapOption_xs, wrapColSpansMax);
    }
  }

  let rowOffset = 0;
  let column = 1;
  const wrapCells = wrapColSpans.map((span) => {
    if (column + span - 1 > wrapColCount) {
      ++rowOffset;
      column = 1;
    }

    const cell = {
      rowOffset,
      span,
      column,
      firstCol: column === 1,
      lastCol: column + span === wrapColCount
    };

    column += span;
    return cell;
  });

  const wrapRowCount = rowOffset + 1;
  const gridTemplateColumns = `repeat(${wrapColCount}, 1fr)`;
  const hasHeaderRow = wrapRowCount === 1;

  className = createClassName(
    className,
    'grid auto-rows-auto',
    dense ? 'gap-x-3 sm:gap-x-4' : 'gap-x-5 sm:gap-x-6'
  );

  const pagination = hasProperty(rest, 'pagination') ? rest.pagination : undefined;

  loading = !!pagination?.loading || !!loading;
  error = pagination?.error ?? error;
  const items = pagination?.items ?? (hasProperty(rest, 'items') ? rest.items : []) ?? [];

  if (hasHeaderRow) {
    let headerColumn = 1;
    headers = headers.map((header, j) => {
      const span = wrapColSpans[j];
      const element = (
        <TableHeader
          key={j}
          column={headerColumn}
          span={span}
          firstCol={j % columns.length === 0}
          lastCol={(j + 1) % columns.length === 0}
        >
          {header}
        </TableHeader>
      );
      headerColumn += span;
      return element;
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
        row={hasHeaderRow ? 2 : 1}
        wrapColCount={wrapColCount}
        wrapRowCount={wrapRowCount}
        hasHeaderRow={hasHeaderRow}
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
          row={i}
          columns={columns}
          headers={headers}
          dense={dense}
          wrapCells={wrapCells}
          wrapRowCount={wrapRowCount}
          hasHeaderRow={hasHeaderRow}
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
        row={hasHeaderRow ? 2 : 1}
        wrapColCount={wrapColCount}
        wrapRowCount={wrapRowCount}
        hasHeaderRow={hasHeaderRow}
      />
    );
  } else {
    rowCount = items.length;
    rows = items.map((item, i) => {
      return (
        <TableRow
          key={
            typeof keyField === 'function' ? keyField(item) : keyField != null ? item[keyField] : i
          }
          item={item}
          row={i}
          columns={columns}
          headers={headers}
          dense={dense}
          wrapCells={wrapCells}
          wrapRowCount={wrapRowCount}
          hasHeaderRow={hasHeaderRow}
          first={i === 0}
          last={i === items!.length - 1}
        />
      );
    });
  }

  let footer: React.ReactNode = undefined;

  if (hasProperty(rest, 'footer')) {
    footer = rest.footer as React.ReactNode;
  } else if (
    hasProperty(rest, 'footerPaginationControls') &&
    rest.footerPaginationControls &&
    pagination &&
    (pagination.loadingTotalNumberOfItems || pagination.totalNumberOfItems > 0)
  ) {
    footer = <PaginationControls pagination={pagination} />;
  }

  return (
    <div className={className} style={{ gridTemplateColumns }}>
      {hasHeaderRow && (
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
          row={rowCount + (hasHeaderRow ? 2 : 1)}
          wrapColCount={wrapColCount}
          wrapRowCount={wrapRowCount}
          hasHeaderRow={hasHeaderRow}
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
  span: number;
  dense?: boolean;
  firstCol: boolean;
  lastCol: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableHeader({ children, column, span, dense, firstCol, lastCol }: TableHeaderProps) {
  const gridArea = `1 / ${column} / 2 / ${column + span}`;

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
  firstRow: boolean;
  lastRow: boolean;
  hasHeaderRow: boolean;
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
  firstRow,
  lastRow,
  hasHeaderRow
}: TableCellProps) {
  const gridArea = `${row} / ${column} / ${row + 1} / ${column + span}`;

  if (hasHeaderRow) {
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
    ? firstRow
      ? 'pt-3 sm:pt-4 '
      : 'pt-1.5 sm:pt-2 '
    : firstRow
    ? 'pt-4 sm:pt-6 '
    : 'pt-2 sm:pt-3 ';
  className += dense
    ? lastRow
      ? 'pb-3 sm:pb-4 '
      : 'pb-1.5 sm:pb-2 '
    : lastRow
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
  columns: ((item: TItem, row: number, column: number) => React.ReactNode)[];
  headers: React.ReactNode[];
  dense?: boolean;
  wrapCells: {
    rowOffset: number;
    span: number;
    column: number;
    firstCol: boolean;
    lastCol: boolean;
  }[];
  first: boolean;
  last: boolean;
  wrapRowCount: number;
  hasHeaderRow: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableRow<TItem>({
  item,
  row,
  columns,
  headers,
  dense,
  wrapCells,
  wrapRowCount,
  first,
  last,
  hasHeaderRow
}: TableRowProps<TItem>) {
  let className = 'border-gray-200 dark:border-gray-700' + (last ? '' : ' border-b');
  const cells = columns.map((column, j) => column(item, row, j));

  row += hasHeaderRow ? 1 : 0;
  row *= wrapRowCount;
  row += 1;

  const gridArea = `${row} / 1 / ${row + wrapRowCount} / -1`;

  return (
    <Fragment>
      <div className={className} style={{ gridArea }}></div>

      {cells.map((cell, j) => {
        const { rowOffset, ...cellProps } = wrapCells[j];

        return (
          <TableCell
            key={j}
            row={row + rowOffset}
            header={headers[j]}
            dense={dense}
            hasHeaderRow={hasHeaderRow}
            {...cellProps}
            firstRow={rowOffset === 0}
            lastRow={rowOffset + 1 === wrapRowCount}
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
  wrapRowCount: number;
  hasHeaderRow: boolean;
  dense?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableFooterRow({
  row,
  wrapColCount,
  wrapRowCount,
  hasHeaderRow,
  dense,
  children
}: TableFooterRowProps) {
  let className =
    'grid text-gray-400 border-t border-gray-200 dark:border-gray-700 place-items-center ';
  className += dense ? 'py-1.5 sm:py-2 ' : 'py-2 sm:py-3 ';
  className += dense ? 'px-3 sm:px-4 ' : 'px-4 sm:px-6 ';

  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  if (!hasHeaderRow) {
    row = ((row - 1) * wrapRowCount * wrapColCount) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapRowCount} / -1`;
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
  wrapRowCount: number;
  hasHeaderRow: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableErrorRow({
  row,
  message,
  wrapColCount,
  wrapRowCount,
  hasHeaderRow
}: TableErrorRowProps) {
  let className = 'grid p-4 border-gray-200 dark:border-gray-700 place-items-center';
  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  message = message ?? 'Some error occurred';

  if (!hasHeaderRow) {
    row = ((row - 1) * wrapRowCount * wrapColCount) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapRowCount} / -1`;
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
  wrapRowCount: number;
  hasHeaderRow: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

function TableInfoRow({
  row,
  message,
  wrapColCount,
  wrapRowCount,
  hasHeaderRow
}: TableInfoRowProps) {
  let className = 'grid p-4 border-gray-200 dark:border-gray-700 place-items-center';
  let gridArea = `${row} / 1 / ${row + 1} / -1`;

  message = message ?? 'Some error occurred';

  if (!hasHeaderRow) {
    row = ((row - 1) * wrapRowCount * wrapColCount) / wrapColCount + 1;
    gridArea = `${row} / 1 / ${row + wrapRowCount} / -1`;
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
