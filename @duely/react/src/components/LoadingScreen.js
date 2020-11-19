import { ScreenOverlayContext } from '../contexts';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

function Default({ message }) {
  message = message ?? 'Loading...';
  return (
    <span className="animate-pulse font-medium tracking-wider text-gray-700">{message}</span>
  );
}

export function LoadingScreen({ message, children }) {
  const screenOverlayRef = useContext(ScreenOverlayContext);
  const hasChildren = React.Children.count(children) !== 0;

  return ReactDOM.createPortal(
    hasChildren ? children : <Default message={message} />,
    screenOverlayRef.current
  );
}
