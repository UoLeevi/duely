import React, { createContext, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { client } from '../apollo';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const { loading, error, data, refetch } = useQuery(gql`
    query {
      me {
        uuid
        name
        emailAddress
        type
      }
    }`
  );

  const [logInLoading, setLogInLoading] = useState(false);
  const [logInMutation] = useMutation(gql`
    mutation($emailAddress: String!, $password: String!) {
      logIn(emailAddress: $emailAddress, password: $password) {
        success
        message
        jwt
      }
    }`,
    {
      onCompleted: async ({ logIn }) => {
        if (logIn.success) {
          localStorage.setItem('user-jwt', logIn.jwt);
          await client.clearStore();
          await refetch();
        } else {
          console.log(logIn.message);
        }

        setLogInLoading(false);
      }
    }
  );

  const logIn = ({ emailAddress, password }) => {
    setLogInLoading(true);
    return logInMutation({ variables: { emailAddress, password }});
  };

  const [logOutLoading, setLogOutLoading] = useState(false);
  const [logOutMutation] = useMutation(gql`
    mutation {
      logOut {
        success
        message
      }
    }`,
    {
      onCompleted: async ({ logOut }) => {
        if (logOut.success) {
          localStorage.removeItem('user-jwt');
          await client.clearStore();
          await refetch();
        } else {
          console.log(logOut.message);
        }

        setLogOutLoading(false);
      }
    }
  );

  const logOut = () => {
    setLogOutLoading(true);
    return logOutMutation();
  }

  return (
    <AuthContext.Provider value={{ 
      loading: loading || logInLoading || logOutLoading, 
      error, 
      isLoggedIn: data && data.me.type === 'user',
      user: data && data.me,
      logIn,
      logOut
    }}>
      { props.children }
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
