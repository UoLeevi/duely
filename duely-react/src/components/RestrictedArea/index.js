import React from 'react';
import Link from 'components/Link';
import Choose from 'components/Choose';
import LoadingSpinner from 'components/LoadingSpinner';

const RestrictedArea = React.forwardRef(({ children, loading, restrict, message, fallback, ...props }, ref) => {
  if (loading || restrict) {
    if (fallback) {
      return (
        <Choose index={ loading ? 0 : 1 } ref={ ref }>
          <LoadingSpinner loading={ loading } { ...props } data-choose="fit"/>
          { React.cloneElement(fallback, props) }
        </Choose>
      );
    } else {
      return (
        <div className="grid items-center" style={{ height: '100vh' }} ref={ ref }>
          <div className="ma-5 pa-5 f-b" { ...props }>
            <Choose index={ loading ? 0 : 1 }>
              <LoadingSpinner loading={ loading } { ...props } data-choose="fit"/>
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

  return React.cloneElement(children, { ...props, ref });
});

export default RestrictedArea;
