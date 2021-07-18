import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center flex-1">
      <div className="flex flex-col items-center space-y-1">
        <h1 className="text-xl font-bold text-gray-400">404 - Not found</h1>
        <p className="font-medium text-gray-600">Seems like this page does not exist.</p>
        <Link className="font-medium text-indigo-600" to="/">Go Home</Link>
      </div>
    </div>
  );
}
