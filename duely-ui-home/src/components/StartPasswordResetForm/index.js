import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, start_password_reset_M } from '@duely/client';
import { FormButton, FormErrorInfo, FormField, Util } from '@duely/react';

export default function StartPasswordResetForm({ className }) {
  const form = useForm();
  const [startPasswordReset, state] = useMutation(start_password_reset_M);

  async function onSubmit(data) {
    await startPasswordReset({ ...data, redirect_url: 'https://duely.app/log-in' });
  };

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <FormField form={form} label="Email address" name="email_address" type="email" registerOptions={{ required: true }} />
      <div className="flex flex-col pt-4 items-center">
        <FormButton form={form} spinner loading={state.loading}>Send me a verification link</FormButton>
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don't have an account?</span>
        <Link to="/sign-up" className="font-semibold text-indigo-600">
          Sign up
        </Link>
      </div>
      <div className="flex flex-col pt-4 items-center h-24">
        <FormErrorInfo error={state.error} />
      </div>
    </form>
  );
}
