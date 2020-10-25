import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate } from 'apollo';
import { startPasswordResetFormAtom } from 'auth';

export default function StartPasswordResetForm() {
  const { register, handleSubmit, errors } = useForm();
  const [startPasswordResetForm, setStartPasswordResetFormState] = useAtom(startPasswordResetFormAtom);

  async function onSubmit(data) {
    setStartPasswordResetFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const res = await mutate('start_password_reset', { ...data, redirect_url: 'https://duely.app/log-in' });

    if (res.success) {
      setStartPasswordResetFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = null;
        state.completed = true;
      }));
    } else {
      setStartPasswordResetFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = res.message;
        state.completed = false;
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email_address">
          Email address
        </label>
        <input name="email_address" ref={register({ required: true })} type="email" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{errors.email_address && <span>Please enter an email address.</span>}</p>
      </div>
      <div className="flex flex-col pt-4 items-center">
        {!startPasswordResetForm.loading && !startPasswordResetForm.completed && (
          <button type="submit" className="bg-indigo-500 px-6 py-3 rounded text-md font-medium leading-5 text-white transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Send me a verification link
          </button>)}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="font-bold text-indigo-600">
          Sign up
        </Link>
      </div>
    </form>
  );
}
