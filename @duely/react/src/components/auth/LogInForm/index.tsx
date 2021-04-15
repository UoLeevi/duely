import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useQuery, current_user_Q, useMutation, log_in_M } from '@duely/client';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '../../forms';
import { Util } from '../../../util';

type LogInFormFields = {
  email_address: string;
  password: string;
};

type LogInFormProps = {
  className?: string;
  redirectTo?: string;
};

export function LogInForm({ className, redirectTo }: LogInFormProps) {
  const form = useForm<LogInFormFields>();
  const [logIn, { loading: logInLoading }] = useMutation(log_in_M);
  const { data: user, loading: userLoading } = useQuery(current_user_Q);
  const history = useHistory();
  const loading = userLoading || logInLoading;
  const { errorMessage, setErrorMessage } = useFormMessages();

  useEffect(() => {
    if (user) history.replace(redirectTo ?? '/');
  }, [history, redirectTo, user]);

  async function onSubmit(data: LogInFormFields) {
    const score = await Util.processRecapthca();
    const { success, message } = (await logIn(data)) ?? {};
    if (success) {
      history.replace(redirectTo ?? '/');
    } else {
      setErrorMessage(message ?? 'Incorrect password');
    }
  }

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Log in</h2>
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
        actions={
          <Link
            to="/password-reset"
            className="text-xs font-bold text-indigo-500 focus-visible:text-indigo-700 focus:outline-none"
            tabIndex={10}
          >
            Reset password
          </Link>
        }
      />
      <div className="flex flex-col items-center pt-4">
        <FormButton form={form} spinner loading={loading}>
          Log in
        </FormButton>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Don&apos;t have an account?</span>
        <Link to="/sign-up" className="font-semibold text-indigo-600 focus-visible:text-indigo-700 focus:outline-none">
          Sign up
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <FormInfoMessage error={errorMessage} />
      </div>
    </Form>
  );
}
