import { atom } from 'jotai';
import { query, current_user_Q } from '@duely/client';

const currentUserQueryAtom = atom(query(current_user_Q));

export const currentUserAtom = atom(
  (get) => get(currentUserQueryAtom),
  async (get, set) => set(currentUserQueryAtom, await query(current_user_Q))
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
