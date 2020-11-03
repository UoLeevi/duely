import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { mutate, start_sign_up_M } from '@duely/client';
import FormField from 'components/form-fields/FormField';
import { useState } from 'react';

const initialState = {
  loading: false,
  completed: false,
  errorMessage: null,
  submitted: null
};

const stateOnSubmit = state => ({
  ...state,
  loading: true,
  errorMessage: null,
  submitted: Date.now()
});

const stateOnCompleted = state => ({
  ...state,
  completed: true,
  loading: false,
  errorMessage: null
});

const stateOnError = errorMessage => state => ({
  ...state,
  completed: false,
  loading: false,
  errorMessage: errorMessage
});

export default function SignUpForm() {
  const form = useForm();
  const [state, setState] = useState(initialState);

  async function onSubmit(data) {
    setState(stateOnSubmit);
    const { newsletter, ...sign_up_args } = data;

    try {
      const res = await mutate(start_sign_up_M, { ...sign_up_args, redirect_url: 'https://duely.app/profile' });

      if (res.success) {
        setState(stateOnCompleted);
      } else {
        setState(stateOnError(res.message));
      }
    } catch (error) {
      setState(stateOnError(error.message));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Name" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <FormField form={form} label="Password" name="password" type="password" validateRule={{ required: true }} />
      <div className="flex flex-col">
        <label className="block text-gray-500 font-bold">
          <input name="newsletter" ref={form.register} className="mr-2" type="checkbox" />
          <span className="text-gray-700 font-medium text-sm leading-6">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col pt-4 items-center">
        {!state.loading && !state.completed && (
          <button type="submit" className="bg-indigo-500 px-8 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Sign up
          </button>)}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link to="/log-in" className="font-semibold text-indigo-600">
          Log in
        </Link>
      </div>
    </form>
  );
}
