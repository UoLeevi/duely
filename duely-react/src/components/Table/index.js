import React from 'react';
import { createClassName } from 'utils';
import './Table.css';

const Table = React.forwardRef(({ columns, rows, className, ...props }, ref) => {
  className = createClassName(className, 'table');
  return (
    <table className={ className } { ...props } ref={ ref }>
      <thead>
        <tr>
          { columns.map(c => (
            <th key={ c.key }>{ c.name }</th>
          ))}
        </tr>
      </thead>
      <tbody>
        { rows && rows.map(r => (
          <tr key={ r.key }>
            { columns.map(c => (
              <td key={ c.key }>{ r[c.key] }</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Table;
