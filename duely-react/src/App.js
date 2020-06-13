import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';
import AuthContextProvider from './contexts/AuthContext';
import NavBar from './components/NavBar';

const App = () => (
  <ApolloProvider client={client}>
    <AuthContextProvider>
      <div>
        <h2>Duely</h2>
        <NavBar />
      </div>
    </AuthContextProvider>
  </ApolloProvider>
);

export default App;
