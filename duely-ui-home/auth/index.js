import { from } from '@apollo/client';
import { atom, selector } from 'recoil';
import { query } from '@/apollo';

// TODO: figure out how to best update current user
// see: https://recoiljs.org/docs/api-reference/core/selector
// see also: https://github.com/facebookexperimental/Recoil/issues/85

export const currentUserQueryRefresher = atom({
  key: 'currentUserQueryRefresher',
  default: 0
});

export const currentUserQuery = selector({
  key: 'currentUserQuery',
  async get({ get }) {
    get(currentUserQueryRefresher);
    return await query('current_user');
  }
});

export const currentUserState = atom({
  key: 'currentUserState',
  default: {
    initialized: false,
    loading: true,
    loggedIn: null,
    id: null,
    name: null,
    email_address: null
  }
});

export const logInFormState = atom({
  key: 'logInFormState',
  default: {
    loading: false,
    errorMessage: null,
    completed: false,
    submitted: null
  }
});

export const startPasswordResetFormState = atom({
  key: 'startPasswordResetFormState',
  default: {
    loading: false,
    errorMessage: null,
    completed: false,
    submitted: null
  }
});

export const signUpFormState = atom({
  key: 'signUpFormState',
  default: {
    loading: false,
    errorMessage: null,
    completed: false,
    submitted: null
  }
});

export const signUpVerificationState = atom({
  key: 'signUpVerificationState',
  default: {
    loading: false,
    errorMessage: null,
    completed: false
  }
});
