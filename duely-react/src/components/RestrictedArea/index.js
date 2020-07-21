import React from 'react';
import { Link } from 'react-router-dom';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';

const RestrictedArea = ({ children, loading, restrict, message, fallback, ...props }) => {
  if (loading || restrict) {
    if (fallback) {
      return (
        <Choose index={ loading ? 0 : 1 }>
          <Spinner spin={ loading } { ...props } data-choose="fit"/>
          { React.cloneElement(fallback, props) }
        </Choose>
      );
    } else {
      return (
        <div className="grid items-center" style={{ height: '100vh' }}>
          <div className="ma-5 pa-5 f-b" { ...props }>
            <Choose index={ loading ? 0 : 1 }>
              <Spinner spin={ loading } { ...props } data-choose="fit"/>
              <div className="flex column center-h">
                { message &&
                  <span>{ message }</span>
                }
                <Link className="button text primary ma-1" to="/">Back to home page</Link>
              </div>
            </Choose>
          </div>
        </div>
      );
    }
  }

  return React.cloneElement(children, props);
};

export default RestrictedArea;