import React, { useRef } from 'react';
import useAuthState from 'hooks/useAuthState';
import useModal from 'hooks/useModal';
import LoginForm from 'components/LogInForm';
import Button from 'components/Button';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    showLogIn: queryParams.has('log-in')
  };
};

const initialState = getInitialState();

const TopbarActions = ({ links, ...props }) => {
  const [state, send] = useAuthState();
  const hideModalRef = useRef();
  const showModal = useModal(<LoginForm redirectUrl={ '/profile' } />, { hideModalRef, show: state.matches('visitor') && initialState.showLogIn });

  if (state.matches('loggedIn')) {
    return (
      <div className="grid row gap-5 items-center">
        { links?.map(({ to, text, ...props }) =>
          <Button key={ to } text link={{ to }} { ...props }>{ text }</Button>
        )}
        <Button text onClick={ () => send('LOG_OUT') } color="surface-l3" >Log out</Button>
      </div>
    );
  }

  if (state.matches('visitor')) {
    return (
      <div className="grid row gap-5 items-center">
        <Button text onClick={ showModal } color="primary">Log in</Button>
        <Button link={{ to: '/sign-up' }} color="primary">Sign up</Button>
      </div>
    );
  }

  return null;
};

export default TopbarActions;
