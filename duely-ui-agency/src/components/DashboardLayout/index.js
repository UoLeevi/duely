import Sidebar from 'components/Sidebar';
// import TopBar from 'components/TopBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="relative w-full h-full bg-gray-100">
      <Sidebar className="fixed inset-x-0 bottom-0" />
      <div className="md:pl-64 h-full w-full box-border relative">
        <div className="flex flex-col h-full p-4">
          { children }
        </div>
      </div>
    </div>
  );
}
