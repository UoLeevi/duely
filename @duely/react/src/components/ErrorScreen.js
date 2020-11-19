import { ScreenOverlayContext } from '../contexts';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

function Default({ message }) {
  message = message ?? 'Some error occurred';
  return (
    <span className="font-medium text-sm text-red-500">{message}</span>
  );
}

export function ErrorScreen({ error, message, children }) {
  console.error(error);
  const screenOverlayRef = useContext(ScreenOverlayContext);
  const hasChildren = React.Children.count(children) !== 0;

  return ReactDOM.createPortal(
    hasChildren ? children : <Default message={message} />,
    screenOverlayRef.current
  );
}
