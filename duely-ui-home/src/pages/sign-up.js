import TopBar from 'components/TopBar';
import SignUpForm from 'components/SignUpForm';

export default function SignUp() {
  return (
    <div className="page-container">
      <TopBar />
      <div className="page-body-container">
        <main className="flex flex-col justify-around flex-grow flex-shrink-0 py-6">
          <div className="form-container">
            <h2 className="font-semibold text-xl text-gray-700 self-center">Sign up</h2>
            <SignUpForm />
          </div>
        </main>
      </div>
    </div>
  );
}
