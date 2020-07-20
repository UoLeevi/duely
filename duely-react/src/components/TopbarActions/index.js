import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import LoginForm from 'components/LogInForm';
import AnimatedTransition from 'components/AnimatedTransition';
import Button from 'components/Button';

const getInitialState = () => {
  const queryParams = new URLSearchParams(window.location.search);
  return {
    showLogIn: queryParams.has('login')
  };
};

const initialState = getInitialState();

const shouldUpdateLinks = (previous, next) => {
  if (previous.children !== next.children) {
    return true;
  }
};

const TopbarActions = ({ links, ...props }) => {
  const navigate = useNavigate(); // TODO: add & remove ?login query parameter when login form is shown (should maybe go in LoginForm)
  const { loading, isLoggedIn, logOut } = useAuth();
  const hideModalRef = useRef();
  const showModal = useModal(<LoginForm whenDone={ () => { hideModalRef.current(); navigate('/profile', { replace: true }); } } />, { hideModalRef, show: !isLoggedIn && initialState.showLogIn });

  return (
    <AnimatedTransition { ...props } shouldTransition={ shouldUpdateLinks }>
      { loading
        ? null
        : isLoggedIn 
          ? (
            <div className="grid row gap-5 items-center">
              { links?.map(({ to, text }) => 
                <AnimatedTransition key={ to }>
                  <Button text link={{ to }}>{ text }</Button>
                </AnimatedTransition>
              )}
              <Button text onClick={ () => logOut() }>Log out</Button>
            </div>
          )
          : (
            <div className="grid row gap-5 items-center">
              <Button text onClick={ showModal }>Log in</Button>
              <Button text link={{ to: '/sign-up' }} color="primary">Sign up</Button>
            </div>
          )
      }
    </AnimatedTransition>
  );
};

export default TopbarActions;
