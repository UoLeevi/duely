import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { client, ME_QUERY, LOG_IN_MUTATION, LOG_OUT_MUTATION, SIGN_UP_MUTATION, RESET_PASSWORD_MUTATION } from '../apollo';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(ME_QUERY);
  const [logInLoading, setLogInLoading] = useState(false);

  function updateJwtFromMutationResult(mutationName, action = 'set') {
    return async ({ [mutationName]: result }) => {
      if (result.success) {
        switch (action) {

          case 'set':
            localStorage.setItem('user-jwt', result.jwt);
            break;

          case 'remove':
            localStorage.removeItem('user-jwt');
            break;

          default:
            throw new Error();
        }

        await client.clearStore();
        await refetch();
      }

      setLogInLoading(false);
    }
  }

  function authActionForMutation(mutationName, mutation) {
    return async (variables, redirectTo) => {
      setLogInLoading(true);
      const { loading, error, data: { [mutationName]: data } = {} } = await mutation({ variables });

      if (data?.success && redirectTo) {
        navigate(redirectTo, { replace: true });
      }

      return { loading, error, data };
    }
  };

  const [logInMutation] = useMutation(LOG_IN_MUTATION, { onCompleted: updateJwtFromMutationResult('logIn') });
  const logIn = authActionForMutation('logIn', logInMutation);

  const [signUpMutation] = useMutation(SIGN_UP_MUTATION, { onCompleted: updateJwtFromMutationResult('signUp') });
  const signUp = authActionForMutation('signUp', signUpMutation);

  const [resetPasswordMutation] = useMutation(RESET_PASSWORD_MUTATION, { onCompleted: updateJwtFromMutationResult('resetPassword') });
  const resetPassword = authActionForMutation('resetPassword', resetPasswordMutation);

  const [logOutMutation] = useMutation(LOG_OUT_MUTATION, { onCompleted: updateJwtFromMutationResult('logOut', 'remove') });
  const logOut = authActionForMutation('logOut', logOutMutation);

  return (
    <AuthContext.Provider value={{ 
      loading: loading || logInLoading,
      error, 
      isLoggedIn: data && data.me.type === 'user',
      user: data && data.me,
      logIn,
      signUp,
      resetPassword,
      logOut
    }}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
