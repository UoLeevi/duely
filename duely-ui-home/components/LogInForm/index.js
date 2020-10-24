import Link from 'next/link';
import { useRecoilState, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import { AiOutlineLoading } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate } from '@/apollo';
import { logInFormState, currentUserQueryRefresher, currentUserQuery } from '@/auth';
import { useRouter } from 'next/router';

export default function LogInForm() {
  const router = useRouter();
  const currentUserLoadable = useRecoilValueLoadable(currentUserQuery);
  const { register, handleSubmit, errors } = useForm();
  const [logInForm, setLogInFormState] = useRecoilState(logInFormState);
  const resetCurrentUser = useSetRecoilState(currentUserQueryRefresher);

  if (currentUserLoadable.state === 'loading')
    return <AiOutlineLoading className="animate-spin text-xl text-indigo-500" />;

  if (currentUserLoadable.state === 'hasError')
    return <span>Error</span>;

  const currentUser = currentUserLoadable.contents;

  if (currentUser != null) {
    router.replace('/');
    return <AiOutlineLoading className="animate-spin text-xl text-indigo-500" />;
  }

  async function onSubmit(data) {
    setLogInFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const res = await mutate('log_in', data);

    if (res.success) {
      resetCurrentUser(i => i + 1);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email_address">
          Email address
        </label>
        <input name="email_address" ref={register({ required: true })} type="email" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{errors.email_address && <span>Please enter an email address.</span>}</p>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <Link href="/password-reset">
            <a className="text-indigo-500 text-xs font-bold">Reset password</a>
          </Link>
        </div>
        <input name="password" ref={register({ required: true })} type="password" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{errors.password && <span>Please enter a password.</span>}</p>
      </div>
      <div className="flex flex-col pt-4 items-center">
        {!logInForm.loading && (
          <button type="submit" className="bg-indigo-500 px-8 py-3 rounded text-md font-medium leading-5 text-white transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Log in
          </button>)}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don&apos;t have an account?</span>
        <Link href="/sign-up">
          <a className="font-bold text-indigo-600">Sign up</a>
        </Link>
      </div>
    </form>
  );
}
