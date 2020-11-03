import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { mutate, start_password_reset_M } from '@duely/client';
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

export default function StartPasswordResetForm() {
  const form = useForm();
  const [state, setState] = useState(initialState);

  async function onSubmit(data) {
    setState(stateOnSubmit);

    try {
      const res = await mutate(start_password_reset_M, { ...data, redirect_url: 'https://duely.app/log-in' });

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
      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <div className="flex flex-col pt-4 items-center">
        {!state.loading && !state.completed && (
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
