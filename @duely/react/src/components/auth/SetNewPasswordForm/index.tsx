import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useMutation, verify_password_reset_M } from '@duely/client';
import {
  Form,
  useFormMessages
} from '../../forms';
import { NotFoundScreen } from '../../NotFoundScreen';
import { createClassName } from '@duely/util';
import { useForm } from '../../../form/hooks';

type SetNewPasswordFormFields = {
  password: string;
};

type SetNewPasswordFormProps = {
  className?: string;
  redirectTo?: string;
};

export function SetNewPasswordForm({ className, redirectTo }: SetNewPasswordFormProps) {
  const form = useForm<SetNewPasswordFormFields>();
  const [resetPassword] = useMutation(verify_password_reset_M);
  const history = useHistory();
  const location = useLocation();
  const verification_code = (location.state as any)?.verification_code;
  redirectTo ??= (location.state as any)?.redirectTo;

  const { errorMessage, setErrorMessage } = useFormMessages();

  if (!verification_code) return <NotFoundScreen />;

  async function onSubmit(data: SetNewPasswordFormFields) {
    const res = await resetPassword({ verification_code, ...data });
    if (res?.success) {
      history.replace(redirectTo ?? '/log-in');
    } else {
      setErrorMessage(res?.message ?? 'Something went wrong');
    }
  }

  className = createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Set new password</h2>
      <Form.Field
        label="New password"
        name="password"
        type="password"
        registerOptions={{ required: true }}
      />
      <div className="flex flex-col items-center pt-4">
        <Form.Button>Reset password</Form.Button>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <Form.InfoMessage error={errorMessage} />
      </div>
    </Form>
  );
}
