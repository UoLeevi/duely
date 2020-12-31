import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, start_sign_up_M } from '@duely/client';
import { FormButton, FormErrorInfo, FormField, Util } from '@duely/react';

type SignUpFormFields = {
  name: string;
  email_address: string;
  password: string;
  newsletter: boolean;
};

type SignUpFormProps = {
  className?: string
};

export default function SignUpForm({ className }: SignUpFormProps) {
  const form = useForm<SignUpFormFields>();
  const [startSignUp, state] = useMutation(start_sign_up_M);

  async function onSubmit(data: SignUpFormFields) {
    const { newsletter, ...sign_up_args } = data;
    debugger;
    await startSignUp({ ...sign_up_args, redirect_url: 'https://duely.app/profile' });
  };

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
      <FormField form={form} label="Name" name="name" type="text" registerOptions={{ required: true }} />
      <FormField form={form} label="Email address" name="email_address" type="email" registerOptions={{ required: true }} />
      <FormField form={form} label="Password" name="password" type="password" registerOptions={{ required: true }} />
      <div className="flex flex-col">
        <label className="block font-bold text-gray-500">
          <input name="newsletter" ref={form.register} className="mr-2" type="checkbox" />
          <span className="text-sm font-medium leading-6 text-gray-700">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col items-center pt-4">
        <FormButton form={form} spinner loading={state.loading}>Sign up</FormButton>
      </div>
      <div className="flex flex-row justify-center pt-4 space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link to="/log-in" className="font-semibold text-indigo-600">
          Log in
        </Link>
      </div>
      <div className="flex flex-col items-center h-24 pt-4">
        <FormErrorInfo error={state.error} />
      </div>
    </form>
  );
}
