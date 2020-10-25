import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate } from 'apollo';
import { signUpFormAtom } from 'auth';

export default function SignUpForm() {
  const { register, handleSubmit, errors } = useForm();
  const [signUpForm, setSignUpFormState] = useAtom(signUpFormAtom);
  
  async function onSubmit(data) {
    setSignUpFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const { newsletter, ...sign_up_args } = data;
    const res = await mutate('start_sign_up', { ...sign_up_args, redirect_url: 'https://duely.app/profile' });

    if (res.success) {
      setSignUpFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = null;
        state.completed = true;
      }));
    } else {
      setSignUpFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = res.message;
        state.completed = false;
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input name="name" ref={register({ required: true })} type="text" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{ errors.name && <span>Please tell us your name.</span> }</p>
      </div>
      <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email_address">
          Email address
        </label>
        <input name="email_address" ref={register({ required: true })} type="email" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{ errors.email_address && <span>Please choose an email address.</span> }</p>
      </div>
      <div className="flex flex-col">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
          Password
        </label>
        <input name="password" ref={register({ required: true })} type="password" className="border rounded px-3 py-1" />
        <p className="text-red-500 text-xs italic h-4">{ errors.password && <span>Please choose a password.</span> }</p>
      </div>
      <div className="flex flex-col">
        <label className="block text-gray-500 font-bold">
          <input name="newsletter" ref={register} className="mr-2 leading-tight" type="checkbox" />
          <span className="text-sm">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col pt-4 items-center">
        { !signUpForm.loading && !signUpForm.completed && (
        <button type="submit" className="bg-indigo-500 px-8 py-3 rounded text-md font-medium leading-5 text-white transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
          Sign up
        </button> )}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link to="/log-in" className="font-bold text-indigo-600">
          Log in
        </Link>
      </div>
    </form>
  );
}
