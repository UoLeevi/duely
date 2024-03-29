import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, current_user_Q, useMutation, log_in_M } from '@duely/client';
import { Form, useFormMessages } from '../../forms';
import { Util } from '../../../util';
import { useClassName } from '../../../hooks';
import { LoadingScreen } from '../../LoadingScreen';
import { createClassName } from '@duely/util';
import { useForm } from '../../../form';

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
  const { errorMessage, setErrorMessage } = useFormMessages();
  useClassName(document.body, 'grecaptcha-show');

  useEffect(() => {
    if (user) history.replace(redirectTo ?? '/');
  }, [history, redirectTo, user]);

  if (userLoading && !logInLoading) return <LoadingScreen />;

  async function onSubmit(data: LogInFormFields) {
    const recaptcha_token = await Util.fetchRecapthcaToken();
    const { success, message } = (await logIn({ recaptcha_token, ...data })) ?? {};
    if (success) {
      history.replace(redirectTo ?? '/');
    } else {
      setErrorMessage(message ?? 'Incorrect password');
    }
  }

  className = createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Log in</h2>
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
        <Form.Button>Log in</Form.Button>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Don&apos;t have an account?</span>
        <Link
          to="/sign-up"
          className="font-semibold text-indigo-600 focus-visible:text-indigo-700 focus:outline-none"
        >
          Sign up
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <Form.InfoMessage error={errorMessage} />
      </div>
    </Form>
  );
}
