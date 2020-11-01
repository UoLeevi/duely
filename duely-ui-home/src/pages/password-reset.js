import TopBar from 'components/TopBar';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

export default function PasswordReset() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <h2 className="font-semibold text-xl text-gray-700 self-center">Password reset</h2>
            <StartPasswordResetForm />
          </div>
        </main>
      </div>
    </div>
  );
}
