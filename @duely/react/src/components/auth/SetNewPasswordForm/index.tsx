import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useQuery, current_user_Q, useMutation, verify_password_reset_M } from '@duely/client';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useForm,
  useFormMessages
} from '../../forms';
import { Util } from '../../../util';
import { NotFoundScreen } from '../../NotFoundScreen';
import { LoadingScreen } from '../../LoadingScreen';

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
  const { data: user, loading: userLoading } = useQuery(current_user_Q);
  const history = useHistory();
  const location = useLocation();
  const verification_code = (location.state as any)?.verification_code;
  redirectTo ??= (location.state as any)?.redirectTo;

  const { errorMessage, setErrorMessage } = useFormMessages();

  if (!verification_code) return <NotFoundScreen />;

  if (userLoading) return <LoadingScreen />;

  async function onSubmit(data: SetNewPasswordFormFields) {
    const { success, message } = (await resetPassword({ verification_code, ...data })) ?? {};
    if (success) {
      history.replace(redirectTo ?? '/log-in');
    } else {
      setErrorMessage(message ?? 'Something went wrong');
    }
  }

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <Form form={form} onSubmit={onSubmit} className={className}>
      <h2 className="self-center mb-1 text-xl font-semibold text-gray-700">Set new password</h2>
      <FormField
        label="New password"
        name="password"
        type="password"
        registerOptions={{ required: true }}
      />
      <div className="flex flex-col items-center pt-4">
        <FormButton>Reset password</FormButton>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <FormInfoMessage error={errorMessage} />
      </div>
    </Form>
  );
}
