import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { FormButton, FormErrorInfo, FormField, Util } from '@duely/react';
import LoadingSpinner from 'components/LoadingSpinner';
import { useQuery, current_user_Q, useMutation, log_in_M } from '@duely/client';
// import { useRouter } from 'react-router-dom';

export default function LogInForm({className }) {
  // const router = useRouter();
  const form = useForm();
  const [logIn, state] = useMutation(log_in_M);
  const currentUserQ = useQuery(current_user_Q);
  const history = useHistory();

  useEffect(() => {
    if (currentUserQ.data) {
      history.replace('/profile');
    }
  }, [currentUserQ.data, history]);

  if (currentUserQ.loading) {
    return <LoadingSpinner />;
  }

  async function onSubmit(data) {
    await logIn(data);
  }

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}  className={className}>

      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <FormField form={form} label="Password" name="password" type="password" validateRule={{ required: true }}
        actions={<Link to="/password-reset" className="text-indigo-500 text-xs font-bold" tabIndex="10">Reset password</Link>}
      />
      <div className="flex flex-col pt-4 items-center">
        <FormButton loading={state.loading}>Log in</FormButton>
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Don&apos;t have an account?</span>
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
