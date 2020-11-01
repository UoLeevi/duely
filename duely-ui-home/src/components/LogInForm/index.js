import { Link, useHistory } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate } from 'apollo';
import { logInFormAtom } from 'auth';
import { useEffect } from 'react';
import FormField from 'components/form-fields/FormField';
import LoadingSpinner from 'components/LoadingSpinner';
import useQuery from 'hooks/useQuery';
// import { useRouter } from 'react-router-dom';

export default function LogInForm() {
  // const router = useRouter();
  const form = useForm();
  const [logInForm, setLogInFormState] = useAtom(logInFormAtom);
  const currentUserQ = useQuery('current_user');
  const history = useHistory();

  useEffect(() => {
    if (currentUserQ.data) {
      history.replace('/profile');
    }
  }, [currentUserQ.data, history]);

  if (currentUserQ.loading) {
    return <LoadingSpinner />;
  }

  async function onSubmit(data) {
    setLogInFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const res = await mutate('log_in', data);

    if (res.success) {
      setLogInFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = null;
        state.completed = true;
      }));
    } else {
      setLogInFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = res.message;
        state.completed = false;
      }));
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <FormField form={form} label="Password" name="password" type="password" validateRule={{ required: true }}
        actions={<Link to="/password-reset" className="text-indigo-500 text-xs font-bold" tabIndex="10">Reset password</Link>}
      />
      <div className="flex flex-col pt-4 items-center">
        {!logInForm.loading && (
          <button type="submit" className="bg-indigo-500 px-8 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Log in
          </button>)}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don&apos;t have an account?</span>
        <Link to="/sign-up" className="font-semibold text-indigo-600">
          Sign up
        </Link>
      </div>
    </form>
  );
}
