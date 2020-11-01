import { CgSpinner } from 'react-icons/cg';
import { createClassName } from 'utils';

export default function LoadingSpinner({ className }) {
  className = createClassName('animate-spin text-xl text-indigo-500', className);

  return (
    <CgSpinner className={className} />
  );
}
