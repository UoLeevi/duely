import React, { createContext } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { client } from '../apollo';

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

  const [logIn] = useMutation(gql`
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
          await client.resetStore();
        } else {
          console.log(logIn.message);
          return;
        }
      }
    }
  );

  const [logOut] = useMutation(gql`
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
          await client.resetStore();
        } else {
          console.log(logOut.message);
        }
      }
    }
  );

  const { loading, error, data } = useQuery(gql`
    query {
      me {
        uuid
        name
        emailAddress
        type
      }
    }`
  );

  return (
    <AuthContext.Provider value={{ 
      loading, 
      error, 
      isLoggedIn: data && data.me.type === 'user',
      user: data && data.me,
      logIn: ({ emailAddress, password }) => logIn({ variables: { emailAddress, password }}),
      logOut: () => logOut()
    }}>
      { props.children }
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
