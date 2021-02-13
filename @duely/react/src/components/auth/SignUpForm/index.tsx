import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, start_sign_up_M } from '@duely/client';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '../../forms';
import { Button } from '../../buttons';
import { Util } from '../../../util';

type SignUpFormFields = {
  name: string;
  email_address: string;
  password: string;
  newsletter: boolean;
};

type SignUpFormProps = {
  className?: string;
  redirectUrl?: string;
};

export function SignUpForm({ className, redirectUrl }: SignUpFormProps) {
  const form = useForm<SignUpFormFields>();
  const [completed, setCompleted] = useState(false);
  const [startSignUp, { loading: startSignUpLoading }] = useMutation(start_sign_up_M);
  const { infoMessage, setInfoMessage, errorMessage, setErrorMessage } = useFormMessages();

  async function onSubmit(data: SignUpFormFields) {
    const { newsletter, ...sign_up_args } = data;
    const { success, message } =
      (await startSignUp({
        ...sign_up_args,
        redirect_url: redirectUrl ?? `${window.location.origin}/log-in`
      })) ?? {};

    if (success) {
      setCompleted(true);
    } else if (message?.includes('duplicate key')) {
      setInfoMessage('Email address is already registered. Try to log in.');
    } else {
      setErrorMessage(message ?? 'Something went wrong. Pleas try again later.');
    }
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-10 h-10 bg-green-200 rounded-full place-items-center">
          <svg
            className="text-green-600 h-7 w-7"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold">
          <span>Sign up verification link sent to </span>
          <span className="font-bold whitespace-nowrap">{form.watch('email_address')}</span>
          <span>.</span>
          <br />
          <span>Please check your inbox.</span>
        </p>
        <div className="flex pt-3 space-x-5">
          <Button className="text-white bg-indigo-500 whitespace-nowrap" type="button">
            <Link to="/">Go to home</Link>
          </Button>
          <Button
            onClick={() => setCompleted(false)}
            dense
            className="bg-gray-50 whitespace-nowrap"
            type="button"
          >
            Use different email
          </Button>
        </div>
      </div>
    );
  }

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Sign up</h2>
      <FormField
        form={form}
        label="Name"
        name="name"
        type="text"
        registerOptions={{ required: true }}
      />
      <FormField
        form={form}
        label="Email address"
        name="email_address"
        type="email"
        registerOptions={{ required: true }}
      />
      <FormField
        form={form}
        label="Password"
        name="password"
        type="password"
        registerOptions={{ required: true }}
      />
      <div className="flex flex-col">
        <label className="block font-bold text-gray-500">
          <input name="newsletter" ref={form.register} className="mr-2" type="checkbox" />
          <span className="text-sm font-medium leading-6 text-gray-700">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col items-center pt-4">
        <FormButton form={form} spinner loading={startSignUpLoading}>
          Sign up
        </FormButton>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link to="/log-in" className="font-semibold text-indigo-600 focus-visible:text-indigo-700 focus:outline-none">
          Log in
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <FormInfoMessage info={infoMessage} error={errorMessage} />
      </div>
    </Form>
  );
}
