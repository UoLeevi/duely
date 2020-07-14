import React from 'react';
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
  const [showModal] = useModal(({ hideModal }) => <LoginForm whenDone={ () => { hideModal(); navigate('/profile'); } } />, { options: { show: !isLoggedIn && initialState.showLogIn }});

  return (
    <AnimatedTransition { ...props } shouldTransition={ shouldUpdateLinks }>
      { loading
        ? null
        : isLoggedIn 
          ? (
            <div className="grid row gap-1 items-center">
              { links?.map(({ to, text }) => 
                <AnimatedTransition key={ to }>
                  <Link className="button dense flat" to={ to }>{ text }</Link>
                </AnimatedTransition>
              )}
              <button className="default dense flat" onClick={ logOut }>Log out</button> 
            </div>
          )
          : <button className="default" onClick={ showModal }>Log in</button>
      }
    </AnimatedTransition>
  );
};

export default TopbarActions;
