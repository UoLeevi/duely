import TopBar from 'components/TopBar';
import useMessage from 'hooks/useMessage';
import { BsExclamationDiamond } from 'react-icons/bs';

export default function Home() {
  useMessage(
    <div className="flex flex-row items-center font-semibold space-x-4">
      <BsExclamationDiamond className="text-orange-600" />
      <span className="text-sm">Duely is still in development</span>
    </div>
  , { autoHideMs: 6000, show: true });

  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="flex flex-col items-center">
            Home
          </div>
        </main>
      </div>
    </div>
  );
}
