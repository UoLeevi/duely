import React from 'react';
import { Util, useBreakpoints } from '@duely/react';

function TableHeader({ children, column }) {
  const gridArea = `1 / ${column} / 2 / ${column + 1}`;
  return (
    <div className="grid text-xs text-gray-500 tracking-wide" style={{ gridArea }}>
      {children}
    </div>
  );
}

function TableCell({ children, row, column, header, dense, firstRow, lastRow, firstCol, lastCol, sm }) {
  const gridArea = `${row} / ${column} / ${row + 1} / ${column + 1}`;

  if (sm) {
    const className = 'grid items-center ' + (lastRow ? 'pt-3' : 'py-3');

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
      <div className="grid">
        {children}
      </div>
    </div>
  );
}

function TableRow({ item, row, columns, headers, dense, first, last, sm }) {
  let className = 'border-gray-200' + (last ? '' : ' border-b');

  if (!sm) {
    row = (row - 1) * columns.length + 1;
  }

  const gridArea = sm
    ? `${row} / 1 / ${row + 1} / -1`
    : `${row} / 1 / ${row + columns.length} / -1`;

  const cells = columns.map((column, j) => column(item, j));

  return (
    <>
      <div className={className} style={{ gridArea }}>
      </div>
      {cells.map((cell, j) => (
        <TableCell key={j} row={sm ? row : row + j} column={sm ? j + 1 : 1} header={headers[j]} dense={dense} sm={sm} firstRow={first} lastRow={last} firstCol={j % columns.length === 0} lastCol={(j + 1) % columns.length === 0}>
          {cell}
        </TableCell>
      ))}
    </>
  );
}

export function Table({ rows: items, columns, headers, className, dense }) {
  const { sm } = useBreakpoints();
  const gridTemplateColumns = sm
    ? `repeat(${columns.length}, auto)`
    : `repeat(1, auto)`;

  className = Util.createClassName(className, 'grid auto-rows-auto gap-x-6');

  if (sm) {
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
      <TableRow key={item.key ?? item.id ?? i} item={item} row={i + (sm ? 2 : 1)} columns={columns} headers={headers} dense={dense} sm={sm} first={i === 0} last={i === items.length - 1} />
    );
  });

  return (
    <div className={className} style={{ gridTemplateColumns }}>
      {sm && (
        <>
          <div className="border-b border-gray-200 h-8" style={{ gridArea: `1 / 1 / 2 / -1` }}></div>
          {headers}
        </>
      )}
      {rows}
    </div>
  );
}
