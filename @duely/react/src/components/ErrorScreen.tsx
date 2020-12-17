import { ScreenOverlayContext } from '../contexts';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

type ErrorScreenProps = {
  error?: Error | string | null;
  message?: string | null;
  children?: React.ReactNode;
};

export function ErrorScreen({ error, message, children }: ErrorScreenProps) {
  console.error(error);
  const screenOverlayRef = useContext(ScreenOverlayContext);
  if (!screenOverlayRef?.current) return null;
  const hasChildren = React.Children.count(children) !== 0;

  return ReactDOM.createPortal(
    hasChildren ? children : <DefaultErrorMessage message={message} />,
    screenOverlayRef.current
  );
}

type DefaultErrorMessageProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLSpanElement>,
  HTMLSpanElement
> & {
  message?: string | null;
};

function DefaultErrorMessage({ message }: DefaultErrorMessageProps) {
  message = message ?? 'Some error occurred';
  return <span className="text-sm font-medium text-red-500">{message}</span>;
}
