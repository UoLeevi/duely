import { atom } from 'jotai';
import { query } from 'apollo';

const currentUserQueryAtom = atom(query('current_user'));

export const currentUserAtom = atom(
  (get) => get(currentUserQueryAtom),
  async (get, set) => set(currentUserQueryAtom, await query('current_user'))
);

export const logInFormAtom = atom({
  loading: false,
  errorMessage: null,
  completed: false,
  submitted: null
});

export const startPasswordResetFormAtom = atom({
  loading: false,
  errorMessage: null,
  completed: false,
  submitted: null
});

export const signUpFormAtom = atom({
  loading: false,
  errorMessage: null,
  completed: false,
  submitted: null
});
