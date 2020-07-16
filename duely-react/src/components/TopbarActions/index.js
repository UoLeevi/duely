import React, { useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import LoginForm from 'components/LogInForm';
import AnimatedTransition from 'components/AnimatedTransition';

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
  const showModal = useModal(<LoginForm whenDone={ () => { hideModalRef.current(); navigate('/profile'); } } />, { hideModalRef, show: !isLoggedIn && initialState.showLogIn });

  return (
    <AnimatedTransition { ...props } shouldTransition={ shouldUpdateLinks }>
      { loading
        ? null
        : isLoggedIn 
          ? (
            <div className="grid row gap-1 items-center">
              { links?.map(({ to, text }) => 
                <AnimatedTransition key={ to }>
                  <Link className="button text" to={ to }>{ text }</Link>
                </AnimatedTransition>
              )}
              <button className="default text" onClick={ logOut }>Log out</button> 
            </div>
          )
          : (
            <div className="grid row gap-5 items-center">
              <button className="default text" onClick={ showModal }>Log in</button>
              <Link className="button text primary" to='/create-account'>Sign up</Link>
            </div>
          )
      }
    </AnimatedTransition>
  );
};

export default TopbarActions;
