import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate, start_sign_up_M } from '@duely/client';
import { signUpFormAtom } from 'auth';
import FormField from 'components/form-fields/FormField';

export default function SignUpForm() {
  const form = useForm();
  const [signUpForm, setSignUpFormState] = useAtom(signUpFormAtom);
  
  async function onSubmit(data) {
    setSignUpFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const { newsletter, ...sign_up_args } = data;
    const res = await mutate(start_sign_up_M, { ...sign_up_args, redirect_url: 'https://duely.app/profile' });

    if (res.success) {
      setSignUpFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = null;
        state.completed = true;
      }));
    } else {
      setSignUpFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = res.message;
        state.completed = false;
      }));
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Name" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Email address" name="email_address" type="email" validateRule={{ required: true }} />
      <FormField form={form} label="Password" name="password" type="password" validateRule={{ required: true }} />
      <div className="flex flex-col">
        <label className="block text-gray-500 font-bold">
          <input name="newsletter" ref={form.register} className="mr-2" type="checkbox" />
          <span className="text-gray-700 font-medium text-sm leading-6">
            Send me your newsletter!
          </span>
        </label>
      </div>
      <div className="flex flex-col pt-4 items-center">
        { !signUpForm.loading && !signUpForm.completed && (
        <button type="submit" className="bg-indigo-500 px-8 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
          Sign up
        </button> )}
      </div>
      <div className="flex flex-row pt-4 justify-center space-x-4 text-sm">
        <span>Already have an account?</span>
        <Link to="/log-in" className="font-semibold text-indigo-600">
          Log in
        </Link>
      </div>
    </form>
  );
}
