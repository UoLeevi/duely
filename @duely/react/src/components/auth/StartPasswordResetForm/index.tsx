import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, start_password_reset_M } from '@duely/client';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '../../forms';
import { Button } from '../../Button';
import { Util } from '../../../util';

type StartPasswordResetFormValues = {
  email_address: string;
};

type StartPasswordResetFormProps = {
  className?: string;
  redirectUrl?: string;
};

export function StartPasswordResetForm({ className, redirectUrl }: StartPasswordResetFormProps) {
  const form = useForm<StartPasswordResetFormValues>();
  const [completed, setCompleted] = useState(false);
  const [startPasswordReset, { loading: startPasswordResetLoading }] = useMutation(
    start_password_reset_M
  );

  const { errorMessage, setErrorMessage } = useFormMessages();

  async function onSubmit({ email_address }: StartPasswordResetFormValues) {
    const { success, message } =
      (await startPasswordReset({
        email_address,
        redirect_url: redirectUrl ?? `${window.location.origin}/log-in`
      })) ?? {};

    if (success) {
      setCompleted(true);
    } else {
      setErrorMessage(message ?? 'Incorrect password');
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
          <span>Password reset verification link sent to </span>
          <span className="font-bold whitespace-nowrap">{form.getValues('email_address')}</span>
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
      <FormField
        form={form}
        label="Email address"
        name="email_address"
        type="email"
        registerOptions={{ required: true }}
      />
      <div className="flex flex-col items-center pt-4">
        <FormButton form={form} spinner loading={startPasswordResetLoading}>
          Send a verification link
        </FormButton>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="font-semibold text-indigo-600">
          Sign up
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <FormInfoMessage error={errorMessage} />
      </div>
    </Form>
  );
}
