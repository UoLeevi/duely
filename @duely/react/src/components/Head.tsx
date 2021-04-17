import ReactDOM from 'react-dom';

type HeadProps = {
  children: React.ReactNode;
};

export function Head({ children }: HeadProps) {
  return ReactDOM.createPortal(children, document.head);
}
