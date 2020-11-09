import { CgSpinner } from 'react-icons/cg';
import { Util } from '@duely/react';

export default function LoadingSpinner({ className }) {
  className = Util.createClassName('animate-spin text-xl text-indigo-500', className);

  return (
    <CgSpinner className={className} />
  );
}
