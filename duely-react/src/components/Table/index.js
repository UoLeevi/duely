import React from 'react';
import { createClassName } from 'utils';
import LoadingBar from 'components/LoadingBar';
import './Table.css';

const Table = React.forwardRef(({ caption, columns, rows, loading, className, ...props }, ref) => {
  className = createClassName(className, 'table');
  return (
    <table className={ className } { ...props } ref={ ref }>
      <caption>
        <div className="table-loading-bar">
          <LoadingBar loading={ loading } />
        </div>
        { caption }
      </caption>
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
              <td key={ c.key }>
                <div data-justify={ c.justify }>
                  { r[c.key] }
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default Table;
