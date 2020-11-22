import React, { Fragment } from 'react';
import { Util } from '../util';
import { useBreakpoints } from '../hooks';

function TableHeader({ children, column }) {
  const gridArea = `1 / ${column} / 2 / ${column + 1}`;
  return (
    <div className="grid text-xs text-gray-500 tracking-wide" style={{ gridArea }}>
      {children}
    </div>
  );
}

function TableCell({ children, row, column, span, header, dense, firstRow, lastRow, firstCol, lastCol, isNotWrapped }) {
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
    className += dense
      ? (firstCol ? 'pt-4 ' : 'pt-2 ')
      : (firstCol ? 'pt-6 ' : 'pt-3 ');
  }

  if (!lastRow || !lastCol) {
    className += dense
      ? (lastCol ? 'pb-4 ' : 'pb-2 ')
      : (lastCol ? 'pb-6 ' : 'pb-3 ');
  }

  return (
    <div className={className} style={{ gridArea }}>
      <div className="grid text-xs text-gray-500 tracking-wide">
        {header}
      </div>
      <div className="relative grid flex-1 items-center">
        {children}
      </div>
    </div>
  );
}

function TableRow({ item, row, columns, headers, dense, wrapColCount, wrapColSpans, wrapColSpanSum, first, last, isNotWrapped }) {
  let className = 'border-gray-200' + (last ? '' : ' border-b');
  const cells = columns.map((column, j) => column(item, j));

  if (isNotWrapped) {
    const gridArea = `${row} / 1 / ${row + 1} / -1`;

    return (
      <Fragment>
        <div className={className} style={{ gridArea }}></div>

        {cells.map((cell, j) => (
          <TableCell key={j} row={row} column={j + 1} span={1} header={headers[j]} dense={dense} isNotWrapped={isNotWrapped} firstRow={first} lastRow={last} firstCol={j % columns.length === 0} lastCol={(j + 1) % columns.length === 0}>
            {cell}
          </TableCell>
        ))}
      </Fragment>
    );
  }

  row = (row - 1) * wrapColSpanSum / wrapColCount + 1;
  const gridArea = `${row} / 1 / ${row + wrapColSpanSum / wrapColCount} / -1`;
  let next = 1;

  return (
    <Fragment>
      <div className={className} style={{ gridArea }}></div>

      {cells.map((cell, j) => {
        const column = (next - 1) % wrapColCount + 1;
        const span = wrapColSpans[j];
        const cellRow = row + Math.floor((next - 1) / wrapColCount);
        const firstCol = cellRow === row;
        const lastCol = (cellRow + 1 - row) === wrapColSpanSum / wrapColCount;
        next += span;
        return (
          <TableCell key={j} row={cellRow} column={column} span={span} header={headers[j]} dense={dense} isNotWrapped={isNotWrapped} firstRow={first} lastRow={last} firstCol={firstCol} lastCol={lastCol}>
            {cell}
          </TableCell>
        );
      })}
    </Fragment>
  );
}

export function Table({ rows: items, columns, headers, className, dense, breakpoint, wrap: wrapOptions }) {
  const breakpoints = useBreakpoints();
  const isNotWrapped = breakpoints[breakpoint ?? 'sm'];
  const wrapColCount = wrapOptions?.columns ?? 1;
  const wrapColSpans = wrapOptions?.spans ?? new Array(columns.length).fill(1);
  const wrapColSpanSum = wrapColSpans.reduce((a, b) => a + b, 0);

  const gridTemplateColumns = isNotWrapped
    ? `repeat(${columns.length}, auto)`
    : `repeat(${wrapOptions?.columns ?? 1}, auto)`;

  className = Util.createClassName(className, 'grid auto-rows-auto gap-x-6');

  if (isNotWrapped) {
    headers = headers.map((header, j) => {
      return (
        <TableHeader key={j} column={j + 1}>
          {header}
        </TableHeader>
      );
    });
  }

  const rows = items.map((item, i) => {
    return (
      <TableRow key={item.key ?? item.id ?? i} item={item} row={i + (isNotWrapped ? 2 : 1)} columns={columns} headers={headers} dense={dense} wrapColCount={wrapColCount} wrapColSpans={wrapColSpans} wrapColSpanSum={wrapColSpanSum} isNotWrapped={isNotWrapped} first={i === 0} last={i === items.length - 1} />
    );
  });

  return (
    <div className={className} style={{ gridTemplateColumns }}>
      {isNotWrapped && (
        <Fragment>
          <div className="border-b border-gray-200 h-8" style={{ gridArea: `1 / 1 / 2 / -1` }}></div>
          {headers}
        </Fragment>
      )}
      {rows}
    </div>
  );
}
