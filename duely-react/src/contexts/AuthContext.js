import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { client, ME_QUERY, LOG_IN_MUTATION, LOG_OUT_MUTATION } from '../apollo';

const errorMessageDuration = 4000;
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(ME_QUERY);
  const [logInLoading, setLogInLoading] = useState(false);
  const [logInError, setLogInError] = useState(null);
  const [logInMutation] = useMutation(LOG_IN_MUTATION,
    {
      onCompleted: async ({ logIn }) => {
        if (logIn.success) {
          localStorage.setItem('user-jwt', logIn.jwt);
          await client.clearStore();
          await refetch();
        } else {
          setLogInError(logIn.message);
        }

        setLogInLoading(false);
      }
    }
  );

  const logIn = async ({ emailAddress, password }) => {
    setLogInLoading(true);
    await logInMutation({ variables: { emailAddress, password }});
  };

  useEffect(() => {
    logInError && setTimeout(() => setLogInError(null), errorMessageDuration);
  }, [logInError, setLogInError]);

  const [logOutLoading, setLogOutLoading] = useState(false);
  const [logOutError, setLogOutError] = useState(null);
  const [logOutMutation] = useMutation(LOG_OUT_MUTATION,
    {
      onCompleted: async ({ logOut }) => {
        if (logOut.success) {
          localStorage.removeItem('user-jwt');
          await client.clearStore();
          await refetch();
        } else {
          setLogOutError(logOut.message);
        }

        setLogOutLoading(false);
      }
    }
  );

  const logOut = async () => {
    setLogOutLoading(true);
    await logOutMutation();
    navigate('/', { replace: true });
  }

  useEffect(() => {
    logOutError && setTimeout(() => setLogOutLoading(null), errorMessageDuration);
  }, [logOutError, setLogOutLoading]);

  return (
    <AuthContext.Provider value={{ 
      loading: loading || logInLoading || logOutLoading, 
      error, 
      isLoggedIn: data && data.me.type === 'user',
      user: data && data.me,
      logIn,
      logInLoading,
      logInError,
      logOut,
      logOutLoading,
      logOutError
    }}>
      { children }
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
