import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate, start_password_reset_M } from '@duely/client';
import { startPasswordResetFormAtom } from 'auth';
import FormField from 'components/form-fields/FormField';

export default function StartPasswordResetForm() {
  const form = useForm();
  const [startPasswordResetForm, setStartPasswordResetFormState] = useAtom(startPasswordResetFormAtom);

  async function onSubmit(data) {
    setStartPasswordResetFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const res = await mutate(start_password_reset_M, { ...data, redirect_url: 'https://duely.app/log-in' });

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <div className="flex flex-col pt-4 items-center">
        {!startPasswordResetForm.loading && !startPasswordResetForm.completed && (
          <button type="submit" className="bg-indigo-500 px-6 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Send me a verification link
          </button>)}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="font-semibold text-indigo-600">
          Sign up
        </Link>
      </div>
    </form>
  );
}
