import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, start_sign_up_M } from '@duely/client';
import { Form, useFormMessages } from '../../forms';
import { Button } from '../../buttons';
import { Util } from '../../../util';
import { useClassName } from '../../../hooks';
import { createClassName } from '@duely/util';
import { useForm } from '../../../form';

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
  const [sentToEmail, setSentToEmail] = useState<string>();
  const [completed, setCompleted] = useState(false);
  const [startSignUp, { loading: startSignUpLoading }] = useMutation(start_sign_up_M);
  const { infoMessage, setInfoMessage, errorMessage, setErrorMessage } = useFormMessages();
  useClassName(document.body, 'grecaptcha-show');

  async function onSubmit(data: SignUpFormFields) {
    const recaptcha_token = await Util.fetchRecapthcaToken();

    const { newsletter, ...sign_up_args } = data;
    const { success, message } =
      (await startSignUp({
        ...sign_up_args,
        redirect_url: redirectUrl ?? `${window.location.origin}/log-in`,
        recaptcha_token
      })) ?? {};

    if (success) {
      setCompleted(true);
      setSentToEmail(data.email_address);
    } else if (message?.includes('duplicate key')) {
      setInfoMessage('Email address is already registered. Try to log in.');
    } else {
      setErrorMessage(message ?? 'Something went wrong. Pleas try again later.');
    }
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-10 h-10 bg-green-100 border-2 border-green-600 rounded-full place-items-center">
          <svg
            className="text-green-600 h-7 w-7 animate-stoke-draw"
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
          <span className="font-bold whitespace-nowrap">{sentToEmail}</span>
          <span>.</span>
          <br />
          <span>Please check your inbox.</span>
        </p>
        <div className="flex pt-3 space-x-5">
          <Button color="indigo" className="whitespace-nowrap" type="button">
            <Link to="/">Go to home</Link>
          </Button>
          <Button color="gray" onClick={() => setCompleted(false)} dense type="button">
            Use different email
          </Button>
        </div>
      </div>
    );
  }

  className = createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Sign up</h2>
      <Form.Field label="Name" name="name" type="text" registerOptions={{ required: true }} />
      <Form.Field
        label="Email address"
        name="email_address"
        type="email"
        registerOptions={{ required: true }}
      />
      <Form.Field
        label="Password"
        name="password"
        type="password"
        registerOptions={{ required: true }}
      />
      <div className="flex flex-col">
        <label className="block font-bold text-gray-500">
          <input {...form.register('newsletter')} className="mr-2" type="checkbox" />
          <span className="text-sm font-medium leading-6 text-gray-700">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col items-center pt-4">
        <Form.Button disabled={startSignUpLoading}>Sign up</Form.Button>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link
          to="/log-in"
          className="font-semibold text-indigo-600 focus-visible:text-indigo-700 focus:outline-none"
        >
          Log in
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <Form.InfoMessage info={infoMessage} error={errorMessage} />
      </div>
    </Form>
  );
}
