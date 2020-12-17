import { ScreenOverlayContext } from '../contexts';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

type LoadingScreenProps = {
  message?: string | null;
  children?: React.ReactNode;
};
export function LoadingScreen({ message, children }: LoadingScreenProps) {
  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;
  const hasChildren = React.Children.count(children) !== 0;

  return ReactDOM.createPortal(
    hasChildren ? children : <DefaultLoadingMessage message={message} />,
    screenOverlayRef.current
  );
}

type DefaultLoadingMessageProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  message?: string | null;
};

function DefaultLoadingMessage({ message }: DefaultLoadingMessageProps) {
  message = message ?? 'Loading...';
  return <span className="font-medium tracking-wider text-gray-700 animate-pulse">{message}</span>;
}
